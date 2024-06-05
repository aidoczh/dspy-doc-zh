---
sidebar_position: 2
---

# [02] 多跳问题回答

对于复杂的问答任务，单个搜索查询通常是不够的。例如，在 `HotPotQA` 中的一个例子涉及到一个关于“Right Back At It Again”作者出生城市的问题。搜索查询通常可以正确识别作者为 "Jeremy McKinnon"，但缺乏在确定他的出生日期时组成预期答案的能力。

在检索增强的自然语言处理文献中，解决这一挑战的标准方法是构建多跳搜索系统，比如 GoldEn（Qi 等，2019）和 Baleen（Khattab 等，2021）。这些系统会阅读检索结果，然后在必要时生成额外的查询以收集额外信息，最终得出最终答案。使用 DSPy，我们可以轻松地在几行代码中模拟这样的系统。

## 配置 LM 和 RM

我们将首先设置语言模型（LM）和检索模型（RM），**DSPy** 通过多个 [LM](https://dspy-docs.vercel.app/docs/category/language-model-clients) 和 [RM](https://dspy-docs.vercel.app/docs/category/retrieval-model-clients) API 以及 [本地模型托管](https://dspy-docs.vercel.app/docs/category/local-language-model-clients) 来支持这些功能。

在本教程中，我们将使用 GPT-3.5 (`gpt-3.5-turbo`) 和 `ColBERTv2` 检索器（一个免费服务器托管了维基百科 2017 年的“摘要”搜索索引，包含了来自这个 [2017 转储](https://hotpotqa.github.io/wiki-readme.html) 的每篇文章的第一段）。我们在 DSPy 中配置了 LM 和 RM，允许 DSPy 在需要时内部调用相应的模块进行生成或检索。

```python
import dspy

turbo = dspy.OpenAI(model='gpt-3.5-turbo')
colbertv2_wiki17_abstracts = dspy.ColBERTv2(url='http://20.102.90.50:2017/wiki17_abstracts')

dspy.settings.configure(lm=turbo, rm=colbertv2_wiki17_abstracts)
```

## 加载数据集

在本教程中，我们使用提到的 `HotPotQA` 数据集，这是一个典型以多跳方式回答的复杂问答对集合。我们可以通过 `HotPotQA` 类从 DSPy 提供的数据集中加载数据：

```python
from dspy.datasets import HotPotQA

# 加载数据集。
dataset = HotPotQA(train_seed=1, train_size=20, eval_seed=2023, dev_size=50, test_size=0)

# 告诉 DSPy 'question' 字段是输入。其他字段是标签和/或元数据。
trainset = [x.with_inputs('question') for x in dataset.train]
devset = [x.with_inputs('question') for x in dataset.dev]

len(trainset), len(devset)
```
**输出:**
```text
(20, 50)
```

## 构建签名

现在我们已经加载了数据，让我们开始为 Baleen 流水线的子任务定义签名。

我们首先创建 `GenerateAnswer` 签名，它将以 `context` 和 `question` 作为输入，并给出 `answer` 作为输出。
```python
class GenerateAnswer(dspy.Signature):
    """生成简短事实型答案来回答问题。"""

    context = dspy.InputField(desc="可能包含相关事实")
    question = dspy.InputField()
    answer = dspy.OutputField(desc="通常为1到5个词之间")
```
与通常的问答流程不同，在 Baleen 中我们有一个中间的问题生成步骤，我们需要为“跳跃”行为定义一个新的签名：输入一些上下文和一个问题，生成一个搜索查询以查找缺失的信息。

```python
class GenerateSearchQuery(dspy.Signature):
    """编写一个简单的搜索查询，以帮助回答复杂问题。"""

    context = dspy.InputField(desc="可能包含相关事实")
    question = dspy.InputField()
    query = dspy.OutputField()
```

:::info
我们可以写成 `context = GenerateAnswer.signature.context`，以避免重复描述上下文字段。
:::

现在我们已经有了必要的签名，可以开始构建 Baleen 流水线了！

## 构建流水线

所以，让我们定义程序本身 `SimplifiedBaleen`。实现这一点有许多可能的方法，但我们将保持这个版本的关键要素。

```python
from dsp.utils import deduplicate

class SimplifiedBaleen(dspy.Module):
    def __init__(self, passages_per_hop=3, max_hops=2):
        super().__init__()

        self.generate_query = [dspy.ChainOfThought(GenerateSearchQuery) for _ in range(max_hops)]
        self.retrieve = dspy.Retrieve(k=passages_per_hop)
        self.generate_answer = dspy.ChainOfThought(GenerateAnswer)
        self.max_hops = max_hops
    
    def forward(self, question):
        context = []
        
        for hop in range(self.max_hops):
            query = self.generate_query[hop](context=context, question=question).query
            passages = self.retrieve(query).passages
            context = deduplicate(context + passages)

        pred = self.generate_answer(context=context, question=question)
        return dspy.Prediction(context=context, answer=pred.answer)
```

正如我们所看到的，`__init__` 方法定义了一些关键的子模块：

- **generate_query**：对于每个跳跃，我们将有一个带有 `GenerateSearchQuery` 签名的 `dspy.ChainOfThought` 预测器。
- **retrieve**：这个模块将使用通过 `dspy.Retrieve` 模块在我们定义的 ColBERT RM 搜索索引上生成的查询进行搜索。
- **generate_answer**：这个 `dspy.Predict` 模块将与 `GenerateAnswer` 签名一起使用，以生成最终答案。

`forward` 方法在简单的控制流中使用这些子模块。

1. 首先，我们将循环最多 `self.max_hops` 次。
2. 在每次迭代中，我们将使用 `self.generate_query[hop]` 的预测器生成一个搜索查询。
3. 我们将使用该查询检索前 k 个段落。
4. 我们将将（去重后的）段落添加到我们的 `context` 累加器中。
5. 循环结束后，我们将使用 `self.generate_answer` 生成一个答案。
6. 我们将返回一个包含检索到的 `context` 和预测的 `answer` 的预测。

## 执行流水线

让我们在其零-shot（未编译）设置中执行此程序。
这并不一定意味着性能会很差，而是我们的性能受到底层语言模型理解我们的子任务的可靠性直接限制。通常情况下，在最昂贵/最强大的模型（例如 GPT-4）上执行最简单和最标准的任务（例如回答关于流行实体的简单问题）时，这是完全可以接受的。

```python
# 向这个简单的 RAG 程序提出任何问题。
my_question = "David Gregory 继承的城堡有几层楼?"

# 获取预测结果。这包括 `pred.context` 和 `pred.answer`。
uncompiled_baleen = SimplifiedBaleen()  # 未编译（即零-shot）程序
pred = uncompiled_baleen(my_question)

# 打印上下文和答案。
print(f"问题: {my_question}")
print(f"预测答案: {pred.answer}")
print(f"检索到的上下文（截断）: {[c[:200] + '...' for c in pred.context]}")
```
**输出:**
```text
问题: David Gregory 继承的城堡有几层楼?
预测答案: 五
检索到的上下文（截断）: ['David Gregory (physician) | David Gregory (20 December 1625 – 1720) was a Scottish physician and inventor. His surname is sometimes spelt as Gregorie, the original Scottish spelling. He inherited Kinn...', 'The Boleyn Inheritance | The Boleyn Inheritance is a novel by British author Philippa Gregory which was first published in 2006. It is a direct sequel to her previous novel "The Other Boleyn Girl," an...', 'Gregory of Gaeta | Gregory was the Duke of Gaeta from 963 until his death. He was the second son of Docibilis II of Gaeta and his wife Orania. He succeeded his brother John II, who had left only daugh...', 'Kinnairdy Castle | Kinnairdy Castle is a tower house, having five storeys and a garret, two miles south of Aberchirder, Aberdeenshire, Scotland. The alternative name is Old Kinnairdy....', 'Kinnaird Head | Kinnaird Head (Scottish Gaelic: "An Ceann Àrd" , "high headland") is a headland projecting into the North Sea, within the town of Fraserburgh, Aberdeenshire on the east coast of Scotla...', 'Kinnaird Castle, Brechin | Kinnaird Castle is a 15th-century castle in Angus, Scotland. The castle has been home to the Carnegie family, the Earl of Southesk, for more than 600 years....']
```

我们可以使用以下代码检查最后 **三** 次 LM 调用（即生成第一跳查询、生成第二跳查询和生成答案）：

```python
turbo.inspect_history(n=3)
```

## 优化流程

然而，对于更专业的任务、新领域/设置以及更高效（或更开放）的模型，零-shot 方法很快就会显得力不从心。

为了解决这个问题，**DSPy** 提供了编译功能。让我们编译我们的多跳（`SimplifiedBaleen`）程序。

首先定义编译的验证逻辑：

- 预测的答案与标准答案匹配。
- 检索到的上下文包含标准答案。
- 生成的查询都不是冗长的（即长度不超过100个字符）。
- 生成的查询都不是粗略重复的（即与之前的查询的 F1 分数在0.8或更高）。

```python
def validate_context_and_answer_and_hops(example, pred, trace=None):
    if not dspy.evaluate.answer_exact_match(example, pred): return False
    if not dspy.evaluate.answer_passage_match(example, pred): return False

    hops = [example.question] + [outputs.query for *_, outputs in trace if 'query' in outputs]

    if max([len(h) for h in hops]) > 100: return False
    if any(dspy.evaluate.answer_exact_match_str(hops[idx], hops[:idx], frac=0.8) for idx in range(2, len(hops))): return False

    return True
```

我们将使用**DSPy**中最基本的提示器之一，即`BootstrapFewShot`，来优化具有少量示例的管道中的预测器。

```python
from dspy.teleprompt import BootstrapFewShot

teleprompter = BootstrapFewShot(metric=validate_context_and_answer_and_hops)
compiled_baleen = teleprompter.compile(SimplifiedBaleen(), teacher=SimplifiedBaleen(passages_per_hop=2), trainset=trainset)
```

## 评估管道

现在让我们定义评估函数，并比较未编译和编译的 Baleen 管道的性能。虽然此 devset 并不是完全可靠的基准，但在本教程中使用它是有益的。

```python
from dspy.evaluate.evaluate import Evaluate

# 定义检查是否检索到正确文档的指标
def gold_passages_retrieved(example, pred, trace=None):
    gold_titles = set(map(dspy.evaluate.normalize_text, example["gold_titles"]))
    found_titles = set(
        map(dspy.evaluate.normalize_text, [c.split(" | ")[0] for c in pred.context])
    )
    return gold_titles.issubset(found_titles)

# 设置 `evaluate_on_hotpotqa` 函数。我们将在下面多次使用它。
evaluate_on_hotpotqa = Evaluate(devset=devset, num_threads=1, display_progress=True, display_table=5)

uncompiled_baleen_retrieval_score = evaluate_on_hotpotqa(uncompiled_baleen, metric=gold_passages_retrieved, display=False)

compiled_baleen_retrieval_score = evaluate_on_hotpotqa(compiled_baleen, metric=gold_passages_retrieved)

print(f"## 未编译 Baleen 的检索分数: {uncompiled_baleen_retrieval_score}")
print(f"## 编译 Baleen 的检索分数: {compiled_baleen_retrieval_score}")
```
**输出:**
```text
## 未编译 Baleen 的检索分数: 36.0
## 编译 Baleen 的检索分数: 60.0
```

太棒了！也许编译的多跳程序确实有一些优势。

前面我们说简单程序并不是很有效地找到回答每个问题所需的所有证据。通过在`SimplifiedBaleen`的前向函数中添加一些更好的提示技术来解决这个问题了吗？编译程序是否提高了性能？
在我们的教程中，我们展示了我们的研究结果，但这些问题的答案并不总是显而易见。然而，DSPy使尝试许多不同方法变得非常容易，而且只需付出最少的努力。

现在你已经看到了如何构建一个简单但功能强大的流程的示例，是时候让你自己动手构建一个了！
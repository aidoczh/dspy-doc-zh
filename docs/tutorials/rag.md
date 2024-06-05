---
sidebar_position: 1
---

# [01] RAG：检索增强生成

检索增强生成（RAG）是一种方法，允许大型语言模型（LLMs）利用知识库中的大量知识来源，并查询其知识存储库以找到相关段落/内容，并生成一个经过精心完善的响应。

RAG确保LLMs可以动态利用实时知识，即使最初未经过相关主题的训练，也能给出深思熟虑的答案。然而，随着这种微妙性的增加，建立精细的RAG管道变得更加复杂。为了减少这些复杂性，我们转向 **DSPy**，它提供了一种无缝设置提示管道的方法！

## 配置LM和RM

我们将从设置语言模型（LM）和检索模型（RM）开始，**DSPy**通过多个 [LM](https://dspy-docs.vercel.app/docs/category/language-model-clients) 和 [RM](https://dspy-docs.vercel.app/docs/category/retrieval-model-clients) API以及 [本地模型托管](https://dspy-docs.vercel.app/docs/deep-dive/language_model_clients/local_models/HFClientTGI) 来支持这些模型。

在这个笔记本中，我们将使用GPT-3.5（`gpt-3.5-turbo`）和 `ColBERTv2` 检索器（一个免费服务器托管了维基百科2017年的“摘要”搜索索引，包含了来自这个 [2017年转储](https://hotpotqa.github.io/wiki-readme.html) 的每篇文章的第一段）。我们在DSPy中配置LM和RM，允许DSPy在需要时内部调用相应的模块进行生成或检索。

```python
import dspy

turbo = dspy.OpenAI(model='gpt-3.5-turbo')
colbertv2_wiki17_abstracts = dspy.ColBERTv2(url='http://20.102.90.50:2017/wiki17_abstracts')

dspy.settings.configure(lm=turbo, rm=colbertv2_wiki17_abstracts)
```

## 加载数据集

在本教程中，我们使用 `HotPotQA` 数据集，这是一个包含通常以多跳方式回答的复杂问题-答案对的集合。我们可以通过DSPy提供的 `HotPotQA` 类加载这个数据集：

```python
from dspy.datasets import HotPotQA

# 加载数据集。
dataset = HotPotQA(train_seed=1, train_size=20, eval_seed=2023, dev_size=50, test_size=0)

# 告诉DSPy 'question' 字段是输入。任何其他字段都是标签和/或元数据。
trainset = [x.with_inputs('question') for x in dataset.train]
devset = [x.with_inputs('question') for x in dataset.dev]

len(trainset), len(devset)
```
**输出:**
```text
(20, 50)
```

## 构建签名

现在我们已经加载了数据，让我们开始为管道的子任务定义 [签名](https://dspy-docs.vercel.app/docs/building-blocks/signatures)。

我们可以确定我们的简单输入 `question` 和输出 `answer`，但由于我们正在构建一个RAG管道，我们希望利用一些来自我们ColBERT语料库的上下文信息。因此，让我们定义我们的签名：`context, question --> answer`。
```python
class GenerateAnswer(dspy.Signature):
    """生成简短事实型答案回答问题。"""

    context = dspy.InputField(desc="可能包含相关事实")
    question = dspy.InputField()
    answer = dspy.OutputField(desc="通常为1至5个词")
```
我们为`context`和`answer`字段添加了简要描述，以定义更健壮的指导方针，明确模型将接收和应该生成的内容。

## 构建流水线

我们将构建我们的 RAG 流水线作为一个[DSPy 模块](https://dspy-docs.vercel.app/docs/building-blocks/modules)，它将需要两个方法：

* `__init__`方法将简单地声明它所需的子模块：`dspy.Retrieve`和`dspy.ChainOfThought`。后者被定义为实现我们的`GenerateAnswer`签名。
* `forward`方法将描述使用我们拥有的模块来回答问题的控制流程：给定一个问题，我们将搜索前三个相关段落，然后将它们作为回答生成的上下文。

```python
class RAG(dspy.Module):
    def __init__(self, num_passages=3):
        super().__init__()

        self.retrieve = dspy.Retrieve(k=num_passages)
        self.generate_answer = dspy.ChainOfThought(GenerateAnswer)
    
    def forward(self, question):
        context = self.retrieve(question).passages
        prediction = self.generate_answer(context=context, question=question)
        return dspy.Prediction(context=context, answer=prediction.answer)
```

## 优化流水线

##### 编译 RAG 程序

定义了这个程序之后，现在让我们**编译**它。[编译程序](https://dspy-docs.vercel.app/docs/building-blocks/optimizers)将更新每个模块中存储的参数。在我们的设置中，主要是收集和选择好的示例以包含在提示中。

编译取决于三件事：

1. **一个训练集。** 我们将使用上面`trainset`中的 20 个问题-答案示例。
2. **一个验证指标。** 我们将定义一个简单的`validate_context_and_answer`，用于检查预测的答案是否正确，以及检查检索到的上下文是否确实包含答案。
3. **一个特定的提示器。** **DSPy** 编译器包括许多**提示器**，可以优化您的程序。

```python
from dspy.teleprompt import BootstrapFewShot

# 验证逻辑：检查预测的答案是否正确。还要检查检索到的上下文是否确实包含该答案。
def validate_context_and_answer(example, pred, trace=None):
    answer_EM = dspy.evaluate.answer_exact_match(example, pred)
    answer_PM = dspy.evaluate.answer_passage_match(example, pred)
    return answer_EM and answer_PM

# 设置一个基本的提示器，它将编译我们的 RAG 程序。
teleprompter = BootstrapFewShot(metric=validate_context_and_answer)

# 编译！
compiled_rag = teleprompter.compile(RAG(), trainset=trainset)
```

:::info
**提示器：** 提示器是强大的优化器，可以接受任何程序并学会为其模块引导和选择有效的提示。因此得名，意为“远程提示”。

不同的电子提词器在成本与质量等方面提供了各种权衡。在上面的示例中，我们将使用一个简单的默认 `BootstrapFewShot`。

_如果你喜欢类比的话，你可以将这看作是标准深度神经网络监督学习设置中的训练数据、损失函数和优化器。虽然 SGD 是一种基本的优化器，但像 Adam 或 RMSProp 这样更复杂（也更昂贵！）的优化器也是存在的。_

:::

## 执行流程

既然我们已经编译了我们的 RAG 程序，让我们来试试看。

```python
# 向这个简单的 RAG 程序提出任何问题。
my_question = "David Gregory 继承了哪座城堡？"

# 获取预测结果。这包括 `pred.context` 和 `pred.answer`。
pred = compiled_rag(my_question)

# 打印上下文和答案。
print(f"问题: {my_question}")
print(f"预测答案: {pred.answer}")
print(f"检索到的上下文（已截断）: {[c[:200] + '...' for c in pred.context]}")
```

太棒了。我们来检查 LM 的最后一个提示吧。

```python
turbo.inspect_history(n=1)
```
**输出:**
```text
回答具有简短事实答案的问题。

---

问题: 美国创作歌手 John Townes Van Zandt 发行了哪首歌？
答案: John Townes Van Zandt

问题: “Everything Has Changed” 是哪个唱片公司发行的专辑中的一首歌曲？
答案: Big Machine Records
...(已截断)
```

尽管我们没有编写任何这些详细的演示，但我们看到 DSPy 能够为 3-shot 检索增强生成硬负面段落的 3,000 个标记提示进行引导，并在一个极其简单的程序中使用“思维链”推理。

这展示了组合和学习的力量。当然，这只是由特定电子提词器生成的，可能在每种情况下都不完美。正如您将在 DSPy 中看到的，您有一个庞大但系统化的选项空间，可以优化和验证相对于程序质量和成本的设置。

您还可以轻松地检查学习到的对象本身。

```python
for name, parameter in compiled_rag.named_predictors():
    print(name)
    print(parameter.demos[0])
    print()
```

## 评估流程

现在我们可以在开发集上评估我们的 `compiled_rag` 程序。当然，这个小数据集并不意味着是一个可靠的基准，但将其用于说明是很有益的。

让我们评估预测答案的准确性（完全匹配）。

```python
from dspy.evaluate.evaluate import Evaluate

# 设置 `evaluate_on_hotpotqa` 函数。我们将在下面多次使用它。
evaluate_on_hotpotqa = Evaluate(devset=devset, num_threads=1, display_progress=False, display_table=5)

# 使用 `answer_exact_match` 指标评估 `compiled_rag` 程序。
metric = dspy.evaluate.answer_exact_match
evaluate_on_hotpotqa(compiled_rag, metric=metric)
```
**输出:**
```text
平均指标：22 / 50  (44.0): 100%|██████████| 50/50 [00:00<00:00, 116.45it/s]
平均指标：22 / 50  (44.0%)

44.0
```

## 评估检索结果

检查检索的准确性也是很有启发性的。虽然有多种方法可以做到这一点，我们可以简单地检查检索到的段落是否包含答案。

我们可以利用我们的开发集，其中包含应该被检索的黄金标题。

```python
def gold_passages_retrieved(example, pred, trace=None):
    gold_titles = set(map(dspy.evaluate.normalize_text, example['gold_titles']))
    found_titles = set(map(dspy.evaluate.normalize_text, [c.split(' | ')[0] for c in pred.context]))

    return gold_titles.issubset(found_titles)

compiled_rag_retrieval_score = evaluate_on_hotpotqa(compiled_rag, metric=gold_passages_retrieved)
```
**输出:**
```text
平均指标: 13 / 50  (26.0): 100%|██████████| 50/50 [00:00<00:00, 671.76it/s]平均指标: 13 / 50  (26.0%)
```

尽管这个简单的 `compiled_rag` 程序能够正确回答相当一部分问题（在这个小数据集上超过40%），但检索质量要低得多。

这可能表明语言模型经常依赖于其在训练过程中记忆的知识来回答问题。为了解决这种弱检索，让我们探索一个涉及更高级搜索行为的第二个程序。
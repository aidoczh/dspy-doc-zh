---
sidebar_position: 7
---

# DSPy 断言

语言模型（LMs）已经改变了我们与机器学习的互动方式，为自然语言理解和生成提供了广泛的能力。然而，确保这些模型遵守特定领域约束仍然是一个挑战。尽管像微调或“提示工程”这样的技术不断增长，但这些方法非常繁琐，依赖于繁重的手动指导，以引导LMs遵守特定约束。即使 DSPy 的编程提示管道的模块化也缺乏有效自动执行这些约束的机制。

为了解决这个问题，我们引入了 DSPy 断言，这是 DSPy 框架中的一个功能，旨在自动执行LMs上的计算约束。DSPy 断言使开发人员能够通过最少的手动干预引导LMs朝着期望的结果发展，增强LM输出的可靠性、可预测性和正确性。

## dspy.Assert 和 dspy.Suggest API

我们在 DSPy 断言中引入了两个主要构造：

- **`dspy.Assert`**:
  - **参数**: 
    - `constraint (bool)`: Python定义的布尔验证检查的结果。
    - `msg (Optional[str])`: 提供反馈或修正指导的用户定义错误消息。
    - `backtrack (Optional[module])`: 指定在约束失败时重试尝试的目标模块。默认的回溯模块是断言之前的最后一个模块。
  - **行为**: 在失败时启动重试，动态调整管道的执行。如果失败持续存在，它将停止执行并引发 `dspy.AssertionError`。

- **`dspy.Suggest`**:
  - **参数**: 与 `dspy.Assert` 类似。
  - **行为**: 鼓励通过重试进行自我完善，而不强制性地停止。在最大回溯尝试次数后记录失败，并继续执行。

- **dspy.Assert 与 Python 断言的区别**: 与传统的 Python `assert` 语句在失败时终止程序不同，`dspy.Assert` 进行了复杂的重试机制，允许管道进行调整。

具体来说，当约束未满足时：

- 回溯机制: 启动底层的回溯，为模型提供自我完善和继续的机会，通过以下方式实现：
- 动态签名修改: 通过添加以下字段来内部修改您的 DSPy 程序的签名：
    - 过去的输出: 您的模型未通过验证函数的过去输出
    - 指示: 您定义的关于出了什么问题以及可能如何修复的反馈消息

如果错误持续超过 `max_backtracking_attempts`，那么 `dspy.Assert` 将停止管道执行，并通过 `dspy.AssertionError` 提醒您。这确保您的程序不会继续执行具有“不良”LM行为，并立即突出显示样本失败输出供用户评估。
- **`dspy.Suggest` 与 `dspy.Assert` 的区别**：另一方面，`dspy.Suggest` 提供了一种更温和的方法。它保留了与 `dspy.Assert` 相同的重试回溯机制，但作为一个温和的助推器。如果模型输出在 `max_backtracking_attempts` 后仍无法通过模型约束条件，`dspy.Suggest` 将记录持久性失败并继续执行程序的其余部分数据。这确保了 LM 流水线以“尽力而为”的方式工作，而不会停止执行。

- **`dspy.Suggest`** 最适合在评估阶段作为“助手”使用，提供指导和潜在更正，而不会停止流水线。

- **`dspy.Assert`** 建议在开发阶段作为“检查器”使用，以确保 LM 的行为符合预期，提供了一个强大的机制，早期识别和解决错误。

## 应用案例：在 DSPy 程序中包含断言

我们从一个多跳问答 SimplifiedBaleen 流水线的示例开始，该流水线在介绍中已经定义。

```python
class SimplifiedBaleen(dspy.Module):
    def __init__(self, passages_per_hop=2, max_hops=2):
        super().__init__()

        self.generate_query = [dspy.ChainOfThought(GenerateSearchQuery) for _ in range(max_hops)]
        self.retrieve = dspy.Retrieve(k=passages_per_hop)
        self.generate_answer = dspy.ChainOfThought(GenerateAnswer)
        self.max_hops = max_hops

    def forward(self, question):
        context = []
        prev_queries = [question]

        for hop in range(self.max_hops):
            query = self.generate_query[hop](context=context, question=question).query
            prev_queries.append(query)
            passages = self.retrieve(query).passages
            context = deduplicate(context + passages)
        
        pred = self.generate_answer(context=context, question=question)
        pred = dspy.Prediction(context=context, answer=pred.answer)
        return pred

baleen = SimplifiedBaleen()

baleen(question = "Gary Zukav的第一本书获得了哪个奖项？")
```

要包含 DSPy 断言，我们只需定义我们的验证函数，并在相应的模型生成后声明我们的断言。

对于这个用例，假设我们想要施加以下约束：
    1. 长度 - 每个查询应少于 100 个字符
    2. 独特性 - 每个生成的查询应与先前生成的查询不同。

我们可以将这些验证检查定义为布尔函数：

```python
#查询长度的简单布尔检查
len(query) <= 100

#用于验证不同查询的 Python 函数
def validate_query_distinction_local(previous_queries, query):
    """检查查询是否与先前查询不同"""
    if previous_queries == []:
        return True
    if dspy.evaluate.answer_exact_match_str(query, previous_queries, frac=0.8):
        return False
    return True
```

我们可以通过 `dspy.Suggest` 语句来声明这些验证检查（因为我们希望在最佳努力演示中测试程序）。我们希望在查询生成后保留这些验证检查 `query = self.generate_query[hop](context=context, question=question).query`。

```python
dspy.Suggest(
    len(query) <= 100,
    "查询应该简短，不超过100个字符",
)

dspy.Suggest(
    validate_query_distinction_local(prev_queries, query),
    "查询应该与以下内容不同: "
    + "; ".join(f"{i+1}) {q}" for i, q in enumerate(prev_queries)),
)
```

如果您正在进行断言效果的比较评估，建议将带有断言的程序与原始程序分开定义。如果不是，请随意设置断言！

让我们看看包含断言的 SimplifiedBaleen 程序将如何呈现：

```python
class SimplifiedBaleenAssertions(dspy.Module):
    def __init__(self, passages_per_hop=2, max_hops=2):
        super().__init__()
        self.generate_query = [dspy.ChainOfThought(GenerateSearchQuery) for _ in range(max_hops)]
        self.retrieve = dspy.Retrieve(k=passages_per_hop)
        self.generate_answer = dspy.ChainOfThought(GenerateAnswer)
        self.max_hops = max_hops

    def forward(self, question):
        context = []
        prev_queries = [question]

        for hop in range(self.max_hops):
            query = self.generate_query[hop](context=context, question=question).query

            dspy.Suggest(
                len(query) <= 100,
                "查询应该简短，不超过100个字符",
            )

            dspy.Suggest(
                validate_query_distinction_local(prev_queries, query),
                "查询应该与以下内容不同: "
                + "; ".join(f"{i+1}) {q}" for i, q in enumerate(prev_queries)),
            )

            prev_queries.append(query)
            passages = self.retrieve(query).passages
            context = deduplicate(context + passages)
        
        if all_queries_distinct(prev_queries):
            self.passed_suggestions += 1

        pred = self.generate_answer(context=context, question=question)
        pred = dspy.Prediction(context=context, answer=pred.answer)
        return pred
```

现在，使用 DSPy 断言调用程序需要最后一步，即将程序转换为包装在内部断言回溯和重试逻辑中。

```python
from dspy.primitives.assertions import assert_transform_module, backtrack_handler

baleen_with_assertions = assert_transform_module(SimplifiedBaleenAssertions(), backtrack_handler)

# backtrack_handler 是针对回溯机制的一些设置参数化的
# 要更改最大重试尝试次数，可以这样做
baleen_with_assertions_retry_once = assert_transform_module(SimplifiedBaleenAssertions(), 
    functools.partial(backtrack_handler, max_backtracks=1))
```
或者，您也可以直接在程序中使用默认的回溯机制（`max_backtracks=2`）调用`dspy.Assert/Suggest`语句，并对程序调用`activate_assertions`：

```python
baleen_with_assertions = SimplifiedBaleenAssertions().activate_assertions()
```

现在让我们通过检查语言模型查询生成历史来查看内部的LM回溯。在这里，我们看到当一个查询未能通过验证检查（即长度不足100个字符）时，在回溯+重试过程中，其内部的`GenerateSearchQuery`签名会动态修改，以包括过去的查询和相应的用户定义指令："查询应该简短且少于100个字符"。
```
写一个简单的搜索查询，以帮助回答一个复杂的问题。

---

按照以下格式。

背景：可能包含相关事实

问题：${question}

推理：让我们一步一步地思考，以便${produce the query}。我们...

查询：${query}

---

背景：
[1] «Kerry Condon | Kerry Condon（1983年1月4日出生）是一个爱尔兰电视和电影女演员，以在HBO/BBC系列《罗马》中扮演朱利家族的Octavia、在AMC的《绝命律师》中扮演Stacey Ehrmantraut，以及在漫威电影宇宙中多部电影中为F.R.I.D.A.Y.配音而闻名。她还是Royal Shakespeare Company制作的《哈姆雷特》中饰演奥菲莉亚的最年轻女演员。»
[2] «Corona Riccardo | Corona Riccardo（大约1878年至1917年10月15日）是一位意大利裔美国女演员，在成为妻子和母亲之前曾在百老汇舞台上短暂发展事业。出生于那不勒斯，她于1894年开始演戏，在帝国剧院的一部剧中扮演墨西哥女孩。Wilson Barrett邀请她参加他的剧《十字架的标记》的演出，并随剧组在美国巡回演出。Riccardo在剧中扮演Ancaria，后来又在同一剧中扮演Berenice。1898年，Robert B. Mantell被她的美丽所吸引，还让她出演了两部莎士比亚剧《罗密欧与朱丽叶》和《奥赛罗》。作者刘易斯·斯特朗在1899年写道，Riccardo是当时美国最有前途的女演员。1898年末，Mantell选择她出演另一部莎士比亚剧《哈姆雷特》中的奥菲莉亚。之后，她应该加入奥古斯丁·戴利的剧团，但戴利于1899年去世。1899年，她因在《本·哈尔》的首次舞台剧中扮演Iras而获得了最大的名声。»

问题：谁出演了短片《The Shore》，同时也是Royal Shakespeare Company制作的《哈姆雷特》中饰演奥菲莉亚的最年轻女演员？

推理：让我们一步一步地思考，以便找到这个问题的答案。首先，我们需要确定在Royal Shakespeare Company制作的《哈姆雷特》中扮演奥菲莉亚的女演员是谁。然后，我们需要找出这位女演员是否也出演了短片《The Shore》。

查询："actress Ophelia RSC Hamlet" + "actress The Shore"

---

写一个简单的搜索查询，以帮助回答一个复杂的问题。

---

按照以下格式。

背景：可能包含相关事实

问题：${question}

过去查询：带有错误的过去输出

说明：您必须满足一些要求

查询：${query}

---

背景：
[1] «Kerry Condon | Kerry Condon（1983年1月4日出生）是一个爱尔兰电视和电影女演员，以在HBO/BBC系列《罗马》中扮演朱利家族的Octavia、在AMC的《绝命律师》中扮演Stacey Ehrmantraut，以及在漫威电影宇宙中多部电影中为F.R.I.D.A.Y.配音而闻名。她还是Royal Shakespeare Company制作的《哈姆雷特》中饰演奥菲莉亚的最年轻女演员。»
[2] «Corona Riccardo | Corona Riccardo（大约1878年至1917年10月15日）是一位意大利裔美国女演员，在成为妻子和母亲之前曾在百老汇舞台上短暂发展事业。出生于那不勒斯，她于1894年开始演戏，在帝国剧院的一部剧中扮演墨西哥女孩。Wilson Barrett邀请她参加他的剧《十字架的标记》的演出，并随剧组在美国巡回演出。Riccardo在剧中扮演Ancaria，后来又在同一剧中扮演Berenice。1898年，Robert B. Mantell被她的美丽所吸引，还让她出演了两部莎士比亚剧《罗密欧与朱丽叶》和《奥赛罗》。作者刘易斯·斯特朗在1899年写道，Riccardo是当时美国最有前途的女演员。1898年末，Mantell选择她出演另一部莎士比亚剧《哈姆雷特》中的奥菲莉亚。之后，她应该加入奥古斯丁·戴利的剧团，但戴利于1899年去世。1899年，她因在《本·哈尔》的首次舞台剧中扮演Iras而获得了最大的名声。»

问题：谁出演了短片《The Shore》，同时也是Royal Shakespeare Company制作的《哈姆雷特》中饰演奥菲莉亚的最年轻女演员？

过去查询："actress who played Ophelia in Royal Shakespeare Company production of Hamlet" + "actress in short film The Shore"

说明：查询应简短，不超过100个字符

查询："actress Ophelia RSC Hamlet" + "actress The Shore"
```
## 基于断言的优化

DSPy 断言与 DSPy 提供的优化相结合，特别是与 `BootstrapFewShotWithRandomSearch` 一起使用，包括以下设置：

- 编译时使用断言
    这包括在编译过程中进行基于断言的示例引导和反例引导。用于引导少样本演示的教师模型可以利用 DSPy 断言，在推理过程中为学生模型提供稳健的引导示例。在这种设置下，学生模型在推理过程中不执行断言感知优化（回溯和重试）。
- 编译 + 推理时使用断言
    这包括在编译和推理过程中都使用基于断言的优化。现在教师模型提供基于断言的示例，但学生模型可以在推理时使用自己的断言进一步优化。
```python
teleprompter = BootstrapFewShotWithRandomSearch(
    metric=validate_context_and_answer_and_hops,
    max_bootstrapped_demos=max_bootstrapped_demos,
    num_candidate_programs=6,
)

# 编译时使用断言
compiled_with_assertions_baleen = teleprompter.compile(student=baleen, teacher=baleen_with_assertions, trainset=trainset, valset=devset)

# 编译 + 推理时使用断言
compiled_baleen_with_assertions = teleprompter.compile(student=baleen_with_assertions, teacher=baleen_with_assertions, trainset=trainset, valset=devset)

```
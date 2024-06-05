---
sidebar_position: 5
---

# 指标

DSPy是一个机器学习框架，因此您必须考虑用于评估（以跟踪进展）和优化（使DSPy能够使您的程序更有效）的**自动指标**。

## 什么是指标，如何为我的任务定义指标？

指标只是一个函数，它将从您的数据中获取示例，获取系统的输出，并返回一个量化输出质量的分数。是什么使您系统的输出好坏不同呢？

对于简单的任务，这可能仅仅是“准确度”、“精确匹配”或“F1分数”。这可能适用于简单的分类或短格式问答任务。

然而，对于大多数应用，您的系统将输出长格式的结果。在这种情况下，您的指标可能应该是一个较小的DSPy程序，用于检查输出的多个属性（很可能使用来自语言模型的人工智能反馈）。

第一次就做对这一点是不太可能的，但您应该从简单的东西开始并进行迭代。

## 简单指标

DSPy指标只是Python中的一个函数，它接受`example`（例如，来自您的训练或开发集）和来自DSPy程序的输出`pred`，并输出一个`float`（或`int`或`bool`）分数。

您的指标还应接受一个名为`trace`的可选第三参数。您暂时可以忽略这一点，但如果您想将指标用于优化，它将使一些强大的技巧成为可能。

这是一个比较`example.answer`和`pred.answer`的指标的简单示例。这个特定的指标将返回一个`bool`。

```python
def validate_answer(example, pred, trace=None):
    return example.answer.lower() == pred.answer.lower()
```

一些人发现这些实用程序（内置）很方便：

- `dspy.evaluate.metrics.answer_exact_match`
- `dspy.evaluate.metrics.answer_passage_match`

您的指标可能更复杂，例如检查多个属性。如果`trace`为`None`，则下面的指标将返回一个`float`（即，如果用于评估或优化），否则将返回一个`bool`（即，如果用于引导演示）。

```python
def validate_context_and_answer(example, pred, trace=None):
    # 检查金标签和预测答案是否相同
    answer_match = example.answer.lower() == pred.answer.lower()

    # 检查预测答案是否来自检索到的上下文之一
    context_match = any((pred.answer.lower() in c) for c in pred.context)

    if trace is None: # 如果我们正在进行评估或优化
        return (answer_match + context_match) / 2.0
    else: # 如果我们正在进行引导演示，即自动生成每个步骤的良好演示
        return answer_match and context_match
```

定义一个好的指标是一个迭代的过程，因此进行一些初始评估并查看您的数据和输出是关键的。

## 评估

一旦您有了一个指标，您就可以在一个简单的Python循环中运行评估。
```python
scores = []
for x in devset:
    pred = program(**x.inputs())
    score = metric(x, pred)
    scores.append(score)
```
如果您需要一些实用工具，您也可以使用内置的 `Evaluate` 实用程序。它可以帮助处理诸如并行评估（多线程）或显示输入/输出样本和度量分数等事项。

```python
from dspy.evaluate import Evaluate

# 设置评估器，可以在您的代码中重复使用。
evaluator = Evaluate(devset=YOUR_DEVSET, num_threads=1, display_progress=True, display_table=5)

# 启动评估。
evaluator(YOUR_PROGRAM, metric=YOUR_METRIC)
```


## 中级：使用人工智能反馈进行度量

对于大多数应用程序，您的系统将输出长格式输出，因此您的度量应该使用来自语言模型的人工智能反馈来检查输出的多个维度。

这个简单的签名可能会派上用场。

```python
# 定义用于自动评估的签名。
class Assess(dspy.Signature):
    """评估推文在指定维度上的质量。"""

    assessed_text = dspy.InputField()
    assessment_question = dspy.InputField()
    assessment_answer = dspy.OutputField(desc="是或否")
```

例如，下面是一个简单的度量，使用 GPT-4-turbo 来检查生成的推文是否（1）正确回答了给定的问题，以及（2）是否具有吸引力。我们还检查（3）`len(tweet) <= 280` 字符。

```python
gpt4T = dspy.OpenAI(model='gpt-4-1106-preview', max_tokens=1000, model_type='chat')

def metric(gold, pred, trace=None):
    question, answer, tweet = gold.question, gold.answer, pred.output

    engaging = "被评估文本是否构成一个自包含、引人入胜的推文？"
    correct = f"文本应该用 `{question}` 回答 `{answer}`。被评估文本是否包含这个答案？"
    
    with dspy.context(lm=gpt4T):
        correct =  dspy.Predict(Assess)(assessed_text=tweet, assessment_question=correct)
        engaging = dspy.Predict(Assess)(assessed_text=tweet, assessment_question=engaging)

    correct, engaging = [m.assessment_answer.lower() == 'yes' for m in [correct, engaging]]
    score = (correct + engaging) if correct and (len(tweet) <= 280) else 0

    if trace is not None: return score >= 2
    return score / 2.0
```

在编译时，`trace is not None`，我们希望在判断事物时要严格一些，因此只有在 `score >= 2` 时才返回 `True`。否则，我们返回一个在 1.0 范围内的分数（即 `score / 2.0`）。


## 高级：使用 DSPy 程序作为您的度量

如果您的度量本身是一个 DSPy 程序，迭代的最强大方式之一是编译（优化）度量本身。这通常很容易，因为度量的输出通常是一个简单的值（例如，5 分制的分数），因此度量的度量易于定义并通过收集一些示例进行优化。


### 高级：访问 `trace`

当您的度量在评估运行期间使用时，DSPy 将不会尝试跟踪您程序的步骤。
但在编译（优化）过程中，DSPy 将跟踪您的 LM 调用。跟踪将包含对每个 DSPy 预测器的输入/输出，您可以利用这一点来验证优化的中间步骤。

```python
def validate_hops(example, pred, trace=None):
    hops = [example.question] + [outputs.query for *_, outputs in trace if 'query' in outputs]

    if max([len(h) for h in hops]) > 100: return False
    if any(dspy.evaluate.answer_exact_match_str(hops[idx], hops[:idx], frac=0.8) for idx in range(2, len(hops))): return False

    return True
```
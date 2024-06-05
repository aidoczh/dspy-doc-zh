---
sidebar_position: 5
---

# 数据

DSPy是一个机器学习框架，因此在其中工作涉及训练集、开发集和测试集。

对于数据中的每个示例，我们通常区分三种类型的值：输入、中间标签和最终标签。您可以在没有任何中间或最终标签的情况下有效地使用DSPy，但至少需要一些示例输入。

## 我需要多少数据以及如何为我的任务收集数据？

具体而言，您可以使用仅有10个示例输入就能有效地使用DSPy优化器，但拥有50-100个示例（甚至更好的是300-500个示例）会更有帮助。

如何获取这些示例呢？如果您的任务非常不寻常，请投入精力手动准备约10个示例。通常情况下，根据下面的度量标准，您只需要输入而不需要标签，所以并不难。

然而，您的任务很可能并不是那么独特。您几乎总是可以在HuggingFace数据集或其他形式的数据上找到相邻的数据集，可以在这里利用。

如果有数据的许可证足够宽松，我们建议您使用它们。否则，您也可以开始使用/部署/演示您的系统，并通过这种方式收集一些初始数据。

## DSPy `Example` 对象

在DSPy中，数据的核心数据类型是`Example`。您将使用**示例**来表示训练集和测试集中的项目。

DSPy的**示例**类似于Python的`dict`，但具有一些有用的实用程序。您的DSPy模块将返回`Prediction`类型的值，这是`Example`的一个特殊子类。

当您使用DSPy时，您将进行大量的评估和优化运行。您的单个数据点将是`Example`类型的：

```python
qa_pair = dspy.Example(question="这是一个问题？", answer="这是一个答案。")

print(qa_pair)
print(qa_pair.question)
print(qa_pair.answer)
```
**输出:**
```text
Example({'question': '这是一个问题？', 'answer': '这是一个答案。'}) (input_keys=None)
这是一个问题？
这是一个答案。
```

示例可以具有任何字段键和任何值类型，尽管通常值是字符串。

```text
object = Example(field1=value1, field2=value2, field3=value3, ...)
```

现在，您可以将您的训练集表示为：

```python
trainset = [dspy.Example(report="长报告1", summary="简短摘要1"), ...]
```


### 指定输入键

在传统的机器学习中，有“输入”和“标签”之分。

在DSPy中，`Example`对象具有`with_inputs()`方法，可以将特定字段标记为输入。（其余部分只是元数据或标签。）

```python
# 单个输入。
print(qa_pair.with_inputs("question"))

# 多个输入；在标记标签为输入时要小心，除非您是有意为之。
print(qa_pair.with_inputs("question", "answer"))
```

可以使用`.`（点）运算符访问值。您可以通过`object.name`访问定义对象`Example(name="John Doe", job="sleep")`中`name`键的值。
要访问或排除特定键，可以使用 `inputs()` 和 `labels()` 方法，返回仅包含输入键或非输入键的新 Example 对象。

```python
article_summary = dspy.Example(article= "This is an article.", summary= "This is a summary.").with_inputs("article")

input_key_only = article_summary.inputs()
non_input_key_only = article_summary.labels()

print("Example object with Input fields only:", input_key_only)
print("Example object with Non-Input fields only:", non_input_key_only)
```

**输出**
```
Example object with Input fields only: Example({'article': 'This is an article.'}) (input_keys=None)
Example object with Non-Input fields only: Example({'summary': 'This is a summary.'}) (input_keys=None)
```
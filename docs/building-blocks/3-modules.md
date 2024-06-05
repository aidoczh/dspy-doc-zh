---
sidebar_position: 3
---

# 模块

**DSPy 模块** 是使用 LMs 的程序的构建模块。

- 每个内置模块都抽象了一个**提示技术**（如思维链或 ReAct）。关键是，它们被泛化以处理任何 [DSPy 签名](https://dspy-docs.vercel.app/docs/building-blocks/signatures)。

- DSPy 模块具有**可学习参数**（即组成提示和 LM 权重的小部分），可以被调用以处理输入并返回输出。

- 多个模块可以组合成更大的模块（程序）。DSPy 模块直接受到 PyTorch 中 NN 模块的启发，但应用于 LM 程序。


## 我如何使用内置模块，比如 `dspy.Predict` 或 `dspy.ChainOfThought`？

让我们从最基本的模块 `dspy.Predict` 开始。内部，所有其他 DSPy 模块都只是使用 `dspy.Predict` 构建的。

我们将假设您至少对 [DSPy 签名](https://dspy-docs.vercel.app/docs/building-blocks/signatures) 有一定了解，这些签名是用于定义我们在 DSPy 中使用的任何模块行为的声明规范。

要使用一个模块，我们首先通过给它一个签名来**声明**它。然后我们使用输入参数**调用**模块，并提取输出字段！

```python
sentence = "it's a charming and often affecting journey."  # 来自 SST-2 数据集的示例。

# 1) 使用签名进行声明。
classify = dspy.Predict('sentence -> sentiment')

# 2) 使用输入参数进行调用。
response = classify(sentence=sentence)

# 3) 访问输出。
print(response.sentiment)
```
**输出:**
```text
Positive
```

当我们声明一个模块时，可以向其传递配置键。

在下面的示例中，我们将传递 `n=5` 以请求五个完成。我们还可以传递 `temperature` 或 `max_len` 等。

让我们使用 `dspy.ChainOfThought`。在许多情况下，简单地将 `dspy.ChainOfThought` 替换为 `dspy.Predict` 可以提高质量。

```python
question = "What's something great about the ColBERT retrieval model?"

# 1) 使用签名进行声明，并传递一些配置。
classify = dspy.ChainOfThought('question -> answer', n=5)

# 2) 使用输入参数进行调用。
response = classify(question=question)

# 3) 访问输出。
response.completions.answer
```
**输出:**
```text
['关于 ColBERT 检索模型的一个伟大之处是其与其他模型相比的卓越效率和效果。',
 '它能够高效地从大型文档集合中检索相关信息。',
 'ColBERT 检索模型的一个伟大之处是其与其他模型相比的卓越性能以及对预训练语言模型的高效使用。',
 'ColBERT 检索模型的一个伟大之处是其与其他模型相比的卓越效率和准确性。',
 'ColBERT 检索模型的一个伟大之处是其能够整合用户反馈并支持复杂查询。']
```

让我们在这里讨论输出对象。
`dspy.ChainOfThought` 模块通常会在您的签名输出字段之前注入一个 `rationale`。

让我们检查（第一个）rationale 并回答！

```python
print(f"Rationale: {response.rationale}")
print(f"Answer: {response.answer}")
```
**输出:**
```text
Rationale: 生成答案。我们可以考虑到 ColBERT 已经显示出在效率和有效性方面优于其他最先进的检索模型。它使用上下文嵌入并以准确且可扩展的方式执行文档检索。
Answer: ColBERT 检索模型的一大优点是相较于其他模型具有更高的效率和有效性。
```

无论我们请求一个还是多个完成，这都是可访问的。

我们还可以将不同的完成作为 `Prediction` 列表或作为几个列表访问，每个列表对应一个字段。

```python
response.completions[3].rationale == response.completions.rationale[3]
```
**输出:**
```text
True
```


## 还有哪些其他 DSPy 模块？我该如何使用它们？

其他模块非常相似。它们主要改变了实现您的签名的内部行为！

1. **`dspy.Predict`**: 基本预测器。不修改签名。处理学习的关键形式（即，存储指令和演示以及对 LM 的更新）。

2. **`dspy.ChainOfThought`**: 教导 LM 在承诺签名响应之前逐步思考。

3. **`dspy.ProgramOfThought`**: 教导 LM 输出代码，其执行结果将决定响应。

4. **`dspy.ReAct`**: 一个可以使用工具来实现给定签名的代理。

5. **`dspy.MultiChainComparison`**: 可以比较来自 `ChainOfThought` 的多个输出以生成最终预测。


我们还有一些函数风格的模块：

6. **`dspy.majority`**: 可以进行基本投票，返回一组预测中最受欢迎的响应。


在[每个模块的相应指南](https://dspy-docs.vercel.app/api/category/modules)中查看更多示例。


## 如何将多个模块组合成一个更大的程序？

DSPy 只是使用模块的 Python 代码，可以按照您喜欢的任何控制流使用模块。（在 `compile` 时内部有一些魔法来跟踪您的 LM 调用。）

这意味着，您可以自由地调用这些模块。没有用于链接调用的奇怪抽象。

这基本上是 PyTorch 的设计方法，用于定义运行 / 动态计算图。请参考入门教程以获取示例。
---
sidebar_position: 2
---

# 签名

在 DSPy 中，当我们将任务分配给 LM 时，我们将我们需要的行为规定为一个 Signature。

**Signature 是对 DSPy 模块的输入/输出行为的声明性规范。** Signature 允许您告诉 LM 需要做什么，而不是指定我们应该如何要求 LM 去做。

您可能熟悉函数签名，它们指定输入和输出参数及其类型。DSPy 签名类似，但不同之处在于：

- 传统的函数签名只是描述事物，而 DSPy 签名则定义和控制模块的行为。

- 在 DSPy 签名中，字段名称很重要。您用简单的英语表达语义角色：`question` 与 `answer` 不同，`sql_query` 与 `python_code` 也不同。


## 我为什么要使用 DSPy 签名？

**简短回答：** 为了模块化和清晰的代码，其中 LM 调用可以优化为高质量提示（或自动微调）。

**详细回答：** 大多数人通过修改冗长且脆弱的提示来强迫 LM 完成任务。或者通过收集/生成数据进行微调。

编写签名比在提示或微调上进行修改更模块化、适应性更强、可重复性更好。DSPy 编译器将找出如何为您的 LM 构建高度优化的提示（或微调您的小型 LM）以适应您的签名、您的数据和您的流程。在许多情况下，我们发现编译出的提示比人类编写的更好。并不是因为 DSPy 优化器比人类更有创造力，而仅仅是因为它们可以尝试更多的方法并直接调整指标。


## **内联** DSPy 签名

签名可以定义为一个简短的字符串，其中参数名称定义了输入/输出的语义角色。

1. 问答：`"question -> answer"`

2. 情感分类：`"sentence -> sentiment"`

3. 摘要：`"document -> summary"`

您的签名也可以具有多个输入/输出字段。

4. 基于检索的问答：`"context, question -> answer"`

5. 具有推理的多项选择问答：`"question, choices -> reasoning, selection`


**提示：** 对于字段，任何有效的变量名称都可以使用！字段名称应具有语义意义，但要简单起见，不要过早优化关键字！将这种修改留给 DSPy 编译器。例如，对于摘要，可能可以说 `"document -> summary"`、`"text -> gist"` 或 `"long_context -> tldr"`。


### 示例 A：情感分类

```python
sentence = "it's a charming and often affecting journey."  # 来自 SST-2 数据集的示例。

classify = dspy.Predict('sentence -> sentiment')
classify(sentence=sentence).sentiment
```
**输出：**
```text
'Positive'
```


### 示例 B：摘要

```python
# XSum 数据集中的示例。
document = """这位 21 岁的球员在上赛季为锤子队出场七次，在一场欧洲联赛预选赛中攻入了他们的唯一进球，对阵安道尔球队 FC Lustrains。上赛季，李在英甲联赛有两次租借经历，先是去了布莱克浦，然后是科尔切斯特联队。他为科尔切斯特联队打入两球，但未能帮助球队免于降级。李与晋级的泰克斯队签订的合同长度尚未透露。在我们专门的页面上查看所有最新的足球转会消息。"""

summarize = dspy.ChainOfThought('document -> summary')
response = summarize(document=document)

print(response.summary)
```
**输出:**
```text
21岁的李在上个赛季为西汉姆联队出场7次，打入1球。他曾在英甲联赛租借效力于布莱克浦和科尔切斯特联队，后者他打入了两球。他现在已经与巴恩斯利签约，但合同的期限尚未透露。
```

许多 DSPy 模块（除了 `dspy.Predict`）会在幕后扩展您的签名以返回辅助信息。

例如，`dspy.ChainOfThought` 还会添加一个 `rationale` 字段，其中包含 LM 在生成输出 `summary` 之前的推理过程。

```python
print("推理:", response.rationale)
```
**输出:**
```text
推理: 产生摘要。我们需要强调关于李在西汉姆联队表现、在英甲联赛的租借经历以及与巴恩斯利的新合同的关键点。我们还需要提到他的合同期限尚未披露。
```

## **基于类** 的 DSPy 签名

对于一些高级任务，您可能需要更详细的签名。这通常是为了：

1. 澄清任务性质的某些内容（在下面的 `docstring` 中表达）。

2. 为 `dspy.InputField` 的 `desc` 关键字参数提供有关输入字段性质的提示。

3. 为 `dspy.OutputField` 的 `desc` 关键字参数提供有关输出字段约束的提示。


### 示例 C: 分类

请注意，docstring 包含（最小的）说明，这在这种情况下是必要的，以便完全定义任务。

DSPy 中的一些优化器，如 `COPRO`，可以获取这个简单的 docstring，然后根据需要生成更有效的变体。

```python
class Emotion(dspy.Signature):
    """对悲伤、喜悦、爱、愤怒、恐惧、惊讶等情绪进行分类。"""
    
    sentence = dspy.InputField()
    sentiment = dspy.OutputField()

sentence = "i started feeling a little vulnerable when the giant spotlight started blinding me"  # 来自 dair-ai/emotion

classify = dspy.Predict(Emotion)
classify(sentence=sentence)
```
**输出:**
```text
Prediction(
    sentiment='恐惧'
)
```

**提示:** 清楚地指定您对 LM 的请求没有错。基于类的签名可以帮助您做到这一点。但是，不要过早地手动调整签名的关键字。DSPy 优化器可能会做得更好（并且在不同的 LM 之间转移效果更好）。

### 示例 D: 评估引文忠实度的度量标准
```python
class CheckCitationFaithfulness(dspy.Signature):
    """验证文本是否基于提供的背景信息。"""

    context = dspy.InputField(desc="这里的事实被假定为真实的")
    text = dspy.InputField()
    faithfulness = dspy.OutputField(desc="True/False 表示文本是否忠实于背景信息")

context = "这位21岁的球员上赛季为Hammers出场7次，在一场欧洲联赛预选赛中攻入了他们的唯一进球，对阵安道尔球队FC Lustrains。上赛季，Lee在英甲联赛有两次租借经历，先是去了Blackpool，然后是Colchester United。他为Colchester United打入两球，但未能帮助球队免于降级。目前还不清楚Lee与提升级别的Tykes签约的合同期限。在我们专门的页面上找到所有最新的足球转会消息。"

text = "Lee在Colchester United打入了3个进球。"

faithfulness = dspy.ChainOfThought(CheckCitationFaithfulness)
faithfulness(context=context, text=text)
```
**输出:**
```text
预测(
    解释="产生忠实度。我们知道上赛季李在英甲联赛有两次租借经历，先是去了布莱克浦，然后是科尔切斯特联队。他为科尔切斯特联队打入了两球，但未能帮助球队免于降级。然而，并未提及他为科尔切斯特联队打入三球。",
    忠实度='错误'
)
```


## 使用签名构建模块并编译它们

虽然签名在使用结构化输入/输出进行原型设计时很方便，但这并不是使用它们的主要原因！

您应该将多个签名组合成更大的[DSPy模块](https://dspy-docs.vercel.app/docs/building-blocks/modules)，并[将这些模块编译成优化提示](https://dspy-docs.vercel.app/docs/building-blocks/optimizers#what-does-a-dspy-optimizer-tune-how-does-it-tune-them)和微调。
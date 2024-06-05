# dspy.ChainOfThought

### 构造函数

构造函数初始化 `ChainOfThought` 类并设置其属性。它继承自 `Predict` 类，并为思维链处理添加了特定功能。

在内部，该类将 `activated` 属性初始化为指示是否选择了思维链处理。当启用思维链处理时，它会扩展 `signature` 以包括额外的推理步骤和更新的 `rationale_type`。

```python
class ChainOfThought(Predict):
    def __init__(self, signature, rationale_type=None, activated=True, **config):
        super().__init__(signature, **config)

        self.activated = activated

        signature = ensure_signature(self.signature)
        *_keys, last_key = signature.output_fields.keys()

        rationale_type = rationale_type or dspy.OutputField(
            prefix="Reasoning: Let's think step by step in order to",
            desc="${produce the " + last_key + "}. We ...",
        )

        self.extended_signature = signature.prepend("rationale", rationale_type, type_=str)
```

**参数:**
- `signature` (_Any_): 预测模型的签名。
- `rationale_type` (_dspy.OutputField_, _可选_): 推理步骤的理由类型。默认为 `None`。
- `activated` (_bool_, _可选_): 激活思维链处理的标志。默认为 `True`。
- `**config` (_dict_): 模型的附加配置参数。

### 方法

#### `forward(self, **kwargs)`

此方法在激活思维链推理或语言模型为 GPT3 模型时，扩展了父类 `Predict` 类的前向传递，并更新了签名。

**参数:**
- `**kwargs`: 预测所需的关键字参数。

**返回:**
- `forward` 方法的结果。

### 示例

```python
# 为基本问答定义简单签名
class BasicQA(dspy.Signature):
    """使用简短的事实性答案回答问题。"""
    question = dspy.InputField()
    answer = dspy.OutputField(desc="通常为 1 到 5 个单词之间")

# 将签名传递给 ChainOfThought 模块
generate_answer = dspy.ChainOfThought(BasicQA)

# 对特定输入调用预测器。
question='天空的颜色是什么？'
pred = generate_answer(question=question)

print(f"问题: {question}")
print(f"预测答案: {pred.answer}")
```

以下示例展示了如何指定自定义推理。这里的 `answer` 对应于要生成的最后一个键，实际情况可能不同。

```python
# 定义自定义推理
rationale_type = dspy.OutputField(
            prefix="Reasoning: 让我们逐步思考，以便",
            desc="${生成答案}. 我们 ...",
        )
# 将签名传递给 ChainOfThought 模块
generate_answer = dspy.ChainOfThought(BasicQA, rationale_type=rationale_type)
```
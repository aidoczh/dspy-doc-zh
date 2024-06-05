# dspy.ChainOfThoughtWithHint

### 构造函数

构造函数初始化`ChainOfThoughtWithHint`类并设置其属性，继承自`Predict`类。该类通过提供额外的选项来为推理提供提示，增强了`ChainOfThought`类。根据提示的存在与否，在内部创建了两个不同的签名模板。

```python
class ChainOfThoughtWithHint(Predict):
    def __init__(self, signature, rationale_type=None, activated=True, **config):
        super().__init__(signature, **config)
        self.activated = activated
        signature = self.signature

        *keys, last_key = signature.fields.keys()
        rationale_type = rationale_type or dspy.OutputField(
            prefix="Reasoning: Let's think step by step in order to",
            desc="${produce the " + last_key + "}. We ...",
        )
        self.extended_signature1 = self.signature.insert(-2, "rationale", rationale_type, type_=str)

        DEFAULT_HINT_TYPE = dspy.OutputField()
        self.extended_signature2 = self.extended_signature1.insert(-2, "hint", DEFAULT_HINT_TYPE, type_=str)
```

**参数:**
- `signature` (_Any_): 预测模型的签名。
- `rationale_type` (_dspy.OutputField_, _可选_): 推理步骤的理由类型。默认为`None`。
- `activated` (_bool_, _可选_): 激活思维链处理的标志。默认为`True`。
- `**config` (_dict_): 模型的额外配置参数。

### 方法

#### `forward(self, **kwargs)`

该方法扩展了父类`Predict`类的前向传递，根据关键字参数中`hint`的存在和`activated`属性动态更新签名。

**参数:**
- `**kwargs`: 预测所需的关键字参数。

**返回:**
- `Predict`类中`forward`方法的结果。

### 示例

```python
# 为基本问答定义一个简单的签名
class BasicQA(dspy.Signature):
    """用简短的事实性答案回答问题。"""
    question = dspy.InputField()
    answer = dspy.OutputField(desc="通常为1到5个单词")

# 将签名传递给ChainOfThought模块
generate_answer = dspy.ChainOfThoughtWithHint(BasicQA)

# 在特定输入旁边调用预测器以及一个提示。
question='天空的颜色是什么？'
hint = "这是你在晴天时经常看到的东西。"
pred = generate_answer(question=question, hint=hint)

print(f"问题: {question}")
print(f"预测答案: {pred.answer}")
```
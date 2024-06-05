# dspy.Predict

### 构造函数

构造函数初始化 `Predict` 类并设置其属性，接受 `signature` 和额外的配置选项。如果 `signature` 是一个字符串，它会处理输入和输出字段，生成指令，并为指定的 `signature` 类型创建模板。

```python
class Predict(Parameter):
    def __init__(self, signature, **config):
        self.stage = random.randbytes(8).hex()
        self.signature = signature
        self.config = config
        self.reset()

        if isinstance(signature, str):
            inputs, outputs = signature.split("->")
            inputs, outputs = inputs.split(","), outputs.split(",")
            inputs, outputs = [field.strip() for field in inputs], [field.strip() for field in outputs]

            assert all(len(field.split()) == 1 for field in (inputs + outputs))

            inputs_ = ', '.join([f"`{field}`" for field in inputs])
            outputs_ = ', '.join([f"`{field}`" for field in outputs])

            instructions = f"""给定字段 {inputs_}，生成字段 {outputs_}。"""

            inputs = {k: InputField() for k in inputs}
            outputs = {k: OutputField() for k in outputs}

            for k, v in inputs.items():
                v.finalize(k, infer_prefix(k))
            
            for k, v in outputs.items():
                v.finalize(k, infer_prefix(k))

            self.signature = dsp.Template(instructions, **inputs, **outputs)
```

**参数:**
- `signature` (_Any_): 预测模型的签名。
- `**config` (_dict_): 模型的额外配置参数。

### 方法

#### `__call__(self, **kwargs)`

这个方法作为 `forward` 方法的包装器。它允许通过提供关键字参数来使用 `Predict` 类进行预测。

**参数:**
- `**kwargs`: 预测所需的关键字参数。

**返回:**
- `forward` 方法的结果。

### 示例

```python
# 为基本问答定义一个简单的签名
class BasicQA(dspy.Signature):
    """用简短的事实性答案回答问题。"""
    question = dspy.InputField()
    answer = dspy.OutputField(desc="通常为1到5个单词之间")

# 将签名传递给 Predict 模块
generate_answer = dspy.Predict(BasicQA)

# 对特定输入调用预测器。
question='天空的颜色是什么？'
pred = generate_answer(question=question)

print(f"问题: {question}")
print(f"预测的答案: {pred.answer}")
```
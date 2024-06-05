---
sidebar_position: 1
---

# dspy.TypedPredictor

`TypedPredictor` 类是一个设计精良的模块，专为进行严格类型验证的预测而设计。它利用签名来强制执行输入和输出的类型约束，确保数据符合预期的模式。

### 构造函数

```python
TypedPredictor(
    signature: CodeSignature,
    max_retries: int = 3
)
```

参数:
* `signature` (dspy.Signature): 定义输入和输出字段及其类型的签名。
* `max_retries` (int, 可选): 生成有效预测输出的最大重试次数。默认为 3。

### 方法

#### `copy() -> "TypedPredictor"`

创建并返回当前 `TypedPredictor` 实例的深层副本。

**返回:** 一个 `TypedPredictor` 的新实例，是原始实例的深层副本。

#### `_make_example(type_: Type) -> str`

一个静态方法，根据指定的 Pydantic 模型类型的模式生成一个 JSON 对象示例。这个 JSON 对象作为预期输入或输出格式的示例。

**参数:**
* `type_`: 要生成示例 JSON 对象的 Pydantic 模型类。

**返回:** 代表 JSON 对象示例的字符串，该字符串符合提供的 Pydantic 模型的 JSON 模式。如果该方法无法生成有效示例，则返回空字符串。

#### `_prepare_signature() -> dspy.Signature`

准备并返回与 `TypedPredictor` 实例关联的签名的修改版本。该方法遍历签名的字段，根据其类型注释添加格式和解析函数。

**返回:** 一个增强了格式和解析规范的 `dspy.Signature` 对象。

#### `forward(**kwargs) -> dspy.Prediction`

执行预测逻辑，利用 `dspy.Predict` 组件基于输入参数生成预测。该方法处理类型验证、输出数据解析，并在输出一开始不符合指定输出模式时实施重试逻辑。

**参数:**

* `**kwargs`: 对应于签名中定义的输入字段的关键字参数。

**返回:** 包含预测结果的 `dspy.Prediction` 对象。该对象中的每个键对应于签名中定义的一个输出字段，其值是预测的解析结果。

### 示例

```python
from dspy import InputField, OutputField, Signature
from dspy.functional import TypedPredictor
from pydantic import BaseModel

# 我们定义了一个 pydantic 类型，它会自动检查其参数是否是有效的 Python 代码。
class CodeOutput(BaseModel):
    code: str
    api_reference: str

class CodeSignature(Signature):
    function_description: str = InputField()
    solution: CodeOutput = OutputField()

cot_predictor = TypedPredictor(CodeSignature)
prediction = cot_predictor(
    function_description="编写一个函数，用于计算两个数字的和。"
)

print(prediction["code"])
print(prediction["api_reference"])
```
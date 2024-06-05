---
sidebar_position: 2
---

# dspy.TypedChainOfThought

### 概述

#### `def TypedChainOfThought(signature, max_retries=3) -> dspy.Module`

通过将其置于签名之前，向 `dspy.TypedPredictor` 模块添加一个思维链 `dspy.OutputField`。类似于 `dspy.TypedPredictor`，但会自动添加一个“推理”输出字段。

* **输入**:
    * `signature`: 指定输入/输出字段的 `dspy.Signature`
    * `max_retries`: 如果输出验证失败，最大重试次数
* **输出**: 能够进行预测的 `dspy.Module` 实例。

### 示例

```python
from dspy import InputField, OutputField, Signature
from dspy.functional import TypedChainOfThought
from pydantic import BaseModel

# 我们定义一个 pydantic 类型，它会自动检查其参数是否为有效的 Python 代码。
class CodeOutput(BaseModel):
    code: str
    api_reference: str

class CodeSignature(Signature):
    function_description: str = InputField()
    solution: CodeOutput = OutputField()

cot_predictor = TypedChainOfThought(CodeSignature)
prediction = cot_predictor(
    function_description="编写一个函数，用于将两个数字相加。"
)

print(prediction["code"])
print(prediction["api_reference"])
```
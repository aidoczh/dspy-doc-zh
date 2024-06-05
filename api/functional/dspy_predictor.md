---
sidebar_position: 3
---

# dspy.predictor

### 概述

#### `def predictor(func) -> dspy.Module`

`@predictor` 装饰器用于基于提供的函数创建一个预测模块。它会根据函数的类型注释和文档字符串自动生成一个 `dspy.TypedPredictor`。

* **输入**: 带有输入参数和返回类型注释的函数。
* **输出**: 能够进行预测的 `dspy.Module` 实例。

### 示例

```python
import dspy

context = ["Roses are red.", "Violets are blue"]
question = "What color are roses?"

@dspy.predictor
def generate_answer(self, context: list[str], question) -> str:
    """用简短的事实性答案回答问题。"""
    pass

generate_answer(context=context, question=question)
```
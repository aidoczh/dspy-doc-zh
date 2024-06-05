---
sidebar_position: 4
---

# dspy.cot

### 概述

#### `def cot(func) -> dspy.Module`

`@cot` 装饰器用于基于提供的函数创建一个基于思维链的模块。它会根据函数的类型注释和文档字符串自动生成一个 `dspy.TypedPredictor`。类似于预测器，但添加了一个“Reasoning”输出字段，以捕获模型的逐步推理过程。

* **输入**: 带有输入参数和返回类型注释的函数。
* **输出**: 能够进行预测的 `dspy.Module` 实例。

### 示例

```python
import dspy

context = ["Roses are red.", "Violets are blue"]
question = "What color are roses?"

@dspy.cot
def generate_answer(self, context: list[str], question) -> str:
    """用简短的事实回答问题。"""
    pass

generate_answer(context=context, question=question)
```
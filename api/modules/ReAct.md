# dspy.ReAct

### 构造函数

构造函数初始化`ReAct`类并设置其属性。它专门设计用于组成思考、行动和观察的交错步骤。

```python
import dsp
import dspy
from ..primitives.program import Module
from .predict import Predict

class ReAct(Module):
    def __init__(self, signature, max_iters=5, num_results=3, tools=None):
        ...
```

**参数:**
- `signature`（_Any_）：预测模型的签名。
- `max_iters`（_int_，_可选_）：思考-行动-观察循环的最大迭代次数。默认为`5`。
- `num_results`（_int_，_可选_）：在行动步骤中要检索的结果数量。默认为`3`。
- `tools`（_List[dspy.Tool]_，_可选_）：可用于行动的工具列表。如果未提供任何工具，则使用具有`num_results`的默认`Retrieve`工具。

### 方法

#### `_generate_signature(self, iters)`

根据迭代次数生成思考-行动-观察循环的签名。

**参数:**
- `iters`（_int_）：迭代次数。

**返回:**
- 签名的字典表示。

***

#### `act(self, output, hop)`

处理一个动作并返回观察结果或最终答案。

**参数:**
- `output`（_dict_）：来自思考的当前输出。
- `hop`（_int_）：当前迭代次数。

**返回:**
- 代表最终答案或`None`的字符串。

***

#### `forward(self, **kwargs)`

执行给定输入字段集的思考-行动-观察循环的主要方法。

**参数:**
- `**kwargs`：对应于输入字段的关键字参数。

**返回:**
- 包含ReAct过程结果的`dspy.Prediction`对象。

### 示例

```python
# 为基本问答定义一个简单的签名
class BasicQA(dspy.Signature):
    """用简短的事实性答案回答问题。"""
    question = dspy.InputField()
    answer = dspy.OutputField(desc="通常在1到5个单词之间")

# 将签名传递给ReAct模块
react_module = dspy.ReAct(BasicQA)

# 在特定输入上调用ReAct模块
question = '天空的颜色是什么？'
result = react_module(question=question)

print(f"问题: {question}")
print(f"最终预测答案（经过ReAct处理后）: {result.answer}")
```
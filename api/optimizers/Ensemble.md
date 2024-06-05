---
sidebar_position: 3
---

# teleprompt.Ensemble

### 构造函数

构造函数初始化 `Ensemble` 类并设置其属性。这个电子提示器旨在创建多个程序的集成版本，将来自不同程序的各种输出减少为单个输出。

```python
class Ensemble(Teleprompter):
    def __init__(self, *, reduce_fn=None, size=None, deterministic=False):
```

**参数:**
- `reduce_fn`（_callable_，_可选_）：用于将来自不同程序的多个输出减少为单个输出的函数。常见选择是 `dspy.majority`。默认为 `None`。
- `size`（_int_，_可选_）：要随机选择用于集成的程序数量。如果未指定，将使用所有程序。默认为 `None`。
- `deterministic`（_bool_，_可选_）：指定集成是否应该以确定性方式运行。当前，将此设置为 `True` 将引发错误，因为此功能正在等待实施。默认为 `False`。

### 方法

#### `compile(self, programs)`

此方法将一组程序编译成一个单一程序，当运行时，可以随机抽取给定程序的子集来生成输出，或者使用所有程序。然后可以使用 `reduce_fn` 将多个输出减少为单个输出。

**参数:**
- `programs`（_list_）：要进行集成的程序列表。

**返回:**
- `EnsembledProgram`（_Module_）：输入程序的集成版本。

### 示例

```python
import dspy
from dspy.teleprompt import Ensemble

# 假设有一组程序
programs = [program1, program2, program3, ...]

# 定义 Ensemble 电子提示器
teleprompter = Ensemble(reduce_fn=dspy.majority, size=2)

# 编译以获得 EnsembledProgram
ensembled_program = teleprompter.compile(programs)
```
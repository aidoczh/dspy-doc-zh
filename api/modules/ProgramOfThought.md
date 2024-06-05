# dspy.ProgramOfThought

### 构造函数

构造函数初始化 `ProgramOfThought` 类并设置其属性。它旨在基于输入字段生成和执行 Python 代码，通过迭代细化产生单个输出字段。在出现错误的情况下，支持多次迭代以细化代码。

```python
import dsp
import dspy
from ..primitives.program import Module
from ..primitives.python_interpreter import CodePrompt, PythonInterpreter
import re

class ProgramOfThought(Module):
    def __init__(self, signature, max_iters=3):
        ...
```

**参数:**
- `signature` (_dspy.Signature_): 定义程序输入和输出字段的签名。
- `max_iters` (_int_, _optional_): 用于细化生成代码的最大迭代次数。默认为 `3`。

### 方法

#### `_generate_signature(self, mode)`

为不同模式生成签名字典：`generate`、`regenerate` 和 `answer`。

- `generate` 模式用于使用签名的初始生成 Python 代码 (`question -> generated_code`)。
- `regenerate` 模式用于细化生成 Python 代码，考虑到过去生成的代码和现有错误，带有签名 (`question, previous_code, error -> generated_code`)。
- `answer` 模式用于执行最后存储的生成代码并输出带有签名的问题的最终答案 (`question, final_generated_code, code_output -> answer`)。

**参数:**
- `mode` (_str_): `Program of Thought` 的操作模式。

**返回:**
- 代表指定模式签名的字典。

#### `_generate_instruction(self, mode)`

根据模式生成代码生成的指令。这确保了签名考虑了在生成输入问题的答案时生成可执行的 Python 代码所需的相关指令。

指令模式与签名模式相对应：`generate`、`regenerate`、`answer`

**参数:**
- `mode` (_str_): 操作模式。

**返回:**
- 代表指定模式指令的字符串。

#### `parse_code(self, code_data)`

解析生成的代码并检查格式错误。

**参数:**
- `code_data` (_dict_): 包含生成代码的数据。`key - generated_code`，`val - {Python code string}`

**返回:**
- 包含解析代码和任何错误消息的元组。

#### `execute_code(self, code)`

执行解析后的代码并捕获输出或错误。

**参数:**
- `code` (_str_): 要执行的代码。

**返回:**
- 包含代码、其输出和任何错误消息的元组。

#### `forward(self, **kwargs)`

执行代码生成和细化过程的主要方法。

**参数:**
- `**kwargs`: 对应输入字段的关键字参数。

**返回:**
- 程序生成的最终答案，如果持续出现错误则返回 `None`。

### 示例
```python
# 定义一个简单的签名以进行基本问题回答
class GenerateAnswer(dspy.Signature):
    """用简短的事实性答案回答问题。"""
    question = dspy.InputField()
    answer = dspy.OutputField(desc="通常为1到5个单词之间")

# 将签名传递给ProgramOfThought模块
pot = dspy.ProgramOfThought(GenerateAnswer)

# 在特定输入上调用ProgramOfThought模块
question = 'Sarah有5个苹果。她从商店买了7个苹果。现在Sarah有多少苹果？'
result = pot(question=question)

print(f"问题: {question}")
print(f"最终预测答案（经过ProgramOfThought处理后）: {result.answer}")
```

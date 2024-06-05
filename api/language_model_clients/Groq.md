---
sidebar_position: 9
---

# dspy.GROQ

### 用法

```python
lm = dspy.GROQ(model='mixtral-8x7b-32768', api_key ="gsk_***" )
```

### 构造函数

构造函数初始化基类 `LM` 并验证提供的参数，如 GROQ API 检索器的 `api_key`。`kwargs` 属性使用默认值进行初始化，用于与 GROQ API 通信所需的相关文本生成参数，如 `temperature`、`max_tokens`、`top_p`、`frequency_penalty`、`presence_penalty` 和 `n`。

```python
class GroqLM(LM):
    def __init__(
        self,
        api_key: str,
        model: str = "mixtral-8x7b-32768",
        **kwargs,
    ):
```



**参数:** 
- `api_key` str: API 提供者的身份验证令牌。默认为 None。
- `model` str: 模型名称。默认为 "mixtral-8x7b-32768' 选项: ['llama2-70b-4096', 'gemma-7b-it']
- `**kwargs`: 传递给 API 提供者的其他语言模型参数。

### 方法

####   `def __call__(self, prompt: str, only_completed: bool = True, return_sorted: bool = False, **kwargs, ) -> list[dict[str, Any]]:`

通过调用 `request` 从 GROQ 检索完成内容。

在内部，该方法处理准备请求提示和相应有效载荷以获取响应的具体细节。

生成后，生成的内容看起来像 `choice["message"]["content"]`。

**参数:**
- `prompt` (_str_): 发送到 GROQ 的提示。
- `only_completed` (_bool_, _optional_): 返回仅完成的响应并忽略由于长度而完成的标志。默认为 True。
- `return_sorted` (_bool_, _optional_): 使用返回的平均对数概率对完成选项进行排序的标志。默认为 False。
- `**kwargs`: 完成请求的其他关键字参数。

**返回:**
- `List[Dict[str, Any]]`: 完成选项列表。
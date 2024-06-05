---
sidebar_position: 2
---

# dspy.AzureOpenAI

### 用法

```python
lm = dspy.AzureOpenAI(api_base='...', api_version='2023-12-01-preview', model='gpt-3.5-turbo')
```

### 构造函数

构造函数初始化基类 `LM` 并验证提供的参数，如 `api_provider`、`api_key` 和 `api_base`，以便通过 Azure 设置 OpenAI 请求检索。`kwargs` 属性使用默认值进行初始化，用于与 GPT API 通信所需的相关文本生成参数，如 `temperature`、`max_tokens`、`top_p`、`frequency_penalty`、`presence_penalty` 和 `n`。

Azure 要求还必须使用参数 `deployment_id` 提供 Azure 部署的部署 ID。

```python
class AzureOpenAI(LM):
    def __init__(
        self,
        api_base: str,
        api_version: str,
        model: str = "gpt-3.5-turbo-instruct",
        api_key: Optional[str] = None,
        model_type: Literal["chat", "text"] = None,
        **kwargs,
    ):
```



**参数:** 
- `api_base` (str): Azure 基础 URL。
- `api_version` (str): Azure OpenAI API 的版本标识符。
- `api_key` (_Optional[str]_, _optional_): API 提供者身份验证令牌。如果为 None，则从 `AZURE_OPENAI_KEY` 环境变量中检索。
- `model_type` (_Literal["chat", "text"]_): 指定要使用的模型类型，默认为 'chat'。
- `**kwargs`: 要传递给 API 提供者的其他语言模型参数。

### 方法

#### `__call__(self, prompt: str, only_completed: bool = True, return_sorted: bool = False, **kwargs) -> List[Dict[str, Any]]`

通过调用 `request` 从 Azure OpenAI 端点检索完成内容。

在内部，该方法处理准备请求提示和相应有效载荷以获取响应的具体细节。

生成后，根据 `model_type` 参数后处理完成内容。如果参数设置为 'chat'，生成的内容看起来像 `choice["message"]["content"]`。否则，生成的文本将是 `choice["text"]`。

**参数:**
- `prompt` (_str_): 发送到 Azure OpenAI 的提示。
- `only_completed` (_bool_, _optional_): 返回仅已完成的响应并忽略由于长度而完成的标志。默认为 True。
- `return_sorted` (_bool_, _optional_): 使用返回的平均对数概率对完成选择进行排序的标志。默认为 False。
- `**kwargs`: 完成请求的其他关键字参数。

**返回:**
- `List[Dict[str, Any]]`: 完成选择的列表。
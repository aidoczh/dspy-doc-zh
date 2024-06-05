---
sidebar_position: 8
---

# dspy.Databricks

### 用法
```python
lm = dspy.Databricks(model="databricks-mpt-30b-instruct")
```

### 构造函数

该构造函数继承自 `GPT3` 类，并验证用于通过 OpenAI SDK 使用 Databricks 模型服务 API 的 Databricks 认证凭据。
我们期望以下环境变量已设置好：
- `openai.api_key`: Databricks API 密钥。
- `openai.base_url`: Databricks 模型端点 URL。

`kwargs` 属性初始化为默认值，用于与 Databricks OpenAI SDK 通信所需的相关文本生成参数，如 `temperature`、`max_tokens`、`top_p` 和 `n`。但是，它删除了 `frequency_penalty` 和 `presence_penalty` 参数，因为这些参数目前不受 Databricks API 支持。

```python
class Databricks(GPT3):
    def __init__(
        self,
        model: str,
        api_key: Optional[str] = None,
        api_base: Optional[str] = None,
        model_type: Literal["chat", "text"] = None,
        **kwargs,
    ):
```

**参数:**
- `model` (_str_): 托管在 Databricks 上的模型。
- `stop` (_List[str]_, _optional_): 用于结束生成的停止标记列表。
- `api_key` (_Optional[str]_): Databricks API 密钥。默认为 None。
- `api_base` (_Optional[str]_): Databricks 模型端点 URL。默认为 None。
- `model_type` (_Literal["chat", "text", "embeddings"]_): 指定要使用的模型类型。
- `**kwargs`: 要传递给 API 提供程序的其他语言模型参数。

### 方法

请参阅 [`dspy.OpenAI`](https://dspy-docs.vercel.app/api/language_model_clients/OpenAI) 文档。
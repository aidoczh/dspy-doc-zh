---
sidebar_position: 9
---

# dsp.Mistral

### 用法

```python
lm = dsp.Mistral(model='mistral-medium-latest', api_key="your-mistralai-api-key")
```

### 构造函数

构造函数初始化基类 `LM` 并验证通过 `MISTRAL_API_KEY` 环境变量提供或定义的 `api_key`。

```python
class Mistral(LM):
    def __init__(
        self,
        model: str = "mistral-medium-latest",
        api_key: Optional[str] = None,
        **kwargs,
    ):
```

**参数:**
- `model`（_str_）：Mistral AI 预训练模型。默认为 `mistral-medium-latest`。
- `api_key`（_Optional[str]_，_可选的_）：Mistral AI 的 API 提供者。默认为 None。
- `**kwargs`：传递给 API 提供者的其他语言模型参数。

### 方法

请参阅 [`dspy.Mistral`](#) 文档。
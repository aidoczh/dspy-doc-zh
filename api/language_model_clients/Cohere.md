---
sidebar_position: 3
---

# dsp.Cohere

### 用法

```python
lm = dsp.Cohere(model='command-nightly')
```

### 构造函数

该构造函数初始化基类 `LM` 并验证 `api_key` 以设置 Cohere 请求检索。

```python
class Cohere(LM):
    def __init__(
        self,
        model: str = "command-nightly",
        api_key: Optional[str] = None,
        stop_sequences: List[str] = [],
    ):
```

**参数:**
- `model`（_str_）: Cohere 预训练模型。默认为 `command-nightly`。
- `api_key`（_Optional[str]_，_可选的）: Cohere 的 API 提供者。默认为 None。
- `stop_sequences`（_List[str]_，_可选的）: 用于结束生成的停止标记列表。

### 方法

请参阅[`dspy.OpenAI`](https://dspy-docs.vercel.app/api/language_model_clients/OpenAI) 文档。
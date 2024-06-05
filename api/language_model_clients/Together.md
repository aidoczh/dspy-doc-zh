---
sidebar_position: 7
---

# dspy.Together

### 用法

```python
lm = dspy.Together(model="mistralai/Mistral-7B-v0.1")
```

### 构造函数

构造函数初始化基类 `LM` 并验证使用 Together API 的 `api_key`。
我们期望以下环境变量已设置好：
- `TOGETHER_API_KEY`: Together 的 API 密钥。
- `TOGETHER_API_BASE`: Together 的 API 基本 URL。


```python
class Together(HFModel):
    def __init__(self, model, **kwargs):
```

**参数:**
- `model` (_str_): 托管在 Together 上的模型。
- `stop` (_List[str]_, _optional_): 用于结束生成的停止标记列表。

### 方法

请参考 [`dspy.OpenAI`](https://dspy-docs.vercel.app/api/language_model_clients/OpenAI) 文档。
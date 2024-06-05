---
sidebar_position: 4
---

# dspy.HFClientTGI

### 用法

```python
lm = dspy.HFClientTGI(model="meta-llama/Llama-2-7b-hf", port=8080, url="http://localhost")
```

### 先决条件

请参考`使用本地模型`文档中的[文本生成-推理服务器](https://dspy-docs.vercel.app/docs/deep-dive/language_model_clients/local_models/HFClientTGI)部分。

### 构造函数

构造函数初始化`HFModel`基类，并配置客户端以与TGI服务器通信。它需要一个`model`实例，用于服务器通信的`port`，以及服务器托管生成请求的`url`。可以通过`**kwargs`中的关键字参数提供额外的配置。

```python
class HFClientTGI(HFModel):
    def __init__(self, model, port, url="http://future-hgx-1", **kwargs):
```

**参数:**
- `model` (_HFModel_): 连接到TGI服务器的Hugging Face模型实例。
- `port` (_int_): TGI服务器的端口。
- `url` (_str_): 托管TGI服务器的基本URL。
- `**kwargs`: 用于配置客户端的额外关键字参数。

### 方法

请参考[`dspy.OpenAI`](https://dspy-docs.vercel.app/api/language_model_clients/OpenAI)文档。
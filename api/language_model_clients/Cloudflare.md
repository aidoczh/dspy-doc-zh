---
sidebar_position: 10
---

# dspy.CloudflareAI

### 用法

```python
lm = dspy.CloudflareAI(model="@hf/meta-llama/meta-llama-3-8b-instruct")
```

### 构造函数

构造函数初始化基类 `LM` 并验证 `api_key` 和 `account_id` 以便使用 Cloudflare AI API。需要设置以下环境变量或作为参数传递：

- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 的账户 ID。
- `CLOUDFLARE_API_KEY`: Cloudflare 的 API 密钥。

```python
class CloudflareAI(LM):
  def __init__(
          self,
          model: str = "@hf/meta-llama/meta-llama-3-8b-instruct",
          account_id: Optional[str] = None,
          api_key: Optional[str] = None,
          system_prompt: Optional[str] = None,
          **kwargs,
      ):
```

**参数:**

- `model` (_str_): 托管在 Cloudflare 上的模型。默认为 `@hf/meta-llama/meta-llama-3-8b-instruct`。
- `account_id` (_Optional[str]_, _可选_): Cloudflare 的账户 ID。默认为 None。从环境变量 `CLOUDFLARE_ACCOUNT_ID` 中读取。
- `api_key` (_Optional[str]_, _可选_): Cloudflare 的 API 密钥。默认为 None。从环境变量 `CLOUDFLARE_API_KEY` 中读取。
- `system_prompt` (_Optional[str]_, _可选_): 用于生成的系统提示。

### 方法

请参考 [`dspy.OpenAI`](https://dspy-docs.vercel.app/api/language_model_clients/OpenAI) 文档。
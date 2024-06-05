---
sidebar_position: 9
---

# dspy.AWSMistral, dspy.AWSAnthropic, dspy.AWSMeta

### 用法

```python
# 注意事项：
# 1. 安装 boto3 以使用 AWS 模型。
# 2. 在使用这些模型之前，请使用 AWS CLI 配置您的 AWS 凭据。

# 初始化 bedrock aws 提供程序
bedrock = dspy.Bedrock(region_name="us-west-2")
# 对于 Bedrock 上的 mixtral
lm = dspy.AWSMistral(bedrock, "mistral.mixtral-8x7b-instruct-v0:1", **kwargs)
# 对于 Bedrock 上的 haiku
lm = dspy.AWSAnthropic(bedrock, "anthropic.claude-3-haiku-20240307-v1:0", **kwargs)
# 对于 Bedrock 上的 llama2
lm = dspy.AWSMeta(bedrock, "meta.llama2-13b-chat-v1", **kwargs)

# 初始化 sagemaker aws 提供程序
sagemaker = dspy.Sagemaker(region_name="us-west-2")
# 对于 Sagemaker 上的 mistral
# 注意：您需要先为 mistral 模型创建一个 Sagemaker 端点
lm = dspy.AWSMistral(sagemaker, "<YOUR_MISTRAL_ENDPOINT_NAME>", **kwargs)

```

### 构造函数

`AWSMistral` 构造函数初始化基类 `AWSModel`，该基类本身继承自 `LM` 类。

```python
class AWSMistral(AWSModel):
    """Mistral 系列模型。"""

    def __init__(
        self,
        aws_provider: AWSProvider,
        model: str,
        max_context_size: int = 32768,
        max_new_tokens: int = 1500,
        **kwargs
    ) -> None:
```

**参数:**
- `aws_provider` (AWSProvider): 要使用的 AWS 提供程序。可以是 `dspy.Bedrock` 或 `dspy.Sagemaker` 中的一个。
- `model` (_str_): Mistral AI 预训练模型。对于 Bedrock，这是 https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html#model-ids-arns 中的模型 ID。对于 Sagemaker，这是端点名称。
- `max_context_size` (_Optional[int]_, _optional_): 此模型的最大上下文大小。默认为 32768。
- `max_new_tokens` (_Optional[int]_, _optional_): 此模型可能生成的最大新标记数。默认为 1500。
- `**kwargs`: 要传递给 API 提供程序的其他语言模型参数。

### 方法

```python
def _format_prompt(self, raw_prompt: str) -> str:
```
此函数为模型格式化提示。请参考模型卡片以了解所需的特定格式。

<br/>

```python
def _create_body(self, prompt: str, **kwargs) -> tuple[int, dict[str, str | float]]:
```
此函数创建请求到模型的主体。它接受提示和任何额外的关键字参数，并返回一个元组，包括要生成的标记数和包含用于创建请求主体的提示的键的字典。

<br/>

```python
def _call_model(self, body: str) -> str:
```
此函数使用提供程序的 `call_model()` 函数调用模型，并从特定于提供程序的响应中提取生成的文本（完成）。

<br/>

上述特定于模型的方法由 `AWSModel::basic_request()` 方法调用，这是查询模型的主要方法。该方法接受提示和任何额外的关键字参数，并调用 `AWSModel::_simple_api_call()`，然后委托给特定于模型的 `_create_body()` 和 `_call_model()` 方法来创建请求体，调用模型并提取生成的文本。

有关 `LM` 基类功能的信息，请参考 [`dspy.OpenAI`](https://dspy-docs.vercel.app/api/language_model_clients/OpenAI) 文档。

`AWSAnthropic` 和 `AWSMeta` 的工作方式与 `AWSMistral` 完全相同。
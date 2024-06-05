---
sidebar_position: 9
---

# dspy.Bedrock, dspy.Sagemaker

### 用法

`AWSProvider` 类是 AWS 提供程序 `dspy.Bedrock` 和 `dspy.Sagemaker` 的基类。在创建 AWS 模型类的实例（例如 `dspy.AWSMistral`）时，需要将这些提供程序的实例传递给构造函数，最终用于查询模型。

```python
# 注意事项：
# 1. 安装 boto3 以使用 AWS 模型。
# 2. 在使用这些模型之前，请使用 AWS CLI 配置您的 AWS 凭据。

# 初始化 bedrock aws 提供程序
bedrock = dspy.Bedrock(region_name="us-west-2")

# 初始化 sagemaker aws 提供程序
sagemaker = dspy.Sagemaker(region_name="us-west-2")
```

### 构造函数

`Bedrock` 构造函数初始化基类 `AWSProvider`。

```python
class Bedrock(AWSProvider):
    """该类为 Bedrock 模型添加支持。"""

    def __init__(
        self,
        region_name: str,
        profile_name: Optional[str] = None,
        batch_n_enabled: bool = False,   # 这必须在 Bedrock 上手动设置。
    ) -> None:
```

**参数:**
- `region_name`（str）：托管此 LM 的 AWS 区域。
- `profile_name`（str，可选）：boto3 凭据配置文件。
- `batch_n_enabled`（bool）：如果为 False，则调用 LM N 次而不是批处理。

### 方法

```python
def call_model(self, model_id: str, body: str) -> str:
```
此函数使用 boto3 提供程序在 AWS 上实际调用模型。

<br/>

`Sagemaker` 的工作方式与 `Bedrock` 完全相同。
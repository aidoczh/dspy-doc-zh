# GoogleVertexAI 使用指南

本指南提供了如何使用 `GoogleVertexAI` 类与 Google Vertex AI 的文本和代码生成 API 进行交互的说明。

## 要求

- Python 版本需为 3.10 或更高。
- 需要安装 `vertexai` 包，可通过 pip 安装。
- 需要拥有 Google Cloud 账号并配置一个具有访问 Vertex AI 权限的项目。

## 安装

确保已安装 `vertexai` 包以及其他必要的依赖项：

```bash
pip install dspy-ai[google-vertex-ai]
```

## 配置

在使用 `GoogleVertexAI` 类之前，您需要设置访问 Google Cloud：

1. 在 Google Cloud 平台（GCP）中创建一个项目。
2. 为您的项目启用 Vertex AI API。
3. 创建认证凭据并将其保存在一个 JSON 文件中。

## 使用

以下是如何实例化 `GoogleVertexAI` 类并发送文本生成请求的示例：

```python
from dsp.modules import GoogleVertexAI  # 导入 GoogleVertexAI 类

# 使用模型名称和 Vertex AI 的参数初始化类
vertex_ai = GoogleVertexAI(
    model_name="text-bison@002",
    project="your-google-cloud-project-id",
    location="us-central1",
    credentials="path-to-your-service-account-file.json"
)
```

## 自定义请求

您可以通过传递额外的参数来自定义请求，例如 `temperature`、`max_output_tokens` 等，这些参数由 Vertex AI API 支持。这样可以控制文本生成的行为。

## 注意事项

- 确保正确设置了访问 Google Cloud 的权限，以避免认证问题。
- 了解 Vertex AI API 的配额和限制，以防止服务意外中断。

有了本指南，您就可以使用 `GoogleVertexAI` 与 Google Vertex AI 的文本和代码生成服务进行交互了。
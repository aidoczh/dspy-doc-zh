# Watsonx 使用指南

本指南提供了如何使用 `Watsonx` 类与 IBM Watsonx.ai API 进行文本和代码生成交互的说明。

## 要求

- Python 版本需为 3.10 或更高。
- 需要安装 `ibm-watsonx-ai` 包，可通过 pip 安装。
- 需要 IBM Cloud 账户和配置好的 Watsonx 项目。

## 安装

确保已安装了 `ibm-watsonx-ai` 包以及其他必要的依赖项：

## 配置

在使用 `Watsonx` 类之前，您需要设置访问 IBM Cloud：

1. 创建一个 IBM Cloud 账户
2. 从目录中启用 Watsonx 服务
3. 创建一个新项目并关联一个 Watson 机器学习服务实例。
4. 创建 IAM 认证凭据并将其保存在一个 JSON 文件中。

## 使用

以下是如何实例化 `Watsonx` 类并发送生成请求的示例：

```python
import dspy

''' 使用模型名称和 Watsonx.ai 的参数初始化类
    您可以在许多不同的模型之间进行选择：
    * (Mistral) mistralai/mixtral-8x7b-instruct-v01
    * (Meta) meta-llama/llama-3-70b-instruct
    * (IBM) ibm/granite-13b-instruct-v2
    * 还有许多其他模型。
'''
watsonx=dspy.Watsonx(
    model='mistralai/mixtral-8x7b-instruct-v01',
    credentials={
        "apikey": "your-api-key",
        "url": "https://us-south.ml.cloud.ibm.com"
    },
    project_id="your-watsonx-project-id",
    max_new_tokens=500,
    max_tokens=1000
    )

dspy.settings.configure(lm=watsonx)
```

## 自定义请求

您可以通过传递额外的参数来自定义请求，例如 `decoding_method`、`max_new_tokens`、`stop_sequences`、`repetition_penalty` 等，这些参数都受到 Watsonx.ai API 支持。这样可以控制生成的行为。
请参阅 [`ibm-watsonx-ai library`](https://ibm.github.io/watsonx-ai-python-sdk/index.html) 文档。
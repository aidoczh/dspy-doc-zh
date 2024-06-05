---
sidebar_position: 5
---

# dsp.PremAI

[PremAI](https://app.premai.io) 是一个全能平台，简化了利用生成式人工智能创建强大、可投入生产的应用程序的过程。通过简化开发流程，PremAI 让您可以集中精力提升用户体验，推动应用程序的整体增长。

### 先决条件

请参考[快速入门](https://docs.premai.io/introduction)指南，开始使用 PremAI 平台，创建您的第一个项目并获取 API 密钥。

### 用法

请确保您已安装 premai python sdk。否则，您可以使用以下命令进行安装：

```bash
pip install -U premai
```

以下是如何使用 premai python sdk 与 dspy 的快速示例

```python
from dspy import PremAI

llm = PremAI(model='mistral-tiny', project_id=123, api_key="your-premai-api-key")
print(llm("what is a large language model"))
```

> 请注意：项目 ID 123 仅为示例。您可以在我们的平台内找到您创建项目的项目 ID。

### 构造函数

构造函数初始化基类 `LM` 并验证提供的 `api_key` 或通过 `PREMAI_API_KEY` 环境变量定义的内容。

```python
class PremAI(LM):
    def __init__(
        self,
        model: str,
        project_id: int,
        api_key: str,
        base_url: Optional[str] = None,
        session_id: Optional[int] = None,
        **kwargs,
    ) -> None:
```

**参数:**

- `model` (_str_): PremAI 支持的模型。例如：`mistral-tiny`。我们建议使用在[项目启动台](https://docs.premai.io/get-started/launchpad)中选择的模型。
- `project_id` (_int_): 包含所选模型的[项目 ID](https://docs.premai.io/get-started/projects)。
- `api_key` (_Optional[str]_, _optional_): PremAI 的 API 提供者。默认为 None。
- `**kwargs`: 附加的语言模型参数将传递给 API 提供者。

### 方法

#### `__call__(self, prompt: str, **kwargs) -> List[Dict[str, Any]]`

通过调用 `request` 从 PremAI 检索完成内容。

在内部，该方法处理准备请求提示和相应有效载荷以获取响应的具体细节。

**参数:**

- `prompt` (_str_): 发送到 PremAI 的提示。
- `**kwargs`: 用于完成请求的附加关键字参数。例如：参数如 `temperature`、`max_tokens` 等。您可以在[这里](https://docs.premai.io/get-started/sdk#optional-parameters)找到所有附加的 kwargs。

### 本地 RAG 支持

PremAI 仓库允许用户上传文档（.txt、.pdf 等）并将这些仓库连接到 LLM 以用作向量数据库并支持本地 RAG。您可以在[这里](https://docs.premai.io/get-started/repositories)了解更多关于 PremAI 仓库的信息。

通过 dspy-premai 集成也支持仓库。以下是您可以使用此工作流程的方式：
```python
查询 = "个别星系的直径是多少"
存储库编号 = [1991, ]
存储库 = dict(
    ids=存储库编号,
    相似度阈值=0.3,
    限制=3
)
```
首先，我们通过定义一些有效的存储库 ID 来开始设置我们的存储库。您可以在[这里](https://docs.premai.io/get-started/repositories)了解如何获取存储库 ID。

> 注意：这类似于 LM 集成，现在您可以通过调用参数'repositories'来覆盖启动台中连接的存储库。

接下来，我们将存储库与我们的聊天对象连接起来，以调用基于 RAG 的生成。

```python
response = llm(query, max_tokens=100, repositories=repositories)

print(response)
print("---")
print(json.dumps(llm.history, indent=4))
```

这是使用 PremAI 存储库进行生成的示例。
```bash
'个别星系的直径范围在 8 万至 15 万光年之间。'
---
[
    {
        "prompt": "个别星系的直径是多少",
        "response": "个别星系的直径范围在 8 万至 15 万光年之间。",
        "document_chunks": [
            {
                "repository_id": 1991,
                "document_id": 1307,
                "chunk_id": 173926,
                "document_name": "Kegy 202 Chapter 2",
                "similarity_score": 0.586126983165741,
                "content": "n thousands\n                                                                                                                                               of           light-years. The diameters of individual\n                                                                                                                                               galaxies range from 80,000-150,000 light\n                                                                                                                       "
            },
            {
                "repository_id": 1991,
                "document_id": 1307,
                "chunk_id": 173925,
                "document_name": "Kegy 202 Chapter 2",
                "similarity_score": 0.4815782308578491,
                "content": "                                                for development of galaxies. A galaxy contains\n                                                                                                                                               a large number of stars. Galaxies spread over\n                                                                                                                                               vast distances that are measured in thousands\n                                       "
            },
            {
                "repository_id": 1991,
                "document_id": 1307,
                "chunk_id": 173916,
                "document_name": "Kegy 202 Chapter 2",
                "similarity_score": 0.38112708926200867,
                "content": " was separated from the               from each other as the balloon expands.\n  solar surface. As the passing star moved away,             Similarly, the distance between the galaxies is\n  the material separated from the solar surface\n  continued to revolve around the sun and it\n  slowly condensed into planets. Sir James Jeans\n  and later Sir Harold Jeffrey supported thisnot to be republishedalso found to be increasing and thereby, the\n                                                             universe is"
            }
        ],
        "kwargs": {
            "max_tokens": 100,
            "repositories": {
                "ids": [
                    1991
                ],
                "similarity_threshold": 0.3,
                "limit": 3
            }
        },
        "raw_kwargs": {
            "max_tokens": 100,
            "repositories": {
                "ids": [
                    1991
                ],
                "similarity_threshold": 0.3,
                "limit": 3
            }
        }
    }
]
```
这也意味着在使用 PremAI 平台时，您无需创建自己的 RAG 管道，而是可以利用其本地 RAG 技术，以实现检索增强生成的最佳性能。

> 理想情况下，在这里您无需连接存储库 ID 即可获得检索增强生成。如果您已经在 PremAI 平台中连接了存储库，仍然可以获得相同的结果。
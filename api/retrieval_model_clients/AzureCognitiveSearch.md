---
sidebar_position: 3
---

# retrieve.AzureCognitiveSearch

### 构造函数

构造函数初始化 `AzureCognitiveSearch` 类的一个实例，并设置参数，用于与 Azure Cognitive Search 服务器发送查询和检索结果。

```python
class AzureCognitiveSearch:
    def __init__(
        self,
        search_service_name: str,
        search_api_key: str,
        search_index_name: str,
        field_text: str,
        field_score: str, # 必需字段，用于映射到 dsp 框架中的 "score" 字段
    ):
```

**参数:**

- `search_service_name`（_str_）: Azure Cognitive Search 服务器的名称。
- `search_api_key`（_str_）: 用于访问 Azure Cognitive Search 服务器的 API 认证令牌。
- `search_index_name`（_str_）: Azure Cognitive Search 服务器中搜索索引的名称。
- `field_text`（_str_）: 映射到 DSP "content" 字段的字段名称。
- `field_score`（_str_）: 映射到 DSP "score" 字段的字段名称。

### 方法

请参考 [ColBERTv2](/api/retrieval_model_clients/ColBERTv2) 文档。请注意，AzureCognitiveSearch 不支持 `simplify` 标志。

AzureCognitiveSearch 支持发送查询和处理接收到的结果，将内容和分数映射到正确的格式，以便与 Azure Cognitive Search 服务器配合使用。

### 弃用通知

此模块计划在未来版本中移除。请改用 dspy.retrieve.azureaisearch_rm 中的 AzureAISearchRM 类。有关更多信息，请参阅更新后的文档(docs/docs/deep-dive/retrieval_models_clients/Azure.mdx)。
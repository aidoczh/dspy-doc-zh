---
sidebar_position: 2
---

# retrieve.ChromadbRM

### 构造函数

初始化 `ChromadbRM` 类的一个实例，可以选择使用 OpenAI 的嵌入或任何 chromadb 支持的替代方案，详细信息请参阅官方 [chromadb embeddings 文档](https://docs.trychroma.com/embeddings)。

```python
ChromadbRM(
    collection_name: str,
    persist_directory: str,
    embedding_function: Optional[EmbeddingFunction[Embeddable]] = OpenAIEmbeddingFunction(),
    k: int = 7,
)
```

**参数:**
- `collection_name` (_str_): chromadb 集合的名称。
- `persist_directory` (_str_): chromadb 数据持久化的目录路径。
- `embedding_function` (_Optional[EmbeddingFunction[Embeddable]]_, _可选_): 用于嵌入文档和查询的函数。如果未指定，默认为 `DefaultEmbeddingFunction()`。
- `k` (_int_, _可选_): 要检索的前 k 个段落数量。默认为 7。

### 方法

#### `forward(self, query_or_queries: Union[str, List[str]], k: Optional[int] = None) -> dspy.Prediction`

搜索 chromadb 集合，查找与给定查询或查询匹配的前 `k` 个段落，使用通过指定的 `embedding_function` 生成的嵌入。

**参数:**
- `query_or_queries` (_Union[str, List[str]]_): 要搜索的查询或查询列表。
- `k` (_Optional[int]_, _可选_): 要检索的结果数量。如果未指定，默认为初始化时设置的值。

**返回:**
- `dspy.Prediction`: 包含检索到的段落，每个段落表示为一个具有模式 `[{"id": str, "score": float, "long_text": str, "metadatas": dict }]` 的 `dotdict`。

### 使用 OpenAI Embeddings 快速入门

ChromadbRM 可以灵活使用各种嵌入函数，如 [chromadb embeddings 文档](https://docs.trychroma.com/embeddings) 中所述。虽然有不同的选项可用，但此示例演示了如何专门利用 OpenAI 嵌入。

```python
from dspy.retrieve.chromadb_rm import ChromadbRM
import os
import openai
from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction

embedding_function = OpenAIEmbeddingFunction(
    api_key=os.environ.get('OPENAI_API_KEY'),
    model_name="text-embedding-ada-002"
)

retriever_model = ChromadbRM(
    'your_collection_name',
    '/path/to/your/db',
    embedding_function=embedding_function,
    k=5
)

results = retriever_model("探索量子计算的重要性", k=5)

for result in results:
    print("文档:", result.long_text, "\n")
```
---
sidebar_position: 1
---

# retrieve.MilvusRM

### 构造函数

初始化 `MilvusRM` 类的一个实例，可以选择使用 OpenAI 的 `text-embedding-3-small` 嵌入或任何自定义的嵌入函数。

```python
MilvusRM(
    collection_name: str,
    uri: Optional[str] = "http://localhost:19530",
    token: Optional[str] = None,
    db_name: Optional[str] = "default",
    embedding_function: Optional[Callable] = None,
    k: int = 3,
)
```

**参数:**
- `collection_name (str)`: 要查询的 Milvus 集合的名称。
- `uri (str, optional)`: Milvus 连接 URI。默认为 "http://localhost:19530"。
- `token (str, optional)`: Milvus 连接令牌。默认为 None。
- `db_name (str, optional)`: Milvus 数据库名称。默认为 "default"。
- `embedding_function (callable, optional)`: 用于将文本列表转换为嵌入的函数。
    嵌入函数应接受文本字符串列表作为输入，并输出嵌入列表。
    默认为 None。默认情况下，它将通过环境变量 OPENAI_API_KEY 获取 OpenAI 客户端，并使用默认维度的 OpenAI 嵌入模型 "text-embedding-3-small"。
- `k (int, optional)`: 要检索的顶部段落数。默认为 3。

### 方法

#### `forward(self, query_or_queries: Union[str, List[str]], k: Optional[int] = None) -> dspy.Prediction`

搜索 Milvus 集合，查找与给定查询或查询匹配的前 `k` 个段落，使用通过默认的 OpenAI 嵌入或指定的 `embedding_function` 生成的嵌入。

**参数:**
- `query_or_queries` (_Union[str, List[str]]_): 要搜索的查询或查询列表。
- `k` (_Optional[int]_, _optional_): 要检索的结果数量。如果未指定，则默认为初始化时设置的值。

**返回:**
- `dspy.Prediction`: 包含检索到的段落，每个段落表示为一个具有模式 `[{"id": str, "score": float, "long_text": str, "metadatas": dict }]` 的 `dotdict`。

### 快速开始

为了支持段落检索，假定已创建一个 Milvus 集合，并填充了以下字段：

- `text`: 段落的文本

MilvusRM 默认使用 OpenAI 的 `text-embedding-3-small` 嵌入或任何自定义的嵌入函数。
虽然有不同的选项可用，但以下示例演示了如何利用默认的 OpenAI 嵌入和使用 BGE 模型的自定义嵌入函数。

#### 默认的 OpenAI 嵌入

```python
from dspy.retrieve.milvus_rm import MilvusRM
import os

os.envrion["OPENAI_API_KEY"] = "<YOUR_OPENAI_API_KEY>"

retriever_model = MilvusRM(
    collection_name="<YOUR_COLLECTION_NAME>",
    uri="<YOUR_MILVUS_URI>",
    token="<YOUR_MILVUS_TOKEN>"  # 如果 Milvus 连接不需要令牌，则忽略此项
    )

results = retriever_model("探索量子计算的重要性", k=5)

for result in results:
    print("文档:", result.long_text, "\n")
```

![MilvusRM](https://image-url.com/milvusrm.png)
#### 自定义嵌入函数

```python
from dspy.retrieve.milvus_rm import MilvusRM
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('BAAI/bge-base-en-v1.5')

def bge_embedding_function(texts: List[str]):
    embeddings = model.encode(texts, normalize_embeddings=True)
    return embeddings

retriever_model = MilvusRM(
    collection_name="<YOUR_COLLECTION_NAME>",
    uri="<YOUR_MILVUS_URI>",
    token="<YOUR_MILVUS_TOKEN>",  # 如果Milvus连接不需要token，则忽略此项
    embedding_function=bge_embedding_function
    )

results = retriever_model("探索量子计算的重要性", k=5)

for result in results:
    print("文档:", result.long_text, "\n")
```

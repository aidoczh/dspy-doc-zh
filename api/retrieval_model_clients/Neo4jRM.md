# retrieve.neo4j_rm

### 构造函数

初始化 `Neo4jRM` 类的一个实例。

```python
Neo4jRM(
    index_name: str,
    text_node_property: str,
    k: int = 5,
    retrieval_query: str = None,
    embedding_provider: str = "openai",
    embedding_model: str = "text-embedding-ada-002",
)
```

**环境变量:**

您需要将凭据定义为环境变量:

- `NEO4J_USERNAME`（_str_）: 指定用于与 Neo4j 数据库进行身份验证所需的用户名。这是一项至关重要的安全措施，以确保只有授权用户可以访问数据库。

- `NEO4J_PASSWORD`（_str_）: 定义与 `NEO4J_USERNAME` 关联的用于身份验证的密码。应妥善保管此密码，以防止未经授权访问数据库。

- `NEO4J_URI`（_str_）: 指示用于连接到 Neo4j 数据库的统一资源标识符（URI）。此 URI 通常包括协议、主机名和端口，提供建立与数据库连接所需信息。

- `NEO4J_DATABASE`（_str_, 可选）: 指定要在 Neo4j 实例中连接的数据库的名称。如果未设置，则系统默认使用 `"neo4j"` 作为数据库名称。这允许在单个 Neo4j 服务器中连接到不同的数据库，具有灵活性。

- `OPENAI_API_KEY`（_str_）: 指定用于与 OpenAI 服务进行身份验证所需的 API 密钥。

**参数:**
- `index_name`（_str_）: 指定在 Neo4j 中用于组织和查询数据的向量索引的名称。
- `text_node_property`（_str_, _可选_）: 定义将返回的节点的特定属性。
- `k`（_int_, _可选_）: 从检索操作中返回的前 k 个结果的数量。如果未明确指定，默认为 5。
- `retrieval_query`（_str_, _可选_）: 用于检索数据的自定义查询字符串。如果未提供，默认将使用针对 `text_node_property` 定制的查询。
- `embedding_provider`（_str_, _可选_）: 用于生成嵌入的服务提供商的名称。如果未指定，默认为 "openai"。
- `embedding_model`（_str_, _可选_）: 要从提供商使用的特定嵌入模型。默认情况下，它使用 OpenAI 的 "text-embedding-ada-002" 模型。


### 方法

#### `forward(self, query: [str], k: Optional[int] = None) -> dspy.Prediction`

搜索 neo4j 向量索引，查找与给定查询或查询匹配的前 k 个段落，使用通过指定的 `embedding_model` 生成的嵌入。

**参数:**
- `query`（str_）: 查询。
- `k`（_Optional[int]_, _可选_): 要检索的结果数量。如果未指定，默认为初始化期间设置的值。

**返回:**
- `dspy.Prediction`: 包含检索到的段落作为字符串列表的预测签名。

示例：
```python
预测(
    段落=['段落 1 Lorem Ipsum 真棒', '段落 2 Lorem Ipsum 优皮杜', '段落 3 Lorem Ipsum 耶耶耶']
)
```
### 快速示例：如何在本地环境中使用 Neo4j。

```python
from dspy.retrieve.neo4j_rm import Neo4jRM
import os

os.environ["NEO4J_URI"] = 'bolt://localhost:7687'
os.environ["NEO4J_USERNAME"] = 'neo4j'
os.environ["NEO4J_PASSWORD"] = 'password'
os.environ["OPENAI_API_KEY"] = 'sk-'

retriever_model = Neo4jRM(
    index_name="vector",
    text_node_property="text"
)

results = retriever_model("探索量子计算的重要性", k=3)

for passage in results:
    print("文档:", passage, "\n")
```

在这个示例中，我们展示了如何在本地环境中使用 Neo4j。首先，我们设置了连接到本地数据库的 URI、用户名和密码。然后，我们创建了一个 Neo4jRM 实例，指定了索引名称和文本节点属性。接下来，我们使用这个实例来检索与给定查询“探索量子计算的重要性”相关的前3个结果，并将结果打印输出。
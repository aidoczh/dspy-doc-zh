# retrieve.SnowflakeRM

### 构造函数

初始化 `SnowflakeRM` 类的一个实例，可以选择使用 `e5-base-v2` 或 `snowflake-arctic-embed-m` 嵌入，或任何其他 Snowflake Cortex 支持的嵌入模型。

```python
SnowflakeRM(
     snowflake_table_name: str,
     snowflake_credentials: dict,
     k: int = 3,
     embeddings_field: str,
     embeddings_text_field:str,
     embeddings_model: str = "e5-base-v2",
)
```

**参数:**

- `snowflake_table_name (str)`: 包含嵌入的 Snowflake 表的名称。
- `snowflake_credentials (dict)`: 初始化 Snowflake Snowpark 会话所需的连接参数。
- `k (int, optional)`: 要检索的前几个段落的数量。默认为 3。
- `embeddings_field (str)`: 包含嵌入的 Snowflake 表中的列的名称。
- `embeddings_text_field (str)`: 包含段落的 Snowflake 表中的列的名称。
- `embeddings_model (str)`: 用于将文本转换为嵌入的模型。

### 方法

#### `forward(self, query_or_queries: Union[str, List[str]], k: Optional[int] = None) -> dspy.Prediction`

在给定查询或查询的情况下，搜索 Snowflake 表以匹配前 `k` 个段落，使用通过默认的 `e5-base-v2` 模型生成的嵌入或指定的 `embedding_model`。

**参数:**

- `query_or_queries` (_Union[str, List[str]]_): 要搜索的查询或查询列表。
- `k` (_Optional[int]_, _optional_): 要检索的结果数量。如果未指定，默认为初始化期间设置的值。

**返回:**

- `dspy.Prediction`: 包含检索到的段落，每个表示为具有模式 `[{"id": str, "score": float, "long_text": str, "metadatas": dict }]` 的 `dotdict`。

### 快速入门

为支持段落检索，假定已创建 Snowflake 表，并在一个列 `embeddings_text_field` 中填充了段落，另一个列 `embeddings_field` 中填充了嵌入。

SnowflakeRM 默认使用 `e5-base-v2` 嵌入模型，或任何 Snowflake Cortex 支持的嵌入模型。

#### 默认 OpenAI 嵌入

```python
from dspy.retrieve.snowflake_rm import SnowflakeRM
import os

connection_parameters = {

    "account": os.getenv('SNOWFLAKE_ACCOUNT'),
    "user": os.getenv('SNOWFLAKE_USER'),
    "password": os.getenv('SNOWFLAKE_PASSWORD'),
    "role": os.getenv('SNOWFLAKE_ROLE'),
    "warehouse": os.getenv('SNOWFLAKE_WAREHOUSE'),
    "database": os.getenv('SNOWFLAKE_DATABASE'),
    "schema": os.getenv('SNOWFLAKE_SCHEMA')}

retriever_model = SnowflakeRM(
    snowflake_table_name="<YOUR_SNOWFLAKE_TABLE_NAME>",
    snowflake_credentials=connection_parameters,
    embeddings_field="<YOUR_EMBEDDINGS_COLUMN_NAME>",
    embeddings_text_field= "<YOUR_PASSAGE_COLUMN_NAME>"
    )

results = retriever_model("探索生命的意义", k=5)

for result in results:
    print("文档:", result.long_text, "\n")
```
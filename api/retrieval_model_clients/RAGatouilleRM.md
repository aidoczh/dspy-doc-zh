---
sidebar_position: 5
---

# dspy.RAGatouilleRM

### 构造函数

构造函数初始化 `RAGatouille` 类实例，并设置与使用[RAGatouille库](https://github.com/bclavie/RAGatouille)创建的索引进行交互所需的参数。

```python
class RAGatouilleRM(dspy.Retrieve):
    def __init__(
        self,
        index_root: str,
        index_name: str, 
        k: int = 3,
    ):
```

**参数:**
- `index_root` (_str_): 存储索引的文件夹路径。
- `index_name` (_str_): 想要检索的索引名称。
- `k` (_int_): 默认要检索的段落数。默认为 `3`。

### 方法

#### `forward(self, query_or_queries: Union[str, List[str]], k:Optional[int]) -> dspy.Prediction`

允许向RAGatouille创建的索引发出查询以进行检索。在内部，该方法处理准备查询以获取响应的具体细节。该函数根据提供的查询处理检索前 k 个段落的操作。

**参数:**
- `query_or_queries` (Union[str, List[str]]): 用于检索的查询字符串。
- `k` (_int_, _optional_): 要检索的段落数。默认为 3。

**返回:**
- `dspy.Prediction`: k 个段落的列表


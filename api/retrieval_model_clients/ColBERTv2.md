---
sidebar_position: 1
---

# dspy.ColBERTv2

### 构造函数

构造函数初始化 `ColBERTv2` 类实例，并设置与 ColBERTv2 服务器交互的请求参数。

```python
class ColBERTv2:
    def __init__(
        self,
        url: str = "http://0.0.0.0",
        port: Optional[Union[str, int]] = None,
        post_requests: bool = False,
    ):
```

**参数:**
- `url` (_str_): ColBERTv2 服务器的 URL。
- `port` (_Union[str, int]_, _Optional_): ColBERTv2 服务器的端口终点。默认为 `None`。
- `post_requests` (_bool_, _Optional_): 是否使用 HTTP POST 请求的标志。默认为 `False`。

### 方法

#### `__call__(self, query: str, k: int = 10, simplify: bool = False) -> Union[list[str], list[dotdict]]`

允许向 ColBERTv2 服务器发出检索查询。在内部，该方法处理准备请求提示和相应有效载荷以获取响应的具体细节。该函数处理基于提供的查询获取前 k 个段落的检索。

**参数:**
- `query` (_str_): 用于检索的查询字符串。
- `k` (_int_, _optional_): 要检索的段落数。默认为 10。
- `simplify` (_bool_, _optional_): 是否简化输出为字符串列表的标志。默认为 `False`。

**返回:**
- `Union[list[str], list[dotdict]]`: 根据 `simplify` 标志，返回表示段落内容的字符串列表 (`True`) 或包含段落详细信息的 `dotdict` 实例列表 (`False`)。

### 快速开始

```python
import dspy

colbertv2_wiki17_abstracts = dspy.ColBERTv2(url='http://20.102.90.50:2017/wiki17_abstracts')

retrieval_response = colbertv2_wiki17_abstracts('When was the first FIFA World Cup held?', k=5)

for result in retrieval_response:
    print("Text:", result['text'], "\n")
```

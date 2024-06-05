---
sidebar_position: 4
---

# retrieve.FaissRM

### 构造函数

通过提供一个向量化器和一个字符串列表来初始化 FaissRM 的实例

```python
FaissRM(
    document_chunks: List[str],
    vectorizer: dsp.modules.sentence_vectorizer.BaseSentenceVectorizer,
    k: int = 3
)
```

**参数:**
- `document_chunks` (_List[str]_): 由语料库组成的字符串列表。在创建 FaissRM 对象后，无法向此列表添加/插入/更新元素。
- `vectorizer` (_dsp.modules.sentence_vectorizer.BaseSentenceVectorizer_, _可选_): 如果未提供，则会创建并使用 dsp.modules.sentence_vectorizer.SentenceTransformersVectorizer 对象。
- `k` (_int_, _可选_): 要检索的前 k 个段落数。默认为 3。

### 方法

#### `forward(self, query_or_queries: Union[str, List[str]]) -> dspy.Prediction`

使用在 FaissRM 构造时指定的向量化器生成的嵌入，搜索 FaissRM 向量数据库，找到与给定查询或查询匹配的前 k 个段落。

**参数:**
- `query_or_queries` (_Union[str, List[str]]_): 要搜索的查询或查询列表。

**返回:**
- `dspy.Prediction`: 包含检索到的段落，每个段落都表示为具有 `long_text` 属性和 `index` 属性的 `dotdict`。`index` 属性是在构造 FaissRM 对象时提供给该对象的 document_chunks 数组中的索引。

### 使用默认向量化器快速开始

**FaissRM** 模块提供了一个使用内存中的 Faiss 向量数据库的检索器。该模块不包括向量化器；而是支持 **dsp.modules.sentence_vectorizer.BaseSentenceVectorizer** 的任何子类。如果未提供向量化器，则 **FaissRM** 会创建并使用 **dsp.modules.sentence_vectorizer.SentenceTransformersVectorizer** 的一个实例。请注意，**SentenceTransformersVectorizer** 的默认嵌入模型是 **all-MiniLM-L6-v2**。

```python
import dspy
from dspy.retrieve.faiss_rm import FaissRM

document_chunks = [
    "The superbowl this year was played between the San Francisco 49ers and the Kanasas City Chiefs",
    "Pop corn is often served in a bowl",
    "The Rice Bowl is a Chinese Restaurant located in the city of Tucson, Arizona",
    "Mars is the fourth planet in the Solar System",
    "An aquarium is a place where children can learn about marine life",
    "The capital of the United States is Washington, D.C",
    "Rock and Roll musicians are honored by being inducted in the Rock and Roll Hall of Fame",
    "Music albums were published on Long Play Records in the 70s and 80s",
    "Sichuan cuisine is a spicy cuisine from central China",
    "The interest rates for mortgages is considered to be very high in 2024",
]

frm = FaissRM(document_chunks)
turbo = dspy.OpenAI(model="gpt-3.5-turbo")
dspy.settings.configure(lm=turbo, rm=frm)
print(frm(["I am in the mood for Chinese food"]))
```
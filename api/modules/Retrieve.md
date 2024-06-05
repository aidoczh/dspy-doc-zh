# dspy.Retrieve

### 构造函数

构造函数初始化 `Retrieve` 类并设置其属性，接受 `k` 个检索段落以返回给查询。

```python
class Retrieve(Parameter):
    def __init__(self, k=3):
        self.stage = random.randbytes(8).hex()
        self.k = k
```

**参数:**
- `k` (_Any_): 检索响应的数量

### 方法

#### `__call__(self, *args, **kwargs):`

该方法作为 `forward` 方法的包装器。它允许使用 `Retrieve` 类对输入查询进行检索。

**参数:**
- `**args`: 检索所需的参数。
- `**kwargs`: 检索所需的关键字参数。

**返回:**
- `forward` 方法的结果。

### 示例

```python
query='When was the first FIFA World Cup held?'

# 对特定查询调用检索器。
retrieve = dspy.Retrieve(k=3)
topK_passages = retrieve(query).passages

print(f"问题 '{query}' 的前 {retrieve.k} 个段落 \n", '-' * 30, '\n')

for idx, passage in enumerate(topK_passages):
    print(f'{idx+1}]', passage, '\n')
```
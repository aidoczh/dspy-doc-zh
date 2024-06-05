# dspy.Snowflake

### 用法

```python
import dspy
import os

connection_parameters = {

    "account": os.getenv('SNOWFLAKE_ACCOUNT'),
    "user": os.getenv('SNOWFLAKE_USER'),
    "password": os.getenv('SNOWFLAKE_PASSWORD'),
    "role": os.getenv('SNOWFLAKE_ROLE'),
    "warehouse": os.getenv('SNOWFLAKE_WAREHOUSE'),
    "database": os.getenv('SNOWFLAKE_DATABASE'),
    "schema": os.getenv('SNOWFLAKE_SCHEMA')}

lm = dspy.Snowflake(model="mixtral-8x7b",credentials=connection_parameters)
```

### 构造函数

该构造函数继承自基类 `LM` 并验证用于使用 Snowflake API 的 `credentials`。

```python
class Snowflake(LM):
    def __init__(
        self, 
        model,
        credentials,
        **kwargs):
```

**参数:**
- `model`（_str_）: 由 [Snowflake Cortex](https://docs.snowflake.com/en/user-guide/snowflake-cortex/llm-functions#availability) 托管的模型。
- `credentials`（_dict_）: 初始化 [snowflake snowpark 会话](https://docs.snowflake.com/en/developer-guide/snowpark/reference/python/latest/api/snowflake.snowpark.Session) 所需的连接参数。

### 方法

请参阅 [`dspy.Snowflake`](https://dspy-docs.vercel.app/api/language_model_clients/Snowflake) 文档。
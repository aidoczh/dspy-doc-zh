---
sidebar_position: 5
---

# teleprompt.BootstrapFinetune

### 构造函数

### `__init__(self, metric=None, teacher_settings={}, multitask=True)`

该构造函数初始化一个 `BootstrapFinetune` 实例并设置其属性。它将电讯提示器定义为一个 `BootstrapFewShot` 实例，用于微调编译。

```python
class BootstrapFinetune(Teleprompter):
    def __init__(self, metric=None, teacher_settings={}, multitask=True):
```

**参数:**
- `metric`（_callable_，_可选_）：用于在自举过程中评估示例的度量函数。默认为 `None`。
- `teacher_settings`（_dict_，_可选_）：教师预测器的设置。默认为空字典。
- `multitask`（_bool_，_可选_）：启用多任务微调。默认为 `True`。

### 方法

#### `compile(self, student, *, teacher=None, trainset, valset=None, target='t5-large', bsize=12, accumsteps=1, lr=5e-5, epochs=1, bf16=False)`

该方法首先使用 `BootstrapFewShot` 电讯提示器进行编译自举。然后通过生成提示-完成对来准备微调数据进行训练，并执行微调。编译后，语言模型被设置为微调模型，并且该方法返回一个已编译和微调的预测器。

**参数:**
- `student`（_Predict_）：待微调的学生预测器。
- `teacher`（_Predict_，_可选_）：帮助微调的教师预测器。默认为 `None`。
- `trainset`（_list_）：用于微调的训练数据集。
- `valset`（_list_，_可选_）：用于微调的验证数据集。默认为 `None`。
- `target`（_str_，_可选_）：微调的目标模型。默认为 `'t5-large'`。
- `bsize`（_int_，_可选_）：训练的批量大小。默认为 `12`。
- `accumsteps`（_int_，_可选_）：梯度累积步数。默认为 `1`。
- `lr`（_float_，_可选_）：微调的学习率。默认为 `5e-5`。
- `epochs`（_int_，_可选_）：训练的轮数。默认为 `1`。
- `bf16`（_bool_，_可选_）：启用使用 BF16 的混合精度训练。默认为 `False`。

**返回:**
- `compiled2`（_Predict_）：一个已编译和微调的 `Predict` 实例。

### 示例

```python
#假设已定义 trainset
#假设已定义 RAG 类
...

#定义电讯提示器
teleprompter = BootstrapFinetune(teacher_settings=dict({'lm': teacher}))

# 编译！
compiled_rag = teleprompter.compile(student=RAG(), trainset=trainset, target='google/flan-t5-base')
```
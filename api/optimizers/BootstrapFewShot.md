---
sidebar_position: 2
---

# teleprompt.BootstrapFewShot

### 构造函数

构造函数初始化`BootstrapFewShot`类并设置引导参数。

```python
class BootstrapFewShot(Teleprompter):
    def __init__(self, metric=None, teacher_settings={}, max_bootstrapped_demos=4, max_labeled_demos=16, max_rounds=1):
        self.metric = metric
        self.teacher_settings = teacher_settings

        self.max_bootstrapped_demos = max_bootstrapped_demos
        self.max_labeled_demos = max_labeled_demos
        self.max_rounds = max_rounds
```

**参数:**
- `metric`（_callable_，_可选_）：在引导过程中评估示例的度量函数。默认为`None`。
- `teacher_settings`（_dict_，_可选_）：教师预测器的设置。默认为空字典。
- `max_bootstrapped_demos`（_int_，_可选_）：每个预测器的最大引导演示数量。默认为4。
- `max_labeled_demos`（_int_，_可选_）：每个预测器的最大标记演示数量。默认为16。
- `max_rounds`（_int_，_可选_）：引导轮数的最大数量。默认为1。

### 方法

#### `compile(self, student, *, teacher=None, trainset, valset=None)`

该方法通过执行引导来编译`BootstrapFewShot`实例，以改进学生预测器。

该过程包括准备学生和教师预测器，其中包括创建预测器副本，验证学生预测器未编译，并通过`LabeledFewShot`使用标记演示编译教师预测器（如果教师预测器尚未编译）。

下一阶段涉及准备预测器映射，通过验证学生和教师预测器具有相同的程序结构和相同的签名但是不同对象来实现。

最后阶段是执行引导迭代。

**参数:**
- `student`（_Teleprompter_）：要编译的学生预测器。
- `teacher`（_Teleprompter_，_可选_）：用于引导的教师预测器。默认为`None`。
- `trainset`（_list_）：引导中使用的训练数据集。
- `valset`（_list_，_可选_）：编译中使用的验证数据集。默认为`None`。

**返回:**
- 经过改进演示引导后编译的`student`预测器。

### 示例

```python
#假设已定义trainset
#假设已定义RAG类
...

#定义teleprompter并包括教师
teacher = dspy.OpenAI(model='gpt-3.5-turbo', api_key = openai.api_key, api_provider = "openai", model_type = "chat")
teleprompter = BootstrapFewShot(teacher_settings=dict({'lm': teacher}))

# 编译！
compiled_rag = teleprompter.compile(student=RAG(), trainset=trainset)
```
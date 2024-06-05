---
sidebar_position: 1
---

# teleprompt.LabeledFewShot

### 构造函数

构造函数初始化 `LabeledFewShot` 类并设置其属性，特别是定义了预测器要使用的 `k` 个样本数量。

```python
class LabeledFewShot(Teleprompter):
    def __init__(self, k=16):
        self.k = k
```

**参数:**
- `k` (_int_): 每个预测器要使用的样本数量。默认为 16。

### 方法

#### `compile(self, student, *, trainset)`

此方法通过配置 `student` 预测器来编译 `LabeledFewShot` 实例。它将 `trainset` 的子集分配给每个学生预测器的 `demos` 属性。如果 `trainset` 为空，则该方法返回原始的 `student`。

**参数:**
- `student` (_Teleprompter_): 要编译的学生预测器。
- `trainset` (_list_): 用于与学生预测器编译的训练数据集。

**返回:**
- 经过编译的 `student` 预测器，为每个预测器分配了训练样本，或者如果 `trainset` 为空，则返回原始的 `student`。

### 示例

```python
import dspy

#假设已定义 trainset
class RAG(dspy.Module):
    def __init__(self, num_passages=3):
        super().__init__()

        #声明检索和预测器模块
        self.retrieve = dspy.Retrieve(k=num_passages)
        self.generate_answer = dspy.ChainOfThought(GenerateAnswer)
    
    #使用预测器和检索模块回答问题的流程
    def forward(self, question):
        context = self.retrieve(question).passages
        prediction = self.generate_answer(context=context, question=question)
        return dspy.Prediction(context=context, answer=prediction.answer)

#定义 teleprompter
teleprompter = LabeledFewShot()

# 编译！
compiled_rag = teleprompter.compile(student=RAG(), trainset=trainset)
```
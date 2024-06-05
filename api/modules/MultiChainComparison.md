# dspy.MultiChainComparison

### 构造函数

构造函数初始化 `MultiChainComparison` 类并设置其属性。它继承自 `Predict` 类，并为多链比较添加了特定功能。

该类整合了多个学生尝试的推理，并最终选择最佳的推理路径。

```python
from .predict import Predict
from ..primitives.program import Module

import dsp

class MultiChainComparison(Module):
    def __init__(self, signature, M=3, temperature=0.7, **config):
        super().__init__()

        self.M = M
        signature = Predict(signature).signature
        *keys, last_key = signature.kwargs.keys()

        extended_kwargs = {key: signature.kwargs[key] for key in keys}

        for idx in range(M):
            candidate_type = dsp.Type(prefix=f"学生尝试 #{idx+1}:", desc="${推理尝试}")
            extended_kwargs.update({f'reasoning_attempt_{idx+1}': candidate_type})
        
        rationale_type = dsp.Type(prefix="准确推理：谢谢大家。现在让我们整体地", desc="${更正的推理}")
        extended_kwargs.update({'rationale': rationale_type, last_key: signature.kwargs[last_key]})

        signature = dsp.Template(signature.instructions, **extended_kwargs)
        self.predict = Predict(signature, temperature=temperature, **config)
        self.last_key = last_key
```

**参数:**
- `signature` (_Any_): 预测模型的签名。
- `M` (_int_, _可选_): 学生推理尝试的数量。默认为 `3`。
- `temperature` (_float_, _可选_): 预测的温度参数。默认为 `0.7`。
- `**config` (_dict_): 模型的额外配置参数。

### 方法

#### `forward(self, completions, **kwargs)`

该方法汇总所有学生的推理尝试，并使用扩展签名调用预测方法，以获得最佳推理。

**参数:**
- `completions`: 包含学生推理尝试的完成对象列表。
- `**kwargs`: 额外的关键字参数。

**返回:**
- 最佳推理的 `predict` 方法的结果。

### 示例
```python
class BasicQA(dspy.Signature):
    """使用简短的事实性答案回答问题。"""
    question = dspy.InputField()
    answer = dspy.OutputField(desc="通常为1到5个词")

# 模型生成的示例完成，供参考
completions = [
    dspy.Prediction(rationale="我记得在晴天时，天空通常呈现这种颜色。", answer="蓝色"),
    dspy.Prediction(rationale="根据常识，我认为天空通常是这种颜色。", answer="绿色"),
    dspy.Prediction(rationale="从图片和媒体描绘中，天空经常用这种色调表示。", answer="蓝色"),
]

# 将签名传递给MultiChainComparison模块
compare_answers = dspy.MultiChainComparison(BasicQA)

# 在完成上调用MultiChainComparison
question = '天空的颜色是什么？'
final_pred = compare_answers(completions, question=question)

print(f"问题: {question}")
print(f"最终预测答案（经过比较后）: {final_pred.answer}")
print(f"最终理由: {final_pred.rationale}")
```

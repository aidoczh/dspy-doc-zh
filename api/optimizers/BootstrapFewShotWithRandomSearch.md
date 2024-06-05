---
sidebar_position: 4
---

# teleprompt.BootstrapFewShotWithRandomSearch

### 构造函数

构造函数初始化`BootstrapFewShotWithRandomSearch`类并设置其属性。它继承自`BootstrapFewShot`类，并为随机搜索过程引入了额外的属性。

```python
class BootstrapFewShotWithRandomSearch(BootstrapFewShot):
    def __init__(self, metric, teacher_settings={}, max_bootstrapped_demos=4, max_labeled_demos=16, max_rounds=1, num_candidate_programs=16, num_threads=6):
        self.metric = metric
        self.teacher_settings = teacher_settings
        self.max_rounds = max_rounds

        self.num_threads = num_threads

        self.min_num_samples = 1
        self.max_num_samples = max_bootstrapped_demos
        self.num_candidate_sets = num_candidate_programs
        self.max_num_traces = 1 + int(max_bootstrapped_demos / 2.0 * self.num_candidate_sets)

        self.max_bootstrapped_demos = self.max_num_traces
        self.max_labeled_demos = max_labeled_demos

        print("Going to sample between", self.min_num_samples, "and", self.max_num_samples, "traces per predictor.")
        print("Going to sample", self.max_num_traces, "traces in total.")
        print("Will attempt to train", self.num_candidate_sets, "candidate sets.")
```

**参数:**
- `metric`（_callable_，_可选_）：用于在引导过程中评估示例的度量函数。默认为`None`。
- `teacher_settings`（_dict_，_可选_）：教师预测器的设置。默认为空字典。
- `max_bootstrapped_demos`（_int_，_可选_）：每个预测器的引导演示的最大数量。默认为4。
- `max_labeled_demos`（_int_，_可选_）：每个预测器的标记演示的最大数量。默认为16。
- `max_rounds`（_int_，_可选_）：引导轮数的最大数量。默认为1。
- `num_candidate_programs`（_int_）：在随机搜索期间生成的候选程序数量。
- `num_threads`（_int_）：在随机搜索期间用于评估的线程数。

### 方法

请参阅[teleprompt.BootstrapFewShot](https://dspy-docs.vercel.app/docs/deep-dive/teleprompter/bootstrap-fewshot)文档。

## 示例

```python
#假设已定义trainset
#假设已定义RAG类
...

#定义teleprompter并包含teacher
teacher = dspy.OpenAI(model='gpt-3.5-turbo', api_key = openai.api_key, api_provider = "openai", model_type = "chat")
teleprompter = BootstrapFewShotWithRandomSearch(teacher_settings=dict({'lm': teacher}))

# 编译！
compiled_rag = teleprompter.compile(student=RAG(), trainset=trainset)
```
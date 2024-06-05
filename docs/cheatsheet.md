---
sidebar_position: 999
---


# DSPy 速查表

本页面包含常用模式的代码片段。

## DSPy 数据加载器

导入并初始化 DataLoader 对象：

```python
import dspy
from dspy.datasets import DataLoader

dl = DataLoader()
```

### 从 HuggingFace 数据集加载

```python
code_alpaca = dl.from_huggingface("HuggingFaceH4/CodeAlpaca_20K")
```

通过调用相应拆分的键，您可以访问拆分的数据集：

```python
train_dataset = code_alpaca['train']
test_dataset = code_alpaca['test']
```

### 从 HuggingFace 加载特定拆分

您还可以手动指定要包含的拆分，并将返回一个字典，其中键是您指定的拆分：

```python
code_alpaca = dl.from_huggingface(
    "HuggingFaceH4/CodeAlpaca_20K",
    split = ["train", "test"],
)

print(f"数据集中的拆分: {code_alpaca.keys()}")
```

如果指定了单个拆分，则数据加载器将返回一个 `dspy.Example` 列表而不是字典：

```python
code_alpaca = dl.from_huggingface(
    "HuggingFaceH4/CodeAlpaca_20K",
    split = "train",
)

print(f"拆分中的示例数量: {len(code_alpaca)}")
```

您也可以像处理 HuggingFace 数据集一样对拆分进行切片：

```python
code_alpaca_80 = dl.from_huggingface(
    "HuggingFaceH4/CodeAlpaca_20K",
    split = "train[:80%]",
)

print(f"拆分中的示例数量: {len(code_alpaca_80)}")

code_alpaca_20_80 = dl.from_huggingface(
    "HuggingFaceH4/CodeAlpaca_20K",
    split = "train[20%:80%]",
)

print(f"拆分中的示例数量: {len(code_alpaca_20_80)}")
```

### 从 HuggingFace 加载特定子集

如果数据集有一个子集，您可以像在 HuggingFace 的 `load_dataset` 中那样将其作为参数传递：

```python
gms8k = dl.from_huggingface(
    "gsm8k",
    "main",
    input_keys = ("question",),
)

print(f"返回字典中的键: {list(gms8k.keys())}")

print(f"训练集中的示例数量: {len(gms8k['train'])}")
print(f"测试集中的示例数量: {len(gms8k['test'])}")
```

### 从 CSV 加载

```python
dolly_100_dataset = dl.from_csv("dolly_subset_100_rows.csv",)
```

通过在参数中指定它们，您可以从 csv 中仅选择指定的列：

```python
dolly_100_dataset = dl.from_csv(
    "dolly_subset_100_rows.csv",
    fields=("instruction", "context", "response"),
    input_keys=("instruction", "context")
)
```

### 拆分 `dspy.Example` 列表

```python
splits = dl.train_test_split(dataset, train_size=0.8) # `dataset` 是一个 `dspy.Example` 列表
train_dataset = splits['train']
test_dataset = splits['test']
```

### 从 `dspy.Example` 列表中抽样

```python
sampled_example = dl.sample(dataset, n=5) # `dataset` 是一个 `dspy.Example` 列表
```

## DSPy 程序

### dspy.Signature

```python
class BasicQA(dspy.Signature):
    """使用简短的事实性答案回答问题。"""

    question = dspy.InputField(desc="问题")
    answer = dspy.OutputField(desc="通常为1到5个词")
```

### dspy.ChainOfThought

```python
生成答案 = dspy.ChainOfThought(BasicQA)

# 在特定输入和提示的情况下调用预测器。
question='天空的颜色是什么？'
pred = generate_answer(question=question)
```

### dspy.ChainOfThoughtwithHint

```python
generate_answer = dspy.ChainOfThoughtWithHint(BasicQA)

# 在特定输入和提示的情况下调用预测器。
question='天空的颜色是什么？'
hint = "这是你在晴天经常看到的东西。"
pred = generate_answer(question=question, hint=hint)
```

### dspy.ProgramOfThought

```python
pot = dspy.ProgramOfThought(BasicQA)

question = '莎拉有5个苹果。她从商店买了7个苹果。现在莎拉有多少苹果？'
result = pot(question=question)

print(f"问题: {question}")
print(f"最终预测答案（经过ProgramOfThought处理后）: {result.answer}")
```

### dspy.ReACT

```python
react_module = dspy.ReAct(BasicQA)

question = '莎拉有5个苹果。她从商店买了7个苹果。现在莎拉有多少苹果？'
result = react_module(question=question)

print(f"问题: {question}")
print(f"最终预测答案（经过ReAct处理后）: {result.answer}")
```

### dspy.Retrieve

```python
colbertv2_wiki17_abstracts = dspy.ColBERTv2(url='http://20.102.90.50:2017/wiki17_abstracts')
dspy.settings.configure(rm=colbertv2_wiki17_abstracts)

# 定义检索模块
retriever = dspy.Retrieve(k=3)

query='第一届FIFA世界杯是何时举办的？'

# 对特定查询调用检索器。
topK_passages = retriever(query).passages

for idx, passage in enumerate(topK_passages):
    print(f'{idx+1}]', passage, '\n')
```

## DSPy Metrics

### 作为度量的函数

要创建自定义度量，您可以创建一个返回数字或布尔值的函数：

```python
def parse_integer_answer(answer, only_first_line=True):
    try:
        if only_first_line:
            answer = answer.strip().split('\n')[0]

        # 找到最后一个包含数字的标记
        answer = [token for token in answer.split() if any(c.isdigit() for c in token)][-1]
        answer = answer.split('.')[0]
        answer = ''.join([c for c in answer if c.isdigit()])
        answer = int(answer)

    except (ValueError, IndexError):
        # print(answer)
        answer = 0
    
    return answer

# 度量函数
def gsm8k_metric(gold, pred, trace=None) -> int:
    return int(parse_integer_answer(str(gold.answer))) == int(parse_integer_answer(str(pred.answer)))
```

### 作为评判者的LLM

```python
class FactJudge(dspy.Signature):
    """根据上下文判断答案是否事实正确。"""

    context = dspy.InputField(desc="用于预测的上下文")
    question = dspy.InputField(desc="待回答的问题")
    answer = dspy.InputField(desc="问题的答案")
    factually_correct = dspy.OutputField(desc="根据上下文判断答案是否事实正确", prefix="事实[是/否]:")
    
judge = dspy.ChainOfThought(FactJudge)

def factuality_metric(example, pred):
    factual = judge(context=example.context, question=example.question, answer=pred.answer)
    return int(factual=="是")
```
## DSPy 评估

```python
from dspy.evaluate import Evaluate

evaluate_program = Evaluate(devset=devset, metric=your_defined_metric, num_threads=NUM_THREADS, display_progress=True, display_table=num_rows_to_display)

evaluate_program(your_dspy_program)
```

## DSPy 优化器

### LabeledFewShot 
```python
from dspy.teleprompt import LabeledFewShot

labeled_fewshot_optimizer = LabeledFewShot(k=8)
your_dspy_program_compiled = labeled_fewshot_optimizer.compile(student = your_dspy_program, trainset=trainset)
```

### BootstrapFewShot 
```python
from dspy.teleprompt import BootstrapFewShot

fewshot_optimizer = BootstrapFewShot(metric=your_defined_metric, max_bootstrapped_demos=4, max_labeled_demos=16, max_rounds=1, max_errors=5)

your_dspy_program_compiled = fewshot_optimizer.compile(student = your_dspy_program, trainset=trainset)
```

#### 使用另一个 LM 进行编译，指定在 teacher_settings 中
```python
from dspy.teleprompt import BootstrapFewShot

fewshot_optimizer = BootstrapFewShot(metric=your_defined_metric, max_bootstrapped_demos=4, max_labeled_demos=16, max_rounds=1, max_errors=5, teacher_settings=dict(lm=gpt4))

your_dspy_program_compiled = fewshot_optimizer.compile(student = your_dspy_program, trainset=trainset)
```

#### 编译一个已编译的程序 - 对一个已经进行过 Bootstrap 的程序再进行一次 Bootstrap

```python
your_dspy_program_compiledx2 = teleprompter.compile(
    your_dspy_program,
    teacher=your_dspy_program_compiled,
    trainset=trainset,
)
```

#### 保存/加载已编译的程序

```python
save_path = './v1.json'
your_dspy_program_compiledx2.save(save_path)
```

```python
loaded_program = YourProgramClass()
loaded_program.load(path=save_path)
```

### BootstrapFewShotWithRandomSearch

```python
from dspy.teleprompt import BootstrapFewShotWithRandomSearch

fewshot_optimizer = BootstrapFewShotWithRandomSearch(metric=your_defined_metric, max_bootstrapped_demos=2, num_candidate_programs=8, num_threads=NUM_THREADS)

your_dspy_program_compiled = fewshot_optimizer.compile(student = your_dspy_program, trainset=trainset, valset=devset)

```
其他自定义配置与自定义 `BootstrapFewShot` 优化器类似。

### 集成

```python
from dspy.teleprompt import BootstrapFewShotWithRandomSearch
from dspy.teleprompt.ensemble import Ensemble

fewshot_optimizer = BootstrapFewShotWithRandomSearch(metric=your_defined_metric, max_bootstrapped_demos=2, num_candidate_programs=8, num_threads=NUM_THREADS)
your_dspy_program_compiled = fewshot_optimizer.compile(student = your_dspy_program, trainset=trainset, valset=devset)

ensemble_optimizer = Ensemble(reduce_fn=dspy.majority)
programs = [x[-1] for x in your_dspy_program_compiled.candidate_programs]
your_dspy_program_compiled_ensemble = ensemble_optimizer.compile(programs[:3])
```

### BootstrapFinetune
```python
from dspy.teleprompt import BootstrapFewShotWithRandomSearch, BootstrapFinetune

# 在当前的 dspy.settings.lm 上编译程序
fewshot_optimizer = BootstrapFewShotWithRandomSearch(metric=your_defined_metric, max_bootstrapped_demos=2, num_threads=NUM_THREADS)
your_dspy_program_compiled = tp.compile(your_dspy_program, trainset=trainset[:some_num], valset=trainset[some_num:])

# 配置模型以进行微调
config = dict(target=model_to_finetune, epochs=2, bf16=True, bsize=6, accumsteps=2, lr=5e-5)

# 在 BootstrapFinetune 上编译程序
finetune_optimizer = BootstrapFinetune(metric=your_defined_metric)
finetune_program = finetune_optimizer.compile(your_dspy_program, trainset=some_new_dataset_for_finetuning_model, **config)

finetune_program = your_dspy_program

# 加载程序并在评估之前激活程序中模型的参数
ckpt_path = "finetuning 的保存检查点路径"
LM = dspy.HFModel(checkpoint=ckpt_path, model=model_to_finetune)

for p in finetune_program.predictors():
    p.lm = LM
    p.activated = False
```

### COPRO

```python
from dspy.teleprompt import COPRO

eval_kwargs = dict(num_threads=16, display_progress=True, display_table=0)

copro_teleprompter = COPRO(prompt_model=model_to_generate_prompts, task_model=model_that_solves_task, metric=your_defined_metric, breadth=num_new_prompts_generated, depth=times_to_generate_prompts, init_temperature=prompt_generation_temperature, verbose=False, log_dir=logging_directory)

compiled_program_optimized_signature = copro_teleprompter.compile(your_dspy_program, trainset=trainset, eval_kwargs=eval_kwargs)
```

### MIPRO

```python
from dspy.teleprompt import MIPRO

teleprompter = MIPRO(prompt_model=model_to_generate_prompts, task_model=model_that_solves_task, metric=your_defined_metric, num_candidates=num_new_prompts_generated, init_temperature=prompt_generation_temperature)

kwargs = dict(num_threads=NUM_THREADS, display_progress=True, display_table=0)

compiled_program_optimized_bayesian_signature = teleprompter.compile(your_dspy_program, trainset=trainset, num_trials=100, max_bootstrapped_demos=3, max_labeled_demos=5, eval_kwargs=kwargs)
```

### Signature Optimizer with Types

```python
from dspy.teleprompt.signature_opt_typed import optimize_signature
from dspy.evaluate.metrics import answer_exact_match
from dspy.functional import TypedChainOfThought

compiled_program = optimize_signature(
    student=TypedChainOfThought("question -> answer"),
    evaluator=Evaluate(devset=devset, metric=answer_exact_match, num_threads=10, display_progress=True),
    n_iterations=50,
).program
```

### KNNFewShot

```python
from dspy.predict import KNN
from dspy.teleprompt import KNNFewShot

knn_optimizer = KNNFewShot(KNN, k=3, trainset=trainset)

your_dspy_program_compiled = knn_optimizer.compile(student=your_dspy_program, trainset=trainset, valset=devset)
```

### BootstrapFewShotWithOptuna

```python
from dspy.teleprompt import BootstrapFewShotWithOptuna

fewshot_optuna_optimizer = BootstrapFewShotWithOptuna(metric=your_defined_metric, max_bootstrapped_demos=2, num_candidate_programs=8, num_threads=NUM_THREADS)

your_dspy_program_compiled = fewshot_optuna_optimizer.compile(student=your_dspy_program, trainset=trainset, valset=devset)
```
其他自定义配置与自定义 `dspy.BootstrapFewShot` 优化器类似。

## DSPy 断言

### 包括 `dspy.Assert` 和 `dspy.Suggest` 语句
```python
dspy.Assert(your_validation_fn(model_outputs), "your feedback message", target_module="YourDSPyModuleSignature")

dspy.Suggest(your_validation_fn(model_outputs), "your feedback message", target_module="YourDSPyModuleSignature")
```

### 使用带有断言的 DSPy 程序

**注意**: 要正确使用断言，必须从上述任一方法中**激活**包含 `dspy.Assert` 或 `dspy.Suggest` 语句的 DSPy 程序。
```python
#1. 使用 `assert_transform_module`：
from dspy.primitives.assertions import assert_transform_module, backtrack_handler

带有断言的程序 = assert_transform_module(ProgramWithAssertions(), backtrack_handler)

#2. 使用 `activate_assertions()`：
带有断言的程序 = ProgramWithAssertions().activate_assertions()
```
## 使用带有断言的 DSPy 程序进行编译

```python
带有断言的程序 = assert_transform_module(ProgramWithAssertions(), backtrack_handler)
fewshot_optimizer = BootstrapFewShotWithRandomSearch(metric = your_defined_metric, max_bootstrapped_demos=2, num_candidate_programs=6)
编译后的带有断言的 DSPy 程序 = fewshot_optimizer.compile(student=带有断言的程序, teacher = 带有断言的程序, trainset=trainset, valset=devset) #student can also be program_without_assertions
```
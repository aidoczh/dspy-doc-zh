# 类型化预测器

在 DSPy 签名中，我们有 `InputField` 和 `OutputField`，用于定义字段的输入和输出性质。然而，这些字段的输入和输出始终是 `str` 类型，这需要进行输入和输出字符串处理。

Pydantic 的 `BaseModel` 是强制字段类型约束的好方法，但它与 `dspy.Signature` 不是直接兼容的。类型化预测器解决了这个问题，可以强制执行 `dspy.Signature` 中字段的输入和输出类型约束。

## 执行类型化预测器

使用类型化预测器与任何其他模块并没有太大区别，只是在签名属性中添加了类型提示，并使用一个特殊的预测器模块而不是 `dspy.Predict`。让我们通过一个简单的示例来理解这一点。

### 定义输入和输出模型

让我们以一个简单的任务为例，即给定 `context` 和 `query`，LLM 应该返回一个 `answer` 和 `confidence_score`。让我们通过 pydantic 定义我们的 `Input` 和 `Output` 模型。

```python
from pydantic import BaseModel, Field

class Input(BaseModel):
    context: str = Field(description="问题的上下文")
    query: str = Field(description="待回答的问题")

class Output(BaseModel):
    answer: str = Field(description="问题的答案")
    confidence: float = Field(ge=0, le=1, description="答案的置信度分数")
```

正如你所见，我们可以通过定义一个简单的签名来描述属性，该签名接受输入并返回输出。

### 创建类型化预测器

类型化预测器需要一个类型化签名，它扩展了 `dspy.Signature`，并添加了指定的 "字段类型"。

```python
class QASignature(dspy.Signature):
    """根据提供的上下文和问题回答问题，并在 10 分制下告诉你对答案的信心有多大。"""

    input: Input = dspy.InputField()
    output: Output = dspy.OutputField()
```

现在我们有了 `QASignature`，让我们定义一个类型化预测器，执行这个签名并符合类型约束。

```python
predictor = dspy.TypedPredictor(QASignature)
```

与其他模块类似，我们将 `QASignature` 传递给 `dspy.TypedPredictor`，以强制执行类型约束。

与 `dspy.Predict` 类似，我们也可以使用 "字符串签名"，如下所示：
```python
predictor = dspy.TypedPredictor("input:Input -> output:Output")
```

### 类型化预测器中的输入输出

现在让我们通过为预测器提供一些示例输入来测试类型化预测器，并验证输出类型。我们可以创建一个 `Input` 实例，并将其传递给预测器以获得输出的字典。

```python
doc_query_pair = Input(
    context="The quick brown fox jumps over the lazy dog",
    query="What does the fox jumps over?",
)

prediction = predictor(input=doc_query_pair)
```

让我们看看输出及其类型。
```python
答案 = 预测输出.答案
置信度分数 = 预测输出.置信度

print(f"预测: {prediction}\n\n")
print(f"答案: {答案}, 答案类型: {type(答案)}")
print(f"置信度分数: {置信度分数}, 置信度分数类型: {type(置信度分数)}")
```
## 使用 `dspy.TypedChainOfThought` 进行类型化思维链

类比于 `TypedPredictor` 到 `dspy.Predict` 的关系，我们创建了 `TypedChainOfThought`，它是 `dspy.ChainOfThought` 的类型化对应物：

```python
cot_predictor = dspy.TypedChainOfThought(QASignature)

doc_query_pair = Input(
    context="The quick brown fox jumps over the lazy dog",
    query="What does the fox jumps over?",
)

prediction = cot_predictor(input=doc_query_pair)
```

## 将类型化预测器作为装饰器

虽然 `dspy.TypedPredictor` 和 `dspy.TypedChainOfThought` 提供了一种方便的方式来使用类型化预测器，但你也可以将它们作为装饰器使用，以强制执行函数的输入和输出类型约束。这依赖于 Signature 类及其函数参数、输出和文档字符串的内部定义。

```python
@dspy.predictor
def answer(doc_query_pair: Input) -> Output:
    """基于提供的上下文和查询回答问题，并在 0-1 的范围内告诉你对答案的信心有多大。"""
    pass

@dspy.cot
def answer(doc_query_pair: Input) -> Output:
    """基于提供的上下文和查询回答问题，并在 0-1 的范围内告诉你对答案的信心有多大。"""
    pass

prediction = answer(doc_query_pair=doc_query_pair)
```

## 在 `dspy.Module` 中组合功能型类型化预测器

如果你通过 `dspy.Module` 创建 DSPy 管道，那么你可以通过创建这些类方法并将它们用作装饰器来简单地使用功能型类型化预测器。以下是使用功能型类型化预测器创建 `SimplifiedBaleen` 管道的示例：

```python
class SimplifiedBaleen(FunctionalModule):
    def __init__(self, passages_per_hop=3, max_hops=1):
        super().__init__()
        self.retrieve = dspy.Retrieve(k=passages_per_hop)
        self.max_hops = max_hops

    @cot
    def generate_query(self, context: list[str], question) -> str:
        """编写一个简单的搜索查询，以帮助回答复杂问题。"""
        pass

    @cot
    def generate_answer(self, context: list[str], question) -> str:
        """用简短的事实性答案回答问题。"""
        pass

    def forward(self, question):
        context = []

        for _ in range(self.max_hops):
            query = self.generate_query(context=context, question=question)
            passages = self.retrieve(query).passages
            context = deduplicate(context + passages)

        answer = self.generate_answer(context=context, question=question)
        return dspy.Prediction(context=context, answer=answer)
```

## 优化类型化预测器

可以通过 `optimize_signature` 优化器在 Signature 指令上优化类型化预测器。以下是对 `QASignature` 进行此优化的示例：
```python
import dspy
from dspy.evaluate import Evaluate
from dspy.evaluate.metrics import answer_exact_match
from dspy.teleprompt.signature_opt_typed import optimize_signature

turbo = dspy.OpenAI(model='gpt-3.5-turbo', max_tokens=4000)
gpt4 = dspy.OpenAI(model='gpt-4', max_tokens=4000)
dspy.settings.configure(lm=turbo)

evaluator = Evaluate(devset=devset, metric=answer_exact_match, num_threads=10, display_progress=True)

result = optimize_signature(
    student=dspy.TypedPredictor(QASignature),
    evaluator=evaluator,
    initial_prompts=6,
    n_iterations=100,
    max_examples=30,
    verbose=True,
    prompt_model=gpt4,
)
```
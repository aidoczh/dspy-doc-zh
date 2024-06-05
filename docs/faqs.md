---
sidebar_position: 998
---

# 常见问题

## DSPy 是否适合我？DSPy 与其他框架的比较

**DSPy** 的理念和抽象与其他库和框架有很大不同，因此通常很容易确定在您的用例中是否应该选择 **DSPy** 框架。如果您是一名自然语言处理（NLP）/人工智能研究人员（或者是一名探索新管道或新任务的从业者），答案通常是肯定的。如果您是从事其他工作的从业者，请继续阅读。

**DSPy 与用于提示的轻量包装（OpenAI API、MiniChain、基本模板）的比较** 换句话说：_为什么我不能直接将我的提示写成字符串模板？_ 嗯，在非常简单的情况下，这样做可能完全没问题。（如果您熟悉神经网络，这就像将一个微小的两层神经网络表示为 Python for 循环。这种方法可能有效。）然而，当您需要更高质量（或可管理的成本）时，您需要迭代地探索多阶段分解、改进提示、数据引导、仔细微调、检索增强，以及/或使用更小（或更便宜、本地）的模型。使用基础模型构建的真正表现力在于这些部分之间的交互。但是，每次更改一个部分时，您很可能会破坏（或削弱）多个其他组件。**DSPy** 清晰地将这些与您实际系统设计无关的交互部分抽象出来（并且强大地优化）。它让您专注于设计模块级别的交互：在 **DSPy** 中用 10 到 20 行表达的相同程序可以轻松编译成 `GPT-4` 的多阶段指令、`Llama2-13b` 的详细提示，或者 `T5-base` 的微调。哦，您也不再需要维护项目核心中冗长、脆弱、特定于模型的字符串了。
**DSPy 与 LangChain、LlamaIndex 等应用开发库的比较** LangChain 和 LlamaIndex 面向高级应用开发；它们提供了一揽子解决方案，预先构建的应用模块可以与您的数据或配置相连接。如果您愿意使用通用的现成提示来回答关于 PDF 或标准文本转 SQL 的问题，那么您会发现这些库中有丰富的生态系统。**DSPy** 内部不包含针对特定应用的手工制作提示。相反，**DSPy** 引入了一小组更加强大和通用的模块，_可以在您的数据流水线中学习提示（或微调）您的语言模型_。当您更改数据、调整程序控制流程或更改目标语言模型时，**DSPy 编译器** 可以将您的程序映射到一组新的提示（或微调），这些提示专门针对这个数据流水线进行了优化。因此，您可能会发现 **DSPy** 在您的任务中获得了最高质量，而且付出的努力最少，前提是您愿意实现（或扩展）自己的简短程序。简而言之，**DSPy** 适用于需要轻量级但自动优化的编程模型 — 而不是预定义提示和集成的库。如果您熟悉神经网络：这就像 PyTorch（即代表 **DSPy**）和 HuggingFace Transformers（即代表更高级别的库）之间的区别。

**DSPy 与 Guidance、LMQL、RELM、Outlines 等生成控制库的比较** 这些都是用于控制语言模型的个别完成的令人兴奋的新库，例如，如果您想要强制执行 JSON 输出模式或将采样限制为特定正则表达式。在许多情况下，这非常有用，但通常侧重于对单个语言模型调用的低级结构化控制。它并不能确保您获得的 JSON（或结构化输出）是正确的或对您的任务有用。相比之下，**DSPy** 自动优化程序中的提示，使其与各种任务需求保持一致，这也可能包括生成有效的结构化输出。尽管如此，我们正在考虑允许 **DSPy** 中的 **Signatures** 表达类似正则表达式的约束，这些约束由这些库实现。

## 基本用法
**如何使用 DSPy 完成我的任务？** 我们在[这里](https://dspy-docs.vercel.app/docs/building-blocks/solving_your_task)写了一个八步指南。简而言之，使用 DSPy 是一个迭代的过程。首先，您需要定义您的任务和要最大化的指标，并准备一些示例输入 —— 通常没有标签（或者仅在最终输出需要时带有标签，如果您的指标要求）。然后，通过选择要使用的内置层（`modules`），为每个层指定一个`signature`（输入/输出规范），然后在您的 Python 代码中自由调用您的模块来构建您的流水线。最后，您可以使用 DSPy 的`optimizer`将您的代码编译为高质量的指令、自动的少样本示例，或者更新您的 LM 权重。

**如何将我的复杂提示转换为 DSPy 流水线？** 参见上面相同的回答。

**DSPy 优化器调整什么？** 或者，_编译实际上做了什么？_ 每个优化器都不同，但它们都通过更新提示或 LM 权重来最大化程序上的指标。当前的 DSPy `optimizers`可以检查您的数据，模拟通过您的程序的轨迹以生成每个步骤的好/坏示例，根据过去的结果提出或完善每个步骤的指令，对自动生成的示例上的 LM 权重进行微调，或者结合其中几个来提高质量或降低成本。我们很乐意合并探索更丰富空间的新优化器：您目前为提示工程、"合成数据"生成或自我改进所经历的大部分手动步骤可能可以泛化为一个作用于任意 LM 程序的 DSPy 优化器。

其他常见问题。我们欢迎 PRs 添加这里每个问题的正式答案。您可以在现有问题、教程或论文中找到所有或大多数这些问题的答案。

- **如何获得多个输出？**

您可以指定多个输出字段。对于短格式签名，您可以将多个输出列为逗号分隔的值，跟随“->”指示符（例如“inputs -> output1, output2”）。对于长格式签名，您可以包含多个`dspy.OutputField`。

- **如何处理长回复？**

您可以将生成长回复指定为`dspy.OutputField`。为了确保对长格式生成中的内容进行全面检查，您可以指示在长格式生成中包含引文的上下文。这样的约束，如回复长度或引文包含，可以通过签名描述来说明，或者通过 DSPy Assertions 进行具体强制。查看[LongFormQA notebook](https://colab.research.google.com/github/stanfordnlp/dspy/blob/main/examples/longformqa/longformqa_assertions.ipynb)了解更多关于**生成长格式回答问题的回复**的信息。

- **如何确保 DSPy 不会从我的输入或输出中删除换行符？**
DSPy 使用[签名](https://dspy-docs.vercel.app/docs/deep-dive/signature/understanding-signatures)来格式化传递给语言模型的提示。为了确保长输入中不会去除换行符，创建字段时必须指定 `format=str`。

```python
class UnstrippedSignature(dspy.Signature):
    """在这里为模型输入一些信息。"""

    title = dspy.InputField()
    object = dspy.InputField(format=str)
    result = dspy.OutputField(format=str)
```

现在 `object` 可以是一个多行字符串，不会出现问题。

- **如何定义自己的评估指标？评估指标可以返回浮点数吗？**

您可以将评估指标定义为简单的 Python 函数，用于处理模型生成物并根据用户定义的要求对其进行评估。评估指标可以将现有数据（例如金标签）与模型预测进行比较，也可以用于使用语言模型的验证反馈来评估输出的各个组件（例如将LLMs作为评委）。评估指标可以返回 `bool`、`int` 和 `float` 类型的分数。查看官方[评估指标文档](https://dspy-docs.vercel.app/docs/building-blocks/metrics)以了解如何定义自定义评估指标以及使用 AI 反馈和/或 DSPy 程序进行高级评估。

- **编译的成本高吗？速度慢吗？**

为了反映编译指标，我们举例说明一个实验，使用 `dspy.BootstrapFewShotWithRandomSearch` 优化器在 `gpt-3.5-turbo-1106` 模型上编译 [`SimplifiedBaleen`](https://dspy-docs.vercel.app/docs/tutorials/simplified-baleen)，共有 7 个候选程序和 10 个线程。我们报告编译此程序大约需要 6 分钟，涉及 3200 个 API 调用，270 万个输入标记和 15.6 万个输出标记，总成本约为 3 美元（根据 OpenAI 模型的当前定价）。

编译 DSPy `优化器` 自然会带来额外的语言模型调用，但我们通过极简执行来证实这种开销，目的是最大化性能。这为通过使用较大模型编译 DSPy 程序来增强较小模型性能的途径，以在编译时学习增强行为，并将此类行为传播到测试的较小模型以在推断时使用提供了可能性。

## 部署或可复现性问题

- **如何保存编译程序的检查点？**

以下是保存/加载编译模块的示例：

```python
cot_compiled = teleprompter.compile(CoT(), trainset=trainset, valset=devset)

#保存
cot_compiled.save('compiled_cot_gsm8k.json')

#加载：
cot = CoT()
cot.load('compiled_cot_gsm8k.json')
```

- **如何导出以进行部署？**

导出 DSPy 程序就是简单地保存它们，如上所示！

- **如何搜索自己的数据？**
开源库，如[RAGautouille](https://github.com/bclavie/ragatouille)使您能够通过像ColBERT这样的高级检索模型搜索自己的数据，并提供了嵌入和索引文档的工具。在开发DSPy程序时，可以随意集成这些库以创建可搜索的数据集！

- **如何关闭缓存？如何导出缓存？**

您可以通过将[`DSP_CACHEBOOL`](https://github.com/stanfordnlp/dspy/blob/main/dsp/modules/cache_utils.py#L9)环境变量设置为`False`来关闭缓存，这会禁用`cache_turn_on`标志。

您的本地缓存将保存在全局环境目录`os.environ["DSP_NOTEBOOK_CACHEDIR"]`中，通常可以将其设置为`os.path.join(repo_path, 'cache')`，然后从这里导出缓存。


## 高级用法

- **如何并行化？**
您可以通过在相应的DSPy `optimizers`或`dspy.Evaluate`实用程序函数中指定多个线程设置来并行化DSPy程序的编译和评估。

- **如何冻结模块？**

通过将模块的`._compiled`属性设置为True来冻结模块，表示该模块已经通过优化器编译，不应调整其参数。这在优化器内部进行处理，例如在`dspy.BootstrapFewShot`中，确保在老师传播收集的少量演示之前，学生程序已被冻结在引导过程中。

- **如何获取JSON输出？**

您可以在长格式签名`dspy.OutputField`的`desc`字段中指定JSON类型的描述（例如`output = dspy.OutputField(desc='键-值对')`）。

如果注意到输出仍未符合JSON格式，请尝试断言此约束！查看[断言](https://dspy-docs.vercel.app/docs/building-blocks/assertions)（或下一个问题！）

- **如何使用DSPy断言？**

    a) **如何向程序添加断言**：
    - **定义约束**：使用`dspy.Assert`和/或`dspy.Suggest`在DSPy程序中定义约束。这些基于布尔验证检查的约束用于强制执行您想要的结果，可以简单地是用于验证模型输出的Python函数。
    - **集成断言**：在模型生成后保持您的断言语句（提示：在模块层之后）

    b) **如何激活断言**：
    1. **使用`assert_transform_module`**：
        - 使用`assert_transform_module`函数将您的DSPy模块包装为带有断言的模块，还可以使用`backtrack_handler`。此函数将转换您的程序以包括内部断言回溯和重试逻辑，也可以进行自定义：
        `program_with_assertions = assert_transform_module(ProgramWithAssertions(), backtrack_handler)`
    2. **激活断言**：
- 直接在您的 DSPy 程序中调用 `activate_assertions` 函数并添加断言：`program_with_assertions = ProgramWithAssertions().activate_assertions()`

**注意**：要正确使用断言，您必须通过上述任一方法激活包含 `dspy.Assert` 或 `dspy.Suggest` 语句的 DSPy 程序。

## 错误

- **如何处理 "context too long" 错误？**

如果在 DSPy 中遇到 "context too long" 错误，您可能正在使用 DSPy 优化器在提示中包含演示，而这超出了当前的上下文窗口。尝试减少这些参数（例如 `max_bootstrapped_demos` 和 `max_labeled_demos`）。此外，您还可以减少检索的段落/文档/嵌入数量，以确保您的提示适合模型上下文长度。

一个更通用的解决方法是简单地增加指定给 LM 请求的 `max_tokens` 数量（例如 `lm = dspy.OpenAI(model = ..., max_tokens = ...`）。

- **如何处理超时或退避错误？**

首先，请咨询您的 LM/RM 服务提供商，以确保您的用例具有稳定的状态或足够的速率限制！

此外，尝试减少您正在测试的线程数量，因为相应的服务器可能会因请求过多而过载，并触发退避 + 重试机制。

如果所有变量似乎稳定，您可能由于向 API 提供商发送的不正确的有效载荷请求而遇到超时或退避错误。请验证您的参数是否与您正在交互的 SDK 兼容。有时，DSPy 可能会有一些硬编码参数，这些参数对您的兼容性无关紧要，在这种情况下，请随时提出 PR 提醒或注释掉这些默认设置以供您使用。

## 贡献

**如果我有更好的提示或合成数据生成想法怎么办？** 太好了。我们鼓励您思考它是最好表达为一个模块还是一个优化器，并且我们很乐意将其合并到 DSPy 中，以便每个人都可以使用。DSPy 不是一个完整的项目；它是一个持续努力，旨在创建结构（模块和优化器），以取代繁琐的提示和管道工程技巧。

**如何添加我喜爱的 LM 或向量存储？**

查看这些设置[自定义 LM 客户端](https://dspy-docs.vercel.app/docs/deep-dive/language_model_clients/custom-lm-client) 和 [自定义 RM 客户端](https://dspy-docs.vercel.app/docs/deep-dive/retrieval_models_clients/custom-rm-client) 的指南。
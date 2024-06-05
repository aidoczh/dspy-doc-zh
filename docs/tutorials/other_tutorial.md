---
sidebar_position: 99999
---

# 附加资源

## 教程

| **级别** |  **教程** |  **在 Colab 中运行** |  **描述** |
| --- | -------------  |  -------------  |  -------------  | 
| 初学者 |  [**入门指南**](https://github.com/stanfordnlp/dspy/blob/main/intro.ipynb) | [<img align="center" src="https://colab.research.google.com/assets/colab-badge.svg" />](https://colab.research.google.com/github/stanfordnlp/dspy/blob/main/intro.ipynb)  | 介绍了 DSPy 中的基本构建模块。使用 HotPotQA 处理复杂问题回答任务。 |
| 初学者 | [**最小工作示例**](https://dspy-docs.vercel.app/docs/quick-start/minimal-example) | N/A | 在 DSPy 中构建和优化一个非常简单的思维链程序，用于数学问题回答。非常简短。 |
| 初学者 | [**为复杂任务编译**](https://github.com/stanfordnlp/dspy/blob/main/examples/nli/scone/scone.ipynb) | N/A | 教会语言模型推理逻辑陈述和否定。使用 GPT-4 引导 GPT-3.5 进行少样本 CoT 演示。在[ScoNe](https://arxiv.org/abs/2305.19426)上取得了最新成果。由[Chris Potts](https://twitter.com/ChrisGPotts/status/1740033519446057077)贡献。 |
| 初学者 | [**本地模型与自定义数据集**](https://github.com/stanfordnlp/dspy/blob/main/skycamp2023.ipynb) | [<img align="center" src="https://colab.research.google.com/assets/colab-badge.svg" />](https://colab.research.google.com/github/stanfordnlp/dspy/blob/main/skycamp2023.ipynb) | 结合展示两个不同内容：如何使用本地模型（特别是 Llama-2-13B）以及如何使用自己的数据示例进行训练和开发。
| 中级 | [**DSPy 论文**](https://arxiv.org/abs/2310.03714) | N/A | DSPy 论文的第 3、5、6 和 7 节可作为教程。包括解释的代码片段、结果以及对抽象和 API 的讨论。
| 中级 | [**DSPy 断言**](https://arxiv.org/abs/2312.13382) | [<img align="center" src="https://colab.research.google.com/assets/colab-badge.svg" />](https://colab.research.google.com/github/stanfordnlp/dspy/blob/main/examples/longformqa/longformqa_assertions.ipynb) | 介绍了在生成带引用的长格式问题回答时应用 DSPy 断言的示例。在零样本和编译设置下进行了比较评估。
| 中级 | [**针对复杂程序的微调**](https://twitter.com/lateinteraction/status/1712135660797317577) | [<img align="center" src="https://colab.research.google.com/assets/colab-badge.svg" />](https://colab.research.google.com/github/stanfordnlp/dspy/blob/main/examples/qa/hotpot/multihop_finetune.ipynb) | 教会本地 T5 模型（770M）在 HotPotQA 上表现出色。仅使用了 200 个标记答案。没有手写提示，没有调用 OpenAI，也没有用于检索或推理的标签。
| 高级 | [**信息提取**](https://twitter.com/KarelDoostrlnck/status/1724991014207930696) | [<img align="center" src="https://colab.research.google.com/assets/colab-badge.svg" />](https://colab.research.google.com/drive/1CpsOiLiLYKeGrhmq579_FmtGsD5uZ3Qe) | 处理从长篇文章（生物医学研究论文）中提取信息的问题。结合上下文学习和检索，实现在BioDEX上的SOTA。由[Karel D’Oosterlinck](https://twitter.com/KarelDoostrlnck/status/1724991014207930696)贡献。 |


## 资源

- [DSPy 在 ScaleByTheBay 2023 年 11 月的演讲](https://www.youtube.com/watch?v=Dt3H2ninoeY)。
- [DSPy 与 MLOps 学习者的网络研讨会](https://www.youtube.com/watch?v=im7bCLW2aM4)，包含问答环节，稍微长一些。
- 社区对 DSPy 的实践概述：[Connor Shorten 解释的 DSPy！](https://www.youtube.com/watch?v=41EfOY0Ldkc)，[code_your_own_ai 解释的 DSPy](https://www.youtube.com/watch?v=ycfnKPxBMck)，[AI Bites 制作的 DSPy 速成课](https://youtu.be/5-zgASQKkKQ?si=3gnmVouT5_rpk_nu)
- 采访：[Weaviate Podcast 线下采访](https://www.youtube.com/watch?v=CDung1LnLbY)，您还可以在 YouTube 上找到其他 6-7 个来自不同角度/受众的远程播客。
- **DSPy 中的追踪**，由 Arize Phoenix 提供：[追踪您的提示和 DSPy 程序步骤的教程](https://colab.research.google.com/github/Arize-ai/phoenix/blob/main/tutorials/tracing/dspy_tracing_tutorial.ipynb)
- **DSPy 中的追踪和优化跟踪**，由 Parea AI 提供：[追踪和评估 DSPy RAG 程序的教程](https://docs.parea.ai/tutorials/dspy-rag-trace-evaluate/tutorial)
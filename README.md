# DSPy 中文文档

## 一、项目简介

>  有人说大语言模型的提示语是一个特别重要的工作，我曾认为提示语是中间产物，未来提示语应该可以自动的生成符合需求的提示语，而发现DSPy就是做的这个工作。

**DSPy 是一个用于算法优化da大语言模提示和权重的框架**，特别是当语言模型在管道中使用一次或多次时。要在不使用 DSPy 的情况下使用语言模型构建复杂系统，通常需要：(1) 将问题分解为步骤，(2) 良好提示您的 LM，直到每个步骤在隔离状态下运行良好，(3) 调整步骤以使其共同运行良好，(4) 生成合成示例来调整每个步骤，并且 (5) 使用这些示例微调较小的语言模型以降低成本。目前，这很困难且混乱：每次更改管道、LM 或数据时，所有提示（或微调步骤）可能都需要更改。

为了使这更加系统化和更加强大，**DSPy** 做了两件事。首先，它将程序的流程（`模块`）与每个步骤的参数（LM 提示和权重）分开。其次，**DSPy** 引入了新的 `优化器`，这些是语言模型驱动的算法，可以调整您的语言模型调用的提示和/或权重，给定您想要最大化的 `度量`。

**DSPy** 可以经常教授强大的模型，如 `GPT-3.5` 或 `GPT-4`，以及本地模型，如 `T5-base` 或 `Llama2-13b`，使其在任务中更加可靠，即具有更高的质量和/或避免特定的失败模式。**DSPy** 优化器将将相同程序编译成不同的指令、少量提示和/或权重更新（微调）用于每个 LM。这是一个新的范式，其中语言模型及其提示淡化为可以从数据中学习的更大系统的可优化部分。**tldr;** 较少提示，更高分数，以及更系统化地解决语言模型难题的方法。

DSPy Github：https://github.com/stanfordnlp/dspy

DSPy 官方文档：https://dspy-docs.vercel.app/

DSPy 论文地址：https://arxiv.org/abs/2310.03714

DSPy 中文文档：http://www.aidoczh.com/docs/dspy/docs/intro , 这是我做的在线中文文档，方便大家查阅。

## 二、翻译内容

翻译了DSPy的在线文档以及他项目样例examples，已经放入项目，您可以去http://www.aidoczh.com/dspy 看已经部署运行的在线版本。

![](https://github.com/aidoczh/dspy-doc-zh/blob/main/static/img/screen1.jpg)



![](https://github.com/aidoczh/dspy-doc-zh/blob/main/static/img/screen2.jpg)



## 三、项目启动

### 1、需要安装yarn

```
# npm的版本大于等于8.15.0 yarn版本大于等于1.22.22
npm install -g yarn 
```

### 2、 Clone 项目到本地

```
git clone https://github.com/aidoczh/dsps-doc-zh.git
```

### 3、安装相关配置工具包

```
cd dspy-doc-zh
yarn
```

### 4、测试启动程序

```
yarn run start
```

### 5、代码编译

```
yarn run docusaurus build
```

### 6、 程序启动

```
npm run serve
```

### 7、文档查看

```
http://localhost:3000
```

##  四、应用示例



| DSPy案例                                                     | 文件说明                                                 |
| ------------------------------------------------------------ | -------------------------------------------------------- |
| [skycamp2023.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/skycamp2023.ipynb) | SkyCamp 2023 的 DSPy 教程                                |
| [intro.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/intro.ipynb) | DSPy: 使用基础模型进行编程                               |
| [knn.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/knn.ipynb) | DSPy KNN few-shot 示例                                   |
| [skycamp2023_completed.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/skycamp2023_completed.ipynb) | SkyCamp 2023 的 DSPy 教程                                |
| [longformqa_assertions.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/longformqa/longformqa_assertions.ipynb) | LongFormQA: 生成长篇长度的回答问题的响应                 |
| [scone.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/nli/scone/scone.ipynb) | 使用 GPT-4 来为 GPT-3.5 启动少样本 CoT 演示              |
| [dataloaders_dolly.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/dataloaders/dataloaders_dolly.ipynb) | 使用 `DataLoader` 进行数据加载                           |
| [quiz_assertions.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/quiz/quiz_assertions.ipynb) | QuizGen: 生成多项选择题问题                              |
| [multi_agent_llama3.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/agents/multi_agent_llama3.ipynb) | 多智能体 DSPy 程序：引导和聚合多个 LLaMa3`ReAct` 智能体  |
| [multi_agent.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/agents/multi_agent.ipynb) | 多智能体 DSPy 程序：引导和聚合多个 GPT-3.5`ReAct` 智能体 |
| [hotpotqa_with_assertions.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/qa/hotpot/hotpotqa_with_assertions.ipynb) | 在 DSPy 中使用断言优化                                   |
| [hotpotqa_with_MIPRO.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/qa/hotpot/hotpotqa_with_MIPRO.ipynb) | 在 DSPy 中使用多阶段指令提案和优化（MIPRO）              |
| [gsm8k_assertions.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/math/gsm8k/gsm8k_assertions.ipynb) | SolveGSM8k: 使用 DSPy 解决小学数学问题                   |
| [CoT.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/math/gsm8k/CoT.ipynb) | SolveGSM8k: 使用 DSPy 解决小学数学问题                   |
| [financial_data_text_to_sql.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/text_to_sql/financial_data_text_to_sql.ipynb) | 使用llama index查询流水线来构建文本到SQL流水线           |
| [qdrant_retriever_example.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/integrations/qdrant/qdrant_retriever_example.ipynb) | 使用 Qdrant 的 DSPy 检索器                               |
| [clarifai_llm_retriever_example.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/integrations/clarifai/clarifai_llm_retriever_example.ipynb) | DSPy-Clarifai lm and retriever示例                       |
| [compiling_langchain.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/tweets/compiling_langchain.ipynb) | DSPy: 从 `LangChain` 编译链                              |
| [tweets_assertions.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/tweets/tweets_assertions.ipynb) | TweetGen: 生成推文以回答问题                             |
| [functional.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/functional/functional.ipynb) | 函数调用                                                 |
| [signature_opt_typed.ipynb](https://nbviewer.org/github/aidoczh/dspy-doc-zh/blob/main/examples/functional/signature_opt_typed.ipynb) | 在DSPy中使用TypedPredictor对象                           |

## 五、公众号

我的公众号是数智笔记，欢迎关注。

![](https://github.com/aidoczh/dspy-doc-zh/blob/main/static/img/qrcode.jpg)
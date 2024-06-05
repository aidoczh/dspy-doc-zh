---
sidebar_position: 2
---

# 语言模型

DSPy 中最强大的功能围绕着算法优化语言模型（LM）的提示（或权重），尤其是当您正在构建使用 LM 的程序时。

首先确保您可以设置您的语言模型。DSPy 支持许多远程和本地 LM 的客户端。

## 设置 LM 客户端

您可以直接调用连接到 LM 的构造函数。然后，使用 `dspy.configure` 将其声明为默认的 LM。

例如，要使用 OpenAI 语言模型，可以按照以下步骤进行。

```python
gpt3_turbo = dspy.OpenAI(model='gpt-3.5-turbo-1106', max_tokens=300)
dspy.configure(lm=gpt3_turbo)
```

## 直接调用 LM

您可以简单地用一个字符串调用 LM，给它一个原始提示，即一个字符串。

```python
gpt3_turbo("hello! this is a raw prompt to GPT-3.5")
```

**输出:**
```text
['Hello! How can I assist you today?']
```

这几乎从不是在 DSPy 中与 LM 交互的推荐方式，但是是允许的。

## 使用带有 DSPy 签名的 LM

您还可以通过 DSPy 的 [`signature`（输入/输出规范）](https://dspy-docs.vercel.app/docs/building-blocks/signatures) 和 [`modules`](https://dspy-docs.vercel.app/docs/building-blocks/modules) 使用 LM，我们将在剩余的指南中更深入地讨论这些内容。

```python
# 定义一个模块（ChainOfThought）并为其分配一个签名（给出一个问题，返回一个答案）。
qa = dspy.ChainOfThought('question -> answer')

# 使用上面用 `dspy.configure` 配置的默认 LM 运行。
response = qa(question="How many floors are in the castle David Gregory inherited?")
print(response.answer)
```
**输出:**
```text
The castle David Gregory inherited has 7 floors.
```

## 同时使用多个 LM

上面的默认 LM 是 GPT-3.5，`gpt3_turbo`。如果我想要用比如说 GPT-4 或 LLama-2 运行一段代码怎么办？

不需要改变默认 LM，您可以在代码块内部直接更改它。

**提示:** 使用 `dspy.configure` 和 `dspy.context` 是线程安全的！

```python
# 使用上面配置的默认 LM，即 GPT-3.5 运行
response = qa(question="How many floors are in the castle David Gregory inherited?")
print('GPT-3.5:', response.answer)

gpt4_turbo = dspy.OpenAI(model='gpt-4-1106-preview', max_tokens=300)

# 改用 GPT-4
with dspy.context(lm=gpt4_turbo):
    response = qa(question="How many floors are in the castle David Gregory inherited?")
    print('GPT-4-turbo:', response.answer)
```
**输出:**
```text
GPT-3.5: The castle David Gregory inherited has 7 floors.
GPT-4-turbo: The number of floors in the castle David Gregory inherited cannot be determined with the information provided.
```

## 小贴士和技巧

在 DSPy 中，所有 LM 调用都被缓存。如果您重复相同的调用，您将获得相同的输出。（如果更改输入或配置，您将获得新的输出。）

要生成 5 个输出，您可以在模块构造函数中使用 `n=5`，或者在调用模块时传递 `config=dict(n=5)`。
```python
qa = dspy.ChainOfThought('问题 -> 回答', n=5)

response = qa(question="大卫·格雷戈里继承的城堡有多少层楼？")
response.completions.answer
```
**输出:**
```text
["大卫·格雷戈里继承的城堡中具体的楼层数量未在此提供，因此需要进一步研究以确定答案。",
    '大卫·格雷戈里继承的城堡有4层楼。',
    '大卫·格雷戈里继承的城堡有5层楼。',
    '大卫·格雷戈里在城堡中继承了10层楼。',
    '大卫·格雷戈里继承的城堡有5层楼。']
```

如果您只是在循环中调用 `qa(...)` 并使用相同的输入，它将始终返回相同的值！这是有意设计的。

要循环并生成一个接一个的输出，可以通过确保每个请求是（稍微）唯一的方式绕过缓存，如下所示。

```python
for idx in range(5):
    response = qa(question="大卫·格雷戈里继承的城堡有多少层楼？", config=dict(temperature=0.7+0.0001*idx))
    print(f'{idx+1}.', response.answer)
```
**输出:**
```text
1. 大卫·格雷戈里继承的城堡中具体的楼层数量未在此提供，因此需要进一步研究以确定答案。
2. 没有特定信息，无法确定大卫·格雷戈里继承的城堡有多少层楼，需要了解城堡的布局和历史。
3. 大卫·格雷戈里继承的城堡有5层楼。
4. 我们需要更多信息才能确定大卫·格雷戈里继承的城堡有多少层楼。
5. 大卫·格雷戈里继承的城堡总共有6层楼。
```

## 远程语言模型

这些模型是托管服务。您只需注册并获取 API 密钥。调用以下任何远程语言模型都假定已进行身份验证，并为设置语言模型提供了以下格式：

```python
lm = dspy.{提供商列表中的名称}(model="您的模型", model_request_kwargs="...")
```

1.  `dspy.OpenAI` 用于 GPT-3.5 和 GPT-4。

2.  `dspy.Cohere`

3.  `dspy.Anyscale` 用于托管的 Llama2 模型。

4.  `dspy.Together` 用于托管各种开源模型。

5.  `dspy.PremAI` 用于托管最佳的开源和闭源模型。

### 本地语言模型

您需要在自己的 GPU 上托管这些模型。以下是如何操作的指南。

1.  `dspy.HFClientTGI`：用于通过文本生成推理（TGI）系统的 HuggingFace 模型。[教程：如何安装和启动 TGI 服务器？](https://dspy-docs.vercel.app/docs/deep-dive/language_model_clients/local_models/HFClientTGI)

```python
tgi_mistral = dspy.HFClientTGI(model="mistralai/Mistral-7B-Instruct-v0.2", port=8080, url="http://localhost")
```

2.  `dspy.HFClientVLLM`：用于通过 vLLM 的 HuggingFace 模型。[教程：如何安装和启动 vLLM 服务器？](https://dspy-docs.vercel.app/docs/deep-dive/language_model_clients/local_models/HFClientVLLM)

```python
vllm_mistral = dspy.HFClientVLLM(model="mistralai/Mistral-7B-Instruct-v0.2", port=8080, url="http://localhost")
```
```
3.  `dspy.HFModel`（实验性）[教程：如何使用 HFModel 初始化模型](https://dspy-docs.vercel.app/api/local_language_model_clients/HFModel)

```python
mistral = dspy.HFModel(model = 'mistralai/Mistral-7B-Instruct-v0.2')
```

4.  `dspy.Ollama`（实验性）用于通过[Ollama](https://ollama.com)获取开源模型。[教程：如何在本地计算机上安装和使用 Ollama？](https://dspy-docs.vercel.app/api/local_language_model_clients/Ollama)\n",

```python
ollama_mistral = dspy.OllamaLocal(model='mistral')
```

5.  `dspy.ChatModuleClient`（实验性）：[如何安装和使用 MLC？](https://dspy-docs.vercel.app/api/local_language_model_clients/MLC)

```python
model = 'dist/prebuilt/mlc-chat-Llama-2-7b-chat-hf-q4f16_1'
model_path = 'dist/prebuilt/lib/Llama-2-7b-chat-hf-q4f16_1-cuda.so'

llama = dspy.ChatModuleClient(model=model, model_path=model_path)
```
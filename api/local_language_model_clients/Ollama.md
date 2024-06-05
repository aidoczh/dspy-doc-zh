# dspy.OllamaLocal

:::note
本文档内容改编自 https://github.com/insop 提供的文档。
:::

Ollama 是一个优秀的软件工具，允许您在本地运行LLMs，比如Mistral、Llama2和Phi。以下是安装和运行Ollama的说明。

### 先决条件

按照以下页面的说明安装Ollama：

- https://ollama.ai

下载模型：`ollama pull`

通过运行`ollama pull`命令来下载模型。您可以下载Mistral、Llama2和Phi。

```bash
# 下载Mistral
ollama pull mistral
```

以下是您可以下载的其他模型列表：
- https://ollama.ai/library

### 运行Ollama模型

运行模型：`ollama run`

通过使用`ollama run`命令来测试一个模型。

```bash
# 运行Mistral
ollama run mistral
```

### 向服务器发送请求

以下是通过Ollama加载模型的代码示例：

```python
lm = dspy.OllamaLocal(model='mistral')
```
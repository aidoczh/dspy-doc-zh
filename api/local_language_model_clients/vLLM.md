# dspy.HFClientVLLM

### 设置 vLLM 服务器

按照以下步骤设置 vLLM 服务器：

1. 按照[源代码构建指南](https://vllm.readthedocs.io/en/latest/getting_started/installation.html#build-from-source)中提供的说明构建服务器。

2. 运行以下命令启动服务器，并使用适当的参数指定所需的模型、主机和端口。默认服务器地址为 http://localhost:8000。

示例命令：

```bash
   python -m vllm.entrypoints.openai.api_server --model mosaicml/mpt-7b --port 8000
```

这将启动 vLLM 服务器。

### 向服务器发送请求

在设置好 vLLM 服务器并确保在运行时显示“Connected”后，您可以使用 `HFClientVLLM` 与其交互。

在程序中使用所需的参数初始化 `HFClientVLLM`。以下是一个示例调用：

```python
   lm = dspy.HFClientVLLM(model="mosaicml/mpt-7b", port=8000, url="http://localhost")
```

根据您的需求自定义 `model`、`port`、`url` 和 `max_tokens`。`model` 参数应设置为您希望使用的特定 Hugging Face 模型 ID。

请参考[官方 vLLM 仓库](https://github.com/vllm-project/vllm)获取更详细的信息和文档。
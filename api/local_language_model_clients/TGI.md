# dspy.HFClientTGI

## 先决条件

- 在您的系统上必须安装 Docker。如果您尚未安装 Docker，可以从[这里](https://docs.docker.com/get-docker/)获取。

## 设置文本生成推理服务器

1. 通过执行以下命令克隆 GitHub 上的 Text-Generation-Inference 仓库：

   ```
   git clone https://github.com/huggingface/text-generation-inference.git
   ```

2. 切换到克隆的仓库目录：

   ```
   cd text-generation-inference
   ```

3. 在“开始”部分下执行 Docker 命令以运行服务器：

   ```
   model=meta-llama/Llama-2-7b-hf # 设置为您希望使用的特定 Hugging Face 模型 ID。
   num_shard=2 # 设置要使用的分片数。
   volume=$PWD/data # 与 Docker 容器共享卷，以避免每次运行都下载权重

   docker run --gpus all --shm-size 1g -p 8080:80 -v $volume:/data ghcr.io/huggingface/text-generation-inference:0.9 --model-id $model --num-shard $num_shard
   ```

   此命令将启动服务器，并使其在 `http://localhost:8080` 上可访问。

如果要连接到[Meta Llama 2 模型](https://huggingface.co/meta-llama)，请确保使用版本 9.3（或更高版本）的 Docker 镜像（ghcr.io/huggingface/text-generation-inference:0.9.3），并将您的 Hugging Face 令牌作为环境变量传入。

```
   docker run --gpus all --shm-size 1g -p 8080:80 -v $volume:/data -e HUGGING_FACE_HUB_TOKEN={your_token} ghcr.io/huggingface/text-generation-inference:0.9.3 --model-id $model --num-shard $num_shard
```

## 向服务器发送请求

设置文本生成推理服务器并确保在运行时显示“Connected”后，您可以使用 `HFClientTGI` 与其进行交互。

在程序中使用所需的参数初始化 `HFClientTGI`。以下是一个示例调用：

   ```python
   lm = dspy.HFClientTGI(model="meta-llama/Llama-2-7b-hf", port=8080, url="http://localhost")
   ```

   根据您的需求自定义 `model`、`port` 和 `url`。`model` 参数应设置为您希望使用的特定 Hugging Face 模型 ID。

### 常见问题解答

1. 如果您的模型不需要任何分片，仍然需要为 `num_shard` 设置一个值，但不需要在命令行中包含参数 `--num-shard`。

2. 如果您的模型遇到任何“token exceeded”问题，可以在命令行上设置以下参数以调整输入长度和令牌限制：
   - `--max-input-length`：设置文本的最大允许输入长度。
   - `--max-total-tokens`：设置文本生成的最大总令牌数。

请参阅[官方 Text-Generation-Inference 仓库](https://github.com/huggingface/text-generation-inference)以获取更详细的信息和文档。
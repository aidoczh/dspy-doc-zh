# dspy.ChatModuleClient

## 先决条件

1. 使用以下命令安装所需的软件包：
   
   ```shell
   pip install --no-deps --pre --force-reinstall mlc-ai-nightly-cu118 mlc-chat-nightly-cu118 -f https://mlc.ai/wheels
   pip install transformers
   git lfs install
   ```
   
   根据 [MLC packages](https://mlc.ai/package/) 中提供的命令，调整 pip wheels 以适应您的操作系统/平台。

## 运行 MLC Llama-2 模型

1. 为预构建模型创建一个目录：

   ```shell
   mkdir -p dist/prebuilt
   ```
   
2. 从仓库克隆必要的库：

   ```shell
   git clone https://github.com/mlc-ai/binary-mlc-llm-libs.git dist/prebuilt/lib
   cd dist/prebuilt
   ```
   
3. 从 [MLC LLMs](https://huggingface.co/mlc-ai) 中选择一个 Llama-2 模型并克隆模型仓库：

   ```shell
   git clone https://huggingface.co/mlc-ai/mlc-chat-Llama-2-7b-chat-hf-q4f16_1
   ```

4. 使用所需参数在程序中初始化 `ChatModuleClient`。以下是一个示例调用：

   ```python
   llama = dspy.ChatModuleClient(model='dist/prebuilt/mlc-chat-Llama-2-7b-chat-hf-q4f16_1', model_path='dist/prebuilt/lib/Llama-2-7b-chat-hf-q4f16_1-cuda.so')
   ```
请参考 [official MLC repository](https://github.com/mlc-ai/mlc-llm) 获取更详细的信息和 [documentation](https://mlc.ai/mlc-llm/docs/get_started/try_out.html)。
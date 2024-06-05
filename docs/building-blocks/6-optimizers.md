---
sidebar_position: 6
---

# 优化器（前身为电子提示器）

**DSPy优化器**是一种算法，可以调整DSPy程序的参数（即提示和/或LM权重），以最大化您指定的指标，如准确性。

DSPy中有许多内置的优化器，采用完全不同的策略。典型的DSPy优化器需要三样东西：

- 您的**DSPy程序**。这可能是一个单一模块（例如`dspy.Predict`）或一个复杂的多模块程序。

- 您的**指标**。这是一个评估您的程序输出的函数，并为其分配一个分数（分数越高越好）。

- 一些**训练输入**。这可能非常少（即只有5或10个示例）且不完整（仅为您的程序提供输入，没有任何标签）。

如果您恰好有大量数据，DSPy可以利用这些数据。但您也可以从小处开始，获得很好的结果。

**注意：** 之前称为**DSPy电子提示器**。我们正在进行官方名称更新，这将在整个库和文档中得到体现。


## **DSPy优化器**调整了什么？它是如何调整它们的？

传统的深度神经网络（DNN）可以通过梯度下降进行优化，给定损失函数和一些训练数据。

DSPy程序由多个LM调用组成，堆叠在一起形成[DSPy模块]。每个DSPy模块都有三种内部参数：（1）LM权重，（2）指令和（3）输入/输出行为的演示。

给定一个指标，DSPy可以使用多阶段优化算法优化这三个参数。这些算法可以结合梯度下降（用于LM权重）和离散的LM驱动优化，即用于制定/更新指令和创建/验证演示。DSPy演示类似于少样本示例，但它们更加强大。它们可以从头开始创建，给定您的程序，并且它们的创建和选择可以以许多有效的方式进行优化。

在许多情况下，我们发现编译会比人类编写更好的提示。并不是因为DSPy优化器比人类更有创造力，而仅仅是因为它们可以更加系统地尝试更多的东西，并直接调整指标。


## 目前有哪些DSPy优化器可用？

<!-- 以下图表是通过以下步骤生成的： -->
<!-- 1. 运行symilar在电子提示器模块上提取Python层次结构作为Graphviz dot文件 -->
<!-- 2. 手动编辑生成的dot文件，删除不是提示器/优化器的类（例如，优化器操作的数据结构类）。 -->
<!-- 3. 使用dot将`.dot`文件编译为PNG -->
<!-- Robert Goldman [2024/05/11:rpg] -->

[电子提示器的子类](figures/teleprompter-classes.png)

所有这些都可以通过`from dspy.teleprompt import *`访问。

#### 自动少样本学习

这些优化器通过自动生成和包含在发送到模型的提示中进行优化的示例，实现了少样本学习的扩展签名。
1. **`LabeledFewShot`**: 从提供的标记输入和输出数据点简单构建少样本示例（演示）。需要 `k`（提示的示例数量）和 `trainset` 来从中随机选择 `k` 个示例。

2. **`BootstrapFewShot`**: 使用一个 `teacher` 模块（默认为您的程序）为程序的每个阶段生成完整的演示，并在 `trainset` 中提供标记示例。参数包括 `max_labeled_demos`（从 `trainset` 中随机选择的演示数量）和 `max_bootstrapped_demos`（`teacher` 生成的额外示例数量）。引导过程使用度量标准验证演示，仅包括通过“编译”提示中的度量标准的演示。高级功能：支持使用一个结构兼容的*不同* DSPy 程序作为 `teacher` 程序，用于更难的任务。

3. **`BootstrapFewShotWithRandomSearch`**: 多次应用 `BootstrapFewShot`，通过随机搜索生成的演示，并在优化过程中选择最佳程序。参数与 `BootstrapFewShot` 相同，另外增加了 `num_candidate_programs`，指定在优化过程中评估的随机程序数量，包括未编译程序的候选程序、经过优化的 `LabeledFewShot` 程序、未混洗示例的 `BootstrapFewShot` 编译程序以及随机示例集的 `num_candidate_programs` `BootstrapFewShot` 编译程序。

4. **`BootstrapFewShotWithOptuna`**: 使用 Optuna 优化在演示集上应用 `BootstrapFewShot`，运行试验以最大化评估指标并选择最佳演示。

5. **`KNNFewShot`**：通过 k-最近邻算法选择演示，从不同簇中选择一组多样化的示例。对示例进行向量化，然后对其进行聚类，使用聚类中心与 `BootstrapFewShot` 一起进行引导/选择过程。当存在大量随机空间数据时，这将有助于优化 `trainset` 以供 `BootstrapFewShot` 使用。查看[此笔记本](https://github.com/stanfordnlp/dspy/blob/main/examples/knn.ipynb) 以获取示例。

#### 自动指令优化

这些优化器为提示生成最佳指令，并在 MIPRO 的情况下还优化少样本演示集。

6. **`COPRO`**: 为每个步骤生成和优化新指令，并使用坐标上升（使用度量函数和 `trainset` 进行爬坡）进行优化。参数包括 `depth`，即优化器运行的提示改进迭代次数。

7. **`MIPRO`**: 在每个步骤生成指令*和*少样本示例。指令生成是数据感知的，并且考虑到演示。使用贝叶斯优化有效地搜索跨您的模块生成指令/演示空间。 

#### 自动微调
这个优化器用于微调底层的LLM(s)。

6. **`BootstrapFinetune`**: 将基于提示的DSPy程序提炼为权重更新（用于较小的LM）。输出是一个DSPy程序，其中每个步骤由一个经过微调的模型执行，而不是由提示的LM执行。

#### 程序转换

8. **`Ensemble`**: 将一组DSPy程序组合在一起，可以使用整个集合或从中随机抽样一个子集组成一个程序。

## 我应该使用哪个优化器？

作为一个经验法则，如果你不知道从哪里开始，可以使用`BootstrapFewShotWithRandomSearch`。

以下是入门的一般指导：

* 如果你的数据很少，例如你的任务有10个示例，使用`BootstrapFewShot`。

* 如果你有稍多一点的数据，例如你的任务有50个示例，使用`BootstrapFewShotWithRandomSearch`。

* 如果你有更多的数据，例如300个示例或更多，使用`MIPRO`。

* 如果你已经能够使用其中一个大型LM（例如7B参数或更多）并且需要一个非常高效的程序，可以将其编译成一个小型LM，使用`BootstrapFinetune`。

## 如何使用优化器？

它们都共享这个通用接口，只是关键字参数（超参数）有所不同。

让我们以最常见的一个为例，`BootstrapFewShotWithRandomSearch`。

```python
from dspy.teleprompt import BootstrapFewShotWithRandomSearch

# 设置优化器：我们想要“引导”（即自动生成）你的程序步骤的8个示例。
# 优化器将在选择其在开发集上的最佳尝试之前重复这个过程10次（加上一些初始尝试）。
config = dict(max_bootstrapped_demos=4, max_labeled_demos=4, num_candidate_programs=10, num_threads=4)

teleprompter = BootstrapFewShotWithRandomSearch(metric=YOUR_METRIC_HERE, **config)
optimized_program = teleprompter.compile(YOUR_PROGRAM_HERE, trainset=YOUR_TRAINSET_HERE)
```

## 保存和加载优化器输出

在通过优化器运行程序之后，将其保存也是很有用的。在以后的某个时间点，可以从文件中加载程序并用于推理。为此，可以使用`load`和`save`方法。

### 保存一个程序

```python
optimized_program.save(YOUR_SAVE_PATH)
```

生成的文件是纯文本JSON格式。它包含源程序中的所有参数和步骤。您可以随时阅读它，看看优化器生成了什么。

### 加载一个程序

要从文件中加载一个程序，可以实例化该类的对象，然后在其上调用load方法。

```python
loaded_program = YOUR_PROGRAM_CLASS()
loaded_program.load(path=YOUR_SAVE_PATH)
```
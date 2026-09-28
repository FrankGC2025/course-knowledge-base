# 因果推断与商业应用

## Chapter 1 Causality: An Introduction

### 课程内容大纲 Contents
1. Causality: An Introduction
2. Causal Diagrams
3. Classical Randomized Experiments
4. Instrumental Variables
5. Propensity Score Matching
6. Regression Discontinuity Design (RDD)
7. Difference in Differences (DiD)
8. Synthetic Control

---

### Causal Inference: Examples
典型的因果推断问题：

| Cause（原因） | Effect（结果） |
|---|---|
| Coffee | Health |
| Ice cream sales | Drown & crime |
| Chocolate | Nobel Prize |
| Pirates | Global warming |
| Marriage | Happiness |
| Ph.D. | Income |
| Police staffing | Crime |

这些例子中，相关性不一定代表因果关系。

---

### The Ladder of Causality（因果阶梯）
因果推断分为三个层次：

#### 1. Association（关联）—— Seeing / Observing
- 问题：变量之间如何相关？看到 X 会如何改变我对 Y 的信念？
- 方法：回归、回归树、随机森林、深度学习等
- 只看相关性

#### 2. Intervention（干预）—— Doing / Intervening
- 问题：如果我做 X，Y 会怎样？如何让 Y 发生？
- 方法：随机实验、因果推断方法论
- 做了什么会影响什么

#### 3. Counterfactuals（反事实）—— Imagining / Reasoning
- 问题：是 X 导致了 Y 吗？如果 X 没有发生会怎样？如果我做了不同选择会怎样？
- 方法：反事实分析、个体异质性分析
- 除了 A，是否还有别的因素会影响 B

---

### Simpson's Paradox（辛普森悖论）

#### 伯克利录取悖论 Berkeley Admission Paradox
- 问题：男性录取率是否更高？是否存在性别歧视？
- 总体来看：男性录取率 68.5%，女性录取率 56.1%
- 但分学院看：每个学院里女性录取率都高于男性
- 原因：女性更倾向于申请录取率低的学院（如法学院），男性更倾向于申请录取率高的学院（如商学院）

#### 数学表达
给定：
$$
\frac{a}{A} > \frac{b}{B}, \quad \frac{c}{C} > \frac{d}{D}
$$
反而可能出现：
$$
\frac{a+c}{A+C} < \frac{b+d}{B+D}
$$

本质上这是 **遗漏变量偏差（omitted variable bias）**！

#### 回归视角看辛普森悖论
- 老年人样本：Cholesterol = 10 - 0.5 × Exercise
- 年轻人样本：Cholesterol = 5 - 0.5 × Exercise
- 全样本错误回归：Cholesterol = 1 + 0.2 × Exercise
- 正确回归：Cholesterol = 5 - 0.5 × Exercise + 5 × Age

加入 Age 后，运动对胆固醇的真实效应才显现出来。

#### 一般形式
$$
E(Y|D=1) - E(Y|D=0) \geq 0
$$
但
$$
E(Y|X, D=1) - E(Y|X, D=0) \leq 0 \quad \forall X
$$

对于每个由 X 刻画的子群体，D 对 Y 的效应符号与一个方向，而对整体人群却呈现相反方向。

#### 例子：素食与寿命
设 X=1 为女性，D=1 为素食者，Y 为寿命：
- 男性效应 = -5：E(Y|X=0, D=0)=65，E(Y|X=0, D=1)=60
- 女性效应 = -5：E(Y|X=1, D=0)=80，E(Y|X=1, D=1)=75
- P(X=1|D=0)=0.2，P(X=1|D=1)=0.7

计算：
$$
E(Y|D=0) = 65 \times 0.8 + 80 \times 0.2 = 68
$$
$$
E(Y|D=1) = 60 \times 0.3 + 75 \times 0.7 = 70.5
$$

对全部人群而言，效应为 2.5（正向）。

- 性别与治疗不独立，因此是 **confounder（混杂因子）**。

---

### Regression: Overview（回归概述）

#### 回归方程
$$
y_i = \beta_0 + x_i \beta_1 + \epsilon_i, \quad Y = X\beta + \epsilon
$$

#### OLS 估计量
$$
\hat{\beta}_1 = \frac{\sum_{i=1}^N (x_i - \bar{x})(y_i - \bar{y})}{\sum_{i=1}^N (x_i - \bar{x})^2}, \quad \hat{\beta} = (X'X)^{-1}X'Y
$$

#### 回归注意事项
- **ceteris paribus**：控制其他变量不变
- **log value**：对数值
- **interaction term**：交叉项
- **significance**：显著性
- **omitted variable bias**：遗漏变量偏误（Confounding factor 混杂因子）
- **heteroskedasticity**：异方差（干扰项方差不同，OLS 估计量仍然一致，但方差估计需要做 robust）

#### 条件期望函数 CEF
假设 X 是随机变量，可以用条件期望函数总结 X 对 Y 的预测能力：
$$
E(y_i | X = x_i)
$$

#### 迭代期望定律
$$
E(y_i) = E[E(y_i | x_i)]
$$

#### CEF 分解性质
$$
Y_i = E(Y_i | x_i) + \epsilon_i
$$

#### CEF 预测性质
对任意 Xi 的函数 m(xi)，CEF 最小化：
$$
E(Y_i | X_i) = \arg\min_{m(X_i)} E[(Y_i - m(X_i))^2]
$$

#### ANOVA 定理
$$
V(Y_i) = V(E[Y_i | X_i]) + E[V(Y_i | X_i)]
$$

#### 回归的三大理论基础
1. **线性 CEF 定理**：若 CEF 是线性的，则总体回归函数就是它。
2. **最佳线性预测定理**：Xi'β 是 Yi 给定 Xi 的最小均方误差线性预测。
3. **回归 CEF 定理**：Xi'β 提供了 E(Yi | Xi) 的最小均方误差线性近似：
$$
\beta = \arg\min_b E[(E[Y_i | X_i] - X_i' b)^2]
$$

---

### Treatment Effect（处理效应）

#### 基本设定
- D：二元处理变量，D=1 表示接受处理，D=0 表示未接受处理
- Y：结果变量
- Yi：个体 i 的可观测结果
$$
Y_i = Y_i(0) + D_i \cdot [Y_i(1) - Y_i(0)]
$$

#### 个体处理效应 TE
$$
TE_i = Y_i(1) - Y_i(0)
$$

#### 平均处理效应 ATE（Average Treatment Effect）
$$
\tau_{ATE} = E[Y_i(1) - Y_i(0)] = E[Y_i(1)] - E[Y_i(0)]
$$

#### 分位数处理效应 QTE（Quantile Treatment Effect）
$$
\tau_{QTE} = Med[Y_i(1) - Y_i(0)] \neq Med[Y_i(1)] - Med[Y_i(0)]
$$
分位数不具备直接可分性。

#### 处理组平均处理效应 ATET
$$
\tau_{ATET} = E[Y_i(1) - Y_i(0) | D_i=1] = E[Y_i(1) | D_i=1] - E[Y_i(0) | D_i=1]
$$
其中 E[Yi(0) | Di=1] 无法直接观测到。

#### 未处理组平均处理效应 ATENT
$$
\tau_{ATENT} = E[Y_i(1) - Y_i(0) | D_i=0] = E[Y_i(1) | D_i=0] - E[Y_i(0) | D_i=0]
$$

#### ATE 的加权表达
$$
\tau_{ATET} \cdot P(D_i=1) + \tau_{ATENT} \cdot P(D_i=0) = \tau_{ATE}
$$

给定可观测协变量 X，还可以定义条件处理效应：
$$
\tau_{ATE}(x) = E[Y_i(1) - Y_i(0) | X=x]
$$
$$
\tau_{ATET}(x) = E[Y_i(1) - Y_i(0) | D_i=1, X=x]
$$
$$
\tau_{ATENT}(x) = E[Y_i(1) - Y_i(0) | D_i=0, X=x]
$$

---

### Group-Mean Difference and Mean Effect（组间均值差异与平均效应）

若潜在结果均值独立于处理分配：
$$
E[Y_i(d) | D_i] = E[Y_i(d)]
$$
即：
$$
E[Y_i(d) | D_i=1] = E[Y_i(d) | D_i=0], \quad d=0,1
$$

在此独立性假设下，组间均值差异就等于平均处理效应：
$$
\begin{aligned}
E[Y_i | D_i=1] - E[Y_i | D_i=0]
&= E[Y_i(1) | D_i=1] - E[Y_i(0) | D_i=0] \\
&= E[Y_i(1)] - E[Y_i(0)] \\
&= E[Y_i(1) - Y_i(0)] = \tau_{ATE}
\end{aligned}
$$

如果随机分组，分到实验组或控制组不会影响潜在结果。

---

### Regression and Causality（回归与因果）

#### Conditional Independence Assumption（CIA，也称 selection on observables）
$$
Y_i(d) \perp D_i | X_i
$$
其中 Xi 是包含可观测协变量的向量。

CIA 意味着：一旦分析师把影响样本选择的因素考虑进去（或控制住），随机化的条件就恢复了。

#### Conditional Mean Independence（CMI，条件均值独立）
$$
E(Y_1 | X, D) = E(Y_1 | X)
$$
$$
E(Y_0 | X, D) = E(Y_0 | X)
$$

CMI 是 ATE、ATET、ATENT 的一致估计基础，它只限制均值层面的独立性。

#### 观测差异分解
以是否上大学为例：
$$
E[Y_i | C_i=1] - E[Y_i | C_i=0] = \underbrace{E[Y_{1i} - Y_{0i} | C_i=1]}_{\text{ATET}} + \underbrace{E[Y_{0i} | C_i=1] - E[Y_{0i} | C_i=0]}_{\text{Selection bias}}
$$

CIA 断言：在控制可观测特征后，选择偏误消失：
$$
\{Y_{0i}, Y_{1i}\} \perp C_i | X_i
$$
因此：
$$
E[Y_i | X_i, C_i=1] - E[Y_i | X_i, C_i=0] = E[Y_{1i} - Y_{0i} | X_i]
$$

把会导致 selection bias 的变量潜在地都控制住后，就没有了；但问题是，找到所有这些变量不容易。

---

### OLS Estimator and Endogeneity（OLS 估计量与内生性）

内生性会导致 OLS 估计量有偏。

#### Endogeneity 内生性
解释变量与误差项相关。

#### 内生性来源
- **Omitted variables**：遗漏变量
- **Measurement error of explanatory variables**：解释变量测量误差
- **Reciprocal causation**：双向因果

---

### The Rationale for Choosing Control Variables（控制变量选择逻辑）

是否控制某个协变量 X，取决于 X（潜在混杂因子）、D（处理变量）、Y（结果变量）之间假设的因果联系。

#### 情形 1-3：处理前变量（pretreatment x）
- **Case 1**：X 不影响 D 和 Y，不需要控制 X。
- **Case 2**：X 同时影响 D 和 Y，必须控制 X。
- **Case 3**：X 受 D 影响但不影响 Y，不需要控制 X。

结论：只有当 X 同时影响 D 和 Y 时，才需要控制 X。

#### 情形 4-6：处理后变量（posttreatment x）
- **Case 4**：需要控制预处理 X，但不需要控制处理后 X。
- **Case 5a**：控制处理后 X 不需要。
- **Case 5b**：控制处理后 X 会移除 D 对 Y 的部分或全部效应。
- **Case 6**：估计 D 对 Y 的直接效应时必须控制 X；估计总效应时不需要控制 X。

---

### Selection on Observables and Unobservables

#### Selection on observables（基于可观测变量的选择）
对某些可观测变量 X，Y(d) 与 D 不独立，但给定 X 后独立：
$$
Y_i(d) \perp D_i | X_i
$$
一旦控制了 X，D 就与潜在结果 Y(d) 独立。

在均值层面：
$$
E(Y_d | D, X) = E(Y_d | X)
$$

#### Selection on unobservables（基于不可观测变量的选择）
对某些不可观测变量 ε，给定 X 后 Y(d) 与 D 仍不独立，但给定 (X, ε) 后独立：
$$
Y_i(d) \perp D_i | X_i, \epsilon_i
$$

但实际数据中只有 X，因此需要用工具变量、双重差分等方法处理。

---

### Linear Models and Biases（线性模型与偏误分解）

假设潜在结果由以下模型生成：
$$
Y_i^d = \alpha_d + X_i' \beta_d + U_i^d, \quad E(U|X)=0, \quad d=0,1
$$

#### 期望处理效应
$$
E(Y_1 - Y_0) = \alpha_1 - \alpha_0 + E(X')(\beta_1 - \beta_0) + E(U_1 - U_0) = \alpha_1 - \alpha_0 + E(X')(\beta_1 - \beta_0)
$$

#### 组间均值差异
$$
\begin{aligned}
E(Y|D=1) - E(Y|D=0)
&= \alpha_1 - \alpha_0 + E(X'|D=1)\beta_1 - E(X'|D=0)\beta_0 \\
&\quad + E(U'|D=1) - E(U'|D=0)
\end{aligned}
$$

#### 分解
$$
\underbrace{\alpha_1 - \alpha_0 + E(X)'(\beta_1 - \beta_0)}_{\text{desired effect}}
+ \underbrace{\{E(X|D=1) - E(X)\}'\beta_1 - \{E(X|D=0) - E(X)\}'\beta_0}_{\text{overt bias}}
+ \underbrace{E(U'|D=1) - E(U'|D=0)}_{\text{hidden bias}}
$$

- U 为不可观测因素。

---

### Causal Inference Methodology（因果推断方法论概览）

#### Selection on observables
- Regression adjustment（回归调整）
- Matching（匹配）
- Propensity score matching（倾向得分匹配）
- Doubly robust estimation（双重稳健估计）
- Sharp RDD（清晰断点回归）
- Stratification / subclassification（分层）

#### Selection on unobservables
- Instrumental variable（工具变量）
- Difference-in-differences（双重差分）
- Panel estimators, synthetic control, event studies（面板估计、合成控制、事件研究）
- Fuzzy RDD（模糊断点回归）
- Heckman selection model（Heckman 选择模型）

---

### Kernel Density Estimator（核密度估计）

核密度估计基于平滑加权思想：
$$
\hat{f}(x) = \frac{1}{Nh} \sum_{i=1}^N K\left(\frac{X_i - x}{h}\right)
$$

- K：核函数，关于 0 对称的光滑多元密度，如 N(0, I_k) 密度
- h：带宽（bandwidth）或平滑参数，类似于直方图的区间宽度

#### 常用核函数
- **Uniform kernel**：K(z) = 1[|z|<1] / 2
- **N(0,1) kernel**：φ(·) = (2π)^(-1/2) exp{-(·)^2/2}
- **Trimmed quadratic / Epanechnikov kernel**：K(z) = (3/4)(1-z^2) · 1[|z|<1]
- **Quartic / biweight kernel**：K(z) = (15/16)(1-z^2)^2 · 1[|z|<1]

---

### Kernel Regression Estimator（核回归估计）

模型：
$$
Y_i = \mu(X_i) + U_i, \quad E(U|X)=0 \iff E(Y|X) = \mu(X)
$$

核回归估计量：
$$
\hat{\mu}(x) = \frac{\hat{g}(x)}{\hat{f}(x)} = \frac{(Nh^d)^{-1} \sum_i K\left(\frac{X_i - x}{h}\right) Y_i}{(Nh^d)^{-1} \sum_i K\left(\frac{X_i - x}{h}\right)} = \sum_i \frac{K\left(\frac{X_i - x}{h}\right)}{\sum_j K\left(\frac{X_j - x}{h}\right)} Y_i
$$

这是 Yi 的加权平均，权重取决于 Xi 与 x 的距离。

可以证明：
$$
\hat{f}(x) \xrightarrow{p} f(x), \quad \hat{g}(x) \xrightarrow{p} E(Y|X=x) \cdot f(x)
$$
因此：
$$
\hat{\mu}(x) \xrightarrow{p} \mu(x)
$$

---

### Local Linear Regression（局部线性回归）

局部线性回归相当于在泰勒展开中多展开一级，目的都是为了计算 CEF。

通过最小化以下目标函数得到 a 和 b：
$$
\sum_i \left\{Y_i - a - b(X_i - x)\right\}^2 \cdot K\left(\frac{X_i - x}{h}\right)
$$

局部线性回归估计量：
$$
\hat{a}(x) = (1, 0_{1 \times k}) \cdot \{X(x)' W(x) X(x)\}^{-1} \cdot \{X(x)' W(x) Y\}
$$

其中：
$$
Y = (Y_1, \ldots, Y_N)', \quad W(x) = \text{diag}\left\{K\left(\frac{X_1 - x}{h}\right), \ldots, K\left(\frac{X_N - x}{h}\right)\right\}
$$
$$
X(x) = N \times (1+k) \text{ 矩阵，第 } i \text{ 行为 } (1, (X_i - x)')
$$

截距估计量 a(x) 是 μ(x) 的 LLR 估计量，斜率估计量 b(x) 是 ∂μ(x)/∂x 的估计量。

与普通核回归（局部常数回归 LCR）相比，LLR 偏差更小但方差更大，这是经典的 bias-variance trade-off。LLR 在 X 支撑集边界点和 E(Y|X=x) 的峰谷处优势明显。

---

### Key Takeaways
- 相关不等于因果，因果推断需要识别策略。
- Simpson's Paradox 揭示了分组分析与整体分析可能得出相反结论，根源在于混杂因子。
- OLS 和回归是预测工具，要用于因果推断需要满足 CIA/CMI 等假设。
- 处理效应的核心是潜在结果框架，ATE / ATET / ATENT 各有应用场景。
- 内生性（遗漏变量、测量误差、双向因果）会破坏 OLS 的因果解释。
- 控制变量选择必须基于因果图判断，不能盲目加入所有变量。
- 因果推断方法论分为基于可观测变量选择和基于不可观测变量选择两大类。
- 非参数方法（核密度、核回归、局部线性回归）为估计条件期望函数提供了灵活工具。

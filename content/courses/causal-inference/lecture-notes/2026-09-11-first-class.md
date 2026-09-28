# 因果推断与商业应用

### 课程内容大纲 Contents
- Causality: An introduction
- Causal Diagrams
- Classical Randomized Experiments
- Instrumental Variables
- Propensity Score Matching
- Regression Discontinuity Design (RDD)
- Difference in Differences
- Synthetic Control

#### 随机实验 Random Experient:
- 随机实验是最完美的。
- 要求：样本量足够大 + 随机分组

#### IV
- Local Average Treatment Effect (ATE)
- Always-taker, Never-taker, Complier

### Propensity Score of Matching
Propensity Score Matching (PSM) is a statistical technique used to reduce selection bias in observational studies by matching individuals from treatment and control groups based on similar characteristics. It aims to simulate the conditions of a randomized experiment by balancing covariates between groups.
- Probit, Logit model

A propensity score is the probability of an individual receiving treatment given a set of observed covariates. Mathematically, it is defined as:

e(X) = P(T = 1 | X)
Copy
Where:

T = 1 indicates the treatment group.

X represents the observed covariates.

e(X) is the propensity score.

### Regression Discontinuity Design (断点回归)

### DiD
- Difference in Differences
- DiDiD

### Synthetic Control

### 任务要求：
每周给2-3篇文章，基于文章进行提问和完成结果复现。

## Chapter 1 Causality: An introduction
**Film:** Run Lola Run. -- Potential Outcome

Causal Inference: Examples

Cause ->        Effect
Coffee          Health
Ice cream sales Drown & crime
Chocolate       Nobel Prize
Police staffing Crime

#### Simpson's Paradox
Given that:
$$
a/A > b/B, 
c/C > d/D
$$
反而出现了：
$$
(a+c)/(A+C) < (b+d)/(B+D)
$$
In essence, this is due to omitted variable bias!

$$
E(Y|D=1) - E(Y|D=0) > 0
$$
but 
$$
E(Y|X,D=1) - E(Y|X,D=0) < 0
$$
for each popolation characterized by $X$, the "effect" of $D$ on $Y$ takes one sign, while it takes the opposite sign for the whole population!

- Example:
Suppose for $X=1$ for female, $D=1$ for vegetarian, $Y$ is life span

Effect for male = -5; 

$E(Y|X=0, D=0) = 65$, $E(Y|X=0, D=1) = 60$

Effect for female = -5; 

$E(Y|X = 1, D = 0) = 80$, $E(Y|X=1, D=1) = 75$

$$
P(X=1|D=0) = 0.2, \space P(X=1|D=1) = 0.7
$$

The effect on overall population is 2.5 (positive).

Gender is not independent with treatment, thus is a confounder (confounding factor 混杂因子).

#### Linear regression model
Regression equation, i.e.,
$$
y_i = \beta_0 + x_i\beta_1 + \epsilon_i, \space Y = X\beta + \epsilon
$$
OLS estimator, i.e.,
$$
\hat{\beta}_i = \frac{\Sigma_{i=1}^N(x_i - \bar{x})(y_i - \bar{y})}{\Sigma_{i=1}^N(x_i - \bar{x})^2}, \space \hat{\beta} = (X'X)^{-1}X'Y
$$
- ceteris paribus;
- log value;
- interaction term;
- significance;
- omitted variable bias: Confounding factor混杂因子;
- heteroskedasticity: 异方差;

Assume $X$ is a random variable.

We can summarize the predictive powe rof $X$ on $Y$, by:
$$E(y_i|X = x_i)$$

The law of iteracted expectation
$$E(y_i) = E(E(y_i|x_i))$$
CEF decomposition property
$$Y_i = E(Y_i|x_i) + \epsilon_i$$

#### Average Treatment Effect (ATE)
$$\tau_{ATE} = E_p(Y_i(1) - Y_i(0))$$

Conditional Independence Assumption(CIA, also called secltion on observables.)

Observed difference in earnings = Average treatment effect on the treated + selection bias

把会导致selction bias的变量，潜在的都control住后，就没有了；但是问题是，找到所有的这些变量不容易。


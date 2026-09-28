---
title: 每日选做题单汇总
---

# 每日选做题单汇总

本页整理课程提供的两份 OpenJudge / LeetCode 每日选做题单：

- `pre_problem_list_2025spring.md`：寒假预习题单
- `problem_list_2025spring.md`：学期内每日练习题单

为便于复习，下面按**主题**聚合代表性题目。若需要查看完整题单，可前往本地文件：

- `D:\Frank\Academic\大四上\data_structure\pre_problem_list_2025spring.md`
- `D:\Frank\Academic\大四上\data_structure\problem_list_2025spring.md`

## 复习建议

- 优先刷标注为"必须会"和 Medium 难度的题目。
- 同一类题集中练习，掌握模板后再跨主题混合。
- 上机考试重点考察"识别算法框架"，所以每道题做完后要能说出用了什么数据结构/算法。

---

## 1. 链表与指针

| 题号 | 名称 | 标签 | 难度 | 链接 |
|------|------|------|------|------|
| 20 | 删除链表元素 | linked-list | - | [OpenJudge](http://dsbpython.openjudge.cn/dspythonbook/P0020/) |
| 206 | 反转链表 | linked-list | Easy | [LeetCode](https://leetcode.cn/problems/reverse-linked-list/) |
| 234 | 回文链表 | linked-list, two pointers | Easy | [LeetCode](https://leetcode.cn/problems/palindrome-linked-list/) |
| 19 | 删除链表的倒数第 N 个结点 | linked-list, two pointers | Medium | [LeetCode](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/) |
| 25 | K 个一组翻转链表 | linked list | Tough | [LeetCode](https://leetcode.cn/problems/reverse-nodes-in-k-group/) |
| 23 | 合并 K 个升序链表 | merge sort, linked list | Tough | [LeetCode](https://leetcode.cn/problems/merge-k-sorted-lists/) |
| 146 | LRU 缓存 | hash table, doubly-linked list | Medium | [LeetCode](https://leetcode.cn/problems/lru-cache/) |

### 核心技巧

- 反转链表：三指针迭代或递归。
- 倒数第 N 个：快慢指针。
- 回文链表：快慢指针找中点 + 反转后半部分 + 比较。

---

## 2. 栈与队列

| 题号 | 名称 | 标签 | 难度 | 链接 |
|------|------|------|------|------|
| sy294 | 合法的出栈序列 | stack | Easy | [sunnywhy](https://sunnywhy.com/sfbj/7/1/294) |
| sy295 | 可能的出栈序列 | stack | Medium | [sunnywhy](https://sunnywhy.com/sfbj/7/1/295) |
| 03704 | 括号匹配问题 | stack | 必须会 | [OpenJudge](http://cs101.openjudge.cn/25dsapre/03704) |
| 02734 | 十进制到八进制 | stack | Easy | [OpenJudge](http://cs101.openjudge.cn/25dsapre/02734/) |
| 24591 | 中序表达式转后序表达式 | stack | 必须会 | [OpenJudge](http://cs101.openjudge.cn/practice/24591/) |
| 155 | 最小栈 | OOP, 辅助栈 | Medium | [LeetCode](https://leetcode.cn/problems/min-stack/) |
| 04137 | 最小新整数 | monotonous-stack | - | [OpenJudge](http://cs101.openjudge.cn/25dsapre/04137/) |
| 05902 | 双端队列 | queue | - | [OpenJudge](http://cs101.openjudge.cn/practice/05902/) |
| 02746 | 约瑟夫问题 | queue | - | [OpenJudge](http://cs101.openjudge.cn/25dsapre/02746/) |

### 核心技巧

- 出栈序列合法性：用栈模拟。
- 中缀转后缀 / 后缀求值：栈的经典应用。
- 单调栈：维护递增/递减序列，处理"下一个更大/更小元素"类问题。

---

## 3. 字符串与 KMP

| 题号 | 名称 | 标签 | 难度 | 链接 |
|------|------|------|------|------|
| 01961 | 前缀中的周期 | KMP | Tough | [OpenJudge](http://cs101.openjudge.cn/25dsapre/01961/) |
| 14 | 最长公共前缀 | Trie | 必须会 | [LeetCode](https://leetcode.cn/problems/longest-common-prefix/) |
| 01760 | Disk Tree | Trie | - | [OpenJudge](http://cs101.openjudge.cn/25dsapre/01760/) |
| 208 | 实现 Trie（前缀树） | OOP, hash table | Medium | [LeetCode](https://leetcode.cn/problems/implement-trie-prefix-tree/) |
| 5 | 最长回文子串 | dp, two pointers, Manacher | Medium | [LeetCode](https://leetcode.cn/problems/longest-palindromic-substring/) |

### 核心技巧

- KMP：手写 `next` 数组是笔试重点。
- Trie：前缀匹配、字符串集合查询。

---

## 4. 二叉树

| 题号 | 名称 | 标签 | 难度 | 链接 |
|------|------|------|------|------|
| 104 | 二叉树的最大深度 | tree, dfs | Easy | [LeetCode](https://leetcode.cn/problems/maximum-depth-of-binary-tree/) |
| 94 | 二叉树的中序遍历 | tree | Easy | [LeetCode](https://leetcode.cn/problems/binary-tree-inorder-traversal/) |
| 226 | 翻转二叉树 | tree | Easy | [LeetCode](https://leetcode.cn/problems/invert-binary-tree/) |
| 101 | 对称二叉树 | tree | Easy | [LeetCode](https://leetcode.cn/problems/symmetric-tree/) |
| 199 | 二叉树的右视图 | bfs | Medium | [LeetCode](https://leetcode.cn/problems/binary-tree-right-side-view/) |
| 105 | 从前序与中序遍历序列构造二叉树 | tree | Medium | [LeetCode](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) |
| 22158 | 根据二叉树前中序序列建树 | tree | 必须会 | [OpenJudge](http://cs101.openjudge.cn/practice/22158/) |
| 24750 | 根据二叉树中后序序列建树 | tree | 必须会 | [OpenJudge](http://cs101.openjudge.cn/practice/24750/) |
| 98 | 验证二叉搜索树 | dfs | Medium | [LeetCode](https://leetcode.cn/problems/validate-binary-search-tree/) |
| 236 | 二叉树的最近公共祖先 | dfs | Medium | [LeetCode](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/) |
| 22161 | 哈夫曼编码树 | greedy | Tough | [OpenJudge](http://cs101.openjudge.cn/practice/22161/) |

### 核心技巧

- 遍历：前序、中序、后序、层序。
- 重建：前序 + 中序、中序 + 后序。
- BST 性质：中序有序，用于验证和搜索。

---

## 5. 图论基础

| 题号 | 名称 | 标签 | 难度 | 链接 |
|------|------|------|------|------|
| sy376 | 无向图的邻接矩阵 | graph | Easy | [sunnywhy](https://sunnywhy.com/sfbj/10/2/376) |
| sy377 | 有向图的邻接矩阵 | graph | Easy | [sunnywhy](https://sunnywhy.com/sfbj/10/2/377) |
| sy378 | 无向图的邻接表 | graph | - | [sunnywhy](https://sunnywhy.com/sfbj/10/2/378) |
| sy379 | 有向图的邻接表 | graph | - | [sunnywhy](https://sunnywhy.com/sfbj/10/2/379) |
| 27635 | 判断无向图是否连通有无回路 | dfs, union-find | 必须会 | [OpenJudge](http://cs101.openjudge.cn/practice/27635/) |
| 28046 | 词梯 | bfs | Tough | [OpenJudge](http://cs101.openjudge.cn/25dsapre/28046/) |
| 05443 | 兔子与樱花 | Dijkstra, Floyd-Warshall | 必须会 | [OpenJudge](http://cs101.openjudge.cn/25dsapre/05443/) |
| 05442 | 兔子与星空 | prim, kruskal | 必须会 | [OpenJudge](http://cs101.openjudge.cn/25dsapre/05442/) |
| 20106 | 走山路 | Dijkstra | 必须会 | [OpenJudge](http://cs101.openjudge.cn/25dsapre/20106/) |
| 09202 | 舰队、海域出击！ | topological order | 必须会 | [OpenJudge](http://cs101.openjudge.cn/practice/09202/) |
| 210 | 课程表 II | topological sort | Medium | [LeetCode](https://leetcode.cn/problems/course-schedule-ii/) |
| 547 | 省份数量 | dfs, disjoint set | Medium | [LeetCode](https://leetcode.cn/problems/number-of-provinces/) |

### 核心技巧

- 图存储：邻接矩阵 vs 邻接表。
- 遍历：BFS、DFS。
- 最短路：Dijkstra（非负权）、Floyd（多源）、Bellman-Ford（负权）。
- 最小生成树：Prim、Kruskal。
- 拓扑排序：Kahn 算法 / DFS 后序逆序。

---

## 6. 并查集

| 题号 | 名称 | 标签 | 难度 | 链接 |
|------|------|------|------|------|
| 02524 | 宗教信仰 | disjoint set | 必须会 | [OpenJudge](http://cs101.openjudge.cn/dsapre/02524/) |
| 01703 | 发现它，抓住它 | disjoint set | - | [OpenJudge](http://cs101.openjudge.cn/25dsapre/01703/) |
| 01611 | The Suspects | disjoint set | - | [OpenJudge](http://cs101.openjudge.cn/practice/01611/) |
| 01182 | 食物链 | disjoint set | Tough | [OpenJudge](http://cs101.openjudge.cn/practice/01182) |
| 827 | 最大人工岛 | disjoint set | Tough | [LeetCode](https://leetcode.cn/problems/making-a-large-island/) |

### 核心技巧

- 路径压缩 + 按秩合并保证近似 $O(\alpha(n))$。
- 带权并查集（食物链类问题）。

---

## 7. 堆与 Trie

| 题号 | 名称 | 标签 | 难度 | 链接 |
|------|------|------|------|------|
| 04078 | 实现堆结构 | implementation | 必须会 | [OpenJudge](http://cs101.openjudge.cn/25dsapre/04078/) |
| 06648 | Sequence | heap | Tough | [OpenJudge](http://cs101.openjudge.cn/25dsapre/06648/) |
| 295 | 数据流的中位数 | OOP, heap | Medium | [LeetCode](https://leetcode.cn/problems/find-median-from-data-stream/) |
| 3478 | 选出和最大的 K 个元素 | heap | Medium | [LeetCode](https://leetcode.cn/problems/choose-k-elements-with-maximum-sum/) |
| 208 | 实现 Trie(前缀树) | OOP, hash table | Medium | [LeetCode](https://leetcode.cn/problems/implement-trie-prefix-tree/) |
| 01760 | Disk Tree | Trie | - | [OpenJudge](http://cs101.openjudge.cn/25dsapre/01760/) |

### 核心技巧

- 堆：向下调整、向上调整、建堆 $O(n)$、堆排序。
- Trie：节点按字符分叉，适合前缀查询。

---

## 8. 排序与二分

| 题号 | 名称 | 标签 | 难度 | 链接 |
|------|------|------|------|------|
| 02299 | Ultra-QuickSort | merge sort | Tough | [OpenJudge](http://cs101.openjudge.cn/25dsapre/02299/) |
| 75 | 颜色分类 | three pointers | Medium | [LeetCode](https://leetcode.cn/problems/sort-colors/) |
| 35 | 搜索插入位置 | binary search | Easy | [LeetCode](https://leetcode.cn/problems/search-insert-position/) |
| 02456 | Aggressive cows | binary + greedy | Medium | [OpenJudge](http://cs101.openjudge.cn/25dsapre/02456/) |
| 08210 | 河中跳房子 | binary search + greedy | Medium | [OpenJudge](http://cs101.openjudge.cn/25dsapre/08210) |
| 4 | 寻找两个正序数组的中位数 | 分治, 二分查找 | Tough | [LeetCode](https://leetcode.cn/problems/median-of-two-sorted-arrays/) |
| 240 | 搜索二维矩阵 II | binary search | Medium | [LeetCode](https://leetcode.cn/problems/search-a-2d-matrix-ii/) |

### 核心技巧

- 归并排序：逆序对计数常用。
- 二分：明确边界、循环不变量。
- 快速选择 / 第 K 大元素。

---

## 9. 动态规划

| 题号 | 名称 | 标签 | 难度 | 链接 |
|------|------|------|------|------|
| 118 | 杨辉三角 | dp | Easy | [LeetCode](https://leetcode.cn/problems/pascals-triangle/) |
| 121 | 买卖股票的最佳时机 | dp | Easy | [LeetCode](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/) |
| 01088 | 滑雪 | dp | Medium | [OpenJudge](http://cs101.openjudge.cn/25dsapre/01088) |
| 337 | 打家劫舍 III | tree dp | Medium | [LeetCode](https://leetcode.cn/problems/house-robber-iii/) |
| 123 | 3095 | 或值至少 K 的最短子数组 I | 滑动窗口 | - | [LeetCode](https://leetcode.cn/problems/shortest-subarray-with-or-at-least-k-i/) |
| 5 | 最长回文子串 | dp, two pointers | Medium | [LeetCode](https://leetcode.cn/problems/longest-palindromic-substring/) |

### 核心技巧

- 状态定义、状态转移、初始化、遍历顺序。
- 树形 DP：后序遍历收集子树信息。

---

## 10. 回溯与搜索

| 题号 | 名称 | 标签 | 难度 | 链接 |
|------|------|------|------|------|
| 01321 | 棋盘问题 | backtracking | - | [OpenJudge](http://cs101.openjudge.cn/25dsapre/01321/) |
| 04123 | 马走日 | backtracking | 必须会 | [OpenJudge](http://cs101.openjudge.cn/25dsapre/04123/) |
| 02488 | A Knight's Journey | backtracking | Tough | [OpenJudge](http://cs101.openjudge.cn/25dsapre/02488/) |
| 37 | 解数独 | backtracking, set | Tough | [LeetCode](https://leetcode.cn/problems/sudoku-solver/) |
| 46 | 全排列 | backtracking | Medium | [LeetCode](https://leetcode.cn/problems/permutations/) |
| 78 | 子集 | backtracking | Medium | [LeetCode](https://leetcode.cn/problems/subsets/) |

### 核心技巧

- 回溯 = 深度优先搜索 + 状态恢复。
- 剪枝：提前终止不可能的分支。

---

## 11. 贪心与滑动窗口

| 题号 | 名称 | 标签 | 难度 | 链接 |
|------|------|------|------|------|
| 01328 | Radar Installation | greedy | Medium | [OpenJudge](http://cs101.openjudge.cn/25dsapre/01328/) |
| 56 | 合并区间 | greedy | Easy | [LeetCode](https://leetcode.cn/problems/merge-intervals/) |
| 781 | 森林中的兔子 | greedy | Medium | [LeetCode](https://leetcode.cn/problems/rabbits-in-forest/) |
| 11 | 盛最多水的容器 | greedy, two pointers | Medium | [LeetCode](https://leetcode.cn/problems/container-with-most-water/) |
| 2799 | 统计完全子数组的数目 | hash table, sliding window | Medium | [LeetCode](https://leetcode.cn/problems/count-complete-subarrays-in-an-array/) |
| 2962 | 统计最大元素出现至少 K 次的子数组 | sliding window | Medium | [LeetCode](https://leetcode.cn/problems/count-subarrays-where-max-element-appears-at-least-k-times/) |

### 核心技巧

- 贪心：证明最优性通常是难点，考试中多为直观贪心。
- 滑动窗口：维护窗口内统计信息，根据条件收缩左边界。

---

## 完整题单位置

如需按日期顺序查看全部题目，请参考本地文件：

- `D:\Frank\Academic\大四上\data_structure\pre_problem_list_2025spring.md`
- `D:\Frank\Academic\大四上\data_structure\problem_list_2025spring.md`

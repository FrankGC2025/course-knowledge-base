---
title: 2026-09-14 线性表
---

# 线性表

## 1. 回顾：时空权衡（Time-Space Trade-off）

- **问题抽象**、**数据抽象**是算法设计的前提。
- 数据结构的初步设计往往**先于**算法设计。
- 除了正确性，还要考虑空间和时间效率。

## 2. 线性表的定义

线性表是具有前后关系的线性结构：

- 有唯一的**开始节点**（无前驱，有唯一后继）。
- 有唯一的**终止节点**（有唯一前驱，无后继）。
- 其余为**内部节点**（各有一个直接前驱和一个直接后继）。

### 特点

- **均匀性**：同一线性表中元素类型相同。
- **有序性**：元素之间存在前驱和后继关系。

### 主要属性

- **线性表的长度**：通常指有效元素个数，不一定是声明的容量。
- **表头（head）**：指向第一个元素的**地址**，不是第一个元素本身。
- **表尾（tail）**：最后一个有效元素的地址。
- **当前位置（current position）**：当前访问到的位置。

## 3. 顺序表

顺序表也称**向量**，采用定长一维数组存储。

> 注意：数组本身不等同于顺序表。数组只是实现顺序表的常见方式，也可以用来存图等其他结构。

### 主要特性

- 元素类型相同。
- 元素顺序地存储在连续存储空间中，每个元素有唯一索引。
- 通过首地址 + 下标即可随机存取任意元素。

$$
Loc(k_i) = Loc(k_0) + c \times i, \quad c = \text{sizeof}(ELEM)
$$

其中 $ELEM$ 是元素数据类型，$Loc(k_i)$ 表示第 $i$ 个元素的位置。

### C 语言定义

```c
struct SeqList {
    DataType *element;  // 或 DataType element[MAXNUM];
    int n;              // 当前元素个数
};

typedef struct SeqList *PSeqList;
```

在 32 位系统下该结构体占 8 字节，64 位系统下占 16 字节（指针 + int，可能有对齐填充）。

### C++ 类定义示例

```cpp
class arrList : public List<T> {
private:
    T* aList;
    int maxSize;
    int curLen;
    int position;
public:
    arrList(const int size){
        maxSize = size;
        aList = new T[maxSize];
        curLen = position = 0;
    }
    ~arrList(){
        delete[] aList;
    }
    void clear();
    int length();
    bool append(const T value);
    bool insert(const int p, const T value);
    bool delete(const int p);
    bool setValue(const int p, const T value);
    bool getValue(const int p, T& value);
    bool getPos(int &p, const T value);
};
```

### 基本运算复杂度

| 操作 | 复杂度 | 说明 |
|------|--------|------|
| 按索引访问 | $O(1)$ | 随机存取 |
| 插入 | $O(n)$ | 需要移动后续元素 |
| 删除 | $O(n)$ | 需要移动后续元素 |
| 查找值 | $O(n)$ | 顺序查找 |

`malloc` 返回首地址；`free` 必须做，否则会造成内存泄漏。

## 4. 链表

链表通过指针表示元素之间的前后关系，不需要连续存储空间。

### 分类

- 单链表
- 双链表
- 循环链表

### 单链表节点定义

```c
struct Node {
    DataType info;
    struct Node *link;
};

typedef struct Node *PNode;
typedef struct Node *PLinkList;  // 仅增强可读性，本质同 PNode
```

### 带头结点的单链表

- 始终存在一个头结点 `head`。
- 第一个有效节点是 `head->next`。
- 判空条件变为 `head->next == NULL`，简化边界处理。

### 删除节点

```cpp
Node* temp = head->next;
head->next = temp->next;
delete temp;
```

虽然 `head->next = temp->next;` 一行就能完成逻辑删除，但不释放 `temp` 会造成内存泄漏。

### 插入与删除复杂度

- 若**已知节点位置**：插入 / 删除为 $O(1)$。
- 若**不知道节点位置**：需要先遍历找到位置，为 $O(n)$。

### 单循环链表

- 最后一个节点的 `link` 指向头结点。
- 插入和删除操作建议引入中间变量，降低理解难度。

## 5. 顺序表 vs 链表

| 特性 | 顺序表 | 链表 |
|------|--------|------|
| 存储空间 | 连续 | 不连续 |
| 随机访问 | $O(1)$ | 不支持 |
| 插入删除 | $O(n)$ | $O(1)$（已知位置） |
| 动态扩容 | 需要重新分配/搬移 | 动态方便 |
| 适用场景 | 数据相对静态、频繁查询 | 数据频繁增删 |

### 存储密度

数据结构实际占用内存中，真正数据所占比例。

设每个节点数据占 $E$ 字节，指针占 $P$ 字节，顺序表每个元素占 $D \cdot E$ 字节（$D$ 为存储密度相关的系数），则：

$$
n \cdot (P + E) > D \cdot E \rightarrow n > \frac{D \cdot E}{P + E}
$$

当数据量足够大时，顺序表的存储密度优势才明显。

## 6. 双链表 + 循环链表

- 双链表每个节点额外保存前驱指针，便于双向遍历和删除。
- 循环链表首尾相连。
- 考试中记住定义和性质即可，不需要死记硬背代码。

## 7. 易混淆概念

- **头指针** ≠ **头结点**
  - 头指针：指向链表第一个节点的指针。
  - 头结点：在第一个有效节点之前附加的节点。

- **随机读**：顺序表的优势，链表只能顺序遍历。

- **查找某个值**：顺序表和链表都是 $O(n)$ 的顺序查找。

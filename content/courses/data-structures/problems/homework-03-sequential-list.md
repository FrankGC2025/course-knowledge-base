---
title: HW3：顺序表操作
---

# HW3：顺序表操作

本组作业围绕**顺序表**的增删改查，包括：

- 有序顺序表去重
- 两个有序表归并
- 动态扩容顺序表的实现

## 1. 顺序有序表中删除多余元素

### 题目大意

给定一个非递减有序序列，删除其中重复元素，只保留第一次出现的值。

### 核心思想

- 维护一个 `current` 变量表示上一个输出的元素。
- 当前读入元素与 `current` 不同时才输出并更新 `current`。

### 参考代码

```cpp
#include <iostream>
using namespace std;

int main() {
    int len;
    cin >> len;
    int input;
    int current;

    for (int i = 0; i < len; ++i) {
        cin >> input;
        if (i == 0) {
            current = input;
            cout << current << " ";
        } else if (input != current) {
            current = input;
            cout << current << " ";
        }
    }
    return 0;
}
```

### 复杂度

- 时间：$O(n)$
- 空间：$O(1)$（只用一个额外变量）

---

## 2. 有序表的归并

### 题目大意

两个已按成绩降序排列的学生名单，归并成一个整体降序的名单。

### 核心思想

- 双指针法：同时遍历两个有序表。
- 每次比较指针所指元素，将较大者输出，并移动对应指针。
- 处理其中一个表遍历完后，将另一个表剩余元素全部输出。

### 参考代码

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

struct Student {
    string id;
    string name;
    int grade;
};

int main() {
    int n1, n2;
    cin >> n1;
    vector<Student> FirstTA(n1);
    for (int i = 0; i < n1; i++) {
        cin >> FirstTA[i].id >> FirstTA[i].name >> FirstTA[i].grade;
    }

    cin >> n2;
    vector<Student> SecondTA(n2);
    for (int j = 0; j < n2; j++) {
        cin >> SecondTA[j].id >> SecondTA[j].name >> SecondTA[j].grade;
    }

    for (int i = 0, j = 0; ; ) {
        if (i == n1) {
            while (j < n2) {
                cout << SecondTA[j].id << " "
                     << SecondTA[j].name << " "
                     << SecondTA[j].grade << endl;
                j++;
            }
            return 0;
        }
        if (j == n2) {
            while (i < n1) {
                cout << FirstTA[i].id << " "
                     << FirstTA[i].name << " "
                     << FirstTA[i].grade << endl;
                i++;
            }
            return 0;
        }
        if (FirstTA[i].grade >= SecondTA[j].grade) {
            cout << FirstTA[i].id << " "
                 << FirstTA[i].name << " "
                 << FirstTA[i].grade << endl;
            i++;
        } else {
            cout << SecondTA[j].id << " "
                 << SecondTA[j].name << " "
                 << SecondTA[j].grade << endl;
            j++;
        }
    }
}
```

### 复杂度

- 时间：$O(n_1 + n_2)$
- 空间：$O(n_1 + n_2)$（存储两个表）

---

## 3. 顺序表容量的增长

### 题目大意

实现一个动态扩容的顺序表，支持 `push_back`。输入若干整数，以 `-1` 结束，然后查询倒数第 `location` 个元素。

### 核心思想

- 使用结构体维护 `elem`（元素指针）、`size`（当前元素数）、`capacity`（容量）。
- 当 `size >= capacity` 时，分配两倍大小的内存，复制旧数据，释放旧内存。
- 查询倒数第 `location` 个元素时，转换为正数下标 `size - location`。

### 参考代码

```cpp
#include <iostream>
using namespace std;

typedef int ElemType;

typedef struct {
    ElemType *elem;
    int size;
    int capacity;
} SqList, *List;

void init(List pList) {
    pList->elem = new ElemType[10];
    pList->size = 0;
    pList->capacity = 10;
}

void push_back(List pList, ElemType x) {
    if (pList->size >= pList->capacity) {
        ElemType *newElem = new ElemType[pList->capacity * 2];
        for (int i = 0; i < pList->size; i++) {
            newElem[i] = pList->elem[i];
        }
        delete[] pList->elem;
        pList->elem = newElem;
        pList->capacity *= 2;
    }
    pList->elem[pList->size++] = x;
}

int main() {
    SqList list;
    init(&list);

    while (true) {
        int number;
        cin >> number;
        if (number == -1) break;
        push_back(&list, number);
    }

    int location;
    cin >> location;

    if (location <= 0 || location > list.size) {
        cout << "Invalid location" << endl;
    } else {
        // 倒数第 location 个元素对应正数下标 size - location
        cout << list.elem[list.size - location] << endl;
    }

    return 0;
}
```

### 复杂度分析

- **单次 `push_back` 均摊时间**：$O(1)$
- **扩容操作**：每次扩容复制全部已有元素，时间 $O(n)$，但发生频率越来越低。
- **空间**：最多浪费约一倍容量。

### 常见考点

- 为什么扩容通常选 2 倍而不是 1.5 倍或固定增量？
  - 固定增量会导致均摊复杂度退化为 $O(n)$。
  - 倍数扩容可保证均摊 $O(1)$，2 倍是常见折中。

## 总结

| 题目 | 核心技巧 |
|------|----------|
| 有序表去重 | 单指针维护当前唯一值 |
| 有序表归并 | 双指针法 |
| 动态扩容顺序表 | 倍增扩容、内存管理、均摊分析 |

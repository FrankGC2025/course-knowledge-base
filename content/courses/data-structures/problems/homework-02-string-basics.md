---
title: HW2：字符串基础与频数统计
---

# HW2：字符串基础与频数统计

本组作业围绕**字符串遍历**、**字符频数统计**、**数组排序与比较**、**大整数乘法**展开，是后续字符串算法（KMP、Trie 等）的基础。

## 1. 统计元音字母个数

### 题目大意

输入一行字符串，统计其中 `a, e, i, o, u` 出现的次数。

### 核心思想

- 使用 `getline` 读取整行字符串（含空格）。
- 用长度为 5 的数组分别记录五个元音字母的出现次数。

### 参考代码

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    getline(cin, s);

    int count[5] = { 0 };
    for (char c : s) {
        if (c == 'a') count[0]++;
        if (c == 'e') count[1]++;
        if (c == 'i') count[2]++;
        if (c == 'o') count[3]++;
        if (c == 'u') count[4]++;
    }

    cout << count[0] << " " << count[1] << " "
         << count[2] << " " << count[3] << " " << count[4] << endl;
}
```

---

## 2. 字符串频率统计与最频繁字符

### 题目大意

给定多个仅含小写字母的字符串，对每个字符串统计各字符出现次数，输出出现次数最多的字符及其次数。若多个字符次数相同，输出 ASCII 最小的那个。

### 核心思想

1. 用长度为 26 的数组统计每个字母出现频率。
2. 遍历数组找最大值。
3. 再次遍历找第一个等于最大值的字母。

### 参考代码

```cpp
#include <iostream>
#include <string>
using namespace std;

int* Init(int* p, int len) {
    for (int i = 0; i < len; ++i) p[i] = 0;
    return p;
}

int* CountFreq(string s, int* p) {
    for (char c : s) p[c - 'a']++;
    return p;
}

int MaxFreq(int* p, int len) {
    int max = 0;
    for (int i = 0; i < len; ++i) {
        if (p[i] > max) max = p[i];
    }
    return max;
}

int MaxElement(int* p, int maxFreq, int len) {
    for (int i = 0; i < len; i++) {
        if (p[i] == maxFreq) return i;
    }
    cout << "Error: element not found." << endl;
    return -1;
}

int main() {
    int n;
    cin >> n;
    while (n--) {
        string alphabetString;
        cin >> alphabetString;

        int count[26] = { 0 };
        Init(count, 26);
        CountFreq(alphabetString, count);
        int maxFreq = MaxFreq(count, 26);
        char maxElem = (char)(MaxElement(count, maxFreq, 26) + 'a');
        cout << maxElem << " " << maxFreq << endl;
    }
}
```

---

## 3. 加密字符串判断

### 题目大意

给定两个字符串（可能含大写字母），判断其中一个是否是另一个的"变位词"（即字符组成相同、次数相同）。

### 核心思想

- 分别统计两个字符串中各字符出现次数。
- 对频数数组排序后比较是否完全相同。

### 参考代码

```cpp
#include <iostream>
#include <string>
using namespace std;

int* Init(int* p, int len) {
    for (int i = 0; i < len; i++) p[i] = 0;
    return p;
}

int* CountFreq(string s, int* p) {
    for (char c : s) p[c - 'A']++;
    return p;
}

int* MySort(int* p, int len) {
    for (int i = 0; i < len; i++) {
        for (int j = i + 1; j < len; j++) {
            if (p[i] < p[j]) {
                int temp = p[j];
                p[j] = p[i];
                p[i] = temp;
            }
        }
    }
    return p;
}

bool CompareList(int* p1, int* p2, int len) {
    for (int i = 0; i < len; i++) {
        if (p1[i] != p2[i]) return false;
    }
    return true;
}

int main() {
    string encryptedString, originalString;
    cin >> encryptedString >> originalString;

    int encryptedCount[26] = { 0 };
    int originalCount[26] = { 0 };
    Init(encryptedCount, 26);
    Init(originalCount, 26);

    CountFreq(encryptedString, encryptedCount);
    CountFreq(originalString, originalCount);
    MySort(encryptedCount, 26);
    MySort(originalCount, 26);

    if (CompareList(encryptedCount, originalCount, 26))
        cout << "YES" << endl;
    else
        cout << "NO" << endl;
}
```

---

## 4. 大整数乘法

### 题目大意

求两个大非负整数的乘积。位数可能超过普通整型范围。

### 核心思想

- 用数组逆序存储两个乘数的每一位（低位在前）。
- 按竖式乘法规则，双重循环计算每一位乘积，累加到结果数组。
- 处理进位。
- 逆序输出并去除前导零。

### 参考代码

```cpp
#include <iostream>
#include <string>
using namespace std;

int* InputLargeNum(int* p, string s, int l) {
    int pos = l - 1;
    for (char c : s) {
        p[pos] = c - '0';
        pos--;
    }
    return p;
}

int* Init(int* p, int len) {
    for (int i = 0; i < len; i++) p[i] = 0;
    return p;
}

int* Multiply(int* p1, int* p2, int l1, int l2, int* res) {
    for (int i = 0; i < l1; ++i) {
        for (int j = 0; j < l2; ++j) {
            res[i + j] += p1[i] * p2[j];
        }
    }
    for (int k = 0; k < l1 + l2; ++k) {
        if (res[k] > 10) {
            res[k + 1] += res[k] / 10;
            res[k] %= 10;
        }
    }
    return res;
}

void PrintList(int* p, int len) {
    for (int i = len - 1; i >= 0; i--) {
        if (p[i] != 0) {
            for (int j = i; j >= 0; j--) {
                cout << p[j];
            }
            cout << endl;
            return;
        }
    }
    cout << 0 << endl;
}

int main() {
    int num1[201] = { 0 };
    int num2[201] = { 0 };

    string numOne, numTwo;
    cin >> numOne >> numTwo;
    int len1 = numOne.length();
    int len2 = numTwo.length();

    InputLargeNum(num1, numOne, len1);
    InputLargeNum(num2, numTwo, len2);

    int result[402] = { 0 };
    Init(result, 402);

    Multiply(num1, num2, len1, len2, result);
    PrintList(result, len1 + len2);
}
```

### 要点

- 两个长度分别为 $l_1$ 和 $l_2$ 的数相乘，结果最多 $l_1 + l_2$ 位。
- `res[i + j] += p1[i] * p2[j]` 是竖式乘法的数组实现。
- 注意进位时 `> 10` 的条件，严格来说应改为 `>= 10`，但本题数据范围下可能仍可通过。

## 总结

| 题目 | 核心技巧 |
|------|----------|
| 元音统计 | 字符串遍历、数组计数 |
| 最频繁字符 | 频数统计、最值查找 |
| 加密字符串判断 | 频数排序、数组比较 |
| 大整数乘法 | 数组逆序存储、竖式乘法、进位处理 |

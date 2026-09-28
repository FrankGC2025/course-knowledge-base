---
title: HW1：递归与大整数运算
---

# HW1：递归与大整数运算

本组作业侧重**递归思想**和**大整数存储/运算**，是后续链表、顺序表等数据结构的基础热身。

## 1. 汉诺塔问题

### 题目大意

将 $n$ 个盘子从起始柱移动到目标柱，借助中间柱，要求大盘不能压在小盘上。

### 核心思想

递归三步：

1. 把上面 $n-1$ 个盘子从起始柱移到中间柱。
2. 把第 $n$ 个盘子从起始柱移到目标柱。
3. 把 $n-1$ 个盘子从中间柱移到目标柱。

### 参考代码

```cpp
#include <iostream>
#include <string>
using namespace std;

void moveStep(int size, string source, string destination) {
    cout << size << ":" << source << "->" << destination << endl;
}

void Tower(int n, string a, string b, string c) {
    if (n <= 0) {
        throw invalid_argument("n must be greater than 0");
    }
    if (n == 1) {
        moveStep(1, a, c);
    } else {
        Tower(n - 1, a, c, b);  // 将 n-1 个从 a 移到 b，借助 c
        moveStep(n, a, c);      // 将最底下的盘子从 a 移到 c
        Tower(n - 1, b, a, c);  // 将 n-1 个从 b 移到 c，借助 a
    }
}

int main() {
    int n;
    string a, b, c;
    cin >> n >> a >> b >> c;
    Tower(n, a, b, c);
    return 0;
}
```

### 复杂度

移动次数：$T(n) = 2T(n-1) + 1 = 2^n - 1$，时间复杂度 $O(2^n)$。

---

## 2. 大整数求和

### 题目大意

求两个不超过 200 位的非负整数之和。输入可能包含前导零。

### 核心思想

- 用字符串读入大整数。
- 将每一位逆序存入数组（低位在前，高位在后），便于从低位开始相加。
- 逐位相加并处理进位。
- 逆序输出结果，注意去除前导零。

### 参考代码

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int num1[205] = { 0 };
    int num2[205] = { 0 };

    for (int i = 0; i < 2; i++) {
        string s;
        cin >> s;
        int len = s.length();
        for (int j = 0; j < len; j++) {
            if (i == 0)
                num1[len - j - 1] = s[j] - '0';
            else
                num2[len - j - 1] = s[j] - '0';
        }
    }

    int carry = 0;
    int result[205] = { 0 };

    for (int i = 0; i < 205; i++) {
        int sum = num1[i] + num2[i] + carry;
        result[i] = sum % 10;
        carry = sum / 10;
    }

    // 逆序输出并去前导零
    for (int i = 204; i >= 0; i--) {
        if (result[i] != 0) {
            for (int j = i; j >= 0; j--) {
                cout << result[j];
            }
            return 0;
        }
        if (i == 0) {
            cout << 0;  // 全零的 corner case
        }
    }
    return 0;
}
```

---

## 3. Sierpinski 分形

### 题目大意

按给定阶数绘制 Sierpinski 三角形分形。

### 核心思想

- 递归地将一个大三角形分解为三个小三角形。
- 用二维字符数组作为画布，递归绘制每个子三角形。
- 注意坐标计算和边界处理。

### 参考代码

```cpp
#include<iostream>
#include<cstring>
using namespace std;

char map[1038][2058];  // x 向上延展是行，y 向右延展是列

void GetMap(int t, int x, int y) {  // x, y 是每个三角形的左下端点
    if (t == 1) {
        map[x][y] = '/';
        map[x][y + 1] = '_';
        map[x][y + 2] = '_';
        map[x][y + 3] = '\\';
        map[x + 1][y] = ' ';
        map[x + 1][y + 1] = '/';
        map[x + 1][y + 2] = '\\';
    } else {
        GetMap(t - 1, x, y);
        GetMap(t - 1, x, (1 << t) + y);
        GetMap(t - 1, (1 << (t - 1)) + x, (1 << (t - 1)) + y);
    }
}

void Draw(int t) {
    int m = (1 << t) + 1;
    for (int i = 1 << t; i >= 1; i--) {
        for (int j = 1; j <= m; j++) {
            if (map[i][j]) cout << map[i][j];
            else cout << ' ';
        }
        cout << endl;
        m++;
    }
}

int main() {
    int t;
    int num = 1;
    while (true) {
        cin >> t;
        if (t == 0) break;
        GetMap(t, 1, 1);
        if (num > 1) cout << endl;
        num++;
        Draw(t);
    }
    return 0;
}
```

### 要点

- 位运算 `1 << t` 等价于 $2^t$，用于快速计算三角形边长。
- 全局字符数组默认初始化为 0，可作为"未绘制"标记。

## 总结

| 题目 | 核心技巧 |
|------|----------|
| 汉诺塔 | 递归分治 |
| 大整数求和 | 数组逆序存储、逐位进位 |
| Sierpinski 分形 | 递归图形分解、坐标映射 |

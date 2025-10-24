# 测试指南

## 概述

本项目使用 [Vitest](https://vitest.dev/) 作为测试框架。Vitest 是一个快速的单元测试框架，与 Vite 原生集成。

## 测试目录结构

```
src/
├── test/                           # 测试配置
│   ├── setup.ts                   # 全局测试设置
│   └── utils/                     # 测试工具函数
├── game/
│   └── editor/
│       ├── __tests__/             # 编辑器测试
│       │   ├── LevelGenerator.test.ts    # 生成器测试
│       │   ├── LevelValidator.test.ts    # 验证器测试
│       │   ├── integration.test.ts       # 集成测试
│       │   └── templates.test.ts         # 模板测试
│       ├── types.ts
│       ├── LevelGenerator.ts
│       ├── LevelValidator.ts
│       └── index.ts
```

## 运行测试

### 命令

```bash
# 运行所有测试（watch模式）
npm test

# 运行测试UI界面
npm run test:ui

# 运行测试一次（CI模式）
npm run test:run

# 运行测试并生成覆盖率报告
npm run test:coverage
```

### 运行特定测试

```bash
# 运行特定文件的测试
npm test LevelGenerator

# 运行特定测试套件
npm test -- -t "基本关卡生成"

# 只运行关卡编辑器的测试
npm test src/game/editor
```

## 测试覆盖

### 当前测试覆盖

| 模块 | 测试文件 | 测试数量 | 覆盖范围 |
|------|---------|---------|---------|
| LevelGenerator | LevelGenerator.test.ts | 15+ | 生成器所有功能 |
| LevelValidator | LevelValidator.test.ts | 20+ | 验证器所有规则 |
| Integration | integration.test.ts | 15+ | 完整工作流程 |
| Templates | templates.test.ts | 15+ | 所有模板 |

### 测试覆盖率目标

- **语句覆盖率**: > 80%
- **分支覆盖率**: > 75%
- **函数覆盖率**: > 85%
- **行覆盖率**: > 80%

## 编写测试

### 基本测试结构

```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../your-module';

describe('模块名称', () => {
  describe('功能组1', () => {
    it('应该做某事', () => {
      // Arrange - 准备
      const input = { /* ... */ };

      // Act - 执行
      const result = yourFunction(input);

      // Assert - 断言
      expect(result).toBeDefined();
      expect(result.value).toBe(expected);
    });
  });
});
```

### 测试命名规范

- **describe**: 描述测试的模块或功能
- **it**: 描述具体的测试用例，使用"应该..."格式

```typescript
describe('LevelGenerator', () => {
  describe('基本关卡生成', () => {
    it('应该成功生成简单关卡', () => {
      // ...
    });

    it('应该使用默认值', () => {
      // ...
    });
  });
});
```

### 常用断言

```typescript
// 相等性
expect(value).toBe(expected);           // 严格相等 ===
expect(value).toEqual(expected);        // 深度相等
expect(value).not.toBe(expected);       // 不相等

// 真值
expect(value).toBeTruthy();             // 真值
expect(value).toBeFalsy();              // 假值
expect(value).toBeDefined();            // 已定义
expect(value).toBeNull();               // null

// 数字
expect(value).toBeGreaterThan(3);       // 大于
expect(value).toBeLessThan(5);          // 小于
expect(value).toBeGreaterThanOrEqual(3);// 大于等于
expect(value).toBeCloseTo(0.3);         // 接近（浮点数）

// 字符串
expect(string).toContain('substring');  // 包含
expect(string).toMatch(/pattern/);      // 匹配正则

// 数组
expect(array).toHaveLength(3);          // 长度
expect(array).toContain(item);          // 包含元素

// 对象
expect(object).toHaveProperty('key');   // 有属性
expect(object).toMatchObject({ /* */ });// 匹配部分

// 函数
expect(fn).toThrow();                   // 抛出异常
expect(fn).toHaveBeenCalled();          // 被调用（mock）
```

## 测试最佳实践

### 1. 测试独立性

每个测试应该独立，不依赖其他测试的结果：

```typescript
describe('Counter', () => {
  it('应该从0开始', () => {
    const counter = new Counter();
    expect(counter.value).toBe(0);
  });

  it('应该能够增加', () => {
    const counter = new Counter(); // 新实例
    counter.increment();
    expect(counter.value).toBe(1);
  });
});
```

### 2. 使用 Setup 和 Teardown

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Database', () => {
  let db;

  beforeEach(() => {
    // 每个测试前执行
    db = new Database();
    db.connect();
  });

  afterEach(() => {
    // 每个测试后执行
    db.disconnect();
  });

  it('应该插入数据', () => {
    db.insert({ id: 1 });
    expect(db.count()).toBe(1);
  });
});
```

### 3. 测试边界情况

```typescript
describe('divide', () => {
  it('应该正确除法', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('应该处理除以0', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });

  it('应该处理负数', () => {
    expect(divide(-10, 2)).toBe(-5);
  });

  it('应该处理小数', () => {
    expect(divide(1, 3)).toBeCloseTo(0.333, 2);
  });
});
```

### 4. 使用描述性的测试名称

```typescript
// ❌ 不好
it('test 1', () => { /* ... */ });

// ✅ 好
it('应该在路径点少于2个时返回错误', () => { /* ... */ });
```

### 5. 测试一件事

```typescript
// ❌ 不好 - 测试太多东西
it('应该创建并验证并导出关卡', () => {
  const level = createLevel(config);
  expect(level).toBeDefined();
  const validation = validate(level);
  expect(validation.valid).toBe(true);
  const json = export(level);
  expect(json).toContain('id');
});

// ✅ 好 - 分成多个测试
it('应该创建关卡', () => {
  const level = createLevel(config);
  expect(level).toBeDefined();
});

it('应该验证关卡', () => {
  const level = createLevel(config);
  const validation = validate(level);
  expect(validation.valid).toBe(true);
});

it('应该导出关卡', () => {
  const level = createLevel(config);
  const json = export(level);
  expect(json).toContain('id');
});
```

## Mock 和 Stub

### 使用 vi.fn() 创建 Mock

```typescript
import { vi } from 'vitest';

it('应该调用回调函数', () => {
  const callback = vi.fn();

  processData(data, callback);

  expect(callback).toHaveBeenCalled();
  expect(callback).toHaveBeenCalledWith(expectedData);
  expect(callback).toHaveBeenCalledTimes(1);
});
```

### Mock 模块

```typescript
import { vi } from 'vitest';

// Mock 整个模块
vi.mock('../api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mock' }))
}));

it('应该使用mock的API', async () => {
  const result = await fetchData();
  expect(result.data).toBe('mock');
});
```

## 测试 UI（可选）

运行测试 UI 可以可视化查看测试结果：

```bash
npm run test:ui
```

然后在浏览器中打开显示的地址（通常是 `http://localhost:51204/__vitest__/`）

### UI 功能

- 📊 **实时测试结果** - 查看所有测试的状态
- 🔍 **过滤测试** - 按文件名或测试名搜索
- 📈 **测试覆盖率** - 可视化覆盖率报告
- 🐛 **调试** - 点击测试查看详细信息

## 覆盖率报告

生成覆盖率报告：

```bash
npm run test:coverage
```

报告会生成在 `coverage/` 目录：
- `coverage/index.html` - HTML报告
- `coverage/coverage-final.json` - JSON数据

### 查看覆盖率报告

打开 `coverage/index.html` 在浏览器中查看详细的覆盖率报告。

## CI/CD 集成

### GitHub Actions 示例

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:run
      - run: npm run test:coverage

      # 上传覆盖率报告
      - uses: codecov/codecov-action@v2
        with:
          files: ./coverage/coverage-final.json
```

## 调试测试

### 在 VS Code 中调试

1. 在测试文件中设置断点
2. 按 F5 或使用调试面板
3. 选择 "Vitest" 配置

### 使用 console.log

```typescript
it('应该调试输出', () => {
  const result = someFunction();
  console.log('Result:', result); // 会在测试输出中显示
  expect(result).toBeDefined();
});
```

### 使用 .only 和 .skip

```typescript
// 只运行这个测试
it.only('应该只运行这个', () => {
  // ...
});

// 跳过这个测试
it.skip('暂时跳过这个', () => {
  // ...
});
```

## 故障排除

### 问题1：测试超时

```typescript
// 增加超时时间
it('应该处理长时间操作', async () => {
  // ...
}, 10000); // 10秒超时
```

### 问题2：异步测试失败

确保使用 async/await 或返回 Promise：

```typescript
// ✅ 正确
it('应该异步操作', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});

// ❌ 错误 - 测试会在异步操作完成前结束
it('应该异步操作', () => {
  asyncFunction().then(result => {
    expect(result).toBeDefined();
  });
});
```

### 问题3：Mock 不工作

确保 mock 在导入之前：

```typescript
// ✅ 正确
vi.mock('../module');
import { function } from '../module';

// ❌ 错误
import { function } from '../module';
vi.mock('../module');
```

## 参考资源

- [Vitest 官方文档](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Jest API 参考](https://jestjs.io/docs/api)（Vitest 兼容）

## 下一步

查看具体的测试示例：
- `src/game/editor/__tests__/` - 关卡编辑器测试
- 参考现有测试了解最佳实践

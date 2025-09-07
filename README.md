# Fetch RedNote Bot

这是一个基于 Coze 平台的机器人项目，用于获取小红书数据。

## 项目结构

```
coze_fetch_rednote/
├── botmax/
│   ├── app.json                    # 应用配置
│   └── fetch_rednote/             # 技能目录
│       ├── block.json             # 技能配置
│       ├── package.json           # 项目依赖
│       ├── src/
│       │   └── register.ts        # 主要业务逻辑
│       ├── test/
│       │   └── index.ts           # 测试文件
│       └── tsconfig.json          # TypeScript 配置
└── README.md                      # 项目说明
```

## 功能特性

- 🔗 集成 Coze SDK (`@coze/api`)
- 📱 支持小红书账号主页URL输入
- ⚙️ 可配置的 Coze Token 和工作流ID
- 🚀 自动化工作流调用
- 📊 结构化数据返回

## 安装和使用

### 1. 安装依赖

```bash
cd botmax/fetch_rednote
npm install
```

### 2. 配置参数

在 `src/register.ts` 中，您需要配置以下参数：

- **profile**: 小红书账号主页URL
- **cozeToken**: Coze API Token
- **workflowId**: Coze 工作流ID

### 3. 构建项目

```bash
npm run build
```

### 4. 预览和上传

```bash
# 预览项目
npm run preview

# 上传到平台
npm run upload
```

## API 使用

### Coze SDK 集成

项目使用了 [Coze JavaScript SDK](https://github.com/coze-dev/coze-js) 来调用 Coze 工作流：

```typescript
import { CozeAPI } from '@coze/api';

const apiClient = new CozeAPI({
  token: cozeToken,
  baseURL: 'https://api.coze.cn'
});

const res = await apiClient.workflows.runs.stream({
  workflow_id: workflowId,
  parameters: {
    profile_url: profile
  }
});
```

## 开发指南

### 修改业务逻辑

编辑 `src/register.ts` 文件来修改机器人的行为：

1. **表单配置**: 修改 `formItems` 来调整输入参数
2. **执行逻辑**: 修改 `execute` 函数来实现具体业务逻辑
3. **返回类型**: 修改 `resultType` 来定义输出数据结构

### 测试

```bash
npm test
```

## 部署

使用 opdev CLI 工具进行部署：

```bash
# 上传到平台
opdev upload

# 或者使用 npm 脚本
npm run upload
```

## 相关链接

- [Coze 官方文档](https://www.coze.cn/docs/)
- [Coze JavaScript SDK](https://github.com/coze-dev/coze-js)
- [Lark OpenDev CLI](https://github.com/larksuite/lark-opdev-cli)

## 许可证

MIT License

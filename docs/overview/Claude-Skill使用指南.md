# Claude Skill 使用指南

## 目的

这份文档用于约定本仓库里 Claude Skill 的推荐用法，减少每次都从零描述上下文。

## 已安装的开发向 Skill

- `uniapp-project`：适合 uni-app / 小程序页面、路由、组件、接口接入实现
- `tencentcloudbase-skills-miniprogram-development`：适合云开发、小程序相关场景
- `ui-ux-pro-max`：适合页面视觉升级、样式方向、交互建议
- `ui-design`：适合界面结构和信息层级梳理
- `writing-plans`：适合先拆计划再动代码
- `brainstorming`：适合方案发散、功能设计、交互思路比较
- `test-driven-development`：适合先写测试再实现
- `systematic-debugging`：适合定位编译错误、接口异常、运行时问题
- `webapp-testing`：适合自动化验证页面流程
- `requesting-code-review`：适合改完后做代码审查
- `verification-before-completion`：适合交付前做最终核对
- `mcp-builder`：适合后续扩展 MCP Server 或自动化工具
- `skill-creator`：适合把高频流程沉淀成项目自定义 Skill

## 推荐使用顺序

标准顺序：

`需求理解 -> 方案拆解 -> 实现开发 -> 调试修复 -> 回归验证 -> Code Review -> 收尾确认`

建议对应 Skill：

1. 需求不清楚时，用 `brainstorming`
2. 要开始做功能前，用 `writing-plans`
3. 开发 uni-app / 小程序页面、状态、接口时，用 `uniapp-project`
4. 需要先测后写时，用 `test-driven-development`
5. 遇到报错或行为异常时，用 `systematic-debugging`
6. 需要自动化走流程时，用 `webapp-testing`
7. 改完代码后，用 `requesting-code-review`
8. 准备交付前，用 `verification-before-completion`

## 本项目里的推荐场景

### `apps/mini-program-vue3`

- 新增页面、重构页面、接接口：优先 `uniapp-project`
- 首页、商品页、预约页体验优化：优先 `ui-ux-pro-max`
- 路由、状态、请求链路异常：优先 `systematic-debugging`

### `apps/admin`

- 后台列表页、表单页、统计页开发：优先 `writing-plans`
- 复杂交互或视觉调整：优先 `ui-design` + `ui-ux-pro-max`
- 提交前检查回归风险：优先 `requesting-code-review`

### `apps/server`

- API 设计和改造：优先 `writing-plans`
- 行为异常、联调失败：优先 `systematic-debugging`
- 交付前验证接口影响：优先 `verification-before-completion`

## 使用前建议先给 Claude 的上下文

每次发起开发请求，尽量带上这 4 类信息：

1. 目标模块
2. 参考文档
3. 约束条件
4. 期望产出

示例：

```text
请使用 uniapp-project 帮我开发 `apps/mini-program-vue3/src/pages/store/index.vue`。
先阅读 `docs/product/pages/03-门店页.md` 和 `docs/decisions/` 里的相关决策。
不要改动接口协议，保持现有状态管理方式。
完成后请自查并说明改动点。
```

## 常用组合

- 先规划再开发：`writing-plans` + `uniapp-project`
- 先测试再开发：`test-driven-development` + `uniapp-project`
- 先排错再修复：`systematic-debugging`
- 改完再复查：`requesting-code-review` + `verification-before-completion`
- 做页面升级：`ui-design` + `ui-ux-pro-max`

## 不建议的用法

- 没看 `docs/product/` 就直接让 Claude 改业务逻辑
- 没看 `docs/decisions/` 就重构已有目录或命名
- 报错没定位根因就直接让 Claude “随便修一下”
- 页面尚未确认需求就直接进入大规模实现

## 后续建议

如果你发现有些提示词每周都会重复使用，下一步就用 `skill-creator` 把它们沉淀成这个仓库自己的业务 Skill。

# Claude Skill 调用模板

下面这些模板可以直接复制给 Claude，再按你的真实目标改路径和页面名。

## 1. 先规划再开发

```text
请使用 writing-plans 帮我规划这个需求：

目标：实现/改造 `apps/mini-program-vue3` 里的某个功能。
先阅读：
- `docs/overview/项目导航.md`
- `docs/product/`
- `docs/decisions/`

请输出：
1. 需求理解
2. 涉及文件
3. 实施步骤
4. 风险点
5. 验证方案

确认方案后再开始改代码。
```

## 2. 开发小程序页面

```text
请使用 uniapp-project 帮我开发小程序页面。

目标文件：
`apps/mini-program-vue3/src/pages/store/index.vue`

参考资料：
- `docs/product/pages/03-门店页.md`
- `design/prototypes/mini-program/03-store.html`

要求：
- 保持现有项目结构
- 优先复用已有组件和服务层
- 不要随意修改接口字段

完成后：
- 直接修改代码
- 说明变更点
- 告诉我如何验证
```

## 3. 开发接口联调

```text
请使用 uniapp-project 帮我接入接口。

目标模块：
- 页面：`apps/mini-program-vue3/src/pages/product/detail.vue`
- 服务：`apps/mini-program-vue3/src/services/modules/product.ts`

要求：
- 先阅读现有 `src/services/http/` 的封装方式
- 沿用当前请求和类型组织方式
- 如果接口字段和页面展示不一致，先指出差异再处理
```

## 4. 排查 bug

```text
请使用 systematic-debugging 帮我排查问题，不要先猜测修复。

问题现象：
这里写具体报错、页面异常或接口异常。

排查范围：
- `apps/mini-program-vue3`
- `apps/server`

要求：
- 先定位根因
- 说明复现路径
- 给出最小修复方案
- 修复后再验证
```

## 5. 先写测试再开发

```text
请使用 test-driven-development 帮我完成这个功能。

目标：
这里写功能点。

要求：
- 先补一个失败测试
- 再做最小实现
- 最后运行相关验证

范围：
`apps/mini-program-vue3` 或 `apps/server`
```

## 6. 页面视觉优化

```text
请使用 ui-ux-pro-max 帮我优化这个页面的视觉和交互。

目标页面：
`apps/mini-program-vue3/src/pages/common/login/index.vue`

参考：
- `design/prototypes/mini-program/`
- `docs/requirements/references/小程序截图/`

要求：
- 保留现有业务结构
- 只优化 UI 和交互表达
- 给出明确的视觉方向后再改代码
```

## 7. 做一次代码审查

```text
请使用 requesting-code-review 帮我审查刚完成的改动。

重点关注：
- 逻辑错误
- 状态管理风险
- 接口兼容性
- 小程序端行为回归
- 是否缺少必要测试

请先给 findings，再给总结。
```

## 8. 提交前最终核对

```text
请使用 verification-before-completion 帮我做交付前检查。

范围：
- `apps/mini-program-vue3`
- `apps/admin`
- `apps/server`

请检查：
- 需求是否闭环
- 是否还有明显回归风险
- 是否遗漏验证步骤
- 是否有不一致的文档或实现
```

## 9. 生成项目自定义 Skill

```text
请使用 skill-creator 帮我把这个高频流程做成项目自定义 Skill。

目标：
把“小程序页面开发 + 联调 + 自查”沉淀成一个新 Skill。

要求：
- 放到当前项目可复用的位置
- 包含触发条件
- 包含执行步骤
- 包含输出要求
```

## 10. 扩展自动化工具

```text
请使用 mcp-builder 帮我设计一个 MCP 工具。

目标：
为这个项目增加一个能查询页面规格、PRD 或接口约束的内部工具。

要求：
- 先给架构方案
- 再给目录结构
- 最后再开始实现
```

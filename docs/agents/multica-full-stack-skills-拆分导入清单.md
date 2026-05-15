# Multica Agent Skill 拆分导入清单

来源仓库：https://github.com/partme-ai/full-stack-skills

更新时间：2026-05-15

## 1. 拆分原则

当前项目技术栈：
- 小程序端：uni-app + Vue 3 + Pinia + Vite
- 运营后台：Vue 3 + Element Plus + Pinia + Vite
- 后端：NestJS + Prisma + Jest

因此不建议整包导入 `full-stack-skills`。该仓库包含 42 个技能组、421 个 `SKILL.md`，整包导入会让 Agent 触发范围过大。建议按 Agent 职责逐个导入，只导入当前阶段会高频使用的 skill。

## 2. 前端开发专家

### P0 必导

| Skill | 作用 | 导入 URL |
|---|---|---|
| `uniapp-project` | uni-app 组件、API、跨端兼容、小程序端开发主 skill | https://github.com/partme-ai/full-stack-skills/tree/main/skills/uniapp-skills/uniapp-project |
| `uniapp-mini` | uni-app 小程序配置、微信小程序能力、平台差异 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/uniapp-skills/uniapp-mini |
| `vue3` | Vue 3 组件、组合式 API、响应式、TypeScript 写法 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/vue-skills/vue3 |
| `pinia` | 用户状态、预约单状态、门店选择状态等状态管理 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/vue-skills/pinia |
| `vite` | 小程序端与后台的 Vite 构建、配置、性能优化 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/build-skills/vite |
| `element-plus-vue3` | 运营后台页面与表单/表格/弹窗组件 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/vue-ui-skills/element-plus-vue3 |

### P1 按需导入

| Skill | 什么时候需要 | 导入 URL |
|---|---|---|
| `vitest` | 当前端开始补组件单测、store 单测时导入 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/testing-skills/vitest |
| `vant-vue3` | 如果后续明确采用 Vant 做 H5/移动端组件库再导入 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/vue-ui-skills/vant-vue3 |

## 3. 后端开发专家

### P0 必导

| Skill | 作用 | 导入 URL |
|---|---|---|
| `nestjs` | NestJS 模块、Controller、Provider、Guard、Pipe、Swagger、测试 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/nodejs-skills/nestjs |
| `jest` | 后端单测、Service 测试、mock、覆盖率 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/testing-skills/jest |
| `api-doc-generator` | 扫描 Controller/接口并生成 API 文档，适合前后端联调 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/document-skills/api-doc-generator |

### P1 按需导入

| Skill | 什么时候需要 | 导入 URL |
|---|---|---|
| `docker` | 开始容器化后端服务或写 Dockerfile 时导入 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/docker-skills/docker |
| `docker-compose` | 需要本地一键启动 server + DB + cache 时导入 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/docker-skills/docker-compose |
| `redis` | 需要缓存、限流、会话、队列时导入 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/database-skills/redis |
| `github-actions` | 开始配置 CI/CD 时导入 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/devops-skills/github-actions |

### 暂不导入

| Skill | 原因 |
|---|---|
| `spring-*` | 当前后端不是 Java/Spring |
| `fastapi` / `django` / `flask` | 当前后端不是 Python |
| `postgresql` / `oracle` | 当前 PRD 与代码更偏 Prisma + MySQL/通用 DB，仓库里没有直接匹配的 MySQL skill |

## 4. QA 测试 Agent

### P0 必导

| Skill | 作用 | 导入 URL |
|---|---|---|
| `test-writer` | 通用测试设计：单测、集成测试、E2E、边界用例 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/dev-utils-skills/test-writer |
| `playwright` | Web/E2E 自动化、关键路径回归、截图和 trace | https://github.com/partme-ai/full-stack-skills/tree/main/skills/testing-skills/playwright |
| `webapp-testing` | 启动本地 Web 应用并用 Playwright 验证 UI 行为 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/dev-utils-skills/webapp-testing |
| `jest` | 后端 Jest 单测审查与补测 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/testing-skills/jest |
| `vitest` | 前端 Vue/Vite 单测审查与补测 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/testing-skills/vitest |

### P1 按需导入

| Skill | 什么时候需要 | 导入 URL |
|---|---|---|
| `cypress` | 如果团队明确选 Cypress 而不是 Playwright 时再导入 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/testing-skills/cypress |
| `selenium` | 需要兼容旧浏览器或企业 Selenium Grid 时再导入 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/testing-skills/selenium |

## 5. 高级美工工程师

### P0 必导

| Skill | 作用 | 导入 URL |
|---|---|---|
| `frontend-design` | 生成和优化高质量前端界面，避免通用模板感 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/dev-utils-skills/frontend-design |
| `theme-factory` | 统一色彩、字体、视觉主题，用于小程序和后台视觉规范 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/dev-utils-skills/theme-factory |

### P1 按需导入

| Skill | 什么时候需要 | 导入 URL |
|---|---|---|
| `canvas-design` | 需要海报、视觉稿、静态创意图时导入 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/design-skills/canvas-design |
| `stitch-ui-designer` | 只有明确使用 Stitch 生成 UI 时再导入 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/stitch-skills/stitch-ui-designer |
| `pencil-ui-designer` | 只有明确使用 Pencil 设计系统时再导入 | https://github.com/partme-ai/full-stack-skills/tree/main/skills/pencil-skills/pencil-ui-designer |

### 暂不导入

| Skill | 原因 |
|---|---|
| `brand-guidelines` | 这是 Anthropic 品牌规范，不适合蓝辉轻改品牌 |
| `stitch-*` 全量 | 需要 Stitch MCP 工具，不适合无差别导入 |
| `pencil-*` 全量 | 需要 Pencil 工作流，不适合无差别导入 |

## 6. 建议导入顺序

第一批先导入：
1. 前端开发专家：`uniapp-project`、`uniapp-mini`、`vue3`、`pinia`、`vite`、`element-plus-vue3`
2. 后端开发专家：`nestjs`、`jest`、`api-doc-generator`
3. QA 测试：`test-writer`、`playwright`、`webapp-testing`、`jest`、`vitest`
4. 高级美工工程师：`frontend-design`、`theme-factory`

第二批等项目进入联调/部署再导入：
1. 后端开发专家：`docker`、`docker-compose`、`redis`、`github-actions`
2. QA 测试：按团队选择 `cypress` 或继续只用 `playwright`
3. 高级美工工程师：按实际设计工具选择 `canvas-design`、`stitch-ui-designer` 或 `pencil-ui-designer`

## 7. 分配建议

| Agent | 推荐 Skill |
|---|---|
| 前端开发专家 | `uniapp-project`、`uniapp-mini`、`vue3`、`pinia`、`vite`、`element-plus-vue3` |
| 后端开发专家 | `nestjs`、`jest`、`api-doc-generator` |
| QA 测试 | `test-writer`、`playwright`、`webapp-testing`、`jest`、`vitest` |
| 高级美工工程师 | `frontend-design`、`theme-factory` |

## 8. 注意事项

- 同一个 skill 可以被多个 Agent 使用，例如 `jest` 同时适合后端和 QA。
- 不建议给前端 Agent 同时导入太多 UI 库 skill，例如 Element Plus、Vant、uView、TUI 全部导入会让它在实现时摇摆。
- 当前小程序端未看到 uView/Vant 依赖，因此 `uview-*`、`vant-vue3` 先不作为必导。
- 如果 Multica 的“从 URL 导入”不接受 GitHub 目录 URL，可先把该仓库安装到本地运行时，再用 Multica 的“从运行时复制”导入对应 skill。

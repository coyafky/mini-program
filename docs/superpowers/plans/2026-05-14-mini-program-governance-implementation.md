# Mini Program Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the repository into a role-based structure, create governance entry documents, migrate existing materials, and repair obvious broken internal references without changing business code behavior.

**Architecture:** This pass separates authoritative documentation, visual artifacts, runnable applications, and operational materials into dedicated top-level directories. The work is sequenced to establish stable destinations first, then move source materials, then repair navigation and archive the legacy structure.

**Tech Stack:** Markdown, shell file operations, static HTML prototypes, Vue/NestJS repository layout

---

### Task 1: Create the target folder scaffold and governance entry docs

**Files:**
- Create: `docs/overview/项目导航.md`
- Create: `docs/overview/目录规范.md`
- Create: `docs/overview/术语表.md`
- Create: `docs/overview/开发流程.md`
- Create: `docs/decisions/.gitkeep`
- Create: `design/prototypes/.gitkeep`
- Create: `design/specs/.gitkeep`
- Create: `qa/.gitkeep`
- Create: `release/.gitkeep`
- Create: `ops/.gitkeep`
- Create: `archive/.gitkeep`

- [ ] **Step 1: Create the destination directories**

Run:

```bash
mkdir -p docs/overview docs/decisions design/prototypes design/specs qa release ops archive
touch docs/decisions/.gitkeep design/prototypes/.gitkeep design/specs/.gitkeep qa/.gitkeep release/.gitkeep ops/.gitkeep archive/.gitkeep
```

Expected: the new governance directories exist under the repository root.

- [ ] **Step 2: Write `docs/overview/项目导航.md`**

Write:

```md
# 蓝辉轻改小程序项目导航

## 项目目标

这个仓库用于承载蓝辉轻改小程序第一阶段项目，核心目标是打通：

`浏览商品/套餐 -> 选择门店 -> 提交预约 -> 总部处理 -> 门店线下承接`

## 从哪里开始看

1. 先看 [术语表](./术语表.md)
2. 再看 [开发流程](./开发流程.md)
3. 需要业务背景时看 `docs/requirements/`
4. 需要产品执行依据时看 `docs/product/`
5. 需要原型和静态页面时看 `design/`
6. 需要实际代码时看 `apps/`

## 目录入口

- `docs/overview/`：项目治理、入口导航、术语、流程
- `docs/requirements/`：原始需求和参考资料
- `docs/product/`：PRD、页面规格、任务清单
- `docs/decisions/`：关键决策记录
- `design/`：原型、静态稿、设计表达
- `apps/`：mini-program、admin、server 代码
- `qa/`：测试与验收材料
- `release/`：发布和上线材料
- `ops/`：运营迭代材料
- `archive/`：历史结构归档

## 当前权威链

`requirements -> product -> decisions -> design -> apps -> qa -> release -> ops`

## 当前阶段

当前处于第一轮仓库治理整理阶段，目标是先统一结构、主入口、术语和文档路径，不调整业务逻辑。
```

- [ ] **Step 3: Write `docs/overview/目录规范.md`**

Write:

```md
# 目录规范

## 顶层目录职责

- `docs/`：所有权威文档
- `design/`：原型和静态设计表达
- `apps/`：可运行代码
- `qa/`：测试计划、联调记录、验收结果
- `release/`：发布说明、上线检查项
- `ops/`：运营迭代记录
- `archive/`：旧结构和过渡文件

## 文档放置规则

- 原始需求、参考截图、需求输入放在 `docs/requirements/`
- PRD、页面规格、任务清单放在 `docs/product/`
- 决策结果放在 `docs/decisions/`
- 不要把产品规则只写在 `design/` 或 `apps/`

## 开发约束

- 新增业务文档时，先判断是需求、产品、决策、测试还是发布材料
- 新增页面说明时，优先进入 `docs/product/pages/`
- 原型只能表达已确认产品，不应独立扩展需求
- 代码实现与产品文档冲突时，先补决策或修正文档，再决定是否改代码
```

- [ ] **Step 4: Write `docs/overview/术语表.md` and `docs/overview/开发流程.md`**

Write:

```md
# 术语表

## 核心术语

### 预约单

- 含义：用户当前挑选但尚未提交的预约意向集合
- 页面名称：预约单页
- 备注：不要再称为“预约页”

### 我的预约

- 含义：用户已经提交成功的预约记录
- 页面名称：我的预约页
- 备注：用于查看状态和历史，不承载当前待提交项目

### 门店商品页

- 含义：用户选择门店后，浏览该门店可承接商品和套餐的页面

### 总部运营后台

- 含义：品牌总部使用的后台，不是门店后台
```

Write:

```md
# 开发流程

## 标准顺序

`需求输入 -> 产品收敛 -> 决策固化 -> 原型表达 -> 实现开发 -> 测试验收 -> 发布 -> 运营迭代`

## 人和 AI Agent 的工作顺序

1. 先读 `docs/overview/项目导航.md`
2. 需要业务背景时看 `docs/requirements/`
3. 需要执行开发任务时看 `docs/product/`
4. 存在冲突时先查 `docs/decisions/`
5. 需要看页面流转和界面表达时看 `design/`
6. 最后才进入 `apps/`

## 当前治理阶段约束

- 先统一结构和术语，再继续功能开发
- 未经过 `docs/product/` 明确认定的内容，不直接作为实现依据
- 原型与 PRD 冲突时，以 `docs/product/` 为准
```

- [ ] **Step 5: Verify the governance docs exist**

Run:

```bash
find docs/overview -maxdepth 1 -type f | sort
```

Expected:

```text
docs/overview/开发流程.md
docs/overview/术语表.md
docs/overview/目录规范.md
docs/overview/项目导航.md
```

- [ ] **Step 6: Commit the scaffold**

Run:

```bash
git add docs/overview docs/decisions design/prototypes design/specs qa release ops archive
git commit -m "docs: add repository governance scaffold"
```

### Task 2: Migrate requirements and product documents into `docs/`

**Files:**
- Move: `01-需求/MVP需求文档 V5.md` -> `docs/requirements/MVP需求文档 V5.md`
- Move: `01-需求/MVP需求文档 V5.pdf` -> `docs/requirements/MVP需求文档 V5.pdf`
- Move: `01-需求/参考小程序截图` -> `docs/requirements/references/小程序截图`
- Move: `01-需求/参考软件截图-2` -> `docs/requirements/references/参考软件截图`
- Move: `02-产品方案/PRD-蓝辉轻改小程序.md` -> `docs/product/PRD-蓝辉轻改小程序.md`
- Move: `02-产品方案/第一阶段开发任务清单.md` -> `docs/product/第一阶段开发任务清单.md`
- Move: `02-产品方案/pages/README.md` -> `docs/product/pages/页面索引.md`
- Move: `02-产品方案/pages/01-首页.md` -> `docs/product/pages/首页.md`
- Move: `02-产品方案/pages/02-分类页.md` -> `docs/product/pages/分类页.md`
- Move: `02-产品方案/pages/03-门店页.md` -> `docs/product/pages/门店页.md`
- Move: `02-产品方案/pages/04-门店商品页.md` -> `docs/product/pages/门店商品页.md`
- Move: `02-产品方案/pages/05-商品详情页.md` -> `docs/product/pages/商品详情页.md`
- Move: `02-产品方案/pages/06-预约单提交页.md` -> `docs/product/pages/预约单提交页.md`
- Move: `02-产品方案/pages/07-提交成功页.md` -> `docs/product/pages/提交成功页.md`
- Move: `02-产品方案/pages/08-预约页.md` -> `docs/product/pages/我的预约页.md`
- Move: `02-产品方案/pages/09-我的页.md` -> `docs/product/pages/我的页.md`
- Move: `02-产品方案/pages/10-后台概览.md` -> `docs/product/pages/后台概览.md`
- Move: `02-产品方案/pages/11-后台门店管理.md` -> `docs/product/pages/后台门店管理.md`
- Move: `02-产品方案/pages/12-后台商品管理.md` -> `docs/product/pages/后台商品管理.md`
- Move: `02-产品方案/pages/13-后台套餐管理.md` -> `docs/product/pages/后台套餐管理.md`
- Move: `02-产品方案/pages/14-后台预约单管理.md` -> `docs/product/pages/后台预约单管理.md`
- Move: `02-产品方案/pages/15-后台首页配置.md` -> `docs/product/pages/后台首页配置.md`
- Move: `02-产品方案/pages/16-后台数据统计.md` -> `docs/product/pages/后台数据统计.md`
- Create: `docs/product/pages/商品列表页.md`
- Create: `docs/product/pages/预约单页.md`
- Create: `docs/product/pages/预约详情页.md`

- [ ] **Step 1: Create the new document destinations**

Run:

```bash
mkdir -p docs/requirements/references docs/product/pages
```

Expected: `docs/requirements/`, `docs/requirements/references/`, and `docs/product/pages/` exist.

- [ ] **Step 2: Move the existing requirement and product source files**

Run:

```bash
mv '01-需求/MVP需求文档 V5.md' 'docs/requirements/MVP需求文档 V5.md'
mv '01-需求/MVP需求文档 V5.pdf' 'docs/requirements/MVP需求文档 V5.pdf'
mv '01-需求/参考小程序截图' 'docs/requirements/references/小程序截图'
mv '01-需求/参考软件截图-2' 'docs/requirements/references/参考软件截图'
mv '02-产品方案/PRD-蓝辉轻改小程序.md' 'docs/product/PRD-蓝辉轻改小程序.md'
mv '02-产品方案/第一阶段开发任务清单.md' 'docs/product/第一阶段开发任务清单.md'
mv '02-产品方案/pages/README.md' 'docs/product/pages/页面索引.md'
mv '02-产品方案/pages/01-首页.md' 'docs/product/pages/首页.md'
mv '02-产品方案/pages/02-分类页.md' 'docs/product/pages/分类页.md'
mv '02-产品方案/pages/03-门店页.md' 'docs/product/pages/门店页.md'
mv '02-产品方案/pages/04-门店商品页.md' 'docs/product/pages/门店商品页.md'
mv '02-产品方案/pages/05-商品详情页.md' 'docs/product/pages/商品详情页.md'
mv '02-产品方案/pages/06-预约单提交页.md' 'docs/product/pages/预约单提交页.md'
mv '02-产品方案/pages/07-提交成功页.md' 'docs/product/pages/提交成功页.md'
mv '02-产品方案/pages/08-预约页.md' 'docs/product/pages/我的预约页.md'
mv '02-产品方案/pages/09-我的页.md' 'docs/product/pages/我的页.md'
mv '02-产品方案/pages/10-后台概览.md' 'docs/product/pages/后台概览.md'
mv '02-产品方案/pages/11-后台门店管理.md' 'docs/product/pages/后台门店管理.md'
mv '02-产品方案/pages/12-后台商品管理.md' 'docs/product/pages/后台商品管理.md'
mv '02-产品方案/pages/13-后台套餐管理.md' 'docs/product/pages/后台套餐管理.md'
mv '02-产品方案/pages/14-后台预约单管理.md' 'docs/product/pages/后台预约单管理.md'
mv '02-产品方案/pages/15-后台首页配置.md' 'docs/product/pages/后台首页配置.md'
mv '02-产品方案/pages/16-后台数据统计.md' 'docs/product/pages/后台数据统计.md'
```

Expected: the original requirement and product documents now live under `docs/requirements/` and `docs/product/`.

- [ ] **Step 3: Add the missing bridge page specs**

Write `docs/product/pages/商品列表页.md`:

```md
# 商品列表页 - 页面桥接说明

## 页面定位

商品列表页用于承接分类、品牌、车型、专题等来源，支持用户在未选门店状态下先浏览商品，再进入商品详情页。

## 当前来源

- 设计原型：`design/prototypes/mini-program/03-product-list.html`
- 开发任务清单：`docs/product/第一阶段开发任务清单.md`

## 核心规则

- 支持来源参数：分类、品牌、车型、专题
- 支持排序和筛选入口
- 可以未选门店先浏览
- 点击商品卡进入商品详情页

## 治理说明

本文件用于补齐原先缺失的产品页说明，先解决导航和命名缺口，不在本轮重写完整页面规格。
```

Write `docs/product/pages/预约单页.md`:

```md
# 预约单页 - 页面桥接说明

## 页面定位

预约单页用于承接用户当前已挑选但尚未提交的商品和套餐，是提交预约前的整理页面。

## 与“我的预约”的区别

- `预约单页`：当前待提交意向
- `我的预约页`：已提交成功的预约记录

## 当前来源

- 设计原型：`design/prototypes/mini-program/08-booking-list.html`
- 页面行为参考：`design/prototypes/mini-program/17-booking-history.html`

## 核心规则

- 支持查看当前已选商品/套餐
- 支持改数量和移除项目
- 支持查看和切换当前服务门店
- 支持进入预约单提交页

## 治理说明

本文件用于在产品导航层明确“预约单”概念，避免继续与“我的预约”混用。
```

Write `docs/product/pages/预约详情页.md`:

```md
# 预约详情页 - 页面桥接说明

## 页面定位

预约详情页用于展示某一条已提交预约的详情信息和处理状态。

## 当前来源

- 设计原型：`design/prototypes/mini-program/10-booking-detail.html`
- 列表入口：`docs/product/pages/我的预约页.md`

## 核心规则

- 展示预约单号、门店、项目、预约时间、联系方式
- 展示总部或门店处理进度
- 从“我的预约页”进入

## 治理说明

本文件用于补齐历史文档中缺失的详情页入口说明，不在本轮展开完整交互定义。
```

- [ ] **Step 4: Verify the product page set**

Run:

```bash
find docs/product/pages -maxdepth 1 -type f | sort
```

Expected: the folder contains renamed business-named page docs plus `商品列表页.md`, `预约单页.md`, and `预约详情页.md`.

- [ ] **Step 5: Commit the doc migration**

Run:

```bash
git add docs/requirements docs/product
git commit -m "docs: migrate requirements and product docs"
```

### Task 3: Migrate design assets and application codebases into `design/` and `apps/`

**Files:**
- Move: `03-设计/screens` -> `design/prototypes/mini-program`
- Move: `03-设计/原型admin` -> `design/prototypes/admin`
- Move: `04-开发/mini-program` -> `apps/mini-program`
- Move: `04-开发/admin` -> `apps/admin`
- Move: `04-开发/server` -> `apps/server`

- [ ] **Step 1: Create the target app and design directories**

Run:

```bash
mkdir -p design/prototypes apps
```

Expected: `design/prototypes/` and `apps/` exist.

- [ ] **Step 2: Move the design and application directories**

Run:

```bash
mv '03-设计/screens' 'design/prototypes/mini-program'
mv '03-设计/原型admin' 'design/prototypes/admin'
mv '04-开发/mini-program' 'apps/mini-program'
mv '04-开发/admin' 'apps/admin'
mv '04-开发/server' 'apps/server'
```

Expected: prototypes live under `design/prototypes/` and runnable codebases live under `apps/`.

- [ ] **Step 3: Verify the migrated structure**

Run:

```bash
find design/prototypes -maxdepth 2 -type d | sort
find apps -maxdepth 2 -type d | sort
```

Expected:

```text
design/prototypes
design/prototypes/admin
design/prototypes/mini-program
apps
apps/admin
apps/mini-program
apps/server
```

- [ ] **Step 4: Commit the directory migration**

Run:

```bash
git add design/prototypes apps
git commit -m "chore: move design and app assets into role-based directories"
```

### Task 4: Rewrite navigation docs and repair obvious broken internal links

**Files:**
- Modify: `README.md`
- Modify: `docs/product/第一阶段开发任务清单.md`
- Modify: `docs/product/pages/页面索引.md`
- Modify: `docs/product/PRD-蓝辉轻改小程序.md`
- Modify: `docs/requirements/MVP需求文档 V5.md`

- [ ] **Step 1: Rewrite `README.md` as a concise external entry**

Write:

```md
# 蓝辉轻改小程序

品牌预约到店型轻改装小程序项目仓库。

## 项目入口

请先阅读 [项目导航](docs/overview/项目导航.md)。

## 目录概览

- `docs/`：需求、产品、治理文档
- `design/`：原型与设计表达
- `apps/`：mini-program、admin、server
- `qa/`：测试与验收
- `release/`：发布材料
- `ops/`：运营迭代

## 技术栈

- 小程序：uni-app / Vue
- 后端：NestJS / Prisma / MySQL
- 后台：Vue 3 / Element Plus / Vite
```

- [ ] **Step 2: Repair path references in `docs/product/第一阶段开发任务清单.md`**

Apply these path substitutions:

```text
/Users/fkycoya/Documents/mini-program/docs/pages/
-> /Users/fkycoya/Documents/mini-program/docs/product/pages/

/Users/fkycoya/Documents/mini-program/原型图/screens/
-> /Users/fkycoya/Documents/mini-program/design/prototypes/mini-program/

docs/pages/
-> docs/product/pages/

原型图/screens/
-> design/prototypes/mini-program/
```

Also normalize the following terminology in that file:

```text
“预约页” (when meaning submitted history) -> “我的预约页”
“预约单页” keeps the current-intent meaning
```

- [ ] **Step 3: Repair path references in `docs/product/pages/页面索引.md`**

Apply these content fixes:

```text
“08 | 预约页” -> “08 | 预约单页”
新增 “09 | 我的预约页”
将原 “09 | 我的页” 顺延为 “10 | 我的页” 仅作为显示顺序
将页面跳转中的“我的预约 -> 预约页”改为“我的预约 -> 我的预约页”
将“用户需先选择门店才能浏览商品”改为“用户可先浏览商品，提交预约前必须先选择门店”
```

- [ ] **Step 4: Repair navigation-level terminology in PRD and requirement doc**

Run:

```bash
rg -n '预约页|我的预约|预约单' docs/product/PRD-蓝辉轻改小程序.md docs/requirements/MVP需求文档\ V5.md
```

Then edit only the navigation-level wording so these rules are explicit:

```text
预约单 = 当前待提交意向
我的预约 = 已提交记录
```

Do not rewrite the whole documents in this pass.

- [ ] **Step 5: Verify no obsolete path family remains in the primary product docs**

Run:

```bash
rg -n 'docs/pages|原型图/screens' docs/product docs/overview README.md
```

Expected: no matches.

- [ ] **Step 6: Commit the navigation repair**

Run:

```bash
git add README.md docs/overview docs/product docs/requirements
git commit -m "docs: rewrite navigation and repair broken links"
```

### Task 5: Archive the legacy numbered structure without deleting history

**Files:**
- Move: `00-项目总览` -> `archive/00-项目总览`
- Move: `01-需求` -> `archive/01-需求`
- Move: `02-产品方案` -> `archive/02-产品方案`
- Move: `03-设计` -> `archive/03-设计`
- Move: `04-开发` -> `archive/04-开发`
- Move: `05-测试` -> `archive/05-测试`
- Move: `06-发布` -> `archive/06-发布`
- Move: `07-运营迭代` -> `archive/07-运营迭代`

- [ ] **Step 1: Confirm the legacy roots are now empty or transitional**

Run:

```bash
find '00-项目总览' '01-需求' '02-产品方案' '03-设计' '04-开发' '05-测试' '06-发布' '07-运营迭代' -maxdepth 1 -mindepth 1
```

Expected: either no output, or only leftover empty shells and metadata files.

- [ ] **Step 2: Move the legacy roots into `archive/`**

Run:

```bash
mv '00-项目总览' 'archive/00-项目总览'
mv '01-需求' 'archive/01-需求'
mv '02-产品方案' 'archive/02-产品方案'
mv '03-设计' 'archive/03-设计'
mv '04-开发' 'archive/04-开发'
mv '05-测试' 'archive/05-测试'
mv '06-发布' 'archive/06-发布'
mv '07-运营迭代' 'archive/07-运营迭代'
```

Expected: the repository root no longer uses the numbered structure as active working directories.

- [ ] **Step 3: Verify the root shape**

Run:

```bash
find . -maxdepth 1 -type d | sort
```

Expected: root contains `docs`, `design`, `apps`, `qa`, `release`, `ops`, `archive`, plus auxiliary support folders such as `.git` and `.claude`.

- [ ] **Step 4: Commit the archive move**

Run:

```bash
git add archive
git commit -m "chore: archive legacy numbered structure"
```

### Task 6: Run final repository verification

**Files:**
- Verify: `README.md`
- Verify: `docs/overview/项目导航.md`
- Verify: `docs/product/第一阶段开发任务清单.md`
- Verify: `docs/product/pages/页面索引.md`

- [ ] **Step 1: Verify the active top-level structure**

Run:

```bash
find . -maxdepth 1 -type d | sort
```

Expected: the working repository follows the new role-based structure.

- [ ] **Step 2: Verify the single-entry and obsolete-path rules**

Run:

```bash
rg -n 'docs/pages|原型图/screens' README.md docs/overview docs/product
```

Expected: no matches.

- [ ] **Step 3: Verify terminology separation in the active navigation layer**

Run:

```bash
rg -n '预约单页|我的预约页' README.md docs/overview docs/product
```

Expected: both terms appear and are used with distinct meanings.

- [ ] **Step 4: Review git status before completion**

Run:

```bash
git status --short
```

Expected: only intended governance changes remain, with no accidental business-code edits.

- [ ] **Step 5: Final commit**

Run:

```bash
git add README.md docs design apps archive qa release ops
git commit -m "chore: complete repository governance reorganization"
```

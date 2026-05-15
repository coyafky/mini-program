# Mini Program Governance Design

**Date:** 2026-05-14
**Status:** Approved for execution after written-spec review
**Scope:** Repository governance, information architecture, and collaboration workflow

---

## 1. Goal

Reorganize the mini program repository into a stable, role-based structure so product, design, engineering, QA, and AI agents can work from the same source of truth.

This round focuses on governance only:
- Define the new top-level structure
- Establish documentation authority and terminology rules
- Create a single project entry document
- Migrate existing materials into the new structure
- Repair obvious broken internal references

This round does not include:
- Business logic refactors
- Feature implementation changes
- API redesign
- Frontend or backend behavior changes

---

## 2. Current Problems

The repository is difficult to operate because the structure and the document semantics have drifted:

1. The top-level folders are organized by phase, but the real content already behaves like role-based assets.
2. The same concept is described with different names across requirements, PRD, prototype, and code.
3. Some product documents reference paths that no longer exist.
4. There is no single project entry document for humans or AI agents.
5. Design artifacts, product specs, and development assets are mixed conceptually even when they are physically separated.

Representative examples:
- `预约页` is used ambiguously for both the user's current intent list and submitted booking history.
- `第一阶段开发任务清单.md` references `docs/pages/...` and `原型图/screens/...`, but those paths are not present in the repository.
- The empty numbered folders at the root no longer reflect the actual working model of the project.

---

## 3. Design Principles

1. Organize by responsibility, not by delivery phase.
2. Make one document the single starting point for the project.
3. Separate source-of-truth documents from derived design artifacts.
4. Normalize core terminology before expanding or editing more content.
5. Avoid touching running application code in this governance pass.
6. Make the structure predictable for both humans and AI agents.

---

## 4. Target Repository Structure

```text
/
├── README.md
├── docs/
│   ├── overview/
│   │   ├── 项目导航.md
│   │   ├── 目录规范.md
│   │   ├── 术语表.md
│   │   └── 开发流程.md
│   ├── requirements/
│   │   ├── MVP需求文档 V5.md
│   │   └── references/
│   │       ├── 小程序截图/
│   │       └── 参考软件截图/
│   ├── product/
│   │   ├── PRD-蓝辉轻改小程序.md
│   │   ├── 第一阶段开发任务清单.md
│   │   └── pages/
│   └── decisions/
├── design/
│   ├── prototypes/
│   │   ├── mini-program/
│   │   └── admin/
│   └── specs/
├── apps/
│   ├── mini-program/
│   ├── admin/
│   └── server/
├── qa/
├── release/
├── ops/
└── archive/
```

### Responsibility by top-level folder

- `docs/`: authoritative written project knowledge
- `design/`: visual and interaction artifacts derived from product specs
- `apps/`: runnable codebases
- `qa/`: test plans, validation records, acceptance assets
- `release/`: delivery and launch materials
- `ops/`: post-launch operation and iteration assets
- `archive/`: retired or transitional structure kept only for traceability

---

## 5. Documentation Authority Chain

The repository must follow this authority chain:

1. `docs/requirements/`
   - Raw demand, reference inputs, discovery material
   - Answers: why the project exists and what references informed it
   - Not the final implementation contract

2. `docs/product/`
   - Product execution layer
   - PRD, page specs, process definitions, development task lists
   - Default source of truth for implementation unless an explicit decision record overrides it

3. `docs/decisions/`
   - Records conflict resolution and key scope or terminology decisions
   - Used when requirements, PRD, prototype, or code disagree

4. `design/`
   - Visual expression of approved product specs
   - Must not invent new product rules independently

5. `apps/`
   - Implementation layer
   - Code should align with `docs/product/` and `docs/decisions/`

If prototype and product spec conflict, the product spec wins unless a decision record says otherwise.

---

## 6. Terminology Rules

The governance pass must lock the following terms:

### 6.1 Current user intent set

- Canonical term: `预约单`
- Canonical page name: `预约单页`
- Meaning: the user's current intended booking items before submission

### 6.2 Submitted booking history

- Canonical term: `我的预约`
- Canonical page name: `我的预约页`
- Meaning: submitted bookings that the user can review later

### 6.3 Naming policy

- File names should prioritize business meaning over serial numbering
- Numbering may be retained only as ordering metadata where useful, not as the semantic source
- New documents should avoid ambiguous labels such as `预约页`

---

## 7. Migration Mapping

Old-to-new structure mapping for the first governance pass:

- `00-项目总览` -> `docs/overview`
- `01-需求` -> `docs/requirements`
- `02-产品方案` -> `docs/product`
- `03-设计` -> `design`
- `04-开发` -> `apps`
- `05-测试` -> `qa`
- `06-发布` -> `release`
- `07-运营迭代` -> `ops`

### Archive policy

The old numbered root folders should not remain as first-class working directories after migration. Any transitional leftovers should be moved under `archive/` to prevent split usage between old and new structures.

---

## 8. First-Pass Execution Boundary

The first execution pass should include:

1. Create the new folder structure
2. Create the overview governance documents
3. Migrate existing requirement, product, design, and app assets into the new structure
4. Rewrite `README.md` to be an external summary and pointer
5. Create `docs/overview/项目导航.md` as the single project entry document
6. Repair obvious path breakage caused by the old structure
7. Normalize the most critical terminology in governance and product navigation documents

The first execution pass should explicitly exclude:

1. Refactoring application source code
2. Changing mini program or admin behavior
3. Fixing every content inconsistency in all historical documents
4. Redesigning product scope
5. Rewriting all page specs from scratch

---

## 9. AI Agent Collaboration Workflow

All future work should follow this sequence:

`requirements -> product -> decisions -> design -> apps -> qa -> release -> ops`

### Rules for AI agent usage

1. Agents must read `docs/overview/项目导航.md` first when starting repository work.
2. Agents must use `docs/product/` as the default implementation context.
3. When ambiguity exists, agents should consult `docs/decisions/` before inferring behavior from prototypes or code.
4. Agents may use `design/` to understand layout and flow, but not as the default business authority.
5. Agents should treat `apps/` as implementation output, not as the original intent definition.

---

## 10. Deliverables for This Governance Pass

Expected deliverables:

1. `docs/overview/项目导航.md`
2. `docs/overview/目录规范.md`
3. `docs/overview/术语表.md`
4. `docs/overview/开发流程.md`
5. Migrated top-level project materials into role-based directories
6. Rewritten `README.md`
7. Corrected obvious broken internal links caused by structure drift

---

## 11. Risks and Constraints

1. Some legacy references may still exist after the first pass because not every historical note is worth normalizing immediately.
2. Moving files changes paths, so link repair must be part of the same pass.
3. Code directories may contain build artifacts such as `dist/`; those are not the main focus of this governance round.
4. The product corpus already contains semantic drift, so the first pass should fix navigation-level ambiguity first rather than trying to rewrite all content.

---

## 12. Acceptance Criteria

This governance design is considered implemented successfully when:

1. The repository has a role-based top-level structure.
2. `docs/overview/项目导航.md` is the single human and AI entry point.
3. The main requirement, product, design, and code assets live under their new responsibility-based directories.
4. The terms `预约单` and `我的预约` are clearly separated in overview and product navigation layers.
5. The most obvious broken internal links introduced by prior structure drift are repaired.
6. No business code behavior is intentionally changed during the pass.

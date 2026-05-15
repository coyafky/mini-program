# Mini Program Vue 3 Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the mini-program on a Vue 3 uni-app foundation while preserving the current page flow, copy, and interaction model.

**Architecture:** Create a new Vue 3 app directory from a stable uni-app template, then port shared infrastructure first and migrate the existing flows by business module. Keep the old mini-program as a migration baseline until the new app can run and complete the core booking flow.

**Tech Stack:** uni-app, Vite, Vue 3, TypeScript, Pinia, axios

---

### Task 1: Scaffold The New App Base

**Files:**
- Create: `apps/mini-program-vue3/**`
- Reference: `apps/mini-program/**`
- Reference: `docs/superpowers/specs/2026-05-14-mini-program-vue3-rewrite-design.md`

- [ ] **Step 1: Clone or copy the Vue 3 template into a temporary directory**

Run: `git clone --depth 1 https://github.com/oyjt/uniapp-vue3-template.git /private/tmp/uniapp-vue3-template`
Expected: template files available under `/private/tmp/uniapp-vue3-template`

- [ ] **Step 2: Copy the template into the new app directory**

Run: `mkdir -p apps/mini-program-vue3`
Expected: new app directory exists for the rewrite target

- [ ] **Step 3: Normalize the new app metadata**

Update package name, app name, and development scripts to match this repository and the rewrite target.

- [ ] **Step 4: Install dependencies and verify the template builds**

Run: `pnpm install`
Run: `pnpm build:h5` or the closest available build script
Expected: template compiles before business migration starts

### Task 2: Port Shared Infrastructure

**Files:**
- Create: `apps/mini-program-vue3/src/stores/**`
- Create: `apps/mini-program-vue3/src/services/**`
- Create: `apps/mini-program-vue3/src/types/**`
- Create: `apps/mini-program-vue3/src/utils/**`
- Reference: `apps/mini-program/api/index.js`
- Reference: `apps/mini-program/store/index.js`
- Reference: `apps/server/.env.example`

- [ ] **Step 1: Create shared HTTP client**

Add an axios-based HTTP module with:
- base URL configuration
- token injection
- 401 handling
- unified error normalization

- [ ] **Step 2: Create service modules**

Split API calls into:
- `auth`
- `home`
- `store`
- `product`
- `reservation`
- `user`

- [ ] **Step 3: Create Pinia stores**

Implement:
- `useUserStore`
- `useStoreStore`
- `useBookingStore`

- [ ] **Step 4: Preserve storage compatibility**

Keep the same local storage keys used by the current app so migration does not break cached state.

### Task 3: Rebuild The Route And App Shell

**Files:**
- Modify: `apps/mini-program-vue3/pages.json`
- Modify: `apps/mini-program-vue3/manifest.json`
- Modify: `apps/mini-program-vue3/src/App.vue`
- Modify: `apps/mini-program-vue3/src/main.*`

- [ ] **Step 1: Recreate the existing page map**

Define the current page routes and tab bar entries in the new app shell.

- [ ] **Step 2: Recreate global app bootstrap**

Port launch-time state recovery for:
- current store
- user token
- user info

- [ ] **Step 3: Recreate shared styling**

Port the shared visual tokens and global styles needed by the existing pages.

### Task 4: Migrate The Core Booking Flow

**Files:**
- Create: `apps/mini-program-vue3/src/pages/home/**`
- Create: `apps/mini-program-vue3/src/pages/store/**`
- Create: `apps/mini-program-vue3/src/pages/product/**`
- Create: `apps/mini-program-vue3/src/pages/booking/**`
- Reference: `apps/mini-program/pages/**`

- [ ] **Step 1: Port the home page**

Preserve the current sections, copy, and navigation behavior.

- [ ] **Step 2: Port the store selection flow**

Preserve:
- current store selection
- store detail jump
- storage persistence

- [ ] **Step 3: Port product detail and booking submit**

Preserve:
- product/package mode
- current store gating
- submit flow

- [ ] **Step 4: Port booking success and booking list detail**

Preserve post-submit navigation and booking status display.

### Task 5: Migrate The Remaining Pages And Verify

**Files:**
- Create: `apps/mini-program-vue3/src/pages/category/**`
- Create: `apps/mini-program-vue3/src/pages/mine/**`
- Verification: `apps/mini-program-vue3/**`

- [ ] **Step 1: Port category and mine pages**

Keep current structure and copy intact while replacing implementation details.

- [ ] **Step 2: Run build verification**

Run the available build command for the new app.
Expected: compile succeeds without relying on the old Vue 2 app.

- [ ] **Step 3: Document remaining gaps**

Record any issues that still require:
- HBuilderX / WeChat DevTools verification
- real-device testing
- API edge-case fixes

- [ ] **Step 4: Commit**

```bash
git add apps/mini-program-vue3 docs/superpowers/plans/2026-05-14-mini-program-vue3-rewrite-plan.md
git commit -m "feat: scaffold vue3 mini-program rewrite"
```

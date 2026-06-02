---
name: github-actions-yarn3-corepack
description: Fix GitHub Actions CI failures when using Yarn 3+ with the packageManager field in package.json
source: auto-skill
extracted_at: '2026-06-02T02:09:00.000Z'
---

# GitHub Actions + Yarn 3 + Corepack Fix

When a project's `package.json` has `"packageManager": "yarn@3.x.x"` and uses a `.yarnrc.yml` config, GitHub Actions will fail with:

```
error This project's package.json defines "packageManager": "yarn@3.5.0".
However the current global version of Yarn is 1.22.22.
```

## Root Cause

GitHub Actions runners ship with Yarn 1.x globally. The `packageManager` field triggers Corepack, but Corepack is disabled by default. Additionally, `actions/setup-node` with `cache: 'yarn'` runs `yarn cache dir` **during its own setup step**, before any subsequent steps execute.

## Fix

Add `corepack enable` **immediately after checkout**, before `setup-node`:

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v4
  - name: Enable Corepack          # ← Must come BEFORE setup-node
    run: corepack enable
  - name: Setup Node
    uses: actions/setup-node@v4
    with:
      node-version: "20"
      cache: 'yarn'                  # This runs yarn during setup
  - name: Install dependencies
    run: yarn install --frozen-lockfile
  - name: Build
    run: yarn build
```

## Why Not After setup-node?

`setup-node` with `cache: 'yarn'` invokes `yarn cache dir` to determine the cache path. If Corepack isn't enabled at that point, yarn 1.x runs and rejects the `packageManager` field.

## Also Ensure

- `.yarnrc.yml` exists with at least `nodeLinker: node-modules` (for yarn 3 with node_modules)
- `yarn.lock` is committed (not the yarn 1 format — yarn 3 uses a different format)
- Use `--frozen-lockfile` in CI to prevent lockfile modifications

## Debugging CI Failures

```bash
# List recent runs
gh run list --limit 3

# View specific run
gh run view <RUN_ID>

# View only failed step logs
gh run view <RUN_ID> --log-failed
```

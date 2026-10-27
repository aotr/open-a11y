# 📦 Publishing Guide — npm Release Process

> How to publish `@aotr/open-a11y` to the npm registry.

---

## ✅ Pre-Publish Checklist

Before publishing, verify:

```bash
# Run from the package root

# 1. All tests pass
npm test                     # Full Vitest suite

# 2. Type checking passes
npm run lint                 # Should show: no errors

# 3. Build succeeds (generates dist/)
npm run build                # Rollup bundles + types + Angular ng-packagr output

# 4. Dist files exist
ls dist/
# Expected: index.js, index.cjs, react.js, vue.js, svelte.js,
# open-a11y.js, styles.css, types/, angular/
```

---

## 🚀 Publishing Steps

### 1. Update Version

```bash
# Manual: edit package.json "version" field
# Or use npm version:
npm version patch    # 1.0.0 → 1.0.1 (bug fixes)
npm version minor    # 1.0.0 → 1.1.0 (new features)
npm version major    # 1.0.0 → 2.0.0 (breaking changes)
```

### 2. Update CHANGELOG

Edit `CHANGELOG.md` with the new version's changes.

### 3. Build & Publish

```bash
npm login                  # First time only
npm publish --access public --scope=@aotr
```

`prepublishOnly` hook runs `npm run build` automatically — dist is always fresh.

### 4. Verify

```bash
npm view @aotr/open-a11y version
# Should show the new version
```

---

## 📁 What Gets Published

Defined in `package.json` → `"files"`:

```json
"files": [
  "dist",
  "README.md",
  "LICENSE",
  "CHANGELOG.md",
  "docs/assets"
]
```

**What's included:**

- `dist/` — Built JavaScript + TypeScript declarations
- `README.md` — Package documentation
- `LICENSE` — MIT license
- `CHANGELOG.md` — Version history

**What's excluded (via `.npmignore`):**

- `src/` — Source TypeScript (consumers use `dist/`)
- `__tests__/` — Test files
- `tsconfig.json`, `rollup.config.mjs`, `vitest.config.ts` — Build config
- `node_modules/` — Dependencies

---

## 🔄 Release Workflow

```
1. Make changes in src/
2. npm test                     ← Verify no regressions
3. npm run build                ← Generate fresh dist/
4. npm version patch            ← Bump version
5. Update CHANGELOG.md          ← Document changes
6. git commit -am "v1.0.1"     ← Commit
7. git tag v1.0.1               ← Tag
8. npm publish                  ← Ship it!
9. git push --tags              ← Push to GitHub
```

---

## 🧪 Local Testing Before Publish

### Test in a local app

```bash
# In this package:
npm run build

# In a consuming app, link the local build:
npm link
npm link @aotr/open-a11y
```

### Test in Another Project

```bash
# In this package:
npm link

# In other project:
npm link @aotr/open-a11y
```

### Test as Packed Tarball

```bash
# In this package:
npm pack
# Creates: aotr-open-a11y-2.0.0.tgz

# In other project:
npm install /path/to/aotr-open-a11y-2.0.0.tgz
```

---

## 🏷️ Semantic Versioning

| Change                           | Version       | Example           |
| -------------------------------- | ------------- | ----------------- |
| Bug fix                          | Patch (1.0.x) | `1.0.0` → `1.0.1` |
| New feature, backward-compatible | Minor (1.x.0) | `1.0.0` → `1.1.0` |
| Breaking API change              | Major (x.0.0) | `1.0.0` → `2.0.0` |

---

## ⚠️ Common Issues

### "You do not have permission to publish"

```bash
npm login
# Enter your npm username, password, and 2FA code
```

### "403 Forbidden — cannot publish over previously published version"

You're trying to publish a version that already exists. Bump the version:

```bash
npm version patch
```

### Dist files are stale

```bash
npm run clean    # rm -rf dist
npm run build    # Fresh build
```

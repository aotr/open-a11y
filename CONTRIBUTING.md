# Contributing to open-a11y

Thanks for helping make the web more accessible.

## Setup

```bash
git clone https://github.com/aotr/open-a11y.git
cd open-a11y
npm install
npm run build
npm test
```

The project uses Vite+ for formatting, linting, type checks, tests, and demo
builds:

```bash
npm exec -- vp check
npm exec -- vp test
npm exec -- vp dev examples/vanilla
```

The Angular build uses pnpm for its isolated library workspace:

```bash
pnpm --dir angular-lib install
pnpm --dir examples/angular install
```

## Project layout

```text
src/
  engine/       public state owner and tool dispatch
  state/        internal persistence and normalization
  css/          one generator and one injector
  tools/        manifest-driven tool executors
  profiles/     canonical profile presets
  ui/           web components and lifecycle registry
  react/        React adapter
  vue/          Vue adapter
  svelte/       Svelte adapter
  angular/      Angular adapter source
examples/       one runnable app per adapter
angular-lib/    ng-packagr build for AOT metadata
docs/           architecture and API notes
```

## Before opening a pull request

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:dist
```

For adapter changes, also build the matching demo:

```bash
npm exec -- vp build examples/vue
pnpm --dir examples/angular build
```

## Rules

- Keep the engine as the only public state owner.
- Use the manifest for tool metadata and canonical state keys.
- Route CSS through `src/css/cssInjector.ts`.
- Keep adapter entries thin; import the core instead of copying it.
- Add a test for behavior changes and a browser check for UI changes.
- Never commit credentials or generated `node_modules` directories.
- No vendor-specific branding in the package source.

## License

By contributing, you agree that your changes are licensed under the MIT license.

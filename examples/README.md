# open-a11y examples

Every adapter has its own app. Each app shows the same widget configuration
surface, a live state inspector, and a customization panel for position, side,
offset, blur, button size, brand colors, footer copy, menu title, language, and
floating-button visibility.

Build the library once before running a demo:

```bash
npm install
npm run build
```

The demos are Vite+ apps. Run them through the root scripts, or use `vp dev`
inside any example directory after installing its dependencies.

| Adapter    | Command                | URL                   |
| ---------- | ---------------------- | --------------------- |
| Vanilla JS | `npm run demo:vanilla` | http://localhost:4174 |
| React      | `npm run demo:react`   | http://localhost:4175 |
| Vue        | `npm run demo:vue`     | http://localhost:4176 |
| Svelte     | `npm run demo:svelte`  | http://localhost:4177 |
| Angular    | `npm run demo:angular` | http://localhost:4178 |

The Angular app uses pnpm because Angular's builder is kept out of the package
root. Install its dependencies once:

```bash
pnpm --dir examples/angular install
```

## Standalone use

Each directory has its own `package.json` and can be copied into a separate
project. Point `@aotr/open-a11y` at the published package instead of
`file:../..` when you do.

## Customization

The shared demo controls live in [`shared/customizer.ts`](./shared/customizer.ts)
and [`shared/demo.css`](./shared/demo.css). Each app remounts the widget through
the public `UIOptions.config` override, so accessibility state survives a
configuration change.

The Laravel Blade and Livewire examples live in the companion repository:
[`aotr/open-a11y-laravel`](https://github.com/aotr/open-a11y-laravel).

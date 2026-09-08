# Digital Autopsy: `yuanchuan/game-of-life`

## Scope and provenance

This checkout is `/Users/mac/einsia/game-of-life`, branch `master`, at commit `8124c7f` (`Fix style`). `git status --short --branch` was clean before this report and showed `master...origin/master`; the only configured remote is `git@github.com:yuanchuan/game-of-life.git`. The upstream history ends at `8124c7f`, authored and committed by `yuanchuan` on 2019-05-27. The preceding fixes are explicitly about GitHub's contribution-board layout (`947e9d0`, `06b5747`, `8674102`, `8124c7f`). The repository's current GitHub profile listing identifies `game-of-life` as a **Public archive** and repeats its description, “A browser extension to play Conway's Game of Life on GitHub contribution board.”

The checkout contains only the original source tree (`src/index.js`, `src/style.css`, `src/manifest.json`), documentation, icons, and screencasts. `README.md` still points to the Chrome Web Store listing and says to click Play on a GitHub profile.

## Reproduced/read-only observations

Commands run:

```sh
pwd
rg --files
 git status --short --branch
 git remote -v
 git log --oneline --decorate -8
 cat src/manifest.json
 rg -n 'querySelector|classList|github|contrib|data-' src/index.js
 git log --reverse --format='%h %ad %an %s' --date=short
 git tag -n
```

No files other than this report were changed. No extension was installed and no product code was edited.

### Chrome/platform failure

`src/manifest.json` declares `"manifest_version": 2`, with a `content_scripts` entry and no service worker. Modern Chrome has removed MV2 from the supported extension path (MV2 extensions are disabled/blocked as Chrome's MV3 migration completes). Consequently, a fresh modern-Chrome install cannot be treated as a reliable execution environment: the browser platform rejects or disables the package before GitHub DOM code can run. This is a packaging/platform break, not evidence that Conway's algorithm is wrong.

The match pattern is also only `https://github.com/*`; it excludes several paths but has no handling for alternate hosts, logged-out redirects, or GitHub's later navigation behavior.

### GitHub DOM/API failure

The script assumes the 2019 contribution graph structure and classes:

* `document.querySelector('.js-yearly-contributions')` must find the graph wrapper for the Play button.
* `document.querySelector('.contrib-legend')` and `.legend li:nth-child(3)` must exist and expose the alive color through computed style.
* `document.querySelector('.js-calendar-graph').parentNode` is used as the injection container.
* Initial state requires `.js-calendar-graph-svg > g > g` containing `rect` nodes; each rect is mapped with fixed offsets `x + 3`, `y + 4`.
* Alignment requires `.js-calendar-graph-svg > g > g:first-child`.
* PJAX handling assumes `#js-pjax-container`, `#js-pjax-loader-bar`, link classes `underline-nav-item|js-year-link`, and `.js-activity-overview-graph-container`.

A current read of `https://github.com/yuanchuan` (2026-09-08 session; page fetched successfully) shows the modern GitHub shell/profile and labels the repository archived. The fetched page does not expose the old contribution-graph SVG/class structure in its rendered text; it does expose modern navigation and dynamic loading/error states. This is consistent with the script's first hard failure: if `.js-yearly-contributions` is absent, `Game.init()` does nothing, so no Play control is inserted. If a partial match remains, later dereferences (`legend.querySelector`, `.js-calendar-graph).parentNode`, SVG `rect` enumeration) can throw `TypeError` or produce an empty/incorrect board.

The CSS independently targets old markup and presentation: `#gol-contribution-board` overlays a fixed 60-column × 13-row board, and selectors include `[gol-layout-overview]`, `.graph-before-activity-overview`, `li[style$="240);"]`, and the old `.contrib-legend` layout. Inline-style suffix tests are especially brittle: browser serialization or GitHub's CSS/color representation changes make `Canvas.isEmpty()` and `animateBackground()` misclassify cells.

## Code defects distinct from platform breakage

* `Game.init()` reads `legend.querySelector(...)` before checking `if (legend)`, so a missing legend throws immediately.
* `Game.play()` dereferences `document.querySelector('.js-calendar-graph').parentNode` without a null check.
* Board dimensions and offsets (`ROW = 13`, `COL = 60`, `x + 3`, `y + 4`) are constants tied to one historical graph shape, not discovered from the DOM.
* Cell state is inferred from serialized inline style suffixes (`style$="240);"`) rather than semantic attributes or normalized computed colors.
* The PJAX polling loop assumes `loaderBar` exists and reads `loaderBar.className`; a missing loader bar is another null dereference.
* The code uses legacy `var`, string-built HTML, vendor-prefixed transition assignments, and a misspelled CSS property (`transfom-origin`). These are maintenance issues, but they are secondary to the unavailable MV2 platform and changed GitHub markup.
* `rle()` and the Life transition logic are self-contained and do not depend on GitHub. Nothing in the read-only inspection indicates a defect in Conway neighbor counting or the bundled pattern data.

## Minimal faithful resurrection plan

1. Preserve attribution to Yuán Chuān/`yuanchuan`, the original repository URL, license, pattern names, and the historical 1.3.7 behavior. Keep the old source available in git history.
2. Port packaging to Manifest V3: replace MV2 metadata with a valid MV3 manifest and use a content script suitable for current Chrome; verify host permissions and Chrome Web Store policy requirements.
3. Introduce a small GitHub adapter that discovers the current contribution calendar from stable semantic attributes/accessible data, rather than relying on the 2019 SVG hierarchy, fixed offsets, or inline-style suffixes. Make absence of the graph a normal no-op.
4. Keep the Life engine independent of the adapter. Add null-safe initialization, teardown, and SPA navigation handling; derive rows, columns, and cell colors from the discovered graph.
5. Recreate the overlay and controls with current GitHub layout CSS, then manually test profile pages, year switching, SPA navigation, logged-out pages, dark/light themes, and an empty contribution history.
6. Validate in a current Chrome MV3 extension load and in a small DOM fixture test suite that covers selector drift and color serialization. Do not claim compatibility with GitHub until those checks pass.

This plan changes the integration boundary and packaging while preserving the original game behavior, visual intent, and attribution.

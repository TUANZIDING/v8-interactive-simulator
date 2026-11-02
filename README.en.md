# Machine Archive · V8 & Sentinel

[简体中文](README.md) · [Live gallery](https://tuanziding.github.io/v8-interactive-simulator/gallery.html) · [Release v1.0.0](https://github.com/TUANZIDING/v8-interactive-simulator/releases/tag/v1.0.0)

Two interactive 3D studies with self-contained offline HTML: a V8 four-stroke engine and a procedural Sentinel-inspired robot.

| Demo | Features | Open |
| --- | --- | --- |
| V8 | Cylinder tracking, cutaway, RPM, valve lift and educational pressure plots | [Live](https://tuanziding.github.io/v8-interactive-simulator/) |
| Sentinel | 400 chain links, 13 sensors, spatial cruise, turns, exploded inspection and isolation | [Live](https://tuanziding.github.io/v8-interactive-simulator/sentinel.html) |

## Build

Node.js 20+ required. No Python or API key is needed for HTML builds.

```sh
npm ci --prefix teardown
node publish-build.mjs
node preview-site.mjs
```

Visit `http://127.0.0.1:4174/gallery.html`. Download individual HTML files or the complete offline ZIP from the release. Open downloaded HTML in a WebGL-capable browser, not GitHub's source viewer.

## Reusable skill

Install [teardown-codex](https://github.com/TUANZIDING/teardown-codex), then invoke `$teardown-codex` in Codex or run `npm run generate -- all --out ./my-machines` inside that skill repository. Each generated project includes editable source and licenses. Existing output directories are never overwritten.

## Validation and scope

Both demos were built and exercised in a real browser. Sentinel checks cover 480 chain parameter cases, path heading, visible translation and frozen-time behavior. Frame rates depend on hardware.

The V8 uses an educational pressure model and resumes its upstream auto-tour after 25 seconds of inactivity. Sentinel is unofficial fan-created geometry, without original movie assets or physical collision simulation. This release does not include video/audio export.

MIT code; upstream and bundled dependency notices are retained. Movie character and brand rights remain with their owners. See [provenance](文档/来源记录v1.0.md), [changelog](CHANGELOG.md) and [citation](CITATION.cff).

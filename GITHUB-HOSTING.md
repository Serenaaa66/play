# GitHub Pages hosting

Account: SiyiYU66. Repository: portfolio-v2.
Address after publication: https://siyiyu66.github.io/portfolio-v2/

This is an independent copy of the original portfolio at commit
2f4db07ed37c91de25be176afcfa9307cd4be5f0. The original repository is unchanged.
The exporter uses `/portfolio-v2` for root-relative media and downloads and
namespaces browser preferences and game sessions as `portfolio-v2:*`.
Project content, images, fonts, disc materials and motion are preserved.

The Pages source is GitHub Actions. The workflow checks and publishes main.
The static build uses scripts/build-github-pages.mjs, then
scripts/export-github-pages.mjs. PDF and video routes are materialised with
their original bytes and checksums. Server credentials are not needed.

Online Battleship continues to use the existing Listening Room room service;
the static exporter sets that public API address in the built game client.
The backend accepts the exact Pages origin and preserves bearer-token checks.

For another Pages account or a custom domain, update worker/hosting-config.js
and the backend allowlist together before changing the frontend API origin.

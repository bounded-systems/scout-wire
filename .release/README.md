# Release intents

This repo uses [@bounded-systems/mint](https://github.com/bounded-systems/mint) for
versioning. Each PR with a user-facing change drops an intent file here; mint
resolves the strongest bump and cuts the release deterministically.

Format — `.release/<slug>.md`:

    ---
    bump: minor   # patch | minor | major
    ---
    short summary of the change (becomes the changelog line)

The `version` CI job runs `mint plan`, which validates every intent and previews
the next version. `mint version` (at release time) bumps `deno.json` +
`manifest.json`'s sibling `deno.json`, prepends `CHANGELOG.md`, and consumes the
intents; `mint release` cuts the `v<version>` tag, and the tag drives
`publish-jsr.yml` (JSR, keyless OIDC) + `release.yml` (in-toto provenance).

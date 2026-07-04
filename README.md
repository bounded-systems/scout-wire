# @bounded-systems/scout-wire

The **pinned agreement** between `scoutd` (the external-read door daemon in
[`door-scout`](https://github.com/bounded-systems/door-scout)) and its in-box
client (in [`door-kit`](https://github.com/bounded-systems/door-kit)) — a
**contract-only repo**.

Both door-scout (implements) and door-kit (calls) depend on **this**, not on each
other — breaking the `door-scout ↔ door-kit` cycle + one-agreement-per-pair
violation the [trellis](https://github.com/bounded-systems/trellis) lattice check
flags.

- **`mod.ts`** — the agreement, as [`@bounded-systems/verbspec`](https://github.com/bounded-systems/verbspec)
  verbs: scoutd's 6 methods (`repo`, `pr`, `issue`, `fetch`, `download`,
  `status`).
- **`manifest.json`** — the dependency-free projection (`deno task gen`) trellis
  reads for its offline conformance check.

Source-available under **PolyForm Noncommercial 1.0.0**.

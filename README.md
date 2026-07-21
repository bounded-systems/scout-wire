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
  verbs: scoutd's methods — `status`; single-target reads `repo`, `pr`, `issue`,
  `fetch`, `download`; and org/board reads `repos`, `project`, `orgOpenWork`,
  `orgMergedPrs`.
- **`manifest.json`** — the dependency-free projection (`deno task gen`) trellis
  reads for its offline conformance check.

## Method spectrum — how a verb projects to an HTTP method

Every verb here is a read: safe + idempotent, `actor: "scout"`. When the contract
is projected to an HTTP surface (verbspec's OpenAPI projection), the method a verb
takes is not a flag — it falls out of **how the operator is versioned**, over one
input key `k_in = (operator, query)` (a hit iff both identities repeat). The
GET/QUERY/POST spectrum is one machine at three points:

- **GET = `q = ⊤`** — query-degenerate: no body; the query collapses to
  "everything at this URI."
- **QUERY = the interior** — operator *and* query both content-derived (same bytes
  ⟹ same id), so `k_in` can match ⟹ a cache hit is possible. This is where every
  scout verb sits: a content-addressed read, keyed by digest, invalidated by
  [`anchored-chain`](https://github.com/bounded-systems/anchored-chain) over
  [`cas`](https://github.com/bounded-systems/cas).
- **POST = `φ` under token versioning** — operator-identity-degenerate: version the
  operator by a per-request minted token (the *singleton* scheme — every occurrence
  its own class, identity by fiat, self-referential). A token never repeats ⟹
  `k_in` never matches ⟹ always recompute, which is *correct* for a side-effecting
  operator. Non-cacheability falls out of the identity, not a flag. No scout verb
  is here — scout is read-only; writes are the keeper door.

Content-hash and token are the two poles of one axis: the hash as coarse as
soundness allows (collapses no-op reads), the token maximally fine (the discrete
partition). Caveat: a bare token is a **pure attribution handle** — totality of the
schema at the cost of emptiness of the guarantee. It proves *that* an occurrence
was distinct, never *what* it was: nameable, not verifiable. Don't let the
id-shaped slot imply an id-shaped guarantee.

Source-available under **PolyForm Noncommercial 1.0.0**.

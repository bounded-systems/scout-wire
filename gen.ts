/**
 * @module
 * Project the scout-wire VerbSpec (mod.ts) to the dependency-free manifest.json
 * trellis's offline check reads — via the ONE canonical projectVerbSpec from
 * @bounded-systems/trellis-kit (0.3.0 accepts a VerbSpec registry directly).
 *
 *   deno run --allow-read --allow-write gen.ts
 */

import { projectVerbSpec } from "@bounded-systems/trellis-kit";
import { SCOUT_WIRE } from "./mod.ts";

if (import.meta.main) {
  const out = new URL("./manifest.json", import.meta.url).pathname;
  await Deno.writeTextFile(
    out,
    JSON.stringify(projectVerbSpec("scout-wire", SCOUT_WIRE), null, 2) + "\n",
  );
  console.log(`wrote ${out}`);
}

/** EXTERNALS **/

import { cli } from "https://deno.land/x/edcb@v1.0.0-alpha.5/mod.ts";

/** MAIN **/

if (import.meta.main) {
  await cli();
}

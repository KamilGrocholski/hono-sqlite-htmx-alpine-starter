import { readdir } from "node:fs/promises";

import { connectDB } from "./db";

(async function migrateUp() {
  const db = connectDB();

  const tx = db.transaction(async () => {
    const files = await readdir("src/db/migrations");
    files.sort((a, b) => {
      const nA = Number(a.split("_")[0]);
      const nB = Number(b.split("_")[0]);
      return nA > nB ? 1 : -1;
    });
    for (const file of files) {
      if (file.endsWith(".sql")) {
        const f = Bun.file(`src/db/migrations/${file}`);
        const sql = await f.text();
        db.exec(sql);
        console.log("executed: ", file);
      }
    }
  });
  await tx();

  db.close();
})();

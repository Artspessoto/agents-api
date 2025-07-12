/** biome-ignore-all lint/suspicious/noConsole: only used in dev */
import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { reset, seed } from 'drizzle-seed';
import { db, sql } from './connection.ts';
import { schema } from './schema/index.ts';

async function runSeed() {
  const rl = createInterface({ input, output });

  const answer = await rl.question(
    "Are you sure you want to reset and seed the database? (y/n)"
  );
  rl.close();

  if (answer.toLowerCase() !== 'y') {
    console.info('Operation cancelled.');
    process.exit(0);
  }

  await reset(db, schema );
  await seed(db, schema ).refine(f => {
    return {
        rooms: {
            count: 20,
            columns: {
                name: f.companyName(),

                
                description: f.loremIpsum(),
            }
        }
    }
  });
  await sql.end();

  console.info('Database seeded!');
  process.exit(0);
}

runSeed().catch((error) => {
  console.error('Error while running seed:', error);
  process.exit(1);
});

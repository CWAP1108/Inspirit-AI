import { Hono } from 'hono';
import { cors } from 'hono/cors';
import postgres from 'postgres';

const app = new Hono();
app.use('*', cors());

const connectionString = Bun.env.DATABASE_URL ?? process.env.DATABASE_URL;
const sql = connectionString ? postgres(connectionString) : null;

app.get('/health', async (c) => {
  if (!sql) {
    return c.json({ ok: true, database: 'not-configured' });
  }

  try {
    await sql`select 1`;
    return c.json({ ok: true, database: 'connected' });
  } catch (error) {
    return c.json({ ok: false, database: 'error', message: (error as Error).message }, 500);
  }
});

app.get('/', (c) => c.json({ message: 'Inspirit AI backend is running' }));

export default app;

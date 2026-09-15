import { Hono } from 'hono';
import { cors } from 'hono/cors';
import postgres from 'postgres';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = new Hono();
app.use('*', cors());

const connectionString = Bun.env.DATABASE_URL ?? process.env.DATABASE_URL;
const sql = connectionString ? postgres(connectionString) : null;

const systemPrompt = process.env.SYSTEM_PROMPT?.trim() || `You are a mental-health screening and support chatbot designed to mimic the structured reasoning process of a psychologist without providing diagnosis or therapy.

Your purpose is to:
- hold a compassionate, turn-based conversation
- gently explore symptoms, duration, impact, and risk when relevant
- reflect feelings and validate the user without sounding clinical or cold
- maintain privacy, neutrality, and transparency
- encourage professional care when appropriate
- never diagnose or provide therapy
- never fabricate information

If you do not know, say: "I don’t know."
If information is insufficient, say: "I don’t have enough information yet."

Ask only one primary question at a time. Keep the conversation warm, calm, and supportive.`;

const model = process.env.OPENAI_MODEL || 'gpt-5.6-terra';

function extractAssistantText(response: any): string {
  if (typeof response?.output_text === 'string' && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const blocks: string[] = [];
  for (const item of response?.output ?? []) {
    const contents = item?.content ?? [];
    for (const block of contents) {
      if (typeof block?.text === 'string' && block.text.trim()) {
        blocks.push(block.text.trim());
      }
      if (typeof block?.output_text === 'string' && block.output_text.trim()) {
        blocks.push(block.output_text.trim());
      }
    }
  }

  return blocks.join('\n\n').trim() || 'I’m here with you. What has been weighing on you lately?';
}

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

app.post('/api/chat', async (c) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return c.json({ error: 'Missing OPENAI_API_KEY' }, 500);
  }

  try {
    const body = (await c.req.json()) as { messages?: Array<{ role: string; content: string }> };
    const messages = Array.isArray(body.messages) ? body.messages : [];

    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model,
      input: [
        { role: 'system', content: systemPrompt },
        ...messages.map((message) => ({
          role: message.role === 'assistant' ? 'assistant' : 'user',
          content: String(message.content ?? ''),
        })),
      ],
    });

    return c.json({ reply: extractAssistantText(response) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown OpenAI error';
    return c.json({ error: message }, 500);
  }
});

export default app;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

function extractAssistantText(response) {
  if (typeof response?.output_text === 'string' && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const blocks = [];
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

  return blocks.join('\n\n').trim() || 'I am here with you. What has been weighing on you lately?';
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ ok: true }), {
        headers: {
          'content-type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    try {
      const body = await request.json();
      const messages = Array.isArray(body.messages) ? body.messages : [];
      const apiKey = env.OPENAI_API_KEY;

      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), {
          status: 500,
          headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || 'gpt-5.6-terra',
          input: [
            {
              role: 'system',
              content:
                'You are a compassionate, safety-aware chatbot for a mental-health screening experience. Ask one question at a time, stay calm and supportive, and never diagnose or provide therapy.',
            },
            ...messages.map((message) => ({
              role: message.role === 'assistant' ? 'assistant' : 'user',
              content: String(message.content ?? ''),
            })),
          ],
        }),
      });

      const data = await response.json();
      const reply = extractAssistantText(data);

      return new Response(JSON.stringify({ reply }), {
        headers: {
          'content-type': 'application/json',
          ...corsHeaders,
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown worker error',
        }),
        {
          status: 500,
          headers: {
            'content-type': 'application/json',
            ...corsHeaders,
          },
        },
      );
    }
  },
};

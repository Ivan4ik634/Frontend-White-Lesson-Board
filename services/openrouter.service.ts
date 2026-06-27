import { openrouter } from '@/lib/openrouter';

export const openrouterService = {
  async owlAlphaModelServer(text: string) {
    console.log('KEY:', process.env.OPENROUTER_API_KEY);
    const response = await openrouter.chat.send({
      chatRequest: {
        model: 'owl-alpha',
        messages: [
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.2,
        maxTokens: 8000,
      },
    });

    return response.choices[0].message.content;
  },
  async owlAlphaModel(text: string) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    return data;
  },
};

import { openrouter } from '@/lib/openrouter';

export const openrouterService = {
  async owlAlphaModelServer(text: string) {
    const response = await openrouter.chat.send({
      chatRequest: {
        model: 'stealth/ox-alpha',
        messages: [
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.2,
        maxTokens: 5000,
      },
    });

    return response.choices[0].message.content;
  },
  async owlAlphaModel(text: string) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: text }),
    });
    console.log(res);
    const data = await res.json();
    return data;
  },
};

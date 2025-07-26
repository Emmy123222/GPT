interface GroqCloudResponse {
  choices: Array<{
    message: {
      content: string;
      role: 'assistant' | 'user' | 'system';
    };
  }>;
}

interface ChatSummaryRequest {
  messages: Array<{
    content: string;
    role: 'user' | 'assistant';
    timestamp: string;
  }>;
}

export class GroqCloudService {
  private static instance: GroqCloudService;
  private apiKey: string;
  private baseUrl: string = 'https://api.groq.com/openai/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQCLOUD_API_KEY || '';
  }

  static getInstance(): GroqCloudService {
    if (!GroqCloudService.instance) {
      GroqCloudService.instance = new GroqCloudService();
    }
    return GroqCloudService.instance;
  }

  async summarizeConversation(messages: ChatSummaryRequest['messages']): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GroqCloud API key not configured');
    }

    try {
      const systemPrompt = `You are an AI assistant helping to summarize private conversations. 
      Provide a concise, helpful summary of the key points and context from this conversation. 
      Respect privacy and focus on the main topics discussed.`;

      const conversationText = messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Please summarize this conversation:\n\n${conversationText}` }
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`GroqCloud API error: ${response.statusText}`);
      }

      const data: GroqCloudResponse = await response.json();
      return data.choices[0]?.message?.content || 'Unable to generate summary';
    } catch (error) {
      console.error('GroqCloud summarization error:', error);
      throw new Error('Failed to summarize conversation');
    }
  }

  async generateSmartReplies(lastMessage: string, context: string[]): Promise<string[]> {
    if (!this.apiKey) {
      throw new Error('GroqCloud API key not configured');
    }

    try {
      const systemPrompt = `You are an AI assistant helping to generate smart reply suggestions. 
      Based on the last message and conversation context, suggest 3 brief, natural responses. 
      Return only the suggestions, one per line, without numbers or bullets.`;

      const contextText = context.join('\n');

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Context: ${contextText}\n\nLast message: "${lastMessage}"\n\nGenerate 3 smart reply suggestions:` }
          ],
          max_tokens: 150,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`GroqCloud API error: ${response.statusText}`);
      }

      const data: GroqCloudResponse = await response.json();
      const suggestions = data.choices[0]?.message?.content || '';
      
      return suggestions
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 3);
    } catch (error) {
      console.error('GroqCloud smart replies error:', error);
      return ['Thanks!', 'Got it', 'Sounds good'];
    }
  }

  async generateAIResponse(message: string, conversationHistory: string[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GroqCloud API key not configured');
    }

    try {
      const systemPrompt = `You are PrivateGPT, an AI assistant integrated into a private messaging app. 
      You help users with intelligent responses, maintaining privacy and being helpful. 
      Keep responses conversational and concise.`;

      const historyText = conversationHistory.join('\n');

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Conversation history:\n${historyText}\n\nUser message: ${message}` }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`GroqCloud API error: ${response.statusText}`);
      }

      const data: GroqCloudResponse = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I cannot generate a response right now.';
    } catch (error) {
      console.error('GroqCloud AI response error:', error);
      throw new Error('Failed to generate AI response');
    }
  }
}
'use server';

import { moderateUserInput } from '@/ai/flows/moderate-user-input';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';

export interface ChatMessage {
  role: 'user' | 'bot' | 'error';
  text: string;
}

export async function sendMessage(message: string): Promise<ChatMessage> {
  try {
    // 1. Moderate user input
    const moderationResult = await moderateUserInput({ text: message });
    if (!moderationResult.isSafe) {
      return {
        role: 'error',
        text: `Your message was flagged as inappropriate. Reason: ${moderationResult.reason || 'Not provided.'}`,
      };
    }

    // 2. Generate chat response
    const response = await generateChatResponse({ message });

    if (!response || !response.reply) {
      return {
        role: 'error',
        text: 'The AI failed to provide a response. Please try again.',
      };
    }

    return {
      role: 'bot',
      text: response.reply,
    };
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      role: 'error',
      text: 'An unexpected error occurred. Please check the server logs and try again.',
    };
  }
}

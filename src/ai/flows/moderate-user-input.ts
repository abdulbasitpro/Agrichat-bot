'use server';

/**
 * @fileOverview Implements a content moderation flow to filter out harmful user prompts.
 *
 * - moderateUserInput - A function that moderates user input.
 * - ModerateUserInputInput - The input type for the moderateUserInput function.
 * - ModerateUserInputOutput - The return type for the moderateUserInput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateUserInputInputSchema = z.object({
  text: z.string().describe('The user input text to moderate.'),
});
export type ModerateUserInputInput = z.infer<typeof ModerateUserInputInputSchema>;

const ModerateUserInputOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the input is considered safe.'),
  reason: z.string().optional().describe('The reason the input was considered unsafe, if applicable.'),
});
export type ModerateUserInputOutput = z.infer<typeof ModerateUserInputOutputSchema>;

export async function moderateUserInput(input: ModerateUserInputInput): Promise<ModerateUserInputOutput> {
  return moderateUserInputFlow(input);
}

const moderateUserInputPrompt = ai.definePrompt({
  name: 'moderateUserInputPrompt',
  input: {schema: ModerateUserInputInputSchema},
  output: {schema: ModerateUserInputOutputSchema},
  prompt: `You are a content moderation tool that determines whether the given text is safe for a chat application.

  Text: {{{text}}}

  Respond with whether the text is safe and, if not, why.  The output should be in JSON format.
`,
});

const moderateUserInputFlow = ai.defineFlow(
  {
    name: 'moderateUserInputFlow',
    inputSchema: ModerateUserInputInputSchema,
    outputSchema: ModerateUserInputOutputSchema,
  },
  async input => {
    const {output} = await moderateUserInputPrompt(input);
    return output!;
  }
);

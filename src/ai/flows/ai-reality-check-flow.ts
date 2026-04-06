'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiRealityCheckInputSchema = z.object({
  businessStatements: z
    .string()
    .describe('A set of business statements provided by the user.'),
});
export type AiRealityCheckInput = z.infer<typeof AiRealityCheckInputSchema>;

const AiRealityCheckOutputSchema = z.object({
  realityCheckedText: z.string(),
  needsClarification: z.boolean(),
});
export type AiRealityCheckOutput = z.infer<typeof AiRealityCheckOutputSchema>;

export async function aiRealityCheck(input: AiRealityCheckInput): Promise<AiRealityCheckOutput> {
  return aiRealityCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiRealityCheckPrompt',
  input: {schema: AiRealityCheckInputSchema},
  output: {schema: AiRealityCheckOutputSchema},
  prompt: `You are an AI assistant designed to perform a 'reality check' on business statements. 
ALWAYS RESPOND IN ARABIC.

Identify aspirational statements and rephrase them into direct questions asking for the current status.
If a statement is factual, confirm it.

User statements: "{{{businessStatements}}}"`,
});

const aiRealityCheckFlow = ai.defineFlow(
  {
    name: 'aiRealityCheckFlow',
    inputSchema: AiRealityCheckInputSchema,
    outputSchema: AiRealityCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

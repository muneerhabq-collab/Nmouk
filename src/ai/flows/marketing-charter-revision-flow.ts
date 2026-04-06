'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MarketingCharterRevisionInputSchema = z.object({
  originalCharter: z.string(),
  feedback: z.string(),
});
export type MarketingCharterRevisionInput = z.infer<typeof MarketingCharterRevisionInputSchema>;

const MarketingCharterRevisionOutputSchema = z.object({
  revisedCharter: z.string(),
});
export type MarketingCharterRevisionOutput = z.infer<typeof MarketingCharterRevisionOutputSchema>;

export async function reviseMarketingCharter(input: MarketingCharterRevisionInput): Promise<MarketingCharterRevisionOutput> {
  return marketingCharterRevisionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketingCharterRevisionPrompt',
  input: { schema: MarketingCharterRevisionInputSchema },
  output: { schema: MarketingCharterRevisionOutputSchema },
  prompt: `Revise the marketing charter based on feedback. 
ALWAYS RESPOND IN ARABIC.

Original: {{{originalCharter}}}
Feedback: {{{feedback}}}`,
});

const marketingCharterRevisionFlow = ai.defineFlow(
  {
    name: 'marketingCharterRevisionFlow',
    inputSchema: MarketingCharterRevisionInputSchema,
    outputSchema: MarketingCharterRevisionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

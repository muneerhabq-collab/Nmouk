'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BrandIdentityGenerationInputSchema = z.object({
  businessInformation: z.string(),
});
export type BrandIdentityGenerationInput = z.infer<typeof BrandIdentityGenerationInputSchema>;

const BrandIdentityOptionSchema = z.object({
  archetype: z.string().describe('النموذج الأصلي من الـ 12 نموذجاً كلاسيكياً (أو مزيج من اثنين)'),
  plot: z.string().describe('الحبكة الاستراتيجية من الحبكات السبع الأساسية'),
  globalReferences: z.string().describe('أمثلة لعلامات تجارية عالمية تتبع نفس النهج'),
  narrative: z.string().describe('ملخص السردية الاستراتيجية'),
  justification: z.string().describe('تبرير اختيار هذا التوجه'),
});

const BrandIdentityGenerationOutputSchema = z.array(BrandIdentityOptionSchema).length(3);
export type BrandIdentityGenerationOutput = z.infer<typeof BrandIdentityGenerationOutputSchema>;

export async function generateBrandIdentities(input: BrandIdentityGenerationInput): Promise<BrandIdentityGenerationOutput> {
  return brandIdentityGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'brandIdentityGenerationPrompt',
  input: {schema: BrandIdentityGenerationInputSchema},
  output: {schema: BrandIdentityGenerationOutputSchema},
  prompt: `أنت خبير استراتيجي في بناء العلامات التجارية. بناءً على معلومات العمل المقدمة، اقترح 3 خيارات متميزة لهوية العلامة التجارية.

يجب أن يعتمد كل خيار على:
1. **النموذج الأصلي (Archetype):** اختر من النماذج الـ 12 الكلاسيكية (مثل: البطل، الساحر، الخارج عن القانون، البريء، إلخ) أو امزج بين نموذجين بشكل استراتيجي.
2. **الحبكة (Plot):** اختر من الحبكات السبع الأساسية (مثل: التغلب على الوحش، من الفقر إلى الغنى، الرحلة والعودة، إلخ).

يجب أن يكون الرد باللغة العربية الفصحى والمهنية.

معلومات العمل:
{{{businessInformation}}}`,
});

const brandIdentityGenerationFlow = ai.defineFlow(
  {
    name: 'brandIdentityGenerationFlow',
    inputSchema: BrandIdentityGenerationInputSchema,
    outputSchema: BrandIdentityGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

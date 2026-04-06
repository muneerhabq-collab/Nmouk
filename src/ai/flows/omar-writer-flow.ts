'use server';

/**
 * @fileOverview وكيل ذكاء اصطناعي (عمر) - متخصص في المقالات الطويلة والنشرات البريدية.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OmarInputSchema = z.object({
  task: z.string().describe('المهمة أو موضوع المقال'),
  brandIdentity: z.string().describe('وثيقة هوية العلامة التجارية'),
  marketingCharter: z.string().describe('ميثاق التسويق'),
});

export type OmarInput = z.infer<typeof OmarInputSchema>;

const OmarOutputSchema = z.object({
  title: z.string(),
  subjectLine: z.string().describe('عنوان البريد الإلكتروني'),
  content: z.string().describe('متن المقال أو النشرة'),
  summary: z.string().describe('ملخص للنشر على وسائل التواصل'),
  seoKeywords: z.array(z.string()),
});

export type OmarOutput = z.infer<typeof OmarOutputSchema>;

export async function generateLongFormContent(input: OmarInput): Promise<OmarOutput> {
  return omarWriterFlow(input);
}

const omarWriterFlow = ai.defineFlow(
  {
    name: 'omarWriterFlow',
    inputSchema: OmarInputSchema,
    outputSchema: OmarOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'omarPrompt',
      input: { schema: OmarInputSchema },
      output: { schema: OmarOutputSchema },
      prompt: `أنت "عمر"، كاتب مقالات ونشرات بريدية خبير. 
مهمتك هي كتابة محتوى معمق بناءً على المهمة: "{{{task}}}"

الوثائق المرجعية:
الهوية: {{{brandIdentity}}}
الميثاق: {{{marketingCharter}}}

يجب أن تلتزم بـ:
1. بناء الثقة والتوثيق (Validation).
2. استخدام أطر مثل StoryBrand و QUEST.
3. لغة عربية فصحى، رصينة، وملهمة.

المطلوب:
- عنوان المقال.
- عنوان بريدي جذاب (Subject Line).
- المحتوى الكامل (Content) بصيغة Markdown.
- ملخص قصير (Summary).
- كلمات مفتاحية (SEO Keywords).`,
    });

    const { output } = await prompt(input);
    return output!;
  }
);

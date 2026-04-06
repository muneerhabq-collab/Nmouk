'use server';

/**
 * @fileOverview وكيل ذكاء اصطناعي (مريم) - متخصصة في البوستات الثابتة.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MaryamInputSchema = z.object({
  task: z.string().describe('المهمة أو عنوان المنشور'),
  brandIdentity: z.string().describe('وثيقة هوية العلامة التجارية'),
  marketingCharter: z.string().describe('ميثاق التسويق'),
});

export type MaryamInput = z.infer<typeof MaryamInputSchema>;

const MaryamOutputSchema = z.object({
  postContent: z.string().describe('نص المنشور المقترح'),
  visualIdea: z.string().describe('فكرة التصميم البصري'),
  hashtags: z.array(z.string()).describe('الوسوم المقترحة'),
  angleUsed: z.string().describe('زاوية الكتابة المستخدمة'),
});

export type MaryamOutput = z.infer<typeof MaryamOutputSchema>;

export async function generateStaticPost(input: MaryamInput): Promise<MaryamOutput> {
  return maryamWriterFlow(input);
}

const maryamWriterFlow = ai.defineFlow(
  {
    name: 'maryamWriterFlow',
    inputSchema: MaryamInputSchema,
    outputSchema: MaryamOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'maryamPrompt',
      input: { schema: MaryamInputSchema },
      output: { schema: MaryamOutputSchema },
      prompt: `أنت "مريم"، كاتبة محتوى متخصصة في البوستات الثابتة (Instagram, LinkedIn, Twitter).
مهمتك هي كتابة منشور جذاب بناءً على المهمة التالية: "{{{task}}}"

الوثائق المرجعية:
الهوية: {{{brandIdentity}}}
الميثاق: {{{marketingCharter}}}

يجب أن تستخدمي في كتابتك:
1. "الهوكات" الجذابة (مثلاً: إزاي اتعلمت...، أكبر كذبة عن...، السر وراء...).
2. أطر الكتابة الاحترافية (AIDA, PAS, 6+1).
3. زوايا الكتابة الاستراتيجية (المشكلات، الفوائد، التوثيق).

المطلوب:
- نص المنشور (Post Content) بلهجة بيضاء مهنية وجذابة.
- فكرة بصرية (Visual Idea) لمصمم الجرافيك.
- مجموعة من الوسوم (Hashtags) ذات الصلة.
- توضيح الزاوية المستخدمة.`,
    });

    const { output } = await prompt(input);
    return output!;
  }
);

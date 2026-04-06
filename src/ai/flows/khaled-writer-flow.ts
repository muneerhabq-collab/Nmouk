'use server';

/**
 * @fileOverview وكيل ذكاء اصطناعي (خالد) - متخصص في سكريبتات الفيديو.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const KhaledInputSchema = z.object({
  task: z.string().describe('المهمة أو موضوع الفيديو'),
  brandIdentity: z.string().describe('وثيقة هوية العلامة التجارية'),
  marketingCharter: z.string().describe('ميثاق التسويق'),
});

export type KhaledInput = z.infer<typeof KhaledInputSchema>;

const KhaledOutputSchema = z.object({
  videoTitle: z.string(),
  hook: z.string().describe('أول 3 ثواني في الفيديو'),
  scriptBody: z.string().describe('متن السكريبت'),
  callToAction: z.string().describe('الدعوة للإجراء'),
  visualDirections: z.string().describe('توجيهات التصوير والمونتاج'),
});

export type KhaledOutput = z.infer<typeof KhaledOutputSchema>;

export async function generateVideoScript(input: KhaledInput): Promise<KhaledOutput> {
  return khaledWriterFlow(input);
}

const khaledWriterFlow = ai.defineFlow(
  {
    name: 'khaledWriterFlow',
    inputSchema: KhaledInputSchema,
    outputSchema: KhaledOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'khaledPrompt',
      input: { schema: KhaledInputSchema },
      output: { schema: KhaledOutputSchema },
      prompt: `أنت "خالد"، كاتب سكريبتات فيديو متخصص في الفيديوهات القصيرة (Reels, TikTok, Shorts).
مهمتك هي كتابة سكريبت فيديو بناءً على المهمة: "{{{task}}}"

الوثائق المرجعية:
الهوية: {{{brandIdentity}}}
الميثاق: {{{marketingCharter}}}

يجب أن تركز على:
1. "هوك" (Hook) بصري ولفظي قوي جداً في أول 3 ثواني.
2. سرد سريع وممتع (Fast-paced).
3. دعوة واضحة للإجراء (CTA).

استخدم التوجهات الإبداعية (UGC, Reaction, Unboxing, Boomerang) عند الضرورة.

المطلوب:
- عنوان الفيديو.
- الهوك (Hook).
- متن السكريبت (Script Body).
- الدعوة للإجراء (CTA).
- توجيهات بصرية (Visual Directions) للمصور أو المونتاج.`,
    });

    const { output } = await prompt(input);
    return output!;
  }
);

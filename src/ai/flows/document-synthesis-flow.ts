'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DocumentSynthesisInputSchema = z.object({
  companyName: z.string(),
  industry: z.string(),
  targetAudience: z.string(),
  uniqueSellingProposition: z.string(),
  businessGoals: z.string(),
  currentChallenges: z.string(),
  competitors: z.string(),
  companyVision: z.string(),
  companyMission: z.string(),
  productServiceDescription: z.string(),
  brandIdentity: z.object({
    name: z.string(),
    archetype: z.string(),
    plot: z.string(),
    globalReferences: z.string(),
    narrative: z.string(),
    justification: z.string(),
  }),
});

export type DocumentSynthesisInput = z.infer<typeof DocumentSynthesisInputSchema>;

const DocumentSynthesisOutputSchema = z.object({
  brandIdentityDocument: z.string(),
  goToMarketStrategyDocument: z.string(),
  marketingCharterDocument: z.string(),
});

export type DocumentSynthesisOutput = z.infer<typeof DocumentSynthesisOutputSchema>;

export async function synthesizeDocuments(input: DocumentSynthesisInput): Promise<DocumentSynthesisOutput> {
  return documentSynthesisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'documentSynthesisPrompt',
  input: { schema: DocumentSynthesisInputSchema },
  output: { schema: DocumentSynthesisOutputSchema },
  prompt: `أنت خبير استراتيجي في التسويق. قم بتوليد ثلاث وثائق تسويقية شاملة لشركة {{{companyName}}}.
يجب أن يكون الإخراج بالكامل باللغة العربية المهنية وباستخدام صيغة Markdown.

---
بيانات الشركة:
الاسم: {{{companyName}}}
القطاع: {{{industry}}}
الجمهور: {{{targetAudience}}}
الميزة التنافسية: {{{uniqueSellingProposition}}}
الرؤية والرسالة: {{{companyVision}}} / {{{companyMission}}}

تفاصيل الهوية المختارة:
النموذج الأصلي: {{{brandIdentity.archetype}}}
الحبكة: {{{brandIdentity.plot}}}
السردية: {{{brandIdentity.narrative}}}

المطلوب:

1. وثيقة هوية العلامة التجارية:
يجب أن تلتزم بالهيكل التالي مع التركيز الخاص على النقاط التالية:
- مقدمة عن الهوية.
- القيم والرسائل الجوهرية.
- **النقطة رقم 6: شخصية العلامة التجارية:** اشرح بالتفصيل كيف تجسد العلامة نموذج ({{{brandIdentity.archetype}}}) من النماذج الـ 12 الكلاسيكية. وضح ما إذا كان هذا التجسيد يعتمد على شخصية واحدة أو مزيج استراتيجي بين شخصيتين وكيف يظهر ذلك في تعامل العلامة مع جمهورها.
- **حبكة العلامة التجارية:** وضح الحبكة الاستراتيجية المختارة ({{{brandIdentity.plot}}}) من الحبكات السبع الأساسية وسبب ملاءمتها لواقع الشركة.
- **قصة العلامة التجارية:** صياغة قصة العلامة التجارية (Brand Story) بأسلوب سردي ملهم يربط بين تحديات الجمهور والحل الذي تقدمه الشركة بناءً على الحبكة المختارة.

2. استراتيجية دخول السوق (GTM Strategy).
3. ميثاق التسويق (Marketing Charter).

تأكد من أن جميع الوثائق مترابطة وتعكس الهوية المختارة بقوة.`,
});

const documentSynthesisFlow = ai.defineFlow(
  {
    name: 'documentSynthesisFlow',
    inputSchema: DocumentSynthesisInputSchema,
    outputSchema: DocumentSynthesisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

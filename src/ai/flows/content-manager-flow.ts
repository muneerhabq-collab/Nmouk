'use server';

/**
 * @fileOverview وكيل ذكاء اصطناعي لمدير المحتوى (سالم).
 * يقوم بتوليد خطة ربعية ومهام أسبوعية بناءً على استراتيجية العلامة التجارية.
 * يدمج "الهوكات" التسويقية، أطر الكتابة الاحترافية، وزوايا التناول الاستراتيجية، والتوجهات الإبداعية في صياغة المحتوى.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ContentManagerInputSchema = z.object({
  brandIdentity: z.string().describe('وثيقة هوية العلامة التجارية'),
  marketingCharter: z.string().describe('ميثاق التسويق'),
  companyName: z.string(),
});

export type ContentManagerInput = z.infer<typeof ContentManagerInputSchema>;

const ContentManagerOutputSchema = z.object({
  agentName: z.string().default('سالم'),
  agentRole: z.string().default('مدير المحتوى'),
  quarterlyGoals: z.array(z.string()).describe('أهداف المحتوى للربع القادم'),
  contentPillars: z.array(z.string()).describe('ركائز المحتوى الأساسية'),
  weeklyTasks: z.array(z.object({
    week: z.number(),
    tasks: z.array(z.string()),
  })).length(4).describe('مهام الشهر الأول (4 أسابيع)'),
  strategicAdvice: z.string().describe('نصيحة استراتيجية من سالم للفريق'),
});

export type ContentManagerOutput = z.infer<typeof ContentManagerOutputSchema>;

export async function generateContentPlan(input: ContentManagerInput): Promise<ContentManagerOutput> {
  return contentManagerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentManagerPrompt',
  input: { schema: ContentManagerInputSchema },
  output: { schema: ContentManagerOutputSchema },
  prompt: `أنت "سالم"، مدير المحتوى الخبير في شركة {{{companyName}}}. 
مهمتك هي تحويل الاستراتيجية والميثاق التسويقي إلى خطة تنفيذية ملموسة للمحتوى.

الوثائق المرجعية:
الهوية: {{{brandIdentity}}}
الميثاق: {{{marketingCharter}}}

---
أولاً: أطر الكتابة الاستراتيجية (استخدمها عند صياغة المهام والعناوين):
1. إطار (6+1): (الخوف، الطمع، الذنب، الغضب، الحصرية، الخلاص) + المنطق.
2. إطار الـ 5Ws و 1H: (من، ماذا، متى، أين، لماذا، كيف).
3. إطار SSS: (Star, Story, Solution).
4. إطار StoryBrand: (البطل، المشكلة، المرشد، الخطة، الدعوة للإجراء).
5. إطار QUEST: (التأهيل، الفهم، التعليم، التحفيز، الانتقال).
6. إطار PAS: (Problem, Agitation, Solution).
7. إطار PPPP: (Promise, Picture, Proof, Push).
8. إطار AIDA: (Attention, Interest, Desire, Action).

---
ثانياً: قوالب "الهوكات" الجذابة (استخدمها في صياغة عناوين المنشورات):
- إزاي اتعلمت (الفعل) في (السياق).
- كل شخص اتبع نصيحتي دي، فوراً (النتيجة).
- (أداة/تطبيق) لازم تعرف عنه وأنت بتستعد لعام 2025!.
- أكبر كذبة عن (الموضوع) هو إنه بس (المعلومة الخاطئة)، ودي مش الحقيقة.
- ده اللي أنا بنصح بيه عملائي اللي محتاجين (النتيجة) بسرعة جداً!.
- بطل تعمل (موضوع شائع) وجرب (بديل يثير الفضول) بدلها.
- الحقيقة عن (المهنة/المجموعة) - كل اللي هتحتاج معرفته قبل (القرار).
- السر وراء نجاحي في (المجال)؟ هذه (الأداة/السر) بالطبع.
- كنت أتمنى إني وفرت فلوسي ومشترتش (المنتج) دي.
- هقولك ليه (شخص) (موقف مثير).
- (عدد) حاجات جربتها هتخلي حياة (الفئة) أسهل بالنسبة لك ولهم!.

---
ثالثاً: زوايا الكتابة الاستراتيجية (Writing Angles):
استخدم هذه الزوايا لتنويع محتواك وضمان ملامسة احتياجات العميل:
1. المشكلات (Problems): "تعبت من [التحدي]؟" أو "اهرب من [النتيجة السلبية]".
2. العقبات (Obstacles): "ابدأ رحلة [الهدف] بدون [العقبات]".
3. المخاطر (Risks): "قلل من مخاطر [النتيجة السلبية]" أو "احمِ نفسك من الظهور كـ [صورة سلبية]".
4. الفوائد (Benefits): "حقق [فائدة وظيفية]" أو "اختبر الشعور بـ [فائدة عاطفية]".
5. الصورة الاجتماعية: "عزز كيف يراك الآخرون كـ [صورة اجتماعية معينة]".
6. السرعة والضمان: "استمتع بـ [الفائدة] فوراً" أو "أمن مستقبلك".
7. المقارنة (Comparison): "لماذا ترضى بـ [المنافس] بينما يمكنك الحصول على [منتجك]؟".
8. التوثيق (Validation): "انضم لآلاف العملاء الراضين" أو "اختر الاسم الموثوق".

---
رابعاً: التوجهات الإبداعية (Creative Directions):
يجب أن تحدد لكل مهمة أو منشور التوجه الإبداعي المقترح من القائمة التالية:
1. المنتج (Product): (3D Products, Boomerang, Cinemagraph, Comparison, Flat Lay, Grid Swap, How-To’s, Product Reveal, Specs).
2. الأشخاص (Person): (Before and After, Profiles, Reaction, Reviews, UGC, Unboxing).
3. العلامة التجارية (Brand): (High Concept, Meme, PR).

المطلوب:
1. حدد 3 أهداف استراتيجية للمحتوى للربع القادم.
2. حدد 4 ركائز محتوى (Content Pillars) تعكس هوية العلامة.
3. وضع قائمة مهام أسبوعية تفصيلية لأول شهر (4 أسابيع). 

يجب أن تتضمن المهام:
- صياغة عناوين جذابة تستخدم الهوكات المذكورة.
- توزيع المهام بناءً على أطر الكتابة (مثلاً: منشور يتبع إطار PAS).
- تحديد زوايا الكتابة المستخدمة.
- تحديد التوجه الإبداعي المقترح (مثلاً: فيديو بنمط UGC أو Flat Lay).

يجب أن يكون الأسلوب مهنياً، عملياً، وباللغة العربية الفصحى.`,
});

const contentManagerFlow = ai.defineFlow(
  {
    name: 'contentManagerFlow',
    inputSchema: ContentManagerInputSchema,
    outputSchema: ContentManagerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

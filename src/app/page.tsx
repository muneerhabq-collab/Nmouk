"use client";

import React, { useState, useEffect } from 'react';
import { AppState, BusinessInfo, AgentPlan, WritingResult } from '@/lib/types';
import ChatInterface from '@/components/chat/ChatInterface';
import BrandCard from '@/components/brand/BrandCard';
import DocumentDashboard from '@/components/documents/DocumentDashboard';
import AgentWorkstation from '@/components/agents/AgentWorkstation';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2, ArrowLeft, ShieldCheck, AlertCircle, Users } from 'lucide-react';
import { aiRealityCheck } from '@/ai/flows/ai-reality-check-flow';
import { generateBrandIdentities } from '@/ai/flows/brand-identity-generation-flow';
import { synthesizeDocuments } from '@/ai/flows/document-synthesis-flow';
import { generateContentPlan } from '@/ai/flows/content-manager-flow';
import { generateStaticPost } from '@/ai/flows/maryam-writer-flow';
import { generateVideoScript } from '@/ai/flows/khaled-writer-flow';
import { generateLongFormContent } from '@/ai/flows/omar-writer-flow';
import { cn } from '@/lib/utils';

export default function NmoukApp() {
  const [state, setState] = useState<AppState>({
    currentStep: 'onboarding',
    businessInfo: {} as BusinessInfo,
    brandIdentities: null,
    selectedBrandIndex: null,
    documents: null,
    agentPlans: null,
    writingResults: {},
  });

  const [isLoading, setIsLoading] = useState(false);
  const [realityCheckResult, setRealityCheckResult] = useState<{ text: string; needsClarification: boolean } | null>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('nmouk_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure writingResults is initialized even if old state didn't have it
        setState({
          ...parsed,
          writingResults: parsed.writingResults || {}
        });
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nmouk_state', JSON.stringify(state));
  }, [state]);

  const handleOnboardingComplete = async (info: BusinessInfo) => {
    setIsLoading(true);
    try {
      const allStatements = Object.values(info).join(". ");
      const reality = await aiRealityCheck({ businessStatements: allStatements });
      setRealityCheckResult({ text: reality.realityCheckedText, needsClarification: reality.needsClarification });
      
      setState(prev => ({ ...prev, businessInfo: info, currentStep: 'reality-check' }));
    } catch (error) {
      console.error("Reality check failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToBrandSelection = async () => {
    setIsLoading(true);
    try {
      const allInfo = JSON.stringify(state.businessInfo);
      const identities = await generateBrandIdentities({ businessInformation: allInfo });
      setState(prev => ({ 
        ...prev, 
        brandIdentities: identities, 
        currentStep: 'brand-selection' 
      }));
    } catch (error) {
      console.error("Brand generation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrandSelect = async (index: number) => {
    setIsLoading(true);
    try {
      const selectedBrand = state.brandIdentities![index];
      const result = await synthesizeDocuments({
        ...state.businessInfo,
        brandIdentity: {
          name: `استراتيجية ${selectedBrand.archetype}`,
          ...selectedBrand
        }
      });

      setState(prev => ({
        ...prev,
        selectedBrandIndex: index,
        documents: {
          brandIdentity: result.brandIdentityDocument,
          gtmStrategy: result.goToMarketStrategyDocument,
          marketingCharter: result.marketingCharterDocument
        },
        currentStep: 'document-generation'
      }));
    } catch (error) {
      console.error("Synthesis failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdoptStrategy = async () => {
    setIsLoading(true);
    try {
      const contentPlan = await generateContentPlan({
        companyName: state.businessInfo.companyName,
        brandIdentity: state.documents?.brandIdentity || "",
        marketingCharter: state.documents?.marketingCharter || "",
      });

      setState(prev => ({
        ...prev,
        currentStep: 'agents-planning',
        agentPlans: {
          contentManager: contentPlan
        }
      }));
    } catch (error) {
      console.error("Agent planning failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWriteContent = async (taskId: string, task: string, writer: 'maryam' | 'khaled' | 'omar') => {
    setIsLoading(true);
    try {
      let result: WritingResult;
      const commonInput = {
        task,
        brandIdentity: state.documents?.brandIdentity || "",
        marketingCharter: state.documents?.marketingCharter || "",
      };

      if (writer === 'maryam') {
        const output = await generateStaticPost(commonInput);
        result = { agentName: 'مريم', type: 'post', content: output };
      } else if (writer === 'khaled') {
        const output = await generateVideoScript(commonInput);
        result = { agentName: 'خالد', type: 'script', content: output };
      } else {
        const output = await generateLongFormContent(commonInput);
        result = { agentName: 'عمر', type: 'article', content: output };
      }

      setState(prev => ({
        ...prev,
        writingResults: {
          ...(prev.writingResults || {}),
          [taskId]: result
        }
      }));
    } catch (error) {
      console.error("Content generation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgress = () => {
    switch(state.currentStep) {
      case 'onboarding': return 15;
      case 'reality-check': return 30;
      case 'brand-selection': return 50;
      case 'document-generation': return 75;
      case 'agents-planning': return 90;
      case 'finished': return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen pb-20" dir="rtl">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-headline font-bold">ن</span>
            </div>
            <span className="font-headline font-bold text-xl tracking-tight text-primary">نموّك</span>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-start text-right">
               <span className="text-[10px] uppercase font-bold text-muted-foreground">جلسة نشطة</span>
               <span className="text-xs font-medium text-foreground">{state.businessInfo.companyName || "نمو مجهول"}</span>
             </div>
             <Button variant="ghost" size="sm" onClick={() => { localStorage.removeItem('nmouk_state'); window.location.reload(); }} suppressHydrationWarning>إعادة ضبط</Button>
          </div>
        </div>
        <Progress value={getProgress()} className="h-1 rounded-none bg-primary/10" />
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        {state.currentStep === 'onboarding' && (
          <div className="space-y-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl font-headline font-bold mb-4">هندسة النمو الذكي</h1>
              <p className="text-muted-foreground">لنقم ببناء مستقبل علامتك التجارية. نجمع البيانات اللازمة لتحديد سيطرتك على السوق.</p>
            </div>
            <ChatInterface onComplete={handleOnboardingComplete} />
          </div>
        )}

        {state.currentStep === 'reality-check' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
             <div className="text-center space-y-4">
               <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-primary" />
               </div>
               <h1 className="text-3xl font-headline font-bold">فحص واقعية الاستراتيجية</h1>
               <p className="text-muted-foreground">لقد حللنا مدخلاتك. لضمان أساس استراتيجي متين، حددنا المجالات التي تحتاج إلى ترسيخ واقعي.</p>
             </div>

             <div className={cn(
               "p-8 rounded-2xl border-2 shadow-sm",
               realityCheckResult?.needsClarification ? "bg-amber-50/50 border-amber-200" : "bg-emerald-50/50 border-emerald-200"
             )}>
                <div className="flex gap-4">
                   {realityCheckResult?.needsClarification ? (
                     <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                   ) : (
                     <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                   )}
                   <div className="space-y-4 text-right">
                     <h3 className={cn("font-bold", realityCheckResult?.needsClarification ? "text-amber-800" : "text-emerald-800")}>
                       {realityCheckResult?.needsClarification ? "تحليل التطلعات" : "تم تأكيد التحقق الواقعي"}
                     </h3>
                     <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">{realityCheckResult?.text}</p>
                   </div>
                </div>
             </div>

             <div className="flex justify-center">
               <Button size="lg" className="px-8 font-headline h-12" onClick={proceedToBrandSelection} disabled={isLoading} suppressHydrationWarning>
                 {isLoading ? <><Loader2 className="w-4 h-4 animate-spin ml-2" /> جاري التوليد...</> : <>الانتقال لهوية العلامة التجارية <ArrowLeft className="mr-2 w-4 h-4" /></>}
               </Button>
             </div>
          </div>
        )}

        {state.currentStep === 'brand-selection' && state.brandIdentities && (
          <div className="space-y-12 animate-in fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-4">
               <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
               </div>
               <h1 className="text-4xl font-headline font-bold">اختر هوية علامتك التجارية</h1>
               <p className="text-muted-foreground">قام ذكاؤنا الاصطناعي بتركيب ثلاثة اتجاهات استراتيجية متميزة بناءً على ملف عملك. اختر الأنسب لرؤيتك.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {state.brandIdentities.map((brand, idx) => (
                <BrandCard 
                  key={idx} 
                  brand={brand} 
                  index={idx} 
                  isSelected={state.selectedBrandIndex === idx}
                  onSelect={() => handleBrandSelect(idx)}
                />
              ))}
            </div>

            {isLoading && (
               <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="font-headline font-bold text-xl">جاري تركيب الاستراتيجية الشاملة...</p>
                    <p className="text-muted-foreground max-w-xs mx-auto text-sm">نقوم بتوليد هوية العلامة، استراتيجية الدخول للسوق، وميثاق التسويق.</p>
                  </div>
               </div>
            )}
          </div>
        )}

        {state.currentStep === 'document-generation' && state.documents && (
          <div className="space-y-8">
             <DocumentDashboard 
                documents={state.documents} 
                onUpdateCharter={(newCharter) => setState(prev => ({
                  ...prev,
                  documents: prev.documents ? { ...prev.documents, marketingCharter: newCharter } : null
                }))}
                onAdopt={handleAdoptStrategy}
              />
              {isLoading && (
                 <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                      <p className="font-headline font-bold text-xl">جاري تحضير فريق الوكلاء...</p>
                      <p className="text-muted-foreground">سالم، مدير المحتوى، يقوم الآن بتفصيل الخطة التنفيذية.</p>
                    </div>
                 </div>
              )}
          </div>
        )}

        {state.currentStep === 'agents-planning' && state.agentPlans?.contentManager && (
          <div className="space-y-12 animate-in fade-in">
             <div className="text-center max-w-2xl mx-auto space-y-4">
               <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
               </div>
               <h1 className="text-4xl font-headline font-bold">فريق التخطيط التنفيذي</h1>
               <p className="text-muted-foreground">لقد قمنا بتعيين وكلاء ذكاء اصطناعي لقيادة أقسامك. كل وكيل سيحول استراتيجيتك إلى خطة عمل دقيقة.</p>
            </div>

            <AgentWorkstation 
              plan={state.agentPlans.contentManager} 
              writingResults={state.writingResults || {}}
              onWrite={handleWriteContent}
              isLoading={isLoading}
            />
            
            <div className="flex justify-center pt-8">
               <Button variant="outline" className="gap-2">
                 <Users className="w-4 h-4" /> توظيف مدير العلاقات العامة (قريباً)
               </Button>
            </div>
          </div>
        )}
      </main>

      {/* Background decoration */}
      <div className="fixed top-0 left-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 -z-10 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
    </div>
  );
}
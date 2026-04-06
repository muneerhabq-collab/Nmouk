"use client";

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, RotateCcw, MessageSquare, Loader2, Sparkles, Download, CheckCircle } from 'lucide-react';
import { reviseMarketingCharter } from '@/ai/flows/marketing-charter-revision-flow';

interface DocumentDashboardProps {
  documents: {
    brandIdentity: string;
    gtmStrategy: string;
    marketingCharter: string;
  };
  onUpdateCharter: (newCharter: string) => void;
  onAdopt: () => void;
}

export default function DocumentDashboard({ documents, onUpdateCharter, onAdopt }: DocumentDashboardProps) {
  const [feedback, setFeedback] = useState('');
  const [isRevising, setIsRevising] = useState(false);

  const handleRevise = async () => {
    if (!feedback.trim() || isRevising) return;
    
    setIsRevising(true);
    try {
      const result = await reviseMarketingCharter({
        originalCharter: documents.marketingCharter,
        feedback: feedback
      });
      onUpdateCharter(result.revisedCharter);
      setFeedback('');
    } catch (error) {
      console.error("Revision failed", error);
    } finally {
      setIsRevising(false);
    }
  };

  const renderMarkdown = (text: string | undefined) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-headline font-bold mt-8 mb-4 text-primary">{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-headline font-bold mt-6 mb-3 text-primary/90">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-headline font-bold mt-5 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith('* ') || line.startsWith('- ')) return <li key={i} className="mr-6 list-disc mb-1">{line.slice(2)}</li>;
      if (line.trim() === '---') return <hr key={i} className="my-8 border-t-2 border-border" />;
      return <p key={i} className="mb-4 leading-relaxed text-foreground/80">{line}</p>;
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="w-full">
          <h1 className="text-3xl text-primary flex items-center gap-3 mb-2 justify-end">
            <Sparkles className="w-8 h-8" /> جناح نموّك الاستراتيجي
          </h1>
          <p className="text-muted-foreground">استراتيجيتك التسويقية الشاملة جاهزة للتنفيذ.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex items-center gap-2 flex-1 md:flex-none">
            <Download className="w-4 h-4" /> تصدير الكل
          </Button>
          <Button className="flex items-center gap-2 flex-1 md:flex-none" onClick={onAdopt} suppressHydrationWarning>
             <CheckCircle className="w-4 h-4" /> اعتماد الاستراتيجية
          </Button>
        </div>
      </div>

      <Tabs defaultValue="charter" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
          <TabsTrigger value="brand" className="h-10 text-sm gap-2">
            <FileText className="w-4 h-4" /> هوية العلامة
          </TabsTrigger>
          <TabsTrigger value="gtm" className="h-10 text-sm gap-2">
            <RotateCcw className="w-4 h-4" /> استراتيجية GTM
          </TabsTrigger>
          <TabsTrigger value="charter" className="h-10 text-sm gap-2">
            <MessageSquare className="w-4 h-4" /> ميثاق التسويق
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brand">
          <Card className="glass-panel border-none">
            <ScrollArea className="h-[600px] p-8">
              <div className="max-w-4xl mx-auto prose prose-stone">
                {renderMarkdown(documents.brandIdentity)}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="gtm">
          <Card className="glass-panel border-none">
            <ScrollArea className="h-[600px] p-8">
              <div className="max-w-4xl mx-auto">
                {renderMarkdown(documents.gtmStrategy)}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="charter">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 glass-panel border-none">
              <ScrollArea className="h-[600px] p-8">
                <div className="max-w-4xl mx-auto">
                  {renderMarkdown(documents.marketingCharter)}
                </div>
              </ScrollArea>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 justify-end">
                    تعديل تفاعلي
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </CardTitle>
                  <CardDescription>
                    قدم ملاحظاتك لتحسين ميثاق التسويق بذكاء.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea 
                    placeholder="مثال: 'اجعل النبرة أكثر هجومية تجاه المنافسين' أو 'ركز أكثر على قنوات التواصل الاجتماعي'..."
                    className="min-h-[150px] resize-none text-right"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <Button 
                    className="w-full font-headline" 
                    onClick={handleRevise}
                    disabled={!feedback.trim() || isRevising}
                    suppressHydrationWarning
                  >
                    {isRevising ? (
                      <><Loader2 className="w-4 h-4 animate-spin ml-2" /> جاري التعديل...</>
                    ) : (
                      <>تحسين الميثاق</>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                <h4 className="font-headline font-bold text-primary mb-2">نصيحة استراتيجية</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ميثاق التسويق القوي يوحد فريقك بالكامل حول "لماذا" نقوم بجهودنا التسويقية. ابقه مركزاً على الجمهور المستهدف.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

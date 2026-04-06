"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AgentPlan, WritingResult } from '@/lib/types';
import { User, Target, Calendar, Lightbulb, CheckCircle2, Layout, PenTool, Video, FileText, Loader2, Sparkles } from 'lucide-react';

interface AgentWorkstationProps {
  plan: AgentPlan;
  writingResults: Record<string, WritingResult>;
  onWrite: (taskId: string, task: string, writer: 'maryam' | 'khaled' | 'omar') => void;
  isLoading: boolean;
}

export default function AgentWorkstation({ plan, writingResults = {}, onWrite, isLoading }: AgentWorkstationProps) {
  const [selectedResult, setSelectedResult] = useState<WritingResult | null>(null);

  const renderContent = (result: WritingResult) => {
    if (result.type === 'post') {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg font-body whitespace-pre-wrap border text-right" dir="rtl">{result.content.postContent}</div>
          <div className="text-right" dir="rtl">
            <h4 className="font-bold text-sm mb-1 text-primary">فكرة بصرية:</h4>
            <p className="text-sm">{result.content.visualIdea}</p>
          </div>
          <div className="flex flex-wrap gap-1 justify-end">
            {result.content.hashtags.map((h: string) => <Badge key={h} variant="secondary">#{h}</Badge>)}
          </div>
        </div>
      );
    }
    if (result.type === 'script') {
      return (
        <div className="space-y-4 text-right" dir="rtl">
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">سكريبت فيديو</Badge>
          <div className="p-4 bg-primary/5 border-r-4 border-primary rounded-l-lg">
            <h4 className="font-bold text-primary mb-2">الهوك (أول 3 ثواني):</h4>
            <p className="italic">"{result.content.hook}"</p>
          </div>
          <div className="p-4 bg-muted rounded-lg font-body whitespace-pre-wrap border">{result.content.scriptBody}</div>
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-sm border border-emerald-100">
             <strong>الدعوة للإجراء:</strong> {result.content.callToAction}
          </div>
          <div>
             <h4 className="font-bold text-sm mb-1">توجيهات التصوير:</h4>
             <p className="text-sm text-muted-foreground">{result.content.visualDirections}</p>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-4 text-right" dir="rtl">
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">مقال / نشرة بريدية</Badge>
        <div className="p-4 bg-muted rounded-lg font-body whitespace-pre-wrap border prose prose-sm max-w-none">
          {result.content.content}
        </div>
        <div className="flex flex-wrap gap-1 justify-end">
          {result.content.seoKeywords.map((k: string) => <Badge key={k} variant="outline">{k}</Badge>)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border shadow-sm">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-headline font-bold text-primary">{plan.agentName}</h2>
          <p className="text-muted-foreground font-medium">{plan.agentRole}</p>
        </div>
        <div className="mr-auto flex gap-2">
           <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">نشط الآن</Badge>
           <Badge variant="outline">الخطة الربعية v1.0</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3 text-right">
              <CardTitle className="text-lg flex items-center gap-2 justify-end">
                الأهداف الربعية
                <Target className="w-5 h-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.quarterlyGoals.map((goal, i) => (
                <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-muted/30 flex-row-reverse">
                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center shrink-0 mt-0.5">{i+1}</div>
                  <p className="text-sm font-medium leading-tight text-right flex-1">{goal}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {plan.contentPillars && (
            <Card>
              <CardHeader className="pb-3 text-right">
                <CardTitle className="text-lg flex items-center gap-2 justify-end">
                  ركائز المحتوى
                  <Layout className="w-5 h-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 justify-end">
                {plan.contentPillars.map((pillar, i) => (
                  <Badge key={i} className="py-1 px-3 bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors">
                    {pillar}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 relative overflow-hidden text-right">
             <Lightbulb className="absolute -left-2 -bottom-2 w-20 h-20 text-amber-200/50 rotate-12" />
             <h4 className="font-headline font-bold text-amber-900 mb-2 flex items-center gap-2 justify-end">
               نصيحة سالم
               <Lightbulb className="w-4 h-4" />
             </h4>
             <p className="text-sm text-amber-800 leading-relaxed relative z-10">{plan.strategicAdvice}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full border-none shadow-md overflow-hidden">
            <CardHeader className="bg-primary/5 border-b text-right">
              <CardTitle className="flex items-center gap-2 text-primary justify-end">
                الجدول الزمني التنفيذي
                <Calendar className="w-5 h-5" />
              </CardTitle>
              <CardDescription>انقر على أي مهمة لتكليف فريق الكتابة بالتنفيذ الفوري.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="week-1" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-12 px-4 gap-2 flex-row-reverse">
                  {plan.weeklyTasks.map((w) => (
                    <TabsTrigger 
                      key={w.week} 
                      value={`week-${w.week}`}
                      className="data-[state=active]:bg-white data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full"
                    >
                      الأسبوع {w.week}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollArea className="h-[500px]">
                  {plan.weeklyTasks.map((w) => (
                    <TabsContent key={w.week} value={`week-${w.week}`} className="p-6 m-0 space-y-4">
                      {w.tasks.map((task, idx) => {
                        const taskId = `task-${w.week}-${idx}`;
                        const result = writingResults?.[taskId];
                        
                        return (
                          <div key={idx} className="flex flex-col p-4 rounded-xl border bg-white hover:border-primary/30 transition-all group text-right">
                             <div className="flex gap-4 items-start mb-4 flex-row-reverse">
                               <CheckCircle2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
                               <p className="text-sm font-medium flex-1">{task}</p>
                             </div>
                             
                             <div className="flex flex-wrap gap-2 border-t pt-4 justify-end">
                                {result ? (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="gap-2 text-primary border-primary/20 bg-primary/5 flex-row-reverse"
                                    onClick={() => setSelectedResult(result)}
                                  >
                                    عرض مخرجات {result.agentName}
                                    <Sparkles className="w-3 h-3" />
                                  </Button>
                                ) : (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 text-[10px] gap-2 hover:bg-primary/5 hover:text-primary flex-row-reverse"
                                      onClick={() => onWrite(taskId, task, 'maryam')}
                                      disabled={isLoading}
                                    >
                                      مريم (بوست)
                                      <PenTool className="w-3 h-3" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 text-[10px] gap-2 hover:bg-red-50 hover:text-red-600 flex-row-reverse"
                                      onClick={() => onWrite(taskId, task, 'khaled')}
                                      disabled={isLoading}
                                    >
                                      خالد (فيديو)
                                      <Video className="w-3 h-3" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 text-[10px] gap-2 hover:bg-blue-50 hover:text-blue-600 flex-row-reverse"
                                      onClick={() => onWrite(taskId, task, 'omar')}
                                      disabled={isLoading}
                                    >
                                      عمر (مقال)
                                      <FileText className="w-3 h-3" />
                                    </Button>
                                  </>
                                )}
                             </div>
                          </div>
                        );
                      })}
                    </TabsContent>
                  ))}
                </ScrollArea>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-right">
            <DialogTitle className="flex items-center gap-2 text-primary justify-end">
              مخرجات الكاتب: {selectedResult?.agentName}
              <PenTool className="w-5 h-5" />
            </DialogTitle>
            <DialogDescription>تم توليد هذا المحتوى بناءً على هوية علامتك التجارية والمهام المحددة.</DialogDescription>
          </DialogHeader>
          
          {selectedResult && renderContent(selectedResult)}
        </DialogContent>
      </Dialog>

      {isLoading && (
        <div className="fixed inset-0 z-[110] bg-background/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="font-headline font-bold">جاري كتابة المحتوى...</p>
            <p className="text-sm text-muted-foreground italic">فريق الكتابة يعمل الآن على مهمتك</p>
          </div>
        </div>
      )}
    </div>
  );
}
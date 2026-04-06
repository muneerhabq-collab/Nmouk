"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { BusinessInfo } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

const QUESTIONS = [
  { key: 'companyName', text: "مرحباً بك في نموّك. لنبدأ بالأساسيات: ما هو اسم شركتك؟" },
  { key: 'industry', text: "ممتاز. في أي قطاع تعمل شركتك؟" },
  { key: 'targetAudience', text: "من هو جمهورك المستهدف الأساسي؟ يرجى أن تكون محدداً قدر الإمكان." },
  { key: 'uniqueSellingProposition', text: "ما هي ميزتك التنافسية الفريدة (USP)؟ ما الذي يجعلك مختلفاً؟" },
  { key: 'businessGoals', text: "ما هي أهدافك التجارية الأساسية لـ 12 شهراً القادمة؟" },
  { key: 'currentChallenges', text: "ما هي التحديات أو العوائق الحالية التي تواجه عملك؟" },
  { key: 'competitors', text: "من هم منافسوك الرئيسيون في السوق؟" },
  { key: 'companyVision', text: "أين ترى شركتك في غضون 5-10 سنوات؟ ما هي رؤيتك طويلة المدى؟" },
  { key: 'companyMission', text: "ما هو ميثاق أو رسالة شركتك؟ لماذا وجد هذا العمل؟" },
  { key: 'productServiceDescription', text: "أخيراً، يرجى إعطائي وصفاً مفصلاً لمنتجاتك أو خدماتك الأساسية." },
];

interface ChatInterfaceProps {
  onComplete: (info: BusinessInfo) => void;
}

export default function ChatInterface({ onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: QUESTIONS[0].text }
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [responses, setResponses] = useState<Partial<BusinessInfo>>({});
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    
    const key = QUESTIONS[currentQuestionIndex].key;
    const nextResponses = { ...responses, [key]: inputValue };
    setResponses(nextResponses);
    setInputValue('');

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setIsTyping(true);
      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;
        const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: QUESTIONS[nextIndex].text };
        setMessages(prev => [...prev, aiMsg]);
        setCurrentQuestionIndex(nextIndex);
        setIsTyping(false);
      }, 800);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        onComplete(nextResponses as BusinessInfo);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto glass-panel rounded-2xl overflow-hidden">
      <div className="p-4 border-b bg-white flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Sparkles className="text-primary-foreground w-4 h-4" />
        </div>
        <div>
          <h2 className="font-headline font-bold text-sm">ذكاء نموّك</h2>
          <p className="text-xs text-muted-foreground">مرحلة الإعداد • {currentQuestionIndex + 1}/{QUESTIONS.length}</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6" viewportRef={scrollRef}>
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
              <Avatar className="w-8 h-8 shrink-0">
                {msg.role === 'ai' ? (
                  <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-accent/10 text-accent">أنت</AvatarFallback>
                )}
              </Avatar>
              <div className={cn(msg.role === 'user' ? "chat-bubble-user" : "chat-bubble-ai")}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
              </Avatar>
              <div className="chat-bubble-ai flex items-center py-2 px-4">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <Input 
            placeholder="اكتب ردك هنا..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 border-border focus-visible:ring-primary h-11"
            suppressHydrationWarning
          />
          <Button size="icon" onClick={handleSend} disabled={!inputValue.trim() || isTyping}>
            <Send className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}

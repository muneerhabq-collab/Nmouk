"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, BookOpen, UserCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandIdentityOption {
  archetype: string;
  plot: string;
  globalReferences: string;
  narrative: string;
  justification: string;
}

interface BrandCardProps {
  brand: BrandIdentityOption;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

export default function BrandCard({ brand, isSelected, onSelect, index }: BrandCardProps) {
  return (
    <Card className={cn(
      "relative transition-all duration-300 border-2 overflow-hidden h-full flex flex-col",
      isSelected ? "border-primary shadow-lg ring-1 ring-primary/20" : "border-border hover:border-primary/40"
    )}>
      {isSelected && (
        <div className="absolute top-3 left-3 z-10">
          <CheckCircle2 className="w-6 h-6 text-primary fill-primary-foreground" />
        </div>
      )}
      <CardHeader className="bg-muted/30">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold">الخيار 0{index + 1}</Badge>
        </div>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-primary" />
          {brand.archetype}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-4 flex-1">
        <div className="space-y-1">
          <h4 className="text-[11px] uppercase text-muted-foreground font-bold flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> السردية الأساسية
          </h4>
          <p className="text-sm italic text-foreground/80 leading-relaxed line-clamp-3">"{brand.narrative}"</p>
        </div>

        <div className="space-y-1">
          <h4 className="text-[11px] uppercase text-muted-foreground font-bold flex items-center gap-1">
            <Globe className="w-3 h-3" /> مراجع عالمية
          </h4>
          <div className="flex flex-wrap gap-1">
            {brand.globalReferences.split(',').map(ref => (
              <Badge key={ref} variant="secondary" className="text-[10px] bg-secondary/50">{ref.trim()}</Badge>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-[11px] uppercase text-muted-foreground font-bold">حبكة الاستراتيجية</h4>
          <p className="text-xs text-foreground/70">{brand.plot}</p>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button 
          variant={isSelected ? "default" : "outline"} 
          className="w-full font-headline"
          onClick={onSelect}
        >
          {isSelected ? "تم الاختيار" : "اختيار الهوية"}
        </Button>
      </CardFooter>
    </Card>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import HeaderSection from '@/components/HeaderSections';
import SimpCalc from '@/components/SimpleCalculator';
import AdvCalc from '@/components/AdvanceCalculator';
export default function AttendancePage() {
  const [mode, setMode] = useState<string>("simple");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  useEffect(() => {
    const savedMode = localStorage.getItem("bunkmate_mode");
    if (savedMode && (savedMode === "simple" || savedMode === "advance")) {
      setMode(savedMode);
    }
    setIsLoaded(true);
  }, []);

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    localStorage.setItem("bunkmate_mode", newMode);
  };
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-mono text-sm">
        Loading state...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-8 md:p-12">
      <div className="max-w-3xl mx-auto w-full space-y-8">
      <HeaderSection/>
        <main className="space-y-6">
          <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 border border-border bg-muted/50 rounded-none">
              <TabsTrigger value="simple" className="text-sm font-medium rounded-none relative -top-[3px]">
                Simple Mode
              </TabsTrigger>
              <TabsTrigger value="advance" className="text-sm font-medium rounded-none relative -top-[3px]">
                Advance Mode
              </TabsTrigger>
            </TabsList>
            <TabsContent value="simple" className="mt-6 space-y-6">
              <SimpCalc/>                         
            </TabsContent>
            <TabsContent value="advance" className="mt-6">
              <AdvCalc/>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <footer className="max-w-3xl mx-auto w-full pt-8 mt-8 border-t border-border text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>BunkMate Utility</span>
        <span className="font-mono">Next.js + Tailwind + shadcn/ui</span>
      </footer>
    </div>
  );
}

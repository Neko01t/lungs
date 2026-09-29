"use client";

import React, { useState, useEffect } from "react";
import { LuCalculator, LuBookOpen, LuConstruction, LuExternalLink, LuSparkles } from "react-icons/lu";
import { MdConstruction } from "react-icons/md";

// shadcn UI Primitives
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const RESOURCES = [
  {
    category: "Quick Utilities",
    description: "Free, handy privacy and utility web tools",
    links: [
      { name: "PairDrop", url: "https://pairdrop.net", desc: "Local file sharing in browser" },
      { name: "TempMail", url: "https://tempmail.net", desc: "Disposable temporary email" },
      { name: "TempChat", url: "https://tempchat.org", desc: "Encrypted self-destructing chat" },
    ],
  },
  {
    category: "Learning & Dev",
    description: "Free platforms to master coding and roadmaps",
    links: [
      { name: "The Odin Project", url: "https://www.theodinproject.com", desc: "Full stack open curriculum" },
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org", desc: "Interactive coding certifications" },
      { name: "roadmap.sh", url: "https://roadmap.sh", desc: "Community developer roadmaps" },
    ],
  },
  {
    category: "Developer Tools",
    description: "Essential tools, documentation & components",
    links: [
      { name: "GitHub", url: "https://github.com", desc: "Code hosting & collaboration" },
      { name: "w3schools", url: "https://www.w3schools.com", desc: "Web development reference" },
      { name: "Next.js", url: "https://nextjs.org", desc: "React framework for the web" },
      { name: "shadcn/ui", url: "https://ui.shadcn.com", desc: "Re-usable UI components" },
      { name: "VS Code", url: "https://code.visualstudio.com", desc: "Code editor" },
    ],
  },
];

export default function AttendancePage() {
  const [mode, setMode] = useState<string>("simple");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Simple Mode Inputs
  const [totalClasses, setTotalClasses] = useState<string>("40");
  const [attendedClasses, setAttendedClasses] = useState<string>("32");
  const [targetPercentage, setTargetPercentage] = useState<string>("75");

  // Load mode state from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("bunkmate_mode");
    if (savedMode && (savedMode === "simple" || savedMode === "advance")) {
      setMode(savedMode);
    }
    setIsLoaded(true);
  }, []);

  // Persist mode changes to localStorage
  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    localStorage.setItem("bunkmate_mode", newMode);
  };

  // Simple calculation logic
  const total = Math.max(0, parseInt(totalClasses) || 0);
  const attended = Math.max(0, Math.min(total, parseInt(attendedClasses) || 0));
  const target = Math.min(100, Math.max(1, parseFloat(targetPercentage) || 75));

  const currentPercentage = total > 0 ? (attended / total) * 100 : 0;
  const isAboveTarget = currentPercentage >= target;

  let bunksAllowed = 0;
  let classesToAttend = 0;

  if (total > 0) {
    if (isAboveTarget) {
      bunksAllowed = Math.floor((attended * 100 - target * total) / target);
      if (bunksAllowed < 0) bunksAllowed = 0;
    } else {
      classesToAttend = Math.ceil((target * total - 100 * attended) / (100 - target));
      if (classesToAttend < 0) classesToAttend = 0;
    }
  }

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
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <LuCalculator className="h-6 w-6 text-primary" />
              BunkMate
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Attendance Calculator & Student Resource Hub
            </p>
          </div>

          {/* Student Toolkit Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-border rounded-none">
                <LuBookOpen className="h-4 w-4" />
                Student Toolkit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card text-card-foreground border-border rounded-none max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <LuSparkles className="h-5 w-5 text-primary" />
                  Student Toolkit
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Essential tools, developer roadmaps, and free utilities.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {RESOURCES.map((group, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground border-b border-border pb-1">
                      {group.category}
                    </h3>
                    <p className="text-xs text-muted-foreground">{group.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {group.links.map((link, lIdx) => (
                        <a
                          key={lIdx}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-col justify-between p-3 border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors group rounded-none"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{link.name}</span>
                            <LuExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">{link.desc}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </header>

        {/* Main Interface */}
        <main className="space-y-6">
          <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 border border-border bg-muted/50 p-1 rounded-none">
              <TabsTrigger value="simple" className="text-sm font-medium rounded-none">
                Simple Mode
              </TabsTrigger>
              <TabsTrigger value="advance" className="text-sm font-medium rounded-none">
                Advance Mode
              </TabsTrigger>
            </TabsList>

            {/* SIMPLE MODE */}
            <TabsContent value="simple" className="mt-6 space-y-6">
              <Card className="border-border bg-card text-card-foreground rounded-none">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Calculator</CardTitle>
                  <CardDescription className="text-xs">
                    Calculate current percentage and bunk/recovery allowances.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="total" className="text-xs font-medium">Total Classes</Label>
                      <Input
                        id="total"
                        type="number"
                        min="0"
                        value={totalClasses}
                        onChange={(e) => setTotalClasses(e.target.value)}
                        className="bg-background border-border rounded-none font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attended" className="text-xs font-medium">Attended</Label>
                      <Input
                        id="attended"
                        type="number"
                        min="0"
                        value={attendedClasses}
                        onChange={(e) => setAttendedClasses(e.target.value)}
                        className="bg-background border-border rounded-none font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target" className="text-xs font-medium">Target (%)</Label>
                      <Input
                        id="target"
                        type="number"
                        min="1"
                        max="100"
                        value={targetPercentage}
                        onChange={(e) => setTargetPercentage(e.target.value)}
                        className="bg-background border-border rounded-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Results */}
                  <div className="pt-4 border-t border-border space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-background border border-border rounded-none gap-2">
                      <div>
                        <span className="text-xs text-muted-foreground block">Current Percentage</span>
                        <span className="text-3xl font-extrabold tracking-tight font-mono">
                          {total > 0 ? `${currentPercentage.toFixed(2)}%` : "0%"}
                        </span>
                      </div>
                      <Badge variant={isAboveTarget ? "default" : "destructive"} className="text-xs px-3 py-1 rounded-none">
                        {isAboveTarget ? "Above Target" : "Below Target"}
                      </Badge>
                    </div>

                    <div className="p-4 bg-background border border-border rounded-none space-y-1">
                      <span className="text-xs text-muted-foreground font-medium">Status</span>
                      {total === 0 ? (
                        <p className="text-sm text-muted-foreground">Enter total classes to calculate.</p>
                      ) : isAboveTarget ? (
                        <p className="text-sm font-semibold text-foreground">
                          🎉 You can skip <span className="text-primary font-bold font-mono">{bunksAllowed}</span> class{bunksAllowed !== 1 ? "es" : ""} while staying above {target}%.
                        </p>
                      ) : (
                        <p className="text-sm font-semibold text-destructive">
                          ⚠️ You need to attend the next <span className="underline font-bold font-mono">{classesToAttend}</span> class{classesToAttend !== 1 ? "es" : ""} consecutively.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ADVANCE MODE (UNDER CONSTRUCTION) */}
            <TabsContent value="advance" className="mt-6">
              <Card className="border-border bg-card text-card-foreground rounded-none">
                <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
                  <div className="flex items-center justify-center gap-3 text-muted-foreground">
                    <LuConstruction className="h-10 w-10 animate-bounce" />
                    <MdConstruction className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      Advance Mode Under Construction
                    </h2>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Custom timetable tracking, daily schedules, lecture durations (1hr / 2hr), and flags (Must Do / Must Avoid) coming soon.
                    </p>
                  </div>
                  <Badge variant="outline" className="border-border text-xs px-3 py-1 rounded-none">
                    Under Construction
                  </Badge>
                </CardContent>
              </Card>
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

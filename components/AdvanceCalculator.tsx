import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { TimetableBuilder, type WeekSchedule, type Course, type DayOfWeek } from "./TimetableBuilder";
import { CheckCircle2, XCircle } from "lucide-react";

export default function AdvCalc() {
  const [formData, setFormData] = useState({
    total: "213",
    attended: "170",
    target: "75",
    plannedSkips: "",
  });
  
  const [maintainMode, setMaintainMode] = useState(false);
  
  const [schedule, setSchedule] = useState<WeekSchedule>({
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: []
  });

  const [hasCalculated, setHasCalculated] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedBaseData = localStorage.getItem("simpCalcFormData");
    if (savedBaseData) {
      try {
        setFormData(JSON.parse(savedBaseData));
      } catch (error) {
        console.error("Failed to parse base attendance data:", error);
      }
    }

    const savedAdvData = localStorage.getItem("advCalcFormData");
    if (savedAdvData) {
      try {
        const parsed = JSON.parse(savedAdvData);
        if (parsed.maintainMode !== undefined) setMaintainMode(parsed.maintainMode);
        if (parsed.schedule) setSchedule(parsed.schedule);
      } catch (error) {
        console.error("Failed to parse advanced attendance data:", error);
      }
    }
    
    setIsLoaded(true);  
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("simpCalcFormData", JSON.stringify(formData));
    }
  }, [formData, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("advCalcFormData", JSON.stringify({ maintainMode, schedule }));
    }
  }, [maintainMode, schedule, isLoaded]);

  const total = Math.max(0, parseInt(formData.total) || 0);
  const attended = Math.max(0, Math.min(total, parseInt(formData.attended) || 0));
  const currentPercentage = total > 0 ? (attended / total) * 100 : 0;
  
  const target = maintainMode 
    ? currentPercentage 
    : Math.min(100, Math.max(1, parseFloat(formData.target) || 75));
    
  const isAboveTarget = currentPercentage >= target;

  let bunksAllowed = 0;
  let classesToAttend = 0;

  if (total > 0) {
    if (isAboveTarget && !maintainMode) {
      bunksAllowed = Math.max(0, Math.floor((attended * 100 - target * total) / target));
    } else if (!isAboveTarget || maintainMode) {
      classesToAttend = Math.max(0, Math.ceil((target * total - 100 * attended) / (100 - target)));
    }
  }

  const plannedSkips = Math.max(0, parseInt(formData.plannedSkips) || 0);
  const futureTotal = total + plannedSkips;
  const futurePercentage = futureTotal > 0 ? (attended / futureTotal) * 100 : 0;
  const isFutureAboveTarget = futurePercentage >= target;

  let futureClassesToAttend = 0;
  if (!isFutureAboveTarget && plannedSkips > 0) {
    futureClassesToAttend = Math.max(0, Math.ceil((target * futureTotal - 100 * attended) / (100 - target)));
  }

  const weeklyPlan = useMemo(() => {
    if (!hasCalculated) return null;

    let weekTotalHours = 0;
    const allCourses: { day: string; course: Course }[] = [];

    Object.entries(schedule).forEach(([day, courses]) => {
      courses.forEach(course => {
        weekTotalHours += course.duration;
        allCourses.push({ day, course });
      });
    });

    if (weekTotalHours === 0) return null;

    const targetDecimal = target / 100;
    const requiredTotalAttended = targetDecimal * (total + weekTotalHours);
    const minHoursThisWeek = Math.max(0, requiredTotalAttended - attended);
    
    const mustDo = allCourses.filter(c => c.course.flag === "MUST_DO");
    const neutral = allCourses.filter(c => c.course.flag === "NEUTRAL");
    const mustNotDo = allCourses.filter(c => c.course.flag === "MUST_NOT_DO");

    let hoursScheduled = 0;
    const attendPlan: typeof allCourses = [];
    const skipPlan: typeof allCourses = [...mustNotDo];

    mustDo.forEach(c => {
      attendPlan.push(c);
      hoursScheduled += c.course.duration;
    });

    const sortedNeutral = [...neutral].sort((a, b) => a.course.duration - b.course.duration);
    
    sortedNeutral.forEach(c => {
      if (hoursScheduled < minHoursThisWeek) {
        attendPlan.push(c);
        hoursScheduled += c.course.duration;
      } else {
        skipPlan.push(c);
      }
    });

    const isFailing = hoursScheduled < minHoursThisWeek;
    
    const uniqueAttendNames = Array.from(new Set(attendPlan.map(c => c.course.name)));
    const uniqueSkipNames = Array.from(new Set(skipPlan.map(c => c.course.name)));
    const skipIds = new Set(skipPlan.map(c => c.course.id));

    return { 
      weekTotalHours, 
      minHoursThisWeek, 
      attendPlan, 
      skipPlan, 
      isFailing,
      uniqueAttendNames,
      uniqueSkipNames,
      skipIds
    };
  }, [schedule, target, total, attended, hasCalculated]);

  // --- HANDLERS ---
  const handleIntChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value.replace(/\D/g, "") }));
    setHasCalculated(false);
  };

  const handleFloatChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value.replace(/[^0-9.]/g, "") }));
    setHasCalculated(false);
  };

  return (
    <Card className="border-border bg-card text-card-foreground rounded-none max-w-4xl mx-auto">
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-michroma">Advanced Calculator</CardTitle>
          <Badge variant="outline" className="rounded-none border-primary text-primary text-[10px] uppercase tracking-widest">
            Adv Mode
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Smart scheduling, maintenance modes, and the bunk generator.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total" className="text-xs font-medium">Total Classes</Label>
              <Input id="total" type="text" inputMode="numeric" value={formData.total} onChange={handleIntChange("total")} className="bg-background px-2 border-border rounded-none font-mono" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attended" className="text-xs font-medium">Attended</Label>
              <Input id="attended" type="text" inputMode="numeric" value={formData.attended} onChange={handleIntChange("attended")} className="bg-background border-border px-2 rounded-none font-mono" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center h-4">
                <Label htmlFor="target" className="text-xs font-medium">Target (%)</Label>
                <div className="flex items-center space-x-1.5 cursor-pointer select-none">
                  <Checkbox 
                    id="maintainMode" checked={maintainMode} 
                    onCheckedChange={(checked) => { setMaintainMode(!!checked); setHasCalculated(false); }} 
                    className="rounded-none border-border" 
                  />
                  <label htmlFor="maintainMode" className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider cursor-pointer">Maintain</label>
                </div>
              </div>
              <Input 
                id="target" type="text" inputMode="decimal" maxLength={5} 
                value={maintainMode ? currentPercentage.toFixed(2) : formData.target} 
                onChange={handleFloatChange("target")} 
                disabled={maintainMode}
                className="bg-background border-border px-2 rounded-none font-mono disabled:opacity-50 disabled:bg-muted/30" 
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-background border border-border rounded-none gap-2">
            <div>
              <span className="text-xs text-muted-foreground block">Current Percentage</span>
              <span className="text-3xl font-extrabold tracking-tight font-mono">
                {total > 0 ? `${currentPercentage.toFixed(2)}%` : "0%"}
              </span>
            </div>
            <Badge variant={isAboveTarget ? "default" : "destructive"} className="text-xs px-3 py-1 rounded-none">
              {maintainMode ? "Maintaining Current" : isAboveTarget ? "Above Target" : "Below Target"}
            </Badge>
          </div>
        </div>

        {total > 0 && (
          <Accordion type="multiple" defaultValue={["generator"]} className="space-y-4">
            
            <AccordionItem value="projection" className="border border-border bg-background px-4 rounded-none">
              <AccordionTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground hover:no-underline py-4">
                Plan Future Leaves (What-If)
              </AccordionTrigger>
              <AccordionContent className="pt-2 border-t border-border space-y-4 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="plannedSkips" className="text-xs font-medium">Classes I want to skip</Label>
                  <Input id="plannedSkips" type="text" inputMode="numeric" placeholder="e.g. 5" value={formData.plannedSkips} onChange={handleIntChange("plannedSkips")} className="bg-background px-2 border-border rounded-none font-mono w-full sm:w-1/2" />
                </div>
                {plannedSkips > 0 && (
                  <div className="p-4 bg-muted/30 border border-border rounded-none space-y-2 mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Projected Percentage</span>
                      <span className={`text-xl font-bold font-mono ${isFutureAboveTarget ? "text-foreground" : "text-destructive"}`}>
                        {futurePercentage.toFixed(2)}%
                      </span>
                    </div>
                    {isFutureAboveTarget ? (
                      <p className="text-sm font-semibold text-foreground">You will still be above your target of {target.toFixed(2)}%.</p>
                    ) : (
                      <p className="text-sm font-semibold text-destructive leading-relaxed">
                        After skipping {plannedSkips}, you need to attend the next <span className="underline font-bold font-mono">{futureClassesToAttend}</span> classes consecutively to {maintainMode ? "recover your current percentage" : `reach ${target}%`}.
                      </p>
                    )}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="generator" className="border border-border bg-background px-4 rounded-none">
              <AccordionTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground hover:no-underline py-4">
                <div className="flex flex-col text-left">
                  <span className="text-foreground">Smart Bunk Generator</span>
                  <span className="text-xs font-normal">Build your timetable visually & optimize weekly skips</span>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="pt-4 border-t border-border space-y-6 pb-4">
                
                <TimetableBuilder 
                  schedule={schedule} 
                  setSchedule={setSchedule} 
                  onChange={() => setHasCalculated(false)} 
                />

                <div className="pt-4 border-t border-border flex flex-col items-center gap-3">
                  <Button 
                    onClick={() => setHasCalculated(true)} 
                    className="w-full sm:w-auto rounded-none font-bold tracking-widest uppercase text-xs px-8"
                  >
                    Generate Action Plan
                  </Button>
                  {!hasCalculated && (
                    <span className="text-[10px] text-muted-foreground">Click to run algorithm on current timetable</span>
                  )}
                </div>

                {hasCalculated && weeklyPlan && (
                  <div className="mt-8 border border-border bg-background p-5 space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                    
                    {weeklyPlan.isFailing && (
                      <div className="bg-destructive/10 text-destructive p-3 text-xs border border-destructive/20 rounded-none leading-relaxed">
                        <strong>Warning:</strong> Attending every possible class this week won't be enough to hit your {target.toFixed(2)}% target. You need more classes globally.
                      </div>
                    )}

                    <div className="space-y-4 text-sm leading-relaxed border-b border-border/50 pb-6">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-primary mb-2">Weekly Summary</h4>
                      
                      <p>
                        You have to attend <span className="font-bold font-mono px-1 bg-muted">{weeklyPlan.attendPlan.length}</span> lectures this week (Total: {Math.ceil(weeklyPlan.minHoursThisWeek)} hrs).
                        {weeklyPlan.uniqueAttendNames.length > 0 && (
                          <span className="block mt-1 text-muted-foreground text-xs">
                            Subjects to attend: <strong className="text-foreground">{weeklyPlan.uniqueAttendNames.join(", ")}</strong>
                          </span>
                        )}
                      </p>

                      <p>
                        You can safely skip <span className="font-bold font-mono px-1 bg-muted">{weeklyPlan.skipPlan.length}</span> lectures this week.
                        {weeklyPlan.uniqueSkipNames.length > 0 && (
                          <span className="block mt-1 text-muted-foreground text-xs">
                            Subjects you can skip: <strong className="text-foreground">{weeklyPlan.uniqueSkipNames.join(", ")}</strong>
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Your Schedule</h4>
                      
                      <div className="space-y-3">
                        {(Object.keys(schedule) as Array<DayOfWeek>).map(day => {
                          if (schedule[day].length === 0) return null;
                          
                          return (
                            <div key={day} className="flex flex-col sm:flex-row sm:items-start gap-3 bg-muted/10 p-3 border border-border/50 rounded-none">
                              <div className="w-12 text-xs font-bold uppercase tracking-widest text-muted-foreground pt-1">
                                {day}
                              </div>
                              <div className="flex flex-wrap gap-2 flex-1">
                                {schedule[day].map(course => {
                                  const isSkipped = weeklyPlan.skipIds.has(course.id);
                                  
                                  if (isSkipped) {
                                    return (
                                      <div key={course.id} className="flex items-center gap-1.5 px-2 py-1 border border-border/50 bg-background opacity-50 select-none">
                                        <XCircle className="w-3 h-3 text-destructive" />
                                        <span className="text-[10px] font-bold line-through">{course.name}</span>
                                        <span className="text-[9px] font-mono line-through text-muted-foreground ml-1">{course.duration}h</span>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div key={course.id} className="flex items-center gap-1.5 px-2 py-1 border border-green-600/30 bg-green-600/10 dark:bg-green-500/10 select-none">
                                      <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-500" />
                                      <span className="text-[10px] font-bold text-green-700 dark:text-green-400">{course.name}</span>
                                      <span className="text-[9px] font-mono text-green-600/70 dark:text-green-400/70 ml-1">{course.duration}h</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                        {Object.values(schedule).every(day => day.length === 0) && (
                          <p className="text-xs text-muted-foreground italic">No classes scheduled.</p>
                        )}
                      </div>
                    </div>

                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function SimpCalc() {
  const [formData, setFormData] = useState({
    total: "213",
    attended: "170",
    target: "75",
    plannedSkips: "",
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("simpCalcFormData");
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error("Failed to parse saved attendance data:", error);
      }
    }
    setIsLoaded(true);  
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("simpCalcFormData", JSON.stringify(formData));
    }
  }, [formData, isLoaded]);

  const total = Math.max(0, parseInt(formData.total) || 0);
  const attended = Math.max(0, Math.min(total, parseInt(formData.attended) || 0));
  const target = Math.min(100, Math.max(1, parseFloat(formData.target) || 75));
  
  const currentPercentage = total > 0 ? (attended / total) * 100 : 0;
  const isAboveTarget = currentPercentage >= target;

  let bunksAllowed = 0;
  let classesToAttend = 0;

  if (total > 0) {
    if (isAboveTarget) {
      bunksAllowed = Math.max(0, Math.floor((attended * 100 - target * total) / target));
    } else {
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
  
  const handleIntChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value.replace(/\D/g, "")
    }));
  };

  const handleFloatChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value.replace(/[^0-9.]/g, "")
    }));
  };

  return (
    <Card className="border-border bg-card text-card-foreground rounded-none">
      <CardHeader>
        <CardTitle className="text-lg font-michroma">Quick Calculator</CardTitle>
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
              type="text"
              inputMode="numeric"
              value={formData.total}
              onChange={handleIntChange("total")}
              className="bg-background px-2 border-border rounded-none font-mono"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attended" className="text-xs font-medium">Attended</Label>
            <Input
              id="attended"
              type="text"
              inputMode="numeric"
              value={formData.attended}
              onChange={handleIntChange("attended")}
              className="bg-background border-border px-2 rounded-none font-mono"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target" className="text-xs font-medium">Target (%)</Label>
            <Input
              id="target"
              type="text"
              inputMode="decimal"
              maxLength={5}
              value={formData.target}
              onChange={handleFloatChange("target")}
              className="bg-background border-border px-2 rounded-none font-mono"
            />
          </div>
        </div>
        
        <div className="pt-4 border-t border-border space-y-4">
          <div className="flex flex-col cursor-default sm:flex-row items-start sm:items-center justify-between p-4 bg-background border border-border rounded-none gap-2">
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
                You can skip <span className="text-primary font-bold font-mono">{bunksAllowed}</span> class{bunksAllowed !== 1 ? "es" : ""} while staying above {target}%.
              </p>
            ) : (
              <p className="text-sm font-semibold text-destructive">
                You need to attend the next <span className="underline font-bold font-mono">{classesToAttend}</span> class{classesToAttend !== 1 ? "es" : ""} consecutively.
              </p>
            )}
          </div>
        </div>

        {total > 0 && (
          <details className="group border border-border rounded-none bg-background">
            <summary className="text-sm font-medium cursor-pointer p-3 select-none flex justify-between items-center text-muted-foreground hover:text-foreground transition-colors">
              Plan Future Leaves (What-If)
              <span className="transition-transform duration-200 group-open:rotate-180">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </span>
            </summary>
            
            <div className="p-4 pt-2 border-t border-border space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plannedSkips" className="text-xs font-medium">Classes I want to skip</Label>
                <Input
                  id="plannedSkips"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 5"
                  value={formData.plannedSkips}
                  onChange={handleIntChange("plannedSkips")}
                  className="bg-background px-2 border-border rounded-none font-mono w-full sm:w-1/2"
                />
              </div>

              {plannedSkips > 0 && (
                <div className="p-4 bg-muted/30 border border-border rounded-none space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Projected Percentage</span>
                    <span className={`text-xl font-bold font-mono ${isFutureAboveTarget ? "text-foreground" : "text-destructive"}`}>
                      {futurePercentage.toFixed(2)}%
                    </span>
                  </div>
                  
                  {isFutureAboveTarget ? (
                    <p className="text-sm font-semibold text-foreground">
                      You will still be above the {target}% target.
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-destructive leading-relaxed">
                      After skipping {plannedSkips}, you will need to attend the next <span className="underline font-bold font-mono">{futureClassesToAttend}</span> classes consecutively to reach {target}%.
                    </p>
                  )}
                </div>
              )}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
}

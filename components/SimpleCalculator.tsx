import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
export default function SimpCalc(){
  const [totalClasses, setTotalClasses] = useState<string>("40");
  const [attendedClasses, setAttendedClasses] = useState<string>("32");
  const [targetPercentage, setTargetPercentage] = useState<string>("75");
  
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

  return (<Card className="border-border bg-card text-card-foreground rounded-none">
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
              You can skip <span className="text-primary font-bold font-mono">{bunksAllowed}</span> class{bunksAllowed !== 1 ? "es" : ""} while staying above {target}%.
            </p>
          ) : (
            <p className="text-sm font-semibold text-destructive">
              You need to attend the next <span className="underline font-bold font-mono">{classesToAttend}</span> class{classesToAttend !== 1 ? "es" : ""} consecutively.
            </p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>

  )
}

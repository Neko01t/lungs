import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

import { LuConstruction } from "react-icons/lu";
import { MdConstruction } from "react-icons/md";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function AdvCalc(){
  return (
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
  )
}

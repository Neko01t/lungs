import { Input } from "@/components/ui/input";
import { CheckCircle2, Ban } from "lucide-react";

export type ClassFlag = "MUST_DO" | "NEUTRAL" | "MUST_NOT_DO";

export interface Course {
  id: string;
  name: string;
  duration: number;
  flag: ClassFlag;
}

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
export type WeekSchedule = { [day in DayOfWeek]: Course[] };

const MAX_HOURS_PER_DAY = 12;

export interface TimetableBuilderProps {
  schedule: WeekSchedule;
  setSchedule: React.Dispatch<React.SetStateAction<WeekSchedule>>;
  onChange: () => void;
}

export function TimetableBuilder({ schedule, setSchedule, onChange }: TimetableBuilderProps) {

  const getDayTotalHours = (day: DayOfWeek) => schedule[day].reduce((sum, c) => sum + c.duration, 0);

  const addCourse = (day: DayOfWeek) => {
    if (getDayTotalHours(day) >= MAX_HOURS_PER_DAY) return;
    const newId = Date.now().toString();
    setSchedule(prev => ({
      ...prev,
      [day]: [...prev[day], { id: newId, name: `Class ${prev[day].length + 1}`, duration: 1, flag: "NEUTRAL" }]
    }));
    onChange();
  };

  const updateCourse = (day: DayOfWeek, id: string, field: keyof Course, value: any) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
    onChange();
  };

  const removeCourse = (day: DayOfWeek, id: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter(c => c.id !== id)
    }));
    onChange();
  };

  // --- INTERACTION LOGIC: DRAG TO RESIZE ---
  const startResize = (e: React.PointerEvent, day: DayOfWeek, course: Course) => {
    e.stopPropagation();
    e.preventDefault();
    const container = (e.currentTarget as HTMLElement).closest('.row-container');
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    const startX = e.clientX;
    const startDuration = course.duration;
    const otherHours = getDayTotalHours(day) - course.duration;

    const handleMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaHours = deltaX * (MAX_HOURS_PER_DAY / containerWidth);
      let newDuration = Math.round((startDuration + deltaHours) * 2) / 2; // Snap to 0.5 increments
      newDuration = Math.max(0.5, Math.min(newDuration, MAX_HOURS_PER_DAY - otherHours));
      
      setSchedule(prev => ({
        ...prev,
        [day]: prev[day].map(c => c.id === course.id ? { ...c, duration: newDuration } : c)
      }));
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      onChange();
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  // --- INTERACTION LOGIC: CLICK TO CYCLE / LONG PRESS TO DELETE ---
  const handleBlockPointerDown = (e: React.PointerEvent, day: DayOfWeek, course: Course) => {
    // Ignore if clicking on input or resize handle
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).classList.contains('resize-handle')) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startTime = e.timeStamp;

    const timer = setTimeout(() => {
      removeCourse(day, course.id);
    }, 600); // 600ms long press deletes the course

    const handleMove = (moveEvent: PointerEvent) => {
      // If user drags finger/mouse, cancel the long-press deletion
      if (Math.abs(moveEvent.clientX - startX) > 10 || Math.abs(moveEvent.clientY - startY) > 10) {
        clearTimeout(timer);
        cleanup();
      }
    };

    const handleUp = (upEvent: PointerEvent) => {
      clearTimeout(timer);
      const elapsed = upEvent.timeStamp - startTime;
      const moved = Math.abs(upEvent.clientX - startX) > 10 || Math.abs(upEvent.clientY - startY) > 10;
      
      // If it was a quick click without moving, cycle the flag
      if (elapsed < 600 && !moved) {
        const nextFlag: Record<ClassFlag, ClassFlag> = {
          NEUTRAL: "MUST_NOT_DO",
          MUST_NOT_DO: "MUST_DO",
          MUST_DO: "NEUTRAL"
        };
        updateCourse(day, course.id, "flag", nextFlag[course.flag]);
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const getStyle = (flag: ClassFlag) => {
    if (flag === "MUST_DO") return "bg-primary/15 border-primary/30 text-primary";
    if (flag === "MUST_NOT_DO") return "bg-destructive/15 border-destructive/30 text-destructive";
    return "bg-muted/50 border-border text-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="text-[10px] text-muted-foreground flex justify-between px-2 bg-muted/20 py-1 border border-border">
        <span><strong className="text-foreground">Click</strong> to cycle Priority</span>
        <span><strong className="text-foreground">Drag edge</strong> to resize Time</span>
        <span><strong className="text-foreground">Long press</strong> to Delete</span>
      </div>

      {/* Visual Timetable Grid */}
      <div className="space-y-1">
        <div className="flex pl-12 pr-10 text-[10px] text-muted-foreground justify-between font-mono select-none">
          <span>0h</span><span>3h</span><span>6h</span><span>9h</span><span>12h</span>
        </div>

        {(Object.keys(schedule) as Array<DayOfWeek>).map((day) => (
          <div key={day} className="flex items-center gap-2 group">
            <div className="w-10 text-xs font-bold uppercase tracking-wider text-muted-foreground">{day}</div>
            
            <div className="row-container flex-1 bg-black/95 dark:bg-black relative flex h-10 border border-border overflow-hidden">
              {schedule[day].map((course) => (
                <div 
                  key={course.id}
                  onPointerDown={(e) => handleBlockPointerDown(e, day, course)}
                  style={{ width: `${(course.duration / MAX_HOURS_PER_DAY) * 100}%` }}
                  className={`relative border-r cursor-pointer flex items-center transition-colors overflow-hidden select-none group/block touch-none
                    ${getStyle(course.flag)}
                  `}
                  title={`${course.name} (${course.duration}h) - ${course.flag}`}
                >
                  {/* Status Icon */}
                  <div className="pl-1.5 pr-1 flex-shrink-0">
                    {course.flag === "MUST_DO" && <CheckCircle2 className="w-3 h-3 text-primary" />}
                    {course.flag === "MUST_NOT_DO" && <Ban className="w-3 h-3 text-destructive" />}
                  </div>

                  {/* Inline Name Input */}
                  <Input 
                    value={course.name}
                    onChange={(e) => updateCourse(day, course.id, "name", e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()} // Let user click input without triggering flag cycle
                    className="bg-transparent border-none p-0 h-full w-full text-[10px] font-bold focus:ring-0 focus-visible:ring-0 rounded-none shadow-none text-current placeholder:text-current/50"
                  />

                  {/* Duration Badge (shows on hover) */}
                  <span className="absolute right-3 opacity-0 group-hover/block:opacity-100 text-[9px] font-mono pointer-events-none transition-opacity bg-background/80 px-1 rounded-sm">
                    {course.duration}h
                  </span>

                  {/* Drag-to-Resize Handle */}
                  <div 
                    className="resize-handle absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-black/20 dark:hover:bg-white/20 touch-none"
                    onPointerDown={(e) => startResize(e, day, course)}
                  />
                </div>
              ))}

              {getDayTotalHours(day) < MAX_HOURS_PER_DAY && (
                <button 
                  onClick={() => addCourse(day)}
                  className="px-4 h-full text-white/30 hover:text-white hover:bg-white/10 transition-colors text-lg font-light flex items-center justify-center outline-none"
                  title={`Add class to ${day}`}
                >
                  +
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface Lecture {
  id: number;
  name: string;
  duration: "1hr" | "2hr" | string;
}

export interface ScheduleDay {
  system_given_number: number;
  sections: Lecture[];
}

export let scheduleData: ScheduleDay[] = [];

export function getAllSchedule(): ScheduleDay[] {
  return scheduleData;
}

export function getDayByNumber(id_day: number): ScheduleDay | undefined {
  return scheduleData.find((d) => d.system_given_number === id_day);
}
export function getSectionById(id_day: number, id_section: number): Lecture | undefined {
  const day = getDayByNumber(id_day);
  if (!day) return undefined;
  
  return day.sections.find((s) => s.id === id_section);
}

export function createSection(dayNumber: number, newLecture: Omit<Lecture, "id">) {
  let day = getDayByNumber(dayNumber);

  if (!day) {
    day = { system_given_number: dayNumber, sections: [] };
    scheduleData.push(day);
  }

  const allLectureIds = scheduleData.flatMap((d) => d.sections.map((s) => s.id));
  const nextId = allLectureIds.length > 0 ? Math.max(...allLectureIds) + 1 : 1;

  const lectureWithId: Lecture = {
    id: nextId,
    ...newLecture,
  };

  day.sections.push(lectureWithId);
  return lectureWithId;
}

export function deleteScheduleSection(id_day: number, id_section: number) {
  const day = getDayByNumber(id_day);
  if (!day) return false;

  const initialLength = day.sections.length;
  day.sections = day.sections.filter((section) => section.id !== id_section);

  if (day.sections.length === 0) {
    scheduleData = scheduleData.filter((d) => d.system_given_number !== id_day);
  }

  return day.sections.length < initialLength;
}

export function updateScheduleSection(
  id_day: number,
  id_section: number,
  updatedValues: Partial<Lecture>
) {
  const section = getSectionById(id_day, id_section);
  if (!section) return null;

  Object.assign(section, updatedValues);
  return section;
}

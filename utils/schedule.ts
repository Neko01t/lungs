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


const STORAGE_KEY = "encrypted_schedule_data";
const SECRET_SALT = "chor_ke_ghar_mei_chori";

export function saveToLocalStorage() {
  if (typeof window === "undefined") return;
  try {
    const rawData = JSON.stringify(scheduleData);
    const combined = SECRET_SALT + "::" + rawData;
    const encrypted = btoa(encodeURIComponent(combined));
    localStorage.setItem(STORAGE_KEY, encrypted);
  } catch (error) {
    console.error("Failed to save and encrypt data:", error);
  }
}

export function loadFromLocalStorage(): ScheduleDay[] {
  if (typeof window === "undefined") return [];
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (!encrypted) return [];
    const decoded = decodeURIComponent(atob(encrypted));
    if (!decoded.startsWith(SECRET_SALT)) {
      console.warn("Data integrity check failed or salt mismatch.");
      return [];
    }
    const rawData = decoded.slice(SECRET_SALT.length + 2);
    scheduleData = JSON.parse(rawData);
    return scheduleData;
  } catch (error) {
    console.error("Failed to decrypt and load data:", error);
    return [];
  }
}

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
  
  saveToLocalStorage();
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

  const success = day.sections.length < initialLength;
  if (success) {
    saveToLocalStorage(); 
  }
  return success;
}

export function updateScheduleSection(
  id_day: number,
  id_section: number,
  updatedValues: Partial<Lecture>
) {
  const section = getSectionById(id_day, id_section);
  if (!section) return null;

  Object.assign(section, updatedValues);
  
  saveToLocalStorage(); 
  return section;
}

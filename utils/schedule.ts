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

const STORAGE_KEY = "compressed_encrypted_schedule";
const SECRET_SALT = "my_super_secret_salt";
async function compressData(dataString: string): Promise<string> {
  const stream = new Blob([dataString]).stream().pipeThrough(new CompressionStream('gzip'));
  const compressedBlob = await new Response(stream).blob();
  const buffer = await compressedBlob.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
async function decompressData(base64String: string): Promise<string> {
  const binary = atob(base64String);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  const decompressedBlob = await new Response(stream).blob();
  return await decompressedBlob.text();
}
export async function saveToLocalStorageAsync() {
  if (typeof window === "undefined") return;
  try {
    const rawData = JSON.stringify(scheduleData);
    const combined = SECRET_SALT + "::" + rawData;
    const compressedAndEncrypted = await compressData(combined);
    localStorage.setItem(STORAGE_KEY, compressedAndEncrypted);
  } catch (error) {
    console.error("Failed to compress and save data:", error);
  }
}
export async function loadFromLocalStorageAsync(): Promise<ScheduleDay[]> {
  if (typeof window === "undefined") return [];

  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return [];
    const decoded = await decompressData(storedData);
    if (!decoded.startsWith(SECRET_SALT)) {
      console.warn("Integrity check failed.");
      return [];
    }
    const rawData = decoded.slice(SECRET_SALT.length + 2);
    scheduleData = JSON.parse(rawData);
    return scheduleData;
  } catch (error) {
    console.error("Failed to load and decompress data:", error);
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

export async function createSection(dayNumber: number, newLecture: Omit<Lecture, "id">) {
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
  await saveToLocalStorageAsync(); 
  return lectureWithId;
}

export async function deleteScheduleSection(id_day: number, id_section: number) {
  const day = getDayByNumber(id_day);
  if (!day) return false;

  const initialLength = day.sections.length;
  day.sections = day.sections.filter((section) => section.id !== id_section);

  if (day.sections.length === 0) {
    scheduleData = scheduleData.filter((d) => d.system_given_number !== id_day);
  }

  const success = day.sections.length < initialLength;
  if (success) {
    await saveToLocalStorageAsync();
  }
  return success;
}

export async function updateScheduleSection(
  id_day: number,
  id_section: number,
  updatedValues: Partial<Lecture>
) {
  const section = getSectionById(id_day, id_section);
  if (!section) return null;

  Object.assign(section, updatedValues);
  await saveToLocalStorageAsync();
  return section;
}

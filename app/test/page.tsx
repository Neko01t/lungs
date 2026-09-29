'use client';
import { useEffect, useState } from 'react';
import { 
  loadFromLocalStorage, 
  getAllSchedule, 
  createSection 
} from "@/utils/schedule";

export default function Page() {
  const [schedule, setSchedule] = useState(getAllSchedule());
  useEffect(() => {
    const loadedData = loadFromLocalStorage();
    setSchedule([...loadedData]);
  }, []);

  const handleAdd = () => {
    createSection(1, { name: "Encrypted State Lecture", duration: "1hr" });
    setSchedule([...getAllSchedule()]); 
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>Secure LocalStorage Schedule</h1>
      <button onClick={handleAdd}>Add Lecture (Auto-Encrypted)</button>
      <pre>{JSON.stringify(schedule, null, 2)}</pre>
    </main>
  );
}

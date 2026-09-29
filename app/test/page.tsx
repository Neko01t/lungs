'use client';
import { useEffect, useState } from 'react';
import { 
  loadFromLocalStorageAsync, 
  getAllSchedule, 
  createSection 
} from "@/utils/schedule";

export default function Page() {
  const [schedule, setSchedule] = useState(getAllSchedule());
  useEffect(() => {
    async function loadData(){
    const loadedData = await loadFromLocalStorageAsync();
    setSchedule([...loadedData]);
    }
    loadData();
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

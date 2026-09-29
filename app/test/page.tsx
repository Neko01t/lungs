'use client';
import { useState } from 'react';
import { 
  getAllSchedule, 
  getDayByNumber, 
  createSection 
} from "@/utils/schedule";

export default function Page() {
  const [schedule, setSchedule] = useState(getAllSchedule());

  const handleAdd = () => {
    createSection(1, { name: "TypeScript Basics", duration: "1hr" });
    setSchedule([...getAllSchedule()]);
  };

  const handleFetchOneDay = () => {
    const day1 = getDayByNumber(1);
    console.log("Fetched Day 1 data:", day1);
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>Schedule Viewer</h1>
      <button onClick={handleAdd}>Add Lecture</button>
      <button onClick={handleFetchOneDay} style={{ marginLeft: "10px" }}>Log Day 1 to Console</button>

      <h2>Current Schedule Preview:</h2>
      <pre>{JSON.stringify(schedule, null, 2)}</pre>
    </main>
  );
}

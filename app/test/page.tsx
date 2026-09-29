'use client';
import { 
  scheduleData, 
  createSection, 
  deleteScheduleSection, 
  updateScheduleSection 
} from "@/utils/schedule";

export default function Page() {
  
  const handleAdd = () => {
    createSection(1, { name: "React Basics", duration: "2hr" });
    console.log("Current Schedule:", scheduleData);
  };

  const handleDelete = () => {
    deleteScheduleSection(1, 1);
    console.log("After deletion:", scheduleData);
  };

  const handleUpdate = () => {
    updateScheduleSection(1, 1, { name: "Advanced Next.js" });
    console.log("After update:", scheduleData);
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>Schedule Manager</h1>
      <button onClick={handleAdd}>Add Section to Day 1</button>
      <br /><br />
      <button onClick={handleUpdate}>Update Section 1</button>
      <br /><br />
      <button onClick={handleDelete}>Delete Section 1</button>
    </main>
  );
}

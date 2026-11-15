import { useState } from 'react'
import './App.css';



function App() {
 
  const [assignment,setAssignment]=useState([]);
  const [Tittle,setTittle]= useState(""); 
  const[Course,setCourse]=useState("");
  const[priority,setpriority]=useState("Medium");
  
function addAssignment() {//creates an object with the assignment details and adds it to the assignment array
 if (!Tittle.trim() || !Course.trim()) {
  alert("Please fill in all fields");
  return;
}
  const newAssignment = {
    id: crypto.randomUUID(),
    title: Tittle.trim(),
    course: Course.trim(),
    priority: priority,
    completed:false
  };

  setAssignment(
    previousAssignments => [...previousAssignments,newAssignment]);
setTittle("");
setCourse("");
setpriority("Medium");
}

function deleteAssignment(id) {
  setAssignment(previousAssignments => previousAssignments.filter(assignment => assignment.id !== id));
}
//here we have an array of assignments Object now we have to map it so that i can display all the assignments 

function toggleCompleted(id) {
  setAssignment(previousAssignments =>
    previousAssignments.map((assignment) => {
      if (assignment.id === id) {
        return {
          ...assignment,//this has all the previous properties of the assignment object and we are just changing the completed property to its opposite value
          completed: !assignment.completed //we are using the ! operator to toggle the value of completed property so if it was true it will become false and vice versa
        };
      }

      return assignment;
    })
  );
}
  return (
    <>
    <div>
      <h1>Assignment Manager</h1>

      <input
                  placeholder="Assignment title"
                  value={Tittle}
                  onChange={(e) => setTittle(e.target.value)}
      />
      <input
                  placeholder="Course title"
                  value={Course}
                  onChange={(e) => setCourse(e.target.value)}
      />
      <select
                value={priority}
                onChange={(e) => setpriority(e.target.value)}
         >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
      </select>

      <button onClick={addAssignment}>+ Add Assignment</button>
    </div>
    <div>
      <h2>My Assignments</h2>
      <div>
        {
          assignment.map((assignment)=>(
            <div key={assignment.id}>
              <h3>{assignment.title}</h3>
              <p>{assignment.course}</p>
              <p>{assignment.priority}</p>
              <button onClick={() => deleteAssignment(assignment.id)}>🗑️Delete</button>
              <button onClick={()=>toggleCompleted(assignment.id)}>{assignment.completed ? '✅ COMPLETED' : '❌ PENDING'}</button>
            </div>
          ))
        }
      </div>
    </div>

    </>
  )
}

export default App

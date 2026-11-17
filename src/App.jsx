import { useState } from 'react'
import './App.css';


function App() {
 
  const [assignment,setAssignment]=useState([]);
  const [Tittle,setTittle]= useState(""); 
  const[Course,setCourse]=useState("");
  const[priority,setpriority]=useState("Medium");
  const[editid,seteditid]=useState(null);
  const[editTittle,seteditTittle]=useState("");
  const[editCourse,seteditCourse]=useState("");
  const[editPriority,seteditPriority]=useState("Medium");
  const[filter,setFilter]=useState("all");
  const[searchTerm,setSearchTerm]=useState("");




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
function editAssignment(assignment){
  seteditid(assignment.id);
  seteditTittle(assignment.title);
  seteditCourse(assignment.course);
  seteditPriority(assignment.priority);
}
function saveChanges(editid){
  setAssignment(previousAssignments =>
    previousAssignments.map((assignment) => {
      if (assignment.id === editid) {
        return {
          ...assignment,
          title: editTittle.trim(),
          course: editCourse.trim(),
          priority: editPriority
        };
      }

      return assignment;
    })
  );
  seteditid(null);
  seteditTittle("");
  seteditCourse("");
  seteditPriority("Medium");
}
const FilteredAssignments=assignment.filter((assignment)=>{
    if(filter==="all"){
      return true;
    }
    else if(filter==="pending"){
      return !assignment.completed;
    }
    else if(filter==="completed"){
      return assignment.completed;
    }
  })

const searchedAssignments=FilteredAssignments.filter((assignment)=>{
  return assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
   || assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
})





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
{searchedAssignments.length === 0 && <p>No assignments found.</p>}
    {assignment.length > 0 && (
      <>
      <input
        placeholder="Search assignments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <br/>
       <button onClick={() => setFilter("all")}>
                    All
           </button>

            <button onClick={() => setFilter("pending")}>
                    Pending
           </button>

           <button onClick={() => setFilter("completed")}>
                    Completed
          </button></>
    )}
          
        {
          searchedAssignments.map((assignment)=>(
            <div key={assignment.id}>
              <h3>{assignment.title}</h3>
              <p>{assignment.course}</p>
              <p>{assignment.priority}</p>
              <button onClick={() => deleteAssignment(assignment.id)}>🗑️Delete</button>
              <button onClick={()=>toggleCompleted(assignment.id)}>{assignment.completed ? '✅ COMPLETED' : '❌ PENDING'}</button>
              <button onClick={()=>editAssignment(assignment)}>✏️ Edit</button>
              {editid === assignment.id && (
                <div>
                  <input
                    placeholder="Edit Assignment title"
                    value={editTittle}
                    onChange={(e) => seteditTittle(e.target.value)}
                  />
                  <input
                    placeholder="Edit Course title"
                    value={editCourse}
                    onChange={(e) => seteditCourse(e.target.value)}
                  />
                  <select
                    value={editPriority}
                    onChange={(e) => seteditPriority(e.target.value)}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                  <button onClick={() => saveChanges(editid)}>SAVE CHANGES</button>
                  <button onClick={() => {
                    seteditid(null);
                    seteditTittle("");
                    seteditCourse("");
                    seteditPriority("Medium");
                  }}>Cancel</button>
                </div>
              )}
            </div>
          ))
        }
      </div>
    </div>

    </>
  )
}

export default App

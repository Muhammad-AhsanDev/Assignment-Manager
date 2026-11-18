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
  
const [dueDate, setDueDate] = useState("");
const [editDueDate, setEditDueDate] = useState("");
  const[sort,setsort]=useState("none");

//today's date as "yyyy-mm-dd", the same format the date input gives us
const todayString = new Date().toLocaleDateString("en-CA");

//an assignment is overdue if it is NOT completed and its due date is before today
function isOverdue(assignment) {
  return !assignment.completed && assignment.date < todayString;
}

//how many assignments are overdue (shown on the Overdue button)
const overdueCount = assignment.filter(isOverdue).length;



function addAssignment() {//creates an object with the assignment details and adds it to the assignment array
 if (!Tittle.trim() || !Course.trim()|| !dueDate) {
  alert("Please fill in all fields");
  return;
}
 if (dueDate < todayString) {
  alert("The due date cannot be in the past");
  return;
}
  const newAssignment = {
    id: crypto.randomUUID(),
    title: Tittle.trim(),
    course: Course.trim(),
    priority: priority,
    completed:false,
    date: dueDate
  };

  setAssignment(
    previousAssignments => [...previousAssignments,newAssignment]);
setTittle("");
setCourse("");
setpriority("Medium");
setDueDate("");
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
  setEditDueDate(assignment.date);
}
function saveChanges(editid){
  setAssignment(previousAssignments =>
    previousAssignments.map((assignment) => {
      if (assignment.id === editid) {
        return {
          ...assignment,
          title: editTittle.trim(),
          course: editCourse.trim(),
          priority: editPriority,
          date: editDueDate
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
    else if(filter==="overdue"){
      return isOverdue(assignment);
    }
  })

const searchedAssignments=FilteredAssignments.filter((assignment)=>{
  return assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
   || assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
})

const priorityOrder = { High: 0, Medium: 1, Low: 2 };

const sortedAssignments = [...searchedAssignments].sort((a, b) => {
  if (sort === "dateAsc")  return new Date(a.date) - new Date(b.date);
  if (sort === "dateDesc") return new Date(b.date) - new Date(a.date);
  if (sort === "priority") {
    return priorityOrder[a.priority] - priorityOrder[b.priority] ||
           new Date(a.date) - new Date(b.date);   // tie → soonest date first
  }
  return 0;
});


//APP DISPLAY HERE !!!!!!!!!
  return (
    <>
<div className='add-section'>
      <h1 className='assignment-manager-title'>Assignment Manager</h1>
<div className='AddAssignment-container'>
      <input 
        className='AddAssignment-input'
                  placeholder="Assignment title"
                  value={Tittle}
                  onChange={(e) => setTittle(e.target.value)}
      />
      <input className='AddAssignment-input'
                  placeholder="Course title"
                  value={Course}
                  onChange={(e) => setCourse(e.target.value)}
      />
      <input
  className='AddAssignment-input'
  type='date'
  min={todayString}
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
/>
      <select 
                className='AddAssignment-priority'
                value={priority}
                onChange={(e) => setpriority(e.target.value)}
         >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
      </select>

      <button onClick={addAssignment} className='add-assignment-button'>
        + Add Assignment
      </button>
 </div>
    </div>
    <div className='list-section'>
      <h2 className='assignment-manager-h2'>My Assignments</h2>
      <div className='assignments-container'>
{searchedAssignments.length === 0 && <p className='empty-state'>No assignments found.</p>}
    {assignment.length > 0 && (
      <>
      <input
        className='search-input'
        placeholder="Search assignments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <br/>
      <div className='filter-bar'>
       <button className={filter === "all" ? "filter-btn active" : "filter-btn"} onClick={() => setFilter("all")}>
                    All
           </button>

            <button className={filter === "pending" ? "filter-btn active" : "filter-btn"} onClick={() => setFilter("pending")}>
                    Pending
           </button>

           <button className={filter === "completed" ? "filter-btn active" : "filter-btn"} onClick={() => setFilter("completed")}>
                    Completed
          </button>
          <button className={filter === "overdue" ? "filter-btn active" : "filter-btn"} onClick={() => setFilter("overdue")}>
                    Overdue ({overdueCount})
          </button>
          <select className='sort-select' value={sort} onChange={(e) => setsort(e.target.value)}>
            <option value="none">Sort by...</option>
            <option value="dateAsc">Due date (soonest first)</option>
            <option value="dateDesc">Due date (latest first)</option>
            <option value="priority">Priority (high to low)</option>
          </select>
          </div></>
    )}
          
        { 
          sortedAssignments.map((assignment)=>(
            <div
              key={assignment.id}
              className={`assignment-card prio-${assignment.priority.toLowerCase()}${assignment.completed ? " is-completed" : ""}`}
            >
              <h3 className='card-title'>{assignment.title}</h3>
              <p className='card-course'>{assignment.course}</p>
              <p className={`card-priority prio-${assignment.priority.toLowerCase()}`}>{assignment.priority}</p>
              <p className='card-date'>{assignment.date}</p>
              {isOverdue(assignment) && <p className='card-overdue'>⚠️ Overdue</p>}
              <button className='btn btn-delete' onClick={() => deleteAssignment(assignment.id)}>🗑️Delete</button>
              <button className={`btn btn-toggle ${assignment.completed ? "is-done" : "is-pending"}`} onClick={()=>toggleCompleted(assignment.id)}>{assignment.completed ? '✅ COMPLETED' : '❌ PENDING'}</button>
              <button className='btn btn-edit' onClick={()=>editAssignment(assignment)}>✏️ Edit</button>
              {editid === assignment.id && (
                <div className='edit-panel'>
                  <input
                    className='edit-input'
                    placeholder="Edit Assignment title"
                    value={editTittle}
                    onChange={(e) => seteditTittle(e.target.value)}
                  />
                  <input
                    className='edit-input'
                    placeholder="Edit Course title"
                    value={editCourse}
                    onChange={(e) => seteditCourse(e.target.value)}
                  />
                  <input
                        className='edit-input'
                        type='date'
                        min={todayString}
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                      />
                  <select
                    className='edit-select'
                    value={editPriority}
                    onChange={(e) => seteditPriority(e.target.value)}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                  <button className='btn btn-save' onClick={() => saveChanges(editid)}>SAVE CHANGES</button>
                  <button className='btn btn-cancel' onClick={() => {
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
import { useContext, useState } from "react";
import { addTask } from "../api";
import { TaskContext } from "../App";

function NewTaskForm() {
  const { taskList, setTaskList, JWT } = useContext(TaskContext);
  const [taskInput, setTaskInput] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (taskInput === "") {
      alert("Bitte gebe den Namen des Tasks ein!");
    } else {
      try {
        const newTask = await addTask(taskInput, JWT);
        const newTaskList = [...taskList, { _id: newTask._id, text: taskInput }];
        setTaskList(newTaskList);
        setTaskInput("");
      } catch (error) {
        alert("Fehler beim Hinzufügen eines Tasks.")
      }
    }
  };

  return (
    <form id="new-task-form" onSubmit={handleSubmit}>
      <input type="text" id="new-task-input" placeholder="Was hast du geplant?" name="task-input" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} />
      <input type="submit" id="new-task-submit" value="Task hinzufügen" />
    </form>
  );
}

export default NewTaskForm;

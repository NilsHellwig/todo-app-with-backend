import { useContext, useEffect } from "react";
import TaskItem from "./TaskItem";
import { TaskContext } from "../App";
import { fetchTasks } from "../api";

function TaskList() {
  const { taskList, setTaskList, JWT } = useContext(TaskContext);

  useEffect(() => {
    async function getTasks() {
      try {
        const tasks = await fetchTasks(JWT);
        setTaskList(tasks);
      } catch (error) {
        alert("Fehler beim Laden der Tasks.");
      }
    }
    getTasks();
  }, []);

  return (
    <div id="tasks">
      {taskList.map((task) => (
        <TaskItem key={task._id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;

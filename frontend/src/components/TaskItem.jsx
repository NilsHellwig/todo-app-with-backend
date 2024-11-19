import { useContext, useRef, useState } from "react";
import { deleteTask, updateTask } from "../api";
import { TaskContext } from "../App";

function TaskItem({ task }) {
  const { taskList, setTaskList, JWT } = useContext(TaskContext);
  const [editMode, setEditMode] = useState(false);
  const textInputRef = useRef();

  const handleDelete = async () => {
    try {
      await deleteTask(task.id, JWT);
      const newTaskList = taskList.filter((t) => t.id !== task.id);
      setTaskList(newTaskList);
    } catch (error) {
      alert("Fehler beim Löschen des Tasks!");
    }
  };

  const handleInputChange = (event) => {
    const newTaskList = taskList.map((t) => {
      if (t.id === task.id) {
        return { ...t, text: event.target.value }; // spread-operator
      } else {
        return t;
      }
    });
    setTaskList(newTaskList);
  };

  const onToggleEditMode = async () => {
    if (editMode === true) {
      try {
        await updateTask(task, JWT);
      } catch (error) {
        alert("Fehler beim Aktualisieren des Tasks.")
      }
    }
    setEditMode(!editMode);
    textInputRef.current.focus();
  };

  return (
    <div className="task">
      <input type="text" className="text" value={task.text} readOnly={!editMode} onChange={handleInputChange} ref={textInputRef} />
      <div className="task-actions">
        <button className="edit" onClick={onToggleEditMode}>
          {editMode ? "Speichern" : "Bearbeiten"}
        </button>
        <button className="delete" onClick={handleDelete}>
          Löschen
        </button>
      </div>
    </div>
  );
}

export default TaskItem;

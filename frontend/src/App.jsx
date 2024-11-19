import { createContext, useState } from "react";
import "./App.css";
import "./fonts.css";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import LoginScreen from "./components/LoginScreen";

export const TaskContext = createContext();

function App() {
  const [taskList, setTaskList] = useState([]);
  const [JWT, setJWT] = useState(null);

  const handleLogin = (token) => {
    setJWT(token);
  };

  return (
    <div className="App">
      {JWT ? (
        <TaskContext.Provider value={{taskList, setTaskList, JWT}} >
          <Header />
          <main>
            <h2>Tasks</h2>
            <TaskList />
          </main>
        </TaskContext.Provider>
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

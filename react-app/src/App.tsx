// import { useEffect, useState } from "react";

// function App() {
//   const [tasks, setTasks] = useState<any[]>([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [userId, setUserId] = useState("");

//   // 一覧取得
//   const fetchTasks = () => {
//     fetch("http://127.0.0.1:8000/api/tasks")
//       .then(res => res.json())
//       .then(setTasks);
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   // 追加
// const addTask = () => {
//   fetch("http://127.0.0.1:8000/api/tasks", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       title,
//       description,
//       user_id: userId
//     })
//   }).then(() => {
//     setTitle("");
//     setDescription("");
//     setUserId("");
//     fetchTasks();
//   });
// };
//   // 削除
//   const deleteTask = (id: number) => {
//     fetch(`http://127.0.0.1:8000/api/tasks/${id}`, {
//       method: "DELETE"
//     }).then(fetchTasks);
//   };

//  return (
//   <div style={{ padding: "20px", maxWidth: "400px" }}>
//     <h1>タスクアプリ</h1>

//     <input
//       value={title}
//       onChange={(e) => setTitle(e.target.value)}
//       placeholder="タスク入力"
//     />

//     <input
//       value={description}
//       onChange={(e) => setDescription(e.target.value)}
//       placeholder="説明"
//     />

//     <input
//       value={userId}
//       onChange={(e) => setUserId(e.target.value)}
//       placeholder="ユーザーID"
//     />
//     <button onClick={addTask}>追加</button>

//     <ul>
//       {tasks.map((task: any) => (
//         <li key={task.id}>
//           {task.title}
//           <button onClick={() => deleteTask(task.id)}>
//             削除
//           </button>
//         </li>
//       ))}
//     </ul>
//   </div>
// );
// }
// export default App;



// import { useEffect, useState } from 'react'
// function App() {
//   const [users, setUsers] = useState([])

//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/api/users')
//       .then(res => res.json())
//       .then(data => setUsers(data))
//   }, [])

//   return (
//     <div>
//       <h1>Users</h1>

//       {users.map(user => (
//         <div key={user.id}>
//           <p>{user.name}</p>
//           <p>{user.email}</p>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default App 

import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import FeatureList from "./pages/FunctionList";
import Task from "./pages/Tasks";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/functionlist" element={<FeatureList />} />
      <Route path="/tasks" element={<Task />} />
    </Routes>
  );
}

export default App;
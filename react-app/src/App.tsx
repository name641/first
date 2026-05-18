import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

useEffect(() => {
  fetch("http://127.0.0.1:8000/api/test")
    .then(res => res.json())
    .then(setData);
}, []);

  return (
    <div>
      <h1>React + lalaveru</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;
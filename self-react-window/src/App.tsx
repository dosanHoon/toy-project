import "./App.css";
import { List } from "./components/List";

function App() {
  const items = Array.from(Array(1000)).map((_, i) => `Item ${i}`);
  return (
    <div className="App">
      <List items={items} />
    </div>
  );
}

export default App;

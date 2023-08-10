import "./App.css";
import { ViewPortList } from "./components/ViewPortList";

function App() {
  const items = Array.from(Array(1000)).map((_, i) => `Item ${i}`);
  return (
    <div className="App">
      <ViewPortList items={items} />
    </div>
  );
}

export default App;

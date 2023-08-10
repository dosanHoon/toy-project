import "./App.css";
import { ListItem } from "./components/ListItem";
import { ViewPortList } from "./components/ViewPortList";

function App() {
  const items = Array.from(Array(1000)).map((_, i) => `Item ${i}`);
  return (
    <div className="App">
      <ViewPortList items={items} height={600} itemHeight={100}>
        <ListItem>text</ListItem>
      </ViewPortList>
    </div>
  );
}

export default App;

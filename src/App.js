import "./App.css";
import { RouterComponent } from "./router/RouterComponent";
import { BrowserRouter } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <RouterComponent />
    </BrowserRouter>
  );
}

export default App;

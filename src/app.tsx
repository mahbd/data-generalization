import * as ReactDOM from "react-dom/client";
import Home from "./Home";

function render() {
  const root = ReactDOM.createRoot(document.getElementById("app"));
  root.render(<Home />);
}

render();

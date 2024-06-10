import * as ReactDOM from "react-dom/client";

const App = () => (
  <div>
    <button className="btn btn-primary">Hello</button>
  </div>
);

function render() {
  const root = ReactDOM.createRoot(document.getElementById("app"));
  root.render(<App />);
}

render();

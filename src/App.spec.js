import ReactDom from "react-dom/client";
import App from "./App";

it("renders without crashing", () => {
  const div = document.createElement("div");

  ReactDom.createRoot(div).render(<App />);
  ReactDOM.unmountComponentAtNode(div);
});

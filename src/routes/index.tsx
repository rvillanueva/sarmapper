import { createFileRoute } from "@tanstack/react-router";
import AppComponent from "../App";
export const Route = createFileRoute("/")({ component: App });

function App() {
  return <AppComponent />;
}

import React from "react";
import ReactDOM from "react-dom/client";
import "tauri-plugin-gamepad-api";
import App from "./pages/App";
import "./css/index.css";
import "./css/App.css";
import RpcService from './services/RpcService';
RpcService.StartRPC();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
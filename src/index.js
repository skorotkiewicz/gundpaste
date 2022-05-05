import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import Gun from "gun/gun";
import App from "./App";

const gun = Gun();
gun.opt({
  peers: [
    "https://grizzly.de1.hashbang.sh/gun",
    // "https://gun-manhattan.herokuapp.com/gun",
  ],
});

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App gun={gun} />}>
          <Route path=":binId" element={<App gun={gun} />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>
);

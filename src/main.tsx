import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CampaignProvider } from "./campaign";
import { App } from "./App";
import { VnProvider } from "./vn/state";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CampaignProvider>
        <VnProvider>
          <App />
        </VnProvider>
      </CampaignProvider>
    </BrowserRouter>
  </StrictMode>
);

import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import { startLeadEvents } from './leadEvents';
import './index.css';

const app = (
  <StrictMode>
    <App />
    <Analytics />
    <SpeedInsights />
  </StrictMode>
);

// Count email and Instagram taps from any page (see leadEvents.ts).
startLeadEvents();

// Production pages are prerendered (scripts/prerender.mjs); dev serves an empty root.
const root = document.getElementById('root')!;
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}

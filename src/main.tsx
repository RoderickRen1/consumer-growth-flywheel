import { createRoot } from 'react-dom/client';
import { GrowthFlywheel } from './growth-flywheel';
import 'tailwindcss/preflight.css';
import './flywheel.css';

createRoot(document.getElementById('root')!).render(<GrowthFlywheel />);

import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './components/ThemeProvider';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="savepro-theme">
      <RouterProvider router={router} />
      <Analytics />
    </ThemeProvider>
  );
}

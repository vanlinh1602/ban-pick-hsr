import './App.css';

import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Sider } from '@/features/layout/components';

const Home = lazy(() => import('./pages/Home'));
const Settings = lazy(() => import('./pages/Settings'));

const AppLayout = () => (
  <Suspense>
    <div
      className="grid grid-cols-8 font-mono"
      style={{
        height: '100vh',
        width: '100vw',
        padding: '0.5rem',
      }}
    >
      <div className="col-span-1">
        <Sider />
      </div>
      <ScrollArea className="h-full col-span-7">
        <Outlet />
      </ScrollArea>
    </div>
  </Suspense>
);

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;

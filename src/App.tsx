import './App.css';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { MenuBar } from './features/layout/components';

const Home = lazy(() => import('./pages/Home'));
const Settings = lazy(() => import('./pages/Settings'));

const AppLayout = () => (
  <Suspense>
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      <MenuBar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <ScrollArea>
          <Outlet />
        </ScrollArea>
      </main>
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
        <Route path="*" element={<div>Chưa làm hehe</div>} />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;

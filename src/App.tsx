import './App.css';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { useCatalogSlice } from './features/catalogs/store';
import { MenuBar } from './features/layout/components';

const Home = lazy(() => import('./pages/Home'));
const Configs = lazy(() => import('./pages/Configs'));
const Match = lazy(() => import('./pages/Match'));
const MatchDetail = lazy(() => import('./pages/MatchDetail'));

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
  const dispatch = useDispatch();
  const { actions } = useCatalogSlice();

  useEffect(() => {
    dispatch(actions.getCatalogs());
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/match" element={<Outlet />}>
          <Route path="" element={<Match />} />
          <Route path=":id" element={<MatchDetail />} />
        </Route>
        <Route path="/configs" element={<Configs />} />
        <Route path="*" element={<div>Chưa làm hehe</div>} />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;

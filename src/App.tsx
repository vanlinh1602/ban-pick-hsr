import './App.css';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { onAuthStateChanged } from 'firebase/auth';
import { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';

import AuthorizedRoute from './AuthorizedRoute';
import { useCatalogSlice } from './features/catalogs/store';
import { MenuBar } from './features/layout/components';
import { useUserSlice } from './features/user/store';
import { auth } from './services/firebase';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Configs = lazy(() => import('./pages/Configs'));
const Match = lazy(() => import('./pages/Match'));
const MatchDetail = lazy(() => import('./pages/MatchDetail'));
const Tournament = lazy(() => import('./pages/Tournament'));
const BracketTournament = lazy(() => import('./pages/BracketTournament'));

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
  const { actions: userAction } = useUserSlice();

  useEffect(() => {
    dispatch(actions.getCatalogs());
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          userAction.signedIn({
            id: user.uid,
            email: user.email || '',
            name: user.displayName || '',
            avatar: user.photoURL || '',
          }),
        );
      }
    });
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/match" element={<Outlet />}>
          <Route path="" element={<Match />} />
          <Route path=":id" element={<MatchDetail />} />
        </Route>
        <Route path="/tournament" element={<Outlet />}>
          <Route path=":id" element={<Tournament />} />
          <Route path=":id/edit" element={<AuthorizedRoute />}>
            <Route path="" element={<BracketTournament />} />
          </Route>
        </Route>
        <Route path="/configs" element={<Configs />} />
        <Route path="*" element={<div>Chưa làm hehe</div>} />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}

export default App;

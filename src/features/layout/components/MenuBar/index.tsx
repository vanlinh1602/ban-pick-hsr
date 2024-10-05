import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Medal,
  Menu,
  MonitorCog,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUser } from 'react-icons/fa';
import { TbLogin } from 'react-icons/tb';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import logo from '@/assets/logo.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserSlice } from '@/features/user/store';
import { selectUserInformation } from '@/features/user/store/selectors';
import { translations } from '@/locales/translations';
import { auth } from '@/services/firebase';

import LanguageSelector from './LanguageSelector';

const MenuBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useUserSlice();
  const userInfo = useSelector(selectUserInformation);

  const activeKey = useMemo(() => {
    const path = location.pathname;
    const key = path.split('/')[1];
    return key || 'home';
  }, [location.pathname]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (activeKey === 'login') {
    return null;
  }

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-full max-h-20 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          {/* Logo */}
          <div className="flex justify-start lg:w-0 lg:flex-1 items-center">
            <Avatar>
              <AvatarImage src={logo} alt="avatar" />
              <AvatarFallback>HSR</AvatarFallback>
            </Avatar>
            <div
              className="text-xl font-bold text-gray-900 ml-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              {t(translations.appName)}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 -my-2 md:hidden">
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            <div
              id="home-header"
              onClick={() => navigate('/home')}
              className="text-base font-medium text-gray-500 hover:text-gray-900 cursor-pointer"
            >
              <div
                className={`${
                  activeKey === 'home' ? 'text-gray-900' : 'text-gray-500'
                } hover:text-gray-900`}
              >
                <LayoutDashboard className="inline-block mr-2 h-5 w-5" />
                {t(translations.pages.home)}
              </div>
            </div>
            <div
              id="match-header"
              onClick={() => navigate('/match')}
              className="text-base font-medium text-gray-500 hover:text-gray-900 cursor-pointer"
            >
              <div
                className={`${
                  activeKey === 'match' ? 'text-gray-900' : 'text-gray-500'
                } hover:text-gray-900`}
              >
                <Medal className="inline-block mr-2 h-5 w-5" />
                {t(translations.pages.match)}
              </div>
            </div>
            <div
              id="config-header"
              onClick={() => navigate('/configs')}
              className="text-base font-medium text-gray-500 hover:text-gray-900 cursor-pointer"
            >
              <div
                className={`${
                  activeKey === 'config' ? 'text-gray-900' : 'text-gray-500'
                } hover:text-gray-900`}
              >
                <MonitorCog className="inline-block mr-2 h-5 w-5" />
                {t(translations.pages.config)}
              </div>
            </div>
          </nav>

          {/* User Menu and Notifications */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <LanguageSelector />
            {userInfo?.id ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    id="login-button"
                    variant="ghost"
                    className="flex items-center"
                  >
                    {userInfo?.avatar ? (
                      <Avatar>
                        <AvatarImage src={userInfo.avatar} alt="avatar" />
                        <AvatarFallback>User</AvatarFallback>
                      </Avatar>
                    ) : (
                      <FaUser className="h-5 w-5 text-gray-600" />
                    )}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator /> */}
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      auth.signOut().then(() => {
                        dispatch(actions.signOut());
                      });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t(translations.actions.logOut)}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                id="login-button"
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => navigate('/login')}
              >
                <TbLogin className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => navigate('/home')}
          >
            {t(translations.pages.home)}
          </a>
          <a
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => navigate('/match')}
          >
            {t(translations.pages.match)}
          </a>
          <a
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => navigate('/configs')}
          >
            {t(translations.pages.config)}
          </a>
        </div>
      </div>
    </header>
  );
};

export default MenuBar;

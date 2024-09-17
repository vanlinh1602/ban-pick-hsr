import {
  Bell,
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
import { useLocation, useNavigate } from 'react-router-dom';

import logo from '@/assets/logo.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { translations } from '@/locales/translations';

const MenuBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const activeKey = useMemo(() => {
    const path = location.pathname;
    const key = path.split('/')[1];
    return key || 'home';
  }, [location.pathname]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Button variant="ghost" size="icon" className="mr-2">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center">
                  <Avatar>
                    <AvatarImage src={logo} alt="avatar" />
                    <AvatarFallback>User</AvatarFallback>
                  </Avatar>

                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Users
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Settings
          </a>
        </div>
      </div>
    </header>
  );
};

export default MenuBar;

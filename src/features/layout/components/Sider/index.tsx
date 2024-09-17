import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import logo from '@/assets/logo.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { translations } from '@/locales/translations';

import S from './styles.module.less';

const Sider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const activeKey = useMemo(() => {
    const path = location.pathname;
    const key = path.split('/')[1];
    return key || 'home';
  }, [location.pathname]);

  const siders = [
    {
      name: t(translations.pages.home),
      key: 'home',
      icon: <i className="ri-dashboard-horizontal-fill"></i>,
    },
    {
      name: t(translations.pages.settings),
      key: 'settings',
      icon: <i className="ri-settings-line"></i>,
    },
  ];

  return (
    <div className={S.sider}>
      <div className="grid p-2">
        <div className="flex items-center ">
          <Avatar>
            <AvatarImage src={logo} alt="avatar" />
            <AvatarFallback>HSR</AvatarFallback>
          </Avatar>
          <div
            className="ml-2 text-white text-base"
            style={{
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            {t(translations.appName)}
          </div>
        </div>

        <div className="mt-5 mx-2">
          {siders.map((sider) => (
            <div
              key={sider.key}
              className="flex text-base my-4"
              style={{
                color: activeKey === sider.key ? '#fff' : '#a0aec0',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/${sider.key}`)}
            >
              {sider.icon}
              <div className="ml-3">{sider.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sider;

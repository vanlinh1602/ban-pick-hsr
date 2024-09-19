import { useLocation } from 'react-router-dom';

import BanPick from '../BanPick';

const MatchDetail = () => {
  const location = useLocation();
  const { id, ...params } = location.state;
  if (id) {
    return <div>Match Detail</div>;
  }
  return <BanPick {...params} />;
};

export default MatchDetail;

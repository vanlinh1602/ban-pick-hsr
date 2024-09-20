import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Waiting from '@/components/Waiting';
import { BanPick, MatchLive } from '@/features/match/components';
import { useMatchSlice } from '@/features/match/store';
import {
  selectMatchData,
  selectMatchHandling,
} from '@/features/match/store/selectors';

const MatchDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { actions } = useMatchSlice();
  const handling = useSelector(selectMatchHandling);
  const matchData = useSelector((state: any) => selectMatchData(state, id!));

  useEffect(() => {
    if (id) {
      dispatch(actions.getMatch(id));
    }
  }, []);

  return (
    <div>
      {handling ? <Waiting /> : null}
      {matchData?.status === 'ban-pick' ? <BanPick id={id!} /> : <MatchLive />}
    </div>
  );
};

export default MatchDetail;

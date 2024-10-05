import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import Waiting from '@/components/Waiting';
import {
  BanPick,
  BanPickViewer,
  MatchLive,
  SetUpMatch,
} from '@/features/match/components';
import { useMatchSlice } from '@/features/match/store';
import {
  selectMatchData,
  selectMatchHandling,
} from '@/features/match/store/selectors';
import { Match } from '@/features/match/types';
import { socket } from '@/services/socket';

const MatchDetail = () => {
  const location = useLocation();
  const { state, search } = location;
  const { id } = useParams();

  const dispatch = useDispatch();
  const { actions } = useMatchSlice();
  const handling = useSelector(selectMatchHandling);
  const matchData = useSelector((s: any) => selectMatchData(s, id!));

  useEffect(() => {
    if (id) {
      dispatch(actions.getMatch(id));
    }
  }, [actions, dispatch, id]);

  useEffect(() => {
    socket.emit('join_room', { room: id, player: state?.securityId });
    socket.on('updateMatch', (data: Match) => {
      dispatch(actions.fetchMatch(data));
    });
    socket.on('userAction', (params: any) => {
      const { action, data } = params;
      dispatch(actions.modifyLiveActions({ action, data }));
    });
    return () => {
      socket.emit('leave_room', { room: id, player: state?.securityId });
      dispatch(actions.modifyLiveActions({ action: 'banPick', data: null }));
    };
  }, [state?.securityId]);

  const role = useMemo(() => {
    if (!matchData) return 'viewer';
    const params = new URLSearchParams(search);
    const security = params.get('s') || state?.securityId;
    if (security === matchData.host) {
      return 'host';
    }
    if (matchData.players.some((player: any) => player.id === security)) {
      return 'player';
    }
    return 'viewer';
  }, [matchData, search, state?.securityId]);

  const renderContent = () => {
    switch (matchData?.status) {
      case 'set-up': {
        if (role === 'host') {
          return <SetUpMatch />;
        }
        return (
          <div className="max-w-4xl mx-auto p-6 bg-slate-300 rounded-lg shadow-lg m-5 ">
            <h1 className="text-2xl font-semibold items-center">
              Match is not ready yet.
              <br />
              Please wait for the host to set up the match.
            </h1>
          </div>
        );
      }
      case 'ban-pick': {
        if (role === 'player') {
          return <BanPick id={id!} />;
        }
        return <BanPickViewer id={id!} />;
      }
      case 'playing':
      case 'finished':
        return <MatchLive id={id!} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {handling ? <Waiting /> : null}
      {matchData ? renderContent() : null}
    </div>
  );
};

export default MatchDetail;

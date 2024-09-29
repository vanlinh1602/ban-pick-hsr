import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { selectMatchData } from '../../store/selectors';
import MatchEditor from '../MatchEditor';
import MatchUrlModal from '../MatchUrlModal';

export const SetUpMatch = () => {
  const { id } = useParams<{ id: string }>();
  const [showModal, setShowModal] = useState(false);
  const matchData = useSelector((state: any) => selectMatchData(state, id!));
  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-300 rounded-lg shadow-lg m-5 ">
      {showModal ? (
        <MatchUrlModal match={matchData} onClose={() => setShowModal(false)} />
      ) : null}
      <h1 className="text-2xl  font-extrabold mb-3 flex items-center content-center justify-center">
        SET UP MATCH
        <FaInfoCircle
          className="inline-block text-gray-700 text-lg ml-2"
          onClick={() =>
            setShowModal((prev) => {
              return !prev;
            })
          }
        />
      </h1>
      <MatchEditor id={id} type={'setup'} />
    </div>
  );
};
export default SetUpMatch;

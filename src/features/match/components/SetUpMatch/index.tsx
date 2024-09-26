import { useParams } from 'react-router-dom';

import MatchEditor from '../MatchEditor';

export const SetUpMatch = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-300 rounded-lg shadow-lg m-5 ">
      <h1 className="text-2xl  font-extrabold mb-3">SET UP MATCH</h1>
      <MatchEditor id={id} type={'setup'} />
    </div>
  );
};
export default SetUpMatch;

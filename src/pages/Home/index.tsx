import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaFilter,
  FaMapMarkerAlt,
  FaPlus,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Waiting } from '@/components';
import { EditTournament } from '@/features/tournament/components';
import { useTournamentSlice } from '@/features/tournament/store';
import {
  selectTournamentHandling,
  selectTournaments,
} from '@/features/tournament/store/selectors';
import { Tournament } from '@/features/tournament/type';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { actions } = useTournamentSlice();

  const allTournaments = useSelector(selectTournaments);
  const handling = useSelector(selectTournamentHandling);

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(actions.getTournaments());
  }, [dispatch]);

  useEffect(() => {
    setTournaments(Object.values(allTournaments));
  }, [allTournaments]);

  const handleCreateTournament = () => {
    setIsCreateModalOpen(true);
  };

  const handleFilterTournaments = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const applyFilters = () => {
    // Implement filter logic here
  };

  const FilterDropdown = ({ isOpen, onClose, onFilter }: any) => {
    if (!isOpen) return null;

    return (
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-10">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Filter Tournaments</h3>
          <div className="mb-2">
            <label
              htmlFor="dateFilter"
              className="block text-gray-700 font-bold mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="dateFilter"
              className="w-full px-2 py-1 border rounded"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="locationFilter"
              className="block text-gray-700 font-bold mb-1"
            >
              Location
            </label>
            <input
              type="text"
              id="locationFilter"
              className="w-full px-2 py-1 border rounded"
              placeholder="Enter location"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="categoryFilter"
              className="block text-gray-700 font-bold mb-1"
            >
              Category
            </label>
            <select
              id="categoryFilter"
              className="w-full px-2 py-1 border rounded"
            >
              <option value="">All Categories</option>
              <option value="amateur">Amateur</option>
              <option value="professional">Professional</option>
              <option value="youth">Youth</option>
            </select>
          </div>
          <button
            onClick={() => {
              onFilter();
              onClose();
            }}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-300"
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  };

  const createTournament = (data: Partial<Tournament>) => {
    setIsCreateModalOpen(false);
    dispatch(actions.createTournament(data));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {handling ? <Waiting /> : null}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Tournament Dashboard
        </h1>
        <div className="flex justify-between mb-6">
          <button
            onClick={handleCreateTournament}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center"
            aria-label="Create New Tournament"
          >
            <FaPlus className="mr-2" /> Create New Tournament
          </button>
          <div className="relative">
            <button
              onClick={handleFilterTournaments}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center"
              aria-label="Filter Tournaments"
            >
              <FaFilter className="mr-2" /> Filter Tournaments
            </button>
            <FilterDropdown
              isOpen={isFilterDropdownOpen}
              onClose={() => setIsFilterDropdownOpen(false)}
              onFilter={applyFilters}
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => {
          let status = 'Upcoming';
          let statusColor = 'text-blue-500';
          if (tournament.date.from < Date.now()) {
            status = 'Ongoing';
            statusColor = 'text-yellow-500';
          }
          if (
            (tournament.date.to && tournament.date.to < Date.now()) ||
            (!tournament.date.to && tournament.date.from < Date.now())
          ) {
            status = 'Completed';
            statusColor = 'text-green-500';
          }

          return (
            <div
              key={tournament.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {tournament.name}
                </h2>
                <p className="text-gray-600 mb-4 flex items-center">
                  <FaCalendarAlt className="mr-2" />{' '}
                  {format(tournament.date.from, 'd/L/y')}
                  {tournament.date.to
                    ? ` - ${format(tournament.date.to, 'd/L/y')}`
                    : ''}
                </p>
                <p className="text-gray-600 mb-4 flex items-center">
                  <FaMapMarkerAlt className="mr-2" /> {tournament.organizer}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-semibold ${statusColor}`}>
                    {status}
                  </span>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                    onClick={() => navigation(`/tournament/${tournament.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isCreateModalOpen ? (
        <EditTournament
          onClose={() => setIsCreateModalOpen(false)}
          onConfirm={createTournament}
        />
      ) : null}
    </div>
  );
};

export default HomePage;

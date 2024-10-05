import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { toast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { EditTournament } from '@/features/tournament/components';
import { useTournamentSlice } from '@/features/tournament/store';
import {
  selectTournamentHandling,
  selectTournaments,
} from '@/features/tournament/store/selectors';
import { Tournament } from '@/features/tournament/type';
import { selectUserInformation } from '@/features/user/store/selectors';
import { startTutorial } from '@/lib/tutorial';
import { translations } from '@/locales/translations';

import { Filter } from './Filter';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { actions } = useTournamentSlice();
  const { t } = useTranslation();

  const allTournaments = useSelector(selectTournaments);
  const handling = useSelector(selectTournamentHandling);

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const userInfo = useSelector(selectUserInformation);

  useEffect(() => {
    dispatch(actions.getTournaments());
  }, [dispatch]);

  useEffect(() => {
    setTournaments(Object.values(allTournaments));
  }, [allTournaments]);

  useEffect(() => {
    const tutorial = JSON.parse(localStorage.getItem('tutorial') || '{}');
    if (!tutorial.home) {
      startTutorial('home')!.drive();
      localStorage.setItem(
        'tutorial',
        JSON.stringify({ ...tutorial, home: true }),
      );
    }
  }, []);

  const handleCreateTournament = () => {
    if (!userInfo?.id) {
      toast({
        variant: 'destructive',
        title: t(translations.errors.error),
        description: t(translations.errors.requireLogin),
      });
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleFilterTournaments = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const applyFilters = (values: { status?: string; date?: number }) => {
    const newFilter = Object.values(allTournaments).filter((tournament) => {
      if (values.status) {
        if (values.status === 'upcoming' && tournament.date.from < Date.now()) {
          return false;
        }
        if (
          values.status === 'inProgress' &&
          (tournament.date.from > Date.now() ||
            !tournament.date.to ||
            tournament.date.to < Date.now())
        ) {
          return false;
        }
        if (
          values.status === 'completed' &&
          tournament.date.to &&
          tournament.date.to > Date.now()
        ) {
          return false;
        }
      }

      if (
        values.date &&
        (tournament.date.from > values.date ||
          !tournament.date.to ||
          tournament.date.to < values.date)
      ) {
        return false;
      }

      return true;
    });
    setTournaments(newFilter);
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
          {t(translations.pages.tournament)}
        </h1>
        <div className="flex justify-between mb-6">
          <Button
            id="create-tournament"
            onClick={handleCreateTournament}
            className="text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
          >
            <FaPlus className="mr-2" /> {t(translations.actions.createNew)}
          </Button>
          <div className="relative">
            <Button
              onClick={handleFilterTournaments}
              className="px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
              aria-label="Filter Tournaments"
              variant="outline"
            >
              <FaFilter className="mr-2" /> {t(translations.actions.filter)}
            </Button>
            {isFilterDropdownOpen ? (
              <Filter
                onClose={() => setIsFilterDropdownOpen(false)}
                onFilter={applyFilters}
              />
            ) : null}
          </div>
        </div>
      </header>

      <div
        id="home-content"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {tournaments.map((tournament) => {
          let status = t(translations.tournament.status.upcoming);
          let statusColor = 'text-blue-500';
          if (tournament.date.from < Date.now()) {
            status = t(translations.tournament.status.inProgress);
            statusColor = 'text-yellow-500';
          }
          if (
            (tournament.date.to && tournament.date.to < Date.now()) ||
            (!tournament.date.to && tournament.date.from < Date.now())
          ) {
            status = t(translations.tournament.status.completed);
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
                  <FaMapMarkerAlt className="mr-2" />{' '}
                  {tournament?.organizer?.name}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-semibold ${statusColor}`}>
                    {status}
                  </span>
                  <Button
                    className="font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                    onClick={() => navigation(`/tournament/${tournament.id}`)}
                  >
                    {t(translations.actions.viewDetail)}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isCreateModalOpen ? (
        <EditTournament
          user={userInfo!}
          onClose={() => setIsCreateModalOpen(false)}
          onConfirm={createTournament}
        />
      ) : null}
    </div>
  );
};

export default HomePage;

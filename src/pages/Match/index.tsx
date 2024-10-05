import { useTranslation } from 'react-i18next';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JoinMatch, MatchEditor } from '@/features/match/components';
import { translations } from '@/locales/translations';

const Match = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-300 rounded-lg shadow-lg m-5 ">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">
            {t(translations.actions.createMatch)}
          </TabsTrigger>
          <TabsTrigger value="join">
            {t(translations.actions.joinMatch)}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <MatchEditor />
        </TabsContent>
        <TabsContent value="join">
          <JoinMatch />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Match;

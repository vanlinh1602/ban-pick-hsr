import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JoinMatch, MatchEditor } from '@/features/match/components';

const Match = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-300 rounded-lg shadow-lg m-5 ">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Match Creation</TabsTrigger>
          <TabsTrigger value="join">Join</TabsTrigger>
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

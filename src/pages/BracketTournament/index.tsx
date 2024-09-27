import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { TbUsersPlus } from 'react-icons/tb';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DoubleElimination,
  SingleElimination,
} from '@/features/match/components';

const BracketTournament = () => {
  const [selectedElimination, setSelectedElimination] =
    useState<string>('single');
  return (
    <div
      className="flex flex-col w-full md:flex-row bg-white"
      style={{ height: window.innerHeight - 72 }}
    >
      {/* Sidebar */}
      <div className="w-64 bg-[#1e2235] text-white p-4 flex flex-col">
        <div className="flex gap-2 mb-4">
          <Select
            onValueChange={(v) => setSelectedElimination(v)}
            value={selectedElimination}
          >
            <SelectTrigger className="w-[180px] text-gray-700">
              <SelectValue
                className="text-gray-400"
                placeholder="Select Elimination"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="single">Single Elimination</SelectItem>
                <SelectItem value="double">Double Elimination</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" className="text-white">
            <TbUsersPlus className="h-4 w-4 mr-2" />
          </Button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Participants (4)</h2>
        </div>

        <Input
          placeholder="Search..."
          className="bg-[#2a2f44] border-none text-white mb-4"
        />
        <ScrollArea className="flex-grow">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className="flex items-center justify-between p-2 hover:bg-[#2a2f44] rounded"
            >
              <div className="flex items-center">
                <span>Participant {num}</span>
              </div>
              <Button variant="ghost" size="icon" className="text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </ScrollArea>
        <Button
          variant="outline"
          className="mt-4 text-gray-600 border-dashed border-white/20"
        >
          Save
        </Button>
      </div>

      {/* Main content */}
      <div className={'flex-1 overflow-y-scroll'}>
        {selectedElimination === 'single' && <SingleElimination />}
        {selectedElimination === 'double' && <DoubleElimination />}
      </div>
    </div>
  );
};

export default BracketTournament;

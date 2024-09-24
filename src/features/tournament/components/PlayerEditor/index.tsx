import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { generateID } from '@/lib/utils';

import { Player } from '../../type';

type Props = {
  onClose: () => void;
  onConfirm: (data: Player) => void;
  data?: Player;
};

const PlayerEditor = ({ onClose, onConfirm, data }: Props) => {
  const formSchema = z.object({
    name: z.string().min(1),
    email: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || '',
      email: data?.email || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const dataUpdate: Player = {
      ...data,
      ...values,
      id: data?.id || generateID(),
    };
    onConfirm(dataUpdate);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {data?.id ? 'Edit' : 'Add'} Player
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="text-gray-700 font-bold">
                    Player Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Input name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="text-gray-700 font-bold">
                    Player Email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Input email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PlayerEditor;

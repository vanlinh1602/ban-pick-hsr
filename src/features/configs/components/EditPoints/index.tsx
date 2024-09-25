import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type Props = {
  onClose: () => void;
  onConfirm: (points: number) => void;
  points?: number;
};

const EditPoints = ({ onClose, onConfirm, points }: Props) => {
  const formSchema = z.object({
    points: z.string().nonempty().regex(/^\d+$/),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      points: points?.toString() || '0',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onConfirm(Number(values.points));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-xs w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Adjust Points</h2>
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
              name="points"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="text-gray-700 font-bold">
                    Points
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Tournament Name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500 text-sm">
                    Enter points for this character.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditPoints;

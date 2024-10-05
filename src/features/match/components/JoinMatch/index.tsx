import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
import { translations } from '@/locales/translations';

const JoinMatch = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formSchema = z.object({
    matchId: z.string().min(1),
    securityId: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      securityId: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    navigate(`/match/${data.matchId}`, {
      state: { securityId: data.securityId },
    });
  };

  return (
    <div
      className="w-full flex items-center justify-center"
      style={{
        height: 'calc(100vh - 220px)',
      }}
    >
      <div className="h-80 w-80 p-10 rounded bg-slate-100 text-start">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="matchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(translations.matchId)}</FormLabel>
                  <FormControl>
                    <Input placeholder="Match ID" {...field} />
                  </FormControl>
                  <FormDescription className="text-start">
                    {t(translations.notify.inputMatchId)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="securityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Security ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Player security" {...field} />
                  </FormControl>
                  <FormDescription className="">
                    {t(translations.notify.inputPlayerId)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="text-center w-full" type="submit">
              {t(translations.actions.joinMatch)}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default JoinMatch;

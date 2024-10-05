import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { z } from 'zod';

import { SearchableSelect } from '@/components';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem } from '@/components/ui/form';
import {
  selectCharacters,
  selectConfigs,
  selectLightCones,
} from '@/features/catalogs/store/selectors';
import { MatchGame } from '@/features/match/types';
import { translations } from '@/locales/translations';

type Props = {
  disabledChars: string[];
  data?: MatchGame;
  onClose: () => void;
  onSubmit: (setup: MatchGame) => void;
};

export const SetupTeams = ({
  onClose,
  onSubmit,
  disabledChars,
  data,
}: Props) => {
  const { t } = useTranslation();
  const characters = useSelector(selectCharacters);
  const lightCones = useSelector(selectLightCones);
  const configs = useSelector(selectConfigs);

  const [totalPoints, setTotalPoints] = useState(0);

  const activeChars = useMemo(
    () => Object.keys(characters).filter((k) => !disabledChars.includes(k)),
    [disabledChars],
  );

  const formSchema = z.object({
    'slot-0': z.object({
      character: z.string().optional(),
      lightCone: z.string().optional(),
    }),
    'slot-1': z.object({
      character: z.string().optional(),
      lightCone: z.string().optional(),
    }),
    'slot-2': z.object({
      character: z.string().optional(),
      lightCone: z.string().optional(),
    }),
    'slot-3': z.object({
      character: z.string().optional(),
      lightCone: z.string().optional(),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      'slot-0': {
        character: data?.characters[0] || '',
        lightCone: data?.lightCones[0] || '',
      },
      'slot-1': {
        character: data?.characters[1] || '',
        lightCone: data?.lightCones[1] || '',
      },
      'slot-2': {
        character: data?.characters[2] || '',
        lightCone: data?.lightCones[2] || '',
      },
      'slot-3': {
        character: data?.characters[3] || '',
        lightCone: data?.lightCones[3] || '',
      },
    },
  });
  console.log('data', data);

  useEffect(() => {
    const values = form.getValues();
    let count = 0;
    Object.values(values).forEach((v) => {
      if (v.character) {
        count += configs?.[v.character]?.points || 0;
      }
      if (v.lightCone) {
        count += configs?.[v.lightCone]?.points || 0;
      }
    });
    setTotalPoints(count);
  }, [form.watch()]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const charsSelected = Object.values(values).map((v) => v.character!);
    const lightConesSelected = Object.values(values).map((v) => v.lightCone!);
    const setupDate: MatchGame = {
      player: 0,
      points: totalPoints,
      characters: charsSelected,
      lightCones: lightConesSelected,
    };
    onSubmit(setupDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-2xl font-bold mb-4">{t(translations.gameSetup)}</h3>
        <h3 className="text-xl font-bold mb-4 text-start">
          {t(translations.total)}: {totalPoints} {t(translations.points)}
        </h3>
        <div className="text-start">
          <Form {...form}>
            <form className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="font-semibold">
                    {t(translations.slot)} {i + 1}
                  </div>
                  <FormField
                    control={form.control}
                    name={
                      `slot-${i}` as 'slot-0' | 'slot-1' | 'slot-2' | 'slot-3'
                    }
                    render={({ field }) => (
                      <div className="grid grid-cols-2 gap-5">
                        <FormItem>
                          <SearchableSelect
                            options={activeChars.map((char) => ({
                              value: char,
                              label: characters[char].name,
                              icons: characters[char].icon,
                            }))}
                            value={field.value.character}
                            onSelect={(value) => {
                              form.setValue(
                                `slot-${i}.character` as any,
                                value,
                              );
                            }}
                            placeholder={t(translations.selectCharacter)}
                          />
                        </FormItem>
                        <FormItem>
                          <SearchableSelect
                            options={Object.entries(lightCones).map(
                              ([id, lightCone]) => ({
                                value: id,
                                label: lightCone.name,
                                icons: lightCone.icon,
                              }),
                            )}
                            value={field.value.lightCone}
                            onSelect={(value) => {
                              form.setValue(
                                `slot-${i}.lightCone` as any,
                                value,
                              );
                            }}
                            placeholder={t(translations.selectLightCones)}
                          />
                        </FormItem>
                      </div>
                    )}
                  />
                </div>
              ))}
            </form>
          </Form>
        </div>
        <div className="space-x-5 mt-5">
          <Button variant="secondary" onClick={onClose}>
            {t(translations.actions.cancel)}
          </Button>
          <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
            {t(translations.actions.submit)}
          </Button>
        </div>
      </div>
    </div>
  );
};

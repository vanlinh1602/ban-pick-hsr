export type Character = {
  entry_page_id: string;
  name: string;
  icon_url: string;
  display_field: DisplayField;
  filter_values: FilterValues;
  desc: string;
};

type DisplayField = {
  attr_level_1?: string;
  attr_level_80?: string;
};

type FilterValues = {
  character_rarity: CharacterCombatTypeClass;
  character_factions?: CharacterCombatTypeClass;
  character_combat_type: CharacterCombatTypeClass;
  character_paths: CharacterCombatTypeClass;
};

type CharacterCombatTypeClass = {
  values: string[];
  value_types: ValueType[];
  key: null;
};

type ValueType = {
  id: string;
  value: string;
  mi18n_key: string;
  icon: string;
  enum_string: string;
};

export type MatchSetUpInfo = {
  banPickStatus: {
    player: number;
    type: 'ban' | 'pick';
    character?: string;
  }[];
  firstPick: number;
  goFirst: number;
};

export type Match = {
  id: string;
  players: { name: string; id: string }[];
  status: 'ban-pick' | 'playing' | 'finished';
  date?: number;
  winner?: string;
  games?: {
    player: number;
    characters: string[];
    points: number;
  }[];
  matchSetup?: MatchSetUpInfo;
};

export type MatchState = {
  handling: boolean;
  data: CustomObject<Match>;
};

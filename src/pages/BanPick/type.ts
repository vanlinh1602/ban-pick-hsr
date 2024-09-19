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

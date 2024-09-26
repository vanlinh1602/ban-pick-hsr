export interface Character {
  id: string;
  name: string;
  icon: string;
  background: string;
  path: Value[];
  rarity: Value[];
  combatType: Value[];
  factions: Value[];
}

export interface LightCone {
  id: string;
  name: string;
  icon: string;
  background: string;
  rarity: Value[];
  skillType: Value[];
  source: Value[];
  paths: Value[];
}

interface FilterField {
  key: string;
  text: string;
  values: Value[];
}

interface Value {
  id: string;
  value: string;
  mi18n_key: string;
  icon: string;
  enum_string: string;
}

export interface FilterLightCone {
  equipment_paths: FilterField;
  equipment_rarity: FilterField;
  equipment_skill_type: FilterField;
  equipment_source: FilterField;
}

export interface FilterCharacter {
  character_combat_type: FilterField;
  character_paths: FilterField;
  character_rarity: FilterField;
  character_factions: FilterField;
}

export type Paths = {
  id: string;
  value: string;
  mi18n_key: string;
  icon: string;
  enum_string: string;
};

export type CombatType = {
  id: string;
  value: string;
  mi18n_key: string;
  icon: string;
  enum_string: string;
};

export type CatalogState = {
  handling: boolean;
  data: {
    characters: CustomObject<Character>;
    lightCones: CustomObject<LightCone>;
    filterCharacter: FilterCharacter;
    filterLightCone: FilterLightCone;
  };
};

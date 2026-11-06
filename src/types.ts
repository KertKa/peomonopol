export type TileType = 'start' | 'property' | 'drink' | 'truth_dare' | 'all_drink';

export interface Player {
  id: number;
  name: string;
  color: string;
  pos: number;
  coins: number;
  shield: boolean;
}

export interface Tile {
  id: number;
  name: string;
  type: TileType;
  price?: number;
  owner: number | null;
  color: string;
}

export type RoundStage = 'early' | 'mid' | 'late';

export interface PartyCardTemplate {
  stage: RoundStage;
  type: 'drink' | 'truth_dare';
  alcoholText: string;
  nonAlcoholText: string;
}

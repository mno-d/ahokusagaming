// Game Constants and Types

export const REQUIRED_SCORES = [1200, 1600, 2100, 2600, 3200, 3900, 4700, 5600, 6600, 9500];
export const MAX_TURNS = 10;
export const DIGITS = 3;

export type CardType = '制約' | 'ヒント' | '倍率' | 'コンボ' | '成長' | '条件' | '運命' | '報酬' | '特殊';
export type CardTier = 1 | 2 | 3 | 4;

export interface CardDef {
  id: number;
  name: string;
  type: CardType;
  tier: CardTier;
  desc: string;
  cost: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  effect?: (state: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition?: (state: any) => boolean;
}

export interface GameState {
  coins: number;
  highScore: number;
  highStage: number;
  ownedSkins: string[];
  equippedSkin: string;
}

export interface RunState {
  stage: number;
  score: number;
  deck: number[]; // Card IDs
  hp: number; // If we add HP system later
  combo: number;
  comboMult: number;
}

export interface StageState {
  answer: string;
  guesses: { guess: string; hit: number; blow: number }[];
  turn: number;
  isClear: boolean;
  isGameOver: boolean;
}

export const CARD_DEFS: CardDef[] = [
  { id: 1, name: "ハイ＆ロー", type: "ヒント", tier: 1, desc: "正解の合計が15以上か14以下か判明", cost: 0 },
  { id: 2, name: "奇数偶数", type: "ヒント", tier: 1, desc: "正解の奇数・偶数の個数が判明", cost: 0 },
  { id: 3, name: "レンジ", type: "ヒント", tier: 1, desc: "正解の最大数字-最小数字の差が判明", cost: 0 },
  { id: 4, name: "合計値", type: "ヒント", tier: 2, desc: "正解の3つの数字の合計が判明", cost: 0 },
  { id: 5, name: "ワン・モア", type: "特殊", tier: 2, desc: "残りターン数が+2される", cost: 0 },
  { id: 6, name: "スナイパー", type: "倍率", tier: 1, desc: "1ターン目で正解するとスコア3倍", cost: 0 },
  { id: 7, name: "ラストホープ", type: "倍率", tier: 1, desc: "残り1ターンで正解するとスコア2.5倍", cost: 0 },
  { id: 8, name: "スピードスター", type: "倍率", tier: 2, desc: "3ターン以内正解でスコア1.5倍", cost: 0 },
  { id: 9, name: "コンボマスター", type: "コンボ", tier: 2, desc: "コンボ倍率の上昇量が+0.1される", cost: 0 },
  { id: 10, name: "ラッキーセブン", type: "条件", tier: 1, desc: "正解に7が含まれていればスコア+500", cost: 0 },
  // ... more cards can be added here based on the original code
];

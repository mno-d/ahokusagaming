import { DIGITS } from "./game-constants";

export function generateAnswer(digits: number = DIGITS): string {
  const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let ans = "";
  for (let i = 0; i < digits; i++) {
    const idx = Math.floor(Math.random() * nums.length);
    ans += nums[idx];
    nums.splice(idx, 1);
  }
  return ans;
}

export function calculateHitBlow(guess: string, answer: string) {
  let hit = 0;
  let blow = 0;
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) {
      hit++;
    } else if (answer.includes(guess[i])) {
      blow++;
    }
  }
  return { hit, blow };
}

export function calculateScore(turn: number, maxTurns: number, comboMult: number, baseScore: number = 1000) {
  // Simple score calculation logic for now
  const turnBonus = Math.max(0, maxTurns - turn) * 100;
  return Math.floor((baseScore + turnBonus) * comboMult);
}

export function formatNumber(num: number): string {
  return num.toLocaleString('ja-JP');
}

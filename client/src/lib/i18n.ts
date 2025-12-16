// Internationalization (i18n) - English and Japanese support

export type Language = 'en' | 'ja';

export const translations = {
  en: {
    // Main title and subtitle
    title: 'HIT & BLOW',
    subtitle: 'Roguelike',
    
    // Main menu
    welcome: 'Welcome to Hit & Blow Roguelike',
    description: 'This is a code-breaking game combined with roguelike elements. Your goal is to decrypt the 3-digit secret code within limited turns.',
    initializeRun: 'INITIALIZE RUN',
    systemVersion: 'SYSTEM VERSION 2.0.4 // READY',
    
    // HUD labels
    stage: 'Stage',
    score: 'Score',
    turn: 'Turn',
    combo: 'Combo',
    
    // Game instructions
    hitExplain: 'Correct number in correct position',
    blowExplain: 'Correct number but wrong position',
    
    // Buttons
    del: 'DEL',
    enter: 'ENTER',
    nextStage: 'NEXT STAGE',
    rebootSystem: 'REBOOT SYSTEM',
    
    // Result messages
    cleared: 'CLEARED!',
    sequenceDecrypted: 'Sequence Decrypted',
    failed: 'FAILED',
    systemLocked: 'System Locked',
    correctSequence: 'Correct Sequence',
    
    // Tutorial
    tutorialTitle: 'Welcome to Hit & Blow Roguelike',
    tutorialDesc1: 'This is a code-breaking game combined with roguelike elements. Your goal is to decrypt the 3-digit secret code within limited turns.',
    tutorialTitle2: 'How to Play',
    tutorialDesc2: 'Enter a 3-digit number to make a guess.',
    tutorialHit: 'Correct number in correct position.',
    tutorialBlow: 'Correct number but wrong position.',
    tutorialExample: 'Example: Secret is "123", Guess is "135" → 1 HIT (1), 1 BLOW (3)',
    tutorialTitle3: 'Roguelike Elements',
    tutorialDesc3: 'Clear stages to earn coins and score. As you progress, you\'ll need higher scores to advance. Use special cards (coming soon) to boost your performance!',
    tutorialNext: 'NEXT',
    tutorialStart: 'START MISSION',
    
    // System log
    systemLog: 'System Log',
    awaitingInput: 'Awaiting input sequence...',
    
    // Language selector
    language: 'Language',
    english: 'English',
    japanese: '日本語',
  },
  ja: {
    // Main title and subtitle
    title: 'ヒット & ブロー',
    subtitle: 'ローグライク',
    
    // Main menu
    welcome: 'ヒット&ブロー・ローグライクへようこそ',
    description: '数字当てゲーム（ヒット&ブロー）にローグライク要素を組み合わせたゲームです。限られたターン数で3桁の秘密コードを解読することが目標です。',
    initializeRun: 'ミッション開始',
    systemVersion: 'システムバージョン 2.0.4 // 準備完了',
    
    // HUD labels
    stage: 'ステージ',
    score: 'スコア',
    turn: 'ターン',
    combo: 'コンボ',
    
    // Game instructions
    hitExplain: '正解の数字が正解の位置にある',
    blowExplain: '正解の数字が含まれているが、位置が異なる',
    
    // Buttons
    del: '削除',
    enter: '送信',
    nextStage: '次のステージ',
    rebootSystem: 'システム再起動',
    
    // Result messages
    cleared: 'クリア！',
    sequenceDecrypted: 'コード解読成功',
    failed: '失敗',
    systemLocked: 'システムロック',
    correctSequence: '正解のコード',
    
    // Tutorial
    tutorialTitle: 'ヒット&ブロー・ローグライクへようこそ',
    tutorialDesc1: 'これは数字当てゲーム（ヒット&ブロー）にローグライク要素を組み合わせたゲームです。限られたターン数で3桁の秘密コードを解読することが目標です。',
    tutorialTitle2: 'ゲームの遊び方',
    tutorialDesc2: '3桁の数字を入力して推測します。',
    tutorialHit: '正解の数字が正解の位置にある。',
    tutorialBlow: '正解の数字が含まれているが、位置が異なる。',
    tutorialExample: '例：秘密コードが「123」、推測が「135」の場合 → HIT = 1（「1」が正解）、BLOW = 1（「3」が含まれているが位置が違う）',
    tutorialTitle3: 'ローグライク要素',
    tutorialDesc3: 'ステージをクリアしてコインとスコアを獲得します。進むにつれてより高いスコアが必要になります。特殊カード（近日実装予定）を使用してパフォーマンスを向上させましょう！',
    tutorialNext: '次へ',
    tutorialStart: 'ミッション開始',
    
    // System log
    systemLog: 'システムログ',
    awaitingInput: '入力待機中...',
    
    // Language selector
    language: '言語',
    english: 'English',
    japanese: '日本語',
  },
};

export function getTranslation(lang: Language, key: keyof typeof translations.en): string {
  return translations[lang][key] || key;
}

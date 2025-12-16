# ヒット&ブロー・ローグライク セットアップガイド

このガイドは、Windows、Mac、Linuxでプロジェクトをセットアップするための手順です。

## 前提条件

このプロジェクトはNode.jsで動作します。Pythonではありません。

## ステップ1: Node.jsのインストール

### Windows / Mac / Linux共通

1. 以下のサイトにアクセス：https://nodejs.org/
2. **LTS（Long Term Support）版**をダウンロードしてインストール
3. インストール完了後、ターミナル/PowerShellを再起動

### インストール確認

ターミナル/PowerShellで以下を実行：

```bash
node --version
npm --version
```

バージョン番号が表示されればOKです。

## ステップ2: pnpmのインストール

Node.jsをインストール後、以下を実行：

```bash
npm install -g pnpm
```

確認：
```bash
pnpm --version
```

## ステップ3: プロジェクトの依存関係をインストール

プロジェクトフォルダに移動して：

```bash
cd hitblow-roguelike
pnpm install
```

このコマンドは数分かかる場合があります。完了まで待ってください。

## ステップ4: ローカルサーバーを起動

```bash
pnpm dev
```

ターミナルに以下のような出力が表示されます：

```
➜  Local:   http://localhost:3000/
```

## ステップ5: ブラウザで開く

ブラウザで `http://localhost:3000/` にアクセスしてゲームをプレイできます。

## トラブルシューティング

### Windows PowerShellでのセキュリティエラー

**エラーメッセージ:**
```
このシステムではスクリプトの実行が無効になっているため、ファイル C:\Program Files\nodejs\npm.ps1 を読み込むことができません。
```

**解決方法1: コマンドプロンプトを使用（推奨）**

1. Windowsキーを押して「cmd」と入力
2. 「コマンドプロンプト」を開く
3. 以下のコマンドを実行

```bash
cd C:\Users\your-username\Downloads\hitblow-roguelike\hitblow-roguelike
pnpm install
pnpm dev
```

**解決方法2: PowerShellの実行ポリシーを変更**

1. PowerShellを**管理者として実行**
2. 以下を実行：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
3. 「Y」を入力して確認

### 「pnpmコマンドが見つからない」エラー

→ ステップ2でpnpmのインストールが完了しているか確認してください。ターミナルを再起動してから再度試してください。

### pnpmのインストール確認

以下を実行して、pnpmが正しくインストールされているか確認：

```bash
pnpm --version
```

バージョン番号が表示されればOKです。表示されない場合は、以下を再度実行：

```bash
npm install -g pnpm
```

### 「node_modules not found」エラー

→ ステップ3の `pnpm install` が正常に完了していない可能性があります。再度実行してください。

### ポート3000が既に使用されている

→ 別のアプリがポート3000を使用しています。以下を実行して別のポートで起動：

```bash
pnpm dev -- --port 3001
```

## 本番環境へのデプロイ

ローカルで動作確認後、本番環境にデプロイする場合：

```bash
pnpm build
```

このコマンドで `dist` フォルダが生成されます。このフォルダをWebサーバーにアップロードしてください。

## さらに詳しく

- React: https://react.dev/
- Vite: https://vitejs.dev/
- Tailwind CSS: https://tailwindcss.com/

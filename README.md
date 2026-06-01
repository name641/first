# Task Management App

## 概要

Laravel + React + TypeScript で作成したタスク管理アプリです。

## 機能

- ユーザー登録
- ログイン / ログアウト
- タスク作成
- タスク編集
- タスク削除
- ドラッグ&ドロップ並び替え
- ステータス管理（todo / doing / done）
- タスク検索
- 期限フィルタ
- プロフィール編集
- アカウント削除

## 使用技術

### Backend

- Laravel 13
- PHP
- MySQL
- Laravel Sanctum

### Frontend

- React
- TypeScript
- Vite
- Bootstrap
- DnD Kit

### Test

- PHPUnit
- Playwright

### CI/CD

- GitHub Actions

## セキュリティ対策

- 認証（Sanctum）
- 認可（ユーザー単位のアクセス制御）
- バリデーション
- XSS対策
- API改ざん対策
- APP_DEBUG管理
- CORS設定

## セットアップ

```bash
git clone ...
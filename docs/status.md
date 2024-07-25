# Status

## 概要
状態（永続化を含む）の管理を行う．

## 使用方法
```js
// 使用前にキーを追加する
this._status.addNew("key", default_value, "auto");	// 永続化(自動選択)
this._status.addNew("key", default_value, "sync");	// 永続化(同期)
this._status.addNew("key", default_value, "local");	// 永続化(ローカル)
this._status.addNew("key", default_value, "none");	// 永続化(なし)

// 取得
let value = this._status.get("key");

// 設定
this._status.set("key", value, true);	// 保存あり
this._status.set("key", value, false);	// 保存なし

// 削除
this._status.remove("key", true);	// 保存あり
this._status.remove("key", false);	// 保存なし
```

## 使用中のキー名
* Options-v **(sync)**
* flag-notification **(sync)**
* flag-use-local **(local)**
* CommentPicker
  * CommentPicker-opt-owner
  * CommentPicker-opt-verified
  * CommentPicker-opt-moderator
* FullscreenChat
  * FullscreenChat-opt-text-outline
  * FullscreenChat-opt-font-size
  * FullscreenChat-opt-background-blur
  * FullscreenChat-opt-opacity-def
  * FullscreenChat-opt-opacity-hover
  * FullscreenChat-opt-use-card
  * FullscreenChat-opt-card-opacity-def
  * FullscreenChat-opt-card-opacity-hover
  * FullscreenChat-opt-use-chat-docking
  * FullscreenChat-iframe-top **(local)**
  * FullscreenChat-iframe-left **(local)**
  * FullscreenChat-iframe-width **(local)**
  * FullscreenChat-iframe-height **(local)**
  * FullscreenChat-iframe-chat-docking **(local)**
* ChatTicker
  * ChatTicker-opt-button-hide

## 削除済みキー名
* v
* flag-options-description **(local)**

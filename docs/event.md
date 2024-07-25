# Event

## 概要
基本的にすべてのやり取り（機能間・対YouTube）はイベントマネージャを通して行う．

実際のイベントはメインウィンドウのwindowに対して`ytcex-message`イベントを発火する．

## 使用方法
```js
// イベントリスナーの登録
this._event.listen("event", this._bind.callback);

// イベントの発火
this._event.dispatch("event", data, true);		// すべてのフレーム
this._event.dispatch("event", data, false);		// 実行中のフレームのみ

// イベントリスナーの解除
this._event.unlisten("event", this._bind.callback);
```

## 使用中のイベント名
* main
  * mainInitialized
  * initialized
* event_manager(youtube)
  * yt-load(yt-navigate-finish)
  * yt-unload(yt-navigate-start)
  * yt-fullscreen(yt-action yt-fullscreen-change-action)
* status_manager
  * statusInit
  * statusData
  * statusInitialized
  * statusPropChanged
  * statusChanged
* options
  * requestOptions
  * registerOptions
* fullscreen_chat
  * FullscreenChat-iframe-set
  * FullscreenChat-iframe-grab
  * FullscreenChat-iframe-move
  * FullscreenChat-iframe-ungrab
  * FullscreenChat-iframe-adjust-fixed-length
  * FullscreenChat-chat-docking

## 過去(詳細不明)に記録したYouTubeイベント
```js
const ytEvents = [
	'yt-action',
	'yt-add-element-to-app',
	'yt-autonav-pause-blur',
	'yt-autonav-pause-focus',
	'yt-autonav-pause-guide-closed',
	'yt-autonav-pause-guide-opend',
	'yt-autonav-pause-player',
	'yt-autonav-pause-player-ended',
	'yt-autonav-pause-scroll',
	'yt-focus-searchbox',
	'yt-guide-close',
	'yt-guide-hover',
	'yt-guide-show',
	'yt-guide-toggle',
	'yt-history-load',
	'yt-history-pop',
	'yt-masthead-height-changed',
	'yt-navigate',
	'yt-navigate-caches',
	'yt-navigate-error',
	'yt-navigate-finish',
	'yt-navigate-redirect',
	'yt-navigate-set-page-offset',
	'yt-navigate-start',
	'yt-open-hotkey-dialog',
	'yt-page-data-fetched',
	'yt-page-data-updated',
	'yt-page-type-changed',
	'yt-report-from-closed',
	'yt-report-from-opend',
	'yt-request-panel-mode-change',
	'yt-service-request-completed',
	'yt-service-request-error',
	'yt-service-request-sent',
	'yt-set-fullscreen-styles',
	'yt-set-theater-mode-enabled',
	'yt-update-title',
	'yt-update-unseen-notification-count'
];
```
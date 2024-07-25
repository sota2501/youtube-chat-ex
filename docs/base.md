# Base

## 概要
すべての機能はCoreまたはExtクラスを継承する．

## 初期化
Core，Extクラスの初期化はそれぞれ以下のように行う．ただし，引数はCoreクラスが増えるたびに追加する．

### Core
```js
class ClassName extends Core {
	// constructorは書かない

	register(event, status, debug) {
		super.register(event, status, debug);
		// 以下 その他初期化コード
	}
}
```

### Ext
```js
class ClassName extends Ext {
	constructor(event, status, debug) {
		super(event, status, debug);
		// 以下 その他初期化コード
	}

	// register関数は書かない
}
```

## 共通プロパティ
### _event
* イベント処理を行う．
* あらゆるやり取りはこれを利用して行う．
* 初期化後に利用可能

### _status
* 状態(永続化を含む)の管理を行う．
* statusInitializedイベント発火後に利用可能

### _debug
* デバッグを行う．（細かな仕様は未確定）
* 初期化後に利用可能

### _bind
* インスタンスのメンバ関数のバインドを行う．
* イベントリスナーのコールバックとして登録する場合は必ず使う．
* 一度バインドされたメンバ関数はキャッシュされるため，イベントの解除にそのまま利用できる．
* 初期化後に利用可能

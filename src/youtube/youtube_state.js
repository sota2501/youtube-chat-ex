/**
 * YoutubeState
 * frameはroot,app,mainChat,iframeChat,popupChatのみを想定する
 * TODO: リファクタリング
 */
export default class YoutubeState {
	static parentsFrameIsYT(){
		let win = window;
		do{
			let pIsYT = this.parentFrameIsYT(win);
			if(pIsYT){
				if(win.top != win){
					win = win.parent;
				}else{
					win = win.opener;
				}
			}else{
				return pIsYT;
			}
		}while(win.top != win || win.opener);
		return true;
	}
	static parentFrameIsYT(win=window){
		if(win.top != win || win.opener){
			return new URL(win.document.referrer).hostname == "www.youtube.com"
		}else{
			return null;
		}
	}

	static isMainWindow(){
		return window.opener == null;
	}
	static isSubWindow(){
		return window.opener != null;
	}
	static isTopFrame(){
		return top == window;
	}
	static isChildFrame(){
		return top != window;
	}
	static isAppFrame(){
		return window.document.querySelector("ytd-app") != null;
	}
	static isChatFrame(){
		return window.document.querySelector("yt-live-chat-app") != null;
	}

	static isRootFrame(){
		return this.isMainWindow() && this.isTopFrame();
	}
	static isMainChatFrame(){
		return this.isRootFrame() && this.isChatFrame();
	}
	static isIframeChatFrame(){
		return this.isChildFrame() && this.isChatFrame();
	}
	static isPopupChatFrame(){
		return this.isSubWindow() && this.isChatFrame();
	}

	// アプリフレームのみで使用可能
	static isChatCollapsing(){
		if(this.isAppFrame()){
			return document.querySelector("ytd-live-chat-frame#chat")?.hasAttribute("collapsed") ?? true;
		}
		return null;
	}
	// チャットフレームのみで使用可能
	static isLiveStreaming(){
		if(this.isChatFrame()){
			return location.pathname == "/live_chat";
		}
		return null;
	}

	static getFrame(){
		return this.isAppFrame() ? "app" : this.isMainChatFrame() ? "main-chat" : this.isIframeChatFrame() ? "iframe-chat" : this.isPopupChatFrame() ? "popup-chat" : "others";
	}
}
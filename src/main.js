import EventManager from './core/event_manager.js';
import StatusManager from './core/status_manager.js';
import Debug from './core/debug.js';

import Options from './options/options.js';
import CommentPicker from './comment_picker/comment_picker.js';
import FullscreenChat from './fullscreen_chat/fullscreen_chat.js';
import ChatTickerScroll from './chat_ticker_scroll/chat_ticker_scroll.js';


const event = new EventManager();
const status = new StatusManager();
const debug = new Debug();

event.register(event, status, debug);
status.register(event, status, debug);
debug.register(event, status, debug);

Promise.all([
	new Promise(resolve => {
		event.listen("statusInitialized", resolve);
	}),
	new Promise(resolve => {
		event.listen("mainInitialized", resolve);
	})
]).then(() => {
	event.dispatch("initialized", null, false);
});

const options = new Options(event, status, debug);
const commentPicker = new CommentPicker(event, status, debug);
const fullscreenChat = new FullscreenChat(event, status, debug);
const chatTickerScroll = new ChatTickerScroll(event, status, debug);

event.dispatch("mainInitialized", null, false);
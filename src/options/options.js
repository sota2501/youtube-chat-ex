import Ext from "../base/ext.js";
import YoutubeState from "../youtube/youtube_state.js";

export default class Options extends Ext {
	v = 2;

	constructor(event, status, debug) {
		super(event, status, debug);
		this._event.listen("initialized", this._bind.init);
		if (YoutubeState.isChatFrame()) {
			this._event.listen("requestOptions", this._bind.registerOptions);
			this._event.listen("registerOptions", this._bind.createOptionsDOM);
			this._event.listen("statusChanged", this._bind.onStatusChanged);
		}
	}

	init() {
		this._status.addNew("Options-v", 0, "sync");
		this._status.addNew("flag-notification", true, "sync");
		this._status.addNew("flag-use-local", false, "local");

		if (YoutubeState.isChatFrame()) {
			this.appendSettingsDOM();
			this._event.dispatch("requestOptions", null, false);
			this.appendMenuDOM();
			this.setNotificationBadge();
		}
	}

	registerOptions() {
		const options = [
			{
				type: "toggle",
				name: "flag-notification",
				caption: "Options_ShowNotifyBadge",
				childrenTrue: [
					{
						type: "text",
						caption: "Options_ShowNotifyBadgeTrueDescription"
					}
				],
				childrenFalse: [
					{
						type: "text",
						caption: "Options_ShowNotifyBadgeFalseDescription"
					}
				]
			},
			{
				type: "toggle",
				name: "flag-use-local",
				caption: "Options_UseLocal",
				childrenTrue: [
					{
						type: "text",
						caption: "Options_UseLocalTrueDescription"
					}
				],
				childrenFalse: [
					{
						type: "text",
						caption: "Options_UseLocalFalseDescription"
					}
				]
			},
			{
				type: "margin"
			}
		];

		this._event.dispatch("registerOptions", options, false);
	}

	appendSettingsDOM() {
		const ninja = document.querySelector("yt-live-chat-ninja-message-renderer");
		ninja.insertAdjacentHTML("beforebegin", `
			<div id="ytcex-options-wrapper" class="style-scope yt-live-chat-renderer">
				<div id="header" role="heading" class="style-scope yt-live-chat-renderer" aria-label="${chrome.i18n.getMessage("optionsTitle")}">
					<div id="back-button" class="style-scope yt-live-chat-header-renderer">
						<yt-live-chat-button class="style-scope yt-live-chat-header-renderer" modern>
							<yt-button-renderer class="style-scope yt-live-chat-renderer" is-icon-button="" has-no-text=""></yt-button-renderer>
						</yt-live-chat-button>
					</div>
					${chrome.i18n.getMessage("optionsTitle")}
				</div>
				<div id="ytcex-options" class="style-scope yt-live-chat-renderer">
					<div id="items" class="style-scope yt-live-chat-renderer"></div>
				</div>
			</div>
		`);

		const optionsPage = ninja.parentElement.querySelector("#ytcex-options-wrapper");
		const buttonRenderer = optionsPage.querySelector("#header yt-button-renderer");
		const script = document.createElement("script");
		script.src = chrome.runtime.getURL("options/inline.js");
		buttonRenderer.appendChild(script);
		setTimeout(()=>{
			const button = buttonRenderer.querySelector("button");
			button.addEventListener("click", this._bind.backToChat);
		}, 1000);
	}

	createOptionsDOM(options) {
		const items = document.querySelector("#ytcex-options #items");
		for (let option of options) {
			this.appendSettingDOM(items, option);
		}
	}

	appendSettingDOM(wrapper, options) {
		if (options.type == "margin") {
			wrapper.insertAdjacentHTML("beforeend", `<div class="style-scope ytcex-options-margin" style="height: 16px;"></div>`);
			return
		}

		const isNew = (options.v ?? 0) > this._status.get("Options-v") ? " is-new" : "";
		const caption = chrome.i18n.getMessage(options.caption);
		wrapper.insertAdjacentHTML("beforeend", `
			<div class="style-scope ytcex-options-caption-container">
				<div class="style-scope ytcex-options-caption"${isNew}>${caption}</div>
			</div>
		`);

		if (options.type == "text") {
			return;
		}

		const captionContainer = wrapper.lastElementChild;
		const value = this._status.get(options.name);
		switch(options.type) {
			case "toggle":
				this.appendToggle(captionContainer, options, value);
				break;
			case "slider":
				this.appendSlider(captionContainer, options, value);
				break;
		}
	}

	appendToggle(wrapper, options, checked) {
		wrapper.insertAdjacentHTML("beforeend", `
			<div class="style-scope ytcex-options-toggle-container" role="button" tabindex="0" data-option="${options.name}"${checked?" checked":""}>
				<div class="style-scope ytcex-options-toggle">
					<div class="style-scope ytcex-options-toggle-bar"></div>
					<div class="style-scope ytcex-options-toggle-button"></div>
				</div>
			</div>
		`);

		const toggle = wrapper.lastElementChild;
		const toggleListener = () => {
			if (toggle.getAttribute("disabled") != null) return;
			const checked = toggle.getAttribute("checked") != null;
			this._status.set(options.name, !checked);
		};
		toggle.addEventListener("click", toggleListener);
		toggle.addEventListener("keydown", e => {
			if (e.keyCode == 13) {
				toggleListener();
			}
		});

		if (options.childrenTrue) {
			wrapper.insertAdjacentHTML("beforeend", `<div class="style-scope ytcex-options-toggle-collapse" data-type="on"></div>`);
			const collapseTrue = wrapper.lastElementChild;
			for (let child of options.childrenTrue) {
				this.appendSettingDOM(collapseTrue, child);
			}
		}
		if (options.childrenFalse) {
			wrapper.insertAdjacentHTML("beforeend", `<div class="style-scope ytcex-options-toggle-collapse" data-type="off"></div>`);
			const collapseFalse = wrapper.lastElementChild;
			for (let child of options.childrenFalse) {
				this.appendSettingDOM(collapseFalse, child);
			}
		}
	}

	appendSlider(wrapper, options, value) {
		wrapper.insertAdjacentHTML("beforeend", `
			<div class="style-scope ytcex-options-slider" tabindex="0" data-option="${options.name}" data-min="${options.min}" data-max="${options.max}" data-step="${options.step}" value="${value}">
				<button class="style-scope ytcex-options-slider-handle" tabindex="-1">
					<div class="ytcex-options-slider-bright"></div>
					<div class="ytcex-options-slider-shadow"></div>
				</button>
			</div>
		`);

		const slider = wrapper.lastElementChild;
		this.onChangedSlider(slider, value);

		let moving = false;
		const move = e => {
			let pageX;
			if (e.type.slice(0, 5) == "mouse") {
				pageX = e.pageX;
			} else if (e.type.slice(0, 5) == "touch") {
				for (let i = 0; i < e.changedTouches.length; i++) {
					if (e.changedTouches[i].identifier == moving) {
						pageX = e.changedTouches[i].pageX;
						break;
					}
				}
			} else {
				return;
			}

			const steps = (options.max - options.min) / options.step;
			let position = pageX - slider.getBoundingClientRect().left - 9;
			position = Math.min(Math.max(position, 0), 100);
			let step = Math.round(position / 100 * steps);
			let value = Math.round((step * options.step + options.min) * 100) / 100;
			slider.children[0].setAttribute("data-val", value);
			this._status.set(options.name, value);
		};
		slider.addEventListener("mousedown", e => {
			if(moving !== false){
				return;
			}
			moving = true;
			slider.children[0].setAttribute("active", "");
			if(slider.getAttribute("disabled") == null){
				move(e);
				document.addEventListener("mousemove", move);
				document.addEventListener("mouseup", () => {
					slider.children[0].removeAttribute("active");
					document.removeEventListener("mousemove", move);
					moving = false;
				}, {once: true});
			}
		});
		slider.addEventListener("touchstart", e=>{
			if(moving !== false){
				return;
			}
			moving = e.changedTouches[0].identifier;
			e.preventDefault();
			slider.children[0].setAttribute("active", "");
			if(slider.getAttribute("disabled") == null){
				move(e);
				document.addEventListener("touchmove", move);
				const touchend = e=>{
					let touch = false;
					for(let i = 0; i < e.changedTouches.length; i++){
						if(e.changedTouches[i].identifier == moving){
							touch = e.changedTouches[i];
							break;
						}
					}
					if(!touch){
						return;
					}

					slider.children[0].removeAttribute("active");
					document.removeEventListener("touchmove", move);
					document.removeEventListener("touchend", touchend);
					moving = false;
				};
				document.addEventListener("touchend", touchend);
			}
		});
		slider.addEventListener("keydown",e=>{
			if(slider.getAttribute("disabled") == null){
				let value = Number(slider.getAttribute("value"));
				if(e.keyCode == 37){
					value = Math.min(Math.max(value - options.step, options.min), options.max);
					this._status.set(options.name, value);
				}else if(e.keyCode == 39){
					value = Math.min(Math.max(value + options.step, options.min), options.max);
					this._status.set(options.name, value);
				}
			}
		});
	}

	appendMenuDOM() {
		const threeDots = document.querySelector("#chat-messages > yt-live-chat-header-renderer > yt-live-chat-button");
		threeDots.addEventListener("click",()=>{
			const menu = document.querySelector("yt-live-chat-app > tp-yt-iron-dropdown tp-yt-paper-listbox");
			menu.insertAdjacentHTML("beforeend", `
				<div id="ytcex-menu-item" class="style-scope ytd-menu-popup-renderer" use-icons="" system-icons="" role="menuitem">
					<tp-yt-paper-item class="style-scope ytd-menu-service-item-renderer" style-target="host" role="option" tabindex="0" aria-disabled="false">
						<yt-icon class="style-scope ytd-menu-service-item-renderer" style="display: inline-block;"></yt-icon>
						<yt-formatted-string class="style-scope ytd-menu-service-item-renderer"></yt-formatted-string>
					</tp-yt-paper-item>
				</div>
			`);

			const menuItem = menu.querySelector("#ytcex-menu-item");
			const ytIcon = menuItem.querySelector("yt-icon");
			ytIcon.insertAdjacentHTML("beforeend", `
				<svg viewBox="0 0 24 24" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
					<style>
						div.ytd-menu-popup-renderer yt-icon.ytd-menu-service-item-renderer {
							fill: var(--yt-spec-text-primary)
						}
					</style>
					<g class="style-scope yt-icon">
						<path d="M7,21l4-4h8c1.1,0,2-.9,2-2v-10c0-1.1-0.9-2-2-2h-14c-1.1,0-2,.9-2,2v10c0,1.1,.9,2,2,2h2v4ZM6,6h12v2h-12v-2ZM6,9h12v2h-12v-2ZM6,12h12v2h-12v-2Z"></path>
					</g>
				</svg>
			`);

			const ytFormattedString = menuItem.querySelector("yt-formatted-string");
			ytFormattedString.innerHTML = chrome.i18n.getMessage("optionsTitle");
			ytFormattedString.removeAttribute("is-empty");
			
			menuItem.addEventListener("click", this._bind.openOptions);
		});
	}

	setNotificationBadge() {
		if (this._status.get("flag-notification")) {
			if (this.v > (this._status.get("Options-v"))) {
				document.documentElement.classList.add("ytcexHasNotification");
			}
		}
	}

	onStatusChanged(changes) {
		if (YoutubeState.isChatFrame()) {
			const items = document.querySelector("#ytcex-options #items");
			for (let key in changes) {
				const option = items.querySelector(`[data-option="${key}"]`);
				if (option) {
					if (option.classList.contains("ytcex-options-toggle-container")) {
						this.onChangedToggle(option, changes[key]);
					} else if (option.classList.contains("ytcex-options-slider")) {
						this.onChangedSlider(option, changes[key]);
					}
				}
			}
		}
	}

	onChangedToggle(toggle, checked) {
		if (checked) {
			toggle.setAttribute("checked", "");
		} else {
			toggle.removeAttribute("checked");
		}
	}

	onChangedSlider(slider, value) {
		const min = Number(slider.getAttribute("data-min"));
		const max = Number(slider.getAttribute("data-max"));

		slider.setAttribute("value", value);
		slider.children[0].style.transform = `translateX(${(value - min) / (max - min) * 100}px)`;	// 0~100
	}

	openOptions() {
		const chatMessages = document.querySelector("#chat-messages");
		const optionsPage = document.querySelector("#ytcex-options-wrapper");
		optionsPage.click();
		optionsPage.classList.add("iron-selected");
		chatMessages.classList.remove("iron-selected");
		document.documentElement.classList.remove("ytcexHasNotification");
		this._status.set("Options-v", this.v);
	}

	backToChat() {
		const chatMessages = document.querySelector("#chat-messages");
		const optionsPage = document.querySelector("#ytcex-options-wrapper");
		chatMessages.classList.add("iron-selected");
		optionsPage.classList.remove("iron-selected");

		const itemOffset = document.querySelector("#chat-messages #item-offset");
		if (itemOffset.style.height == "0px") {
			setTimeout(() => itemOffset.parentElement.scrollTo(0, itemOffset.children.item(0).scrollHeight));
		}
		itemOffset.style.height = itemOffset.children.item(0).clientHeight + "px";
		itemOffset.style.minHeight = itemOffset.parentElement.clientHeight + "px";

		const isNewElms = document.querySelectorAll("#ytcex-options-wrapper #caption[is-new]");
		for (let elm of isNewElms) {
			elm.removeAttribute("is-new");
		}
	}
}
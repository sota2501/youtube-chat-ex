(()=>{
	const shape = document.querySelector("#ytcex-options-wrapper yt-button-shape");
	shape.data = {
		aTagConfig: undefined,
		accessibilityLabel: "戻る",
		alignByText: false,
		disabled: undefined,
		focused: false,
		formattedButtonText: undefined,
		iconPosition: "icon-only-40",
		onTap: undefined,
		oneOffCustomTextWrap: undefined,
		size: "M",
		state: "active",
		style: "mono",
		toggled: false,
		type: "text"
	};
	const button = shape.querySelector("button");
	button.classList.add("ytSpecButtonShapeNextIconOnlyDefault");

	// Trusted Types を強制するページでも動くよう insertAdjacentHTML ではなく DOM API で組み立てる
	const svgNS = "http://www.w3.org/2000/svg";
	const svg = document.createElementNS(svgNS, "svg");
	svg.setAttribute("height", "24");
	svg.setAttribute("viewBox", "0 0 24 24");
	svg.setAttribute("width", "24");
	svg.setAttribute("focusable", "false");
	svg.setAttribute("aria-hidden", "true");
	svg.style.pointerEvents = "none";
	svg.style.display = "inherit";
	svg.style.width = "100%";
	svg.style.height = "100%";
	const path = document.createElementNS(svgNS, "path");
	path.setAttribute("d", "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z");
	svg.appendChild(path);

	const svgHolder = document.createElement("div");
	svgHolder.style.width = "100%";
	svgHolder.style.height = "100%";
	svgHolder.style.display = "block";
	svgHolder.style.fill = "currentcolor";
	svgHolder.appendChild(svg);

	const iconShape = document.createElement("span");
	iconShape.className = "yt-icon-shape ytSpecIconShapeHost";
	iconShape.appendChild(svgHolder);

	const iconWrapper = document.createElement("span");
	iconWrapper.className = "ytIconWrapperHost";
	iconWrapper.style.width = "24px";
	iconWrapper.style.height = "24px";
	iconWrapper.appendChild(iconShape);

	const iconDiv = document.createElement("div");
	iconDiv.setAttribute("aria-hidden", "true");
	iconDiv.className = "ytSpecButtonShapeNextIcon";
	iconDiv.appendChild(iconWrapper);

	button.insertBefore(iconDiv, button.firstChild);
})();

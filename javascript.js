const body = document.querySelector("body");
const settings = document.querySelector(".settings");
const settingsWidjet = document.querySelector(".settingsWidjet");
const displayHeight = document.querySelector("#displayHeight");
const displayWidth = document.querySelector("#displayWidth");
const displayHeightValue = document.querySelector(".displayHeightValue");
const displayWidthValue = document.querySelector(".displayWidthValue");
const choseDisplayResButton = document.querySelector("#choseDisplayResButton");
const header = document.querySelector("h1");
const display = document.querySelector(".display");
const clear = document.querySelector("#clear");
const bucket = document.querySelector("#bucket");
const pipette = document.querySelector("#pipette");
const brush = document.querySelector("#brush");
const remover = document.querySelector("#remover");
const undo = document.querySelector("#undo");
const redo = document.querySelector("#redo");
const palet = document.querySelector("#palette");
const redSlider = document.querySelector("#red");
const greenSlider = document.querySelector("#green");
const blueSlider = document.querySelector("#blue");
const opacitySlider = document.querySelector("#opacity");
const choseButton = document.querySelector(".choseButton");
const chousenColor = document.querySelector(".chousenColor");
const paleteWidjet = document.querySelector(".paleteWidjet");
const saveButton = document.querySelector("#save");
const mobileMode = document.querySelector("#MobileMode");
display.addEventListener("mouseup", () => {mousehold = false});
display.addEventListener("mouseleave", () => {mousehold = false});

let selectedTool = "brush";

let displayRes = [64,64];
let currentDisplay = [];
let displayPixelsIds = [];
let currentDisplayColor = [];
let eventSequencePos =	-1;
let eventSequence = [];
let background_color = "rgba(255, 255, 255, 0)";
let mainColor = "rgba(0, 0, 0, 1)";
let mousehold = false;
let clearEvent = new Event('clearPixel');

function displayEvents() {
	display.addEventListener('clearPixel', () => {
		if (eventSequence.length - 1 > eventSequencePos) {
			for (let i = eventSequence.length - 1; i > eventSequencePos; i--){
				eventSequence.splice(i,1);
			}
		}
		for (let i = 0; i < displayRes[0]; i++){
			for (let j = 0; j < displayRes[1]; j++){
				currentDisplay[i][j].style.backgroundColor = background_color;
				currentDisplayColor.push([i,j,background_color]);

			}
		}
		if (JSON.stringify(eventSequence[eventSequencePos]) != JSON.stringify(currentDisplayColor)) {
			console.log(eventSequence[eventSequencePos], currentDisplayColor)
			eventSequence.push(currentDisplayColor); eventSequencePos += 1;
			console.log("currentDisplayColor was created", eventSequencePos);
		}
		currentDisplayColor = [];

	});
}

function painDisplay(eventSequencePos) {
	beforeColorDisplay = eventSequence[eventSequencePos];
	for (let i = 0; i < displayRes[0]*displayRes[1]; i++){
		currentDisplay[beforeColorDisplay[i][0]][beforeColorDisplay[i][1]].style.backgroundColor = beforeColorDisplay[i][2];
	}

}

function createPixel(i,j) {
	const pixel = document.createElement("div");
	pixel.setAttribute("id",`${i+1};${j+1}`);
	pixel.className = "pixel";
	pixel.setAttribute("style",`background-color: ${background_color}; flex: 1 0 auto; aspect-ratio: 1/1; user-select: none; -webkit-user-drag: none;`);
	console.log(background_color);
	pixel.addEventListener("dragstart", (e) => {
		e.preventDefault()
	});
	pixel.addEventListener("mousedown", () => {mousehold = true});
	pixel.addEventListener("mouseup", () => {mousehold = false});

	pixel.addEventListener("touchstart", handleTouchStart);
	pixel.addEventListener("touchmove", handleTouchMove);
	pixel.addEventListener("touchend", handleTouchEnd);

	return pixel;
}

let isTouching = false;

function handleTouchStart(e) {
    e.preventDefault();
    isTouching = true;
    const pixel = e.target;
    if (selectedTool === "brush") {
        pixel.style.backgroundColor = mainColor;
    } else if (selectedTool === "remover") {
        pixel.style.backgroundColor = background_color;
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isTouching) return;
    
    const touch = e.touches[0];
    const pixel = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (pixel && pixel.classList.contains("pixel")) {
        if (selectedTool === "brush") {
            pixel.style.backgroundColor = mainColor;
        } else if (selectedTool === "remover") {
            pixel.style.backgroundColor = background_color;
        }
    }
}

function handleTouchEnd() {
	isTouching = false;
	if (eventSequence.length - 1 > eventSequencePos) {
		for (let i = eventSequence.length - 1; i > eventSequencePos; i--){
			eventSequence.splice(i,1);
		}
	}
	for (let i = 0; i < displayRes[0]; i++){
		for (let j = 0; j < displayRes[1]; j++){
			currentDisplayColor.push([i,j,currentDisplay[i][j].style.backgroundColor]);
		}
	}
	if (JSON.stringify(eventSequence[eventSequencePos]) != JSON.stringify(currentDisplayColor)) {
		eventSequence.push(currentDisplayColor); eventSequencePos += 1;
		console.log("currentDisplayColor was created", eventSequencePos);
	}
	currentDisplayColor = [];
}



function brushEventsPixel(pixel) {
	pixel.addEventListener("mouseenter", () => {
		if (mousehold === true && selectedTool === "brush") {
			pixel.style.backgroundColor = mainColor;
		}
	});	
	pixel.addEventListener("touchstart", (e) => {
        	e.preventDefault();
	        if (selectedTool === "brush") {
        	    pixel.style.backgroundColor = mainColor;
	        }
	});
	pixel.addEventListener("touchmove", (e) => {
        	e.preventDefault();
	        if (selectedTool === "brush") {
        	    const touch = e.touches[0];
	            const movedPixel = document.elementFromPoint(touch.clientX, touch.clientY);
        	    if (movedPixel && movedPixel.classList.contains("pixel")) {
	                movedPixel.style.backgroundColor = mainColor;
		    }
	        }
	});
	pixel.addEventListener("mousedown", () => {
		if (selectedTool === "brush"){
			pixel.style.backgroundColor = mainColor;
		}
	});
}

function removerEventsPixel (pixel) {
	pixel.addEventListener("mouseenter", () => {
		if (mousehold === true && selectedTool === "remover") {
			pixel.style.backgroundColor = background_color;
		}
	});
	pixel.addEventListener("click", () => {
		if (selectedTool === "remover") {
			pixel.style.backgroundColor = background_color;
		}
	});
	pixel.addEventListener("touchstart", (e) => {
        	e.preventDefault();
	        if (selectedTool === "remover") {
        	    pixel.style.backgroundColor = background_color;
	        }
	});    
	pixel.addEventListener("touchmove", (e) => {
        	e.preventDefault();
	        if (selectedTool === "remover") {
        	    const touch = e.touches[0];
	            const movedPixel = document.elementFromPoint(touch.clientX, touch.clientY);
			if (movedPixel && movedPixel.classList.contains("pixel")) {
				movedPixel.style.backgroundColor = background_color;	
			}
	        }
	});
}

function pipetteEventPixel(pixel) {
	pixel.addEventListener("click", () => {
		if (selectedTool === "pipette"){
			mainColor = pixel.style.backgroundColor;
		}
	});
	pixel.addEventListener("touchstart", (e) => {
        	e.preventDefault();
	        if (selectedTool === "pipette") {
			mainColor = pixel.style.backgroundColor;
	        }
	});
}

function bucketEventsPixel(pixel) {	
	pixel.addEventListener("mousedown", () => {
		if (selectedTool === "bucket") {
			const row = currentDisplay.findIndex(arr => arr.includes(pixel));
			const col = currentDisplay[row].indexOf(pixel);
			const beforeColor = pixel.style.backgroundColor;
			console.log(currentDisplay[row][col],beforeColor);
			bucketBrill(row,col,mainColor);
		}
	});
	pixel.addEventListener("touchstart", (e) => {
        	e.preventDefault();
	        if (selectedTool === "bucket") {
			const row = currentDisplay.findIndex(arr => arr.includes(pixel));
			const col = currentDisplay[row].indexOf(pixel);
			const beforeColor = pixel.style.backgroundColor;
			console.log(currentDisplay[row][col],beforeColor);
			bucketBrill(row,col,mainColor);

	        }
	});
}

function bucketBrill(i, j, newColor) {
	let pixelQueue = [];
	let changedPixels = new Set();
	const origignalColor = currentDisplay[i][j].style.backgroundColor;
	console.log(origignalColor,"here",currentDisplay[i][j],i,j);
	if (origignalColor === newColor) {
		return;
	}
	pixelQueue.push([i,j]);
	console.log(i,j);

	while (pixelQueue.length != 0) {
		let currentPixelCords = pixelQueue.shift();
		i = currentPixelCords[0];
		j = currentPixelCords[1];

		currentDisplay[i][j].style.backgroundColor = newColor;
		changedPixels.add(`${i};${j}`);

		if (i-1 >= 0 && currentDisplay[i-1][j].style.backgroundColor === origignalColor && !changedPixels.has(`${i-1};${j}`)) {
			pixelQueue.push([i-1,j]);
			changedPixels.add(`${i-1};${j}`);
		} 
		if (j+1 < displayRes[1] && currentDisplay[i][j+1].style.backgroundColor === origignalColor && !changedPixels.has(`${i};${j+1}`)) {
			pixelQueue.push([i,j+1]);
			changedPixels.add(`${i};${j+1}`);
		}
		if (j-1 >= 0 && currentDisplay[i][j-1].style.backgroundColor === origignalColor && !changedPixels.has(`${i};${j-1}`)) {
			pixelQueue.push([i,j-1]);
			changedPixels.add(`${i};${j-1}`);
		}
		if (i+1 < displayRes[0] && currentDisplay[i+1][j].style.backgroundColor === origignalColor && !changedPixels.has(`${i+1};${j}`)) {
			pixelQueue.push([i+1,j]);
			changedPixels.add(`${i+1};${j}`);
		}
	}
}

function displayConstructor(displayRes) {
	display.innerHTML = "";
	selectedTool = "brush";
	currentDisplay = [];
	currentDisplayColor = [];
	eventSequencePos = -1;
	eventSequence = [];
	background_color = "rgba(255, 255, 255, 0)";
	mainColor = "rgba(0, 0, 0, 1)";
	mousehold = false;

	for (let i = 0; i < displayRes[0]; i++){
		for (let j = 0; j < displayRes[1]; j++){
			currentDisplayColor.push([i,j,background_color]);
		}
	} eventSequence.push(currentDisplayColor); eventSequencePos += 1;
	currentDisplayColor = [];
	for(let i = 0; i < displayRes[0]; i++){
		const currentRow = [];
		const row = document.createElement('div');
		row.setAttribute("style","display: flex;")
		row.setAttribute("dragable", false);
		row.addEventListener("mouseup", () => {mousehold = false});
		currentDisplay.push(currentRow);
		display.append(row);
		for(let j = 0; j < displayRes[1]; j++){
			const pixel = createPixel(i,j);
			currentRow.push(pixel);
			row.append(pixel);
			brushEventsPixel(pixel);
			bucketEventsPixel(pixel);
			removerEventsPixel(pixel);
			pipetteEventPixel(pixel);
			pixel.addEventListener("mouseup", () => {
				if (eventSequence.length - 1 > eventSequencePos) {
					for (let i = eventSequence.length - 1; i > eventSequencePos; i--){
						eventSequence.splice(i,1);
					}
				}
				for (let i = 0; i < displayRes[0]; i++){
					for (let j = 0; j < displayRes[1]; j++){
						currentDisplayColor.push([i,j,currentDisplay[i][j].style.backgroundColor]);
					}
				}
				if (JSON.stringify(eventSequence[eventSequencePos]) != JSON.stringify(currentDisplayColor)) {
					eventSequence.push(currentDisplayColor); eventSequencePos += 1;
					console.log("currentDisplayColor was created", eventSequencePos);
				}
				currentDisplayColor = [];
			});
		}	
	} displayEvents();
}

let settingsWidjetOpen = false;
let settingsButtonShown = true;
settings.addEventListener('click', () => {
	if (settingsWidjetOpen){
		settingsWidjet.style.display = "none";
		settings.style.display = "flex";
		settingsButtonShown = true;
		settingsWidjetOpen = false;
	} else {
		settingsWidjet.style.display = "flex";
		settings.style.display = "none";
		settingsButtonShown = false;
		settingsWidjetOpen = true;
	}
});

displayHeight.addEventListener('mousemove', (e) => {
	console.log(displayHeight.value);
	displayHeightValue.textContent = displayHeight.value;
});

displayWidth.addEventListener('mousemove', (e) => {
	console.log(displayWidth.value);
	displayWidthValue.textContent = displayWidth.value;
});

choseDisplayResButton.addEventListener('click', () => {
	displayRes[0] = displayHeight.value;
	displayRes[1] = displayWidth.value;
	settingsWidjet.style.display = "none";
	settings.style.display = "flex";
	settingsButtonShown = true;
	settingsWidjetOpen = false;
	displayConstructor(displayRes);
});

clear.addEventListener('click', () => {
	display.dispatchEvent(clearEvent);	
});

brush.addEventListener('click', () => {
	selectedTool = "brush";
});

bucket.addEventListener('click', () => {
	console.log("bucket");
	selectedTool = "bucket";
});

pipette.addEventListener('click', () => {
	selectedTool = "pipette";
});

remover.addEventListener('click', () => {
	selectedTool = "remover";
});

function handleUndoClick() {
  if(eventSequencePos > 0) {
    eventSequencePos -= 1;
    painDisplay(eventSequencePos);
  }
}

function handleUndoTouch(e) {
  e.preventDefault();
  console.log("hello");
  if(eventSequencePos > 0) {
    eventSequencePos -= 1;
    painDisplay(eventSequencePos);
  }
}

function handleRedoClick() {
  if (eventSequencePos < eventSequence.length-1) {
    eventSequencePos += 1;
    painDisplay(eventSequencePos);
  }
}

function handleRedoTouch(e) {
  e.preventDefault();
  if (eventSequencePos < eventSequence.length-1) {
    eventSequencePos += 1;
    painDisplay(eventSequencePos);
  }
}

undo.addEventListener('click', handleUndoClick);
redo.addEventListener('click', handleRedoClick);

mobileMode.addEventListener("change", (e) => {
  undo.removeEventListener('click', handleUndoClick);
  undo.removeEventListener('touchstart', handleUndoTouch);
  
  redo.removeEventListener('click', handleRedoClick);
  redo.removeEventListener('touchstart', handleRedoTouch);
  
  if (mobileMode.checked) {
    undo.addEventListener('touchstart', handleUndoTouch);
    redo.addEventListener('touchstart', handleRedoTouch);
  } else {
    undo.addEventListener('click', handleUndoClick);
    redo.addEventListener('click', handleRedoClick);
  }
});

let paleteWidjetOpen = false;
palet.addEventListener('click', () => {
	if (paleteWidjetOpen){
		console.log("paleteWidjetFalse")
		paleteWidjet.style.display = "none";
		paleteWidjetOpen = false;
	} else {	
		chousenColor.dispatchEvent(sliderValueChanged);
		paleteWidjet.style.display = "flex";
		paleteWidjetOpen = true;
	}	
});

redSlider.addEventListener('touchmove', (e) => {
	console.log(redSlider.value);
	chousenColor.dispatchEvent(sliderValueChanged);
});

greenSlider.addEventListener('touchmove', (e) => {
	console.log(greenSlider.value);
	chousenColor.dispatchEvent(sliderValueChanged);
});

blueSlider.addEventListener('touchmove', (e) => {
	console.log(blueSlider.value);
	chousenColor.dispatchEvent(sliderValueChanged);
});

opacitySlider.addEventListener('touchmove', (e) => {
	console.log(opacitySlider.value);
	chousenColor.dispatchEvent(sliderValueChanged);
});

choseButton.addEventListener('click', () => {
	paleteWidjet.style.display = "none";
	paleteWidjetOpen = false;
	chousenColor.dispatchEvent(sliderValueChanged);
});

redSlider.addEventListener('touchend', (e) => {
	console.log(redSlider.value);
	chousenColor.dispatchEvent(sliderValueChanged);
});

greenSlider.addEventListener('touchend', (e) => {
	console.log(greenSlider.value);
	chousenColor.dispatchEvent(sliderValueChanged);
});

blueSlider.addEventListener('touchend', (e) => {
	console.log(blueSlider.value);
	chousenColor.dispatchEvent(sliderValueChanged);
});

opacitySlider.addEventListener('touchend', (e) => {
	console.log(opacitySlider.value);
	chousenColor.dispatchEvent(sliderValueChanged);
});

redSlider.addEventListener('mousemove', (e) => {
	console.log(redSlider.value);
	chousenColor.dispatchEvent(sliderValueChanged);
});

greenSlider.addEventListener('mousemove', (e) => {
	console.log(greenSlider.value);
	chousenColor.dispatchEvent(sliderValueChanged);
});

blueSlider.addEventListener('mousemove', (e) => {
	console.log(blueSlider.value);
	chousenColor.dispatchEvent(sliderValueChanged);
});

opacitySlider.addEventListener('mousemove', (e) => {
	console.log(opacitySlider.value);
	chousenColor.dispatchEvent(sliderValueChanged);
});

let sliderValueChanged = new Event("sliderValueChanged");
chousenColor.addEventListener('sliderValueChanged', () => {
	chousenColor.setAttribute('style',`background-color: rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value}, ${(opacitySlider.value)/100});`);
});

choseButton.addEventListener('click', () => {
	mainColor = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value}, ${(opacitySlider.value)/100})`;
});

function saveToPNG() {
	const canvas = document.createElement("canvas");
	canvas.width = displayRes[1];
	canvas.height = displayRes[0];
	const ctx = canvas.getContext("2d");
	const imageData = ctx.createImageData(displayRes[1], displayRes[0]);

	displayPixelsIds = display.querySelectorAll(".pixel");
	console.log(displayPixelsIds)
	for (let i = 0; i < displayPixelsIds.length; i++){
		const pixel = document.getElementById(displayPixelsIds[i].id);
		console.log(pixel);
		const rgba = parseColorString(pixel);

		const offset = i * 4;
		imageData.data[offset] = rgba.r;
		imageData.data[offset + 1] = rgba.g;
		imageData.data[offset + 2] = rgba.b;
		imageData.data[offset + 3] = rgba.a;
	}

	ctx.putImageData(imageData, 0, 0);
	const pngUrl = canvas.toDataURL("image/png");
	const link = document.createElement("a");
	link.href = pngUrl;
	link.download = "pixel-art.png";
	link.click();	
}

function parseColorString(pixel) {
	const computedColor = getComputedStyle(pixel).backgroundColor;
	console.log(computedColor);
	const rgbaMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
	if (rgbaMatch) {
		return {
			r: parseInt(rgbaMatch[1]),
			g: parseInt(rgbaMatch[2]),
			b: parseInt(rgbaMatch[3]),
			a: rgbaMatch[4] ? Math.round(parseFloat(rgbaMatch[4])*255) : 255
		};
	}
	return {r: 0, g: 0, b: 0, a: 0};
}

saveButton.addEventListener('click', () => {
	saveToPNG();
});

displayConstructor(displayRes);


import { initWhiteboard } from './dm';  
import { setupButton } from './dm';     

document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector<HTMLDivElement>("#app");
  
  if (app) {
    app.innerHTML = '';

    app.innerHTML = `
      <div>
        <div class="card">
          <button id="counter" type="button">Start</button>
        </div>

        <!-- Color and Action Buttons (Bigger buttons with custom styles) -->
        <div id="select">
          <button id="redButton" class="color-button" style="background-color: red; color: white;">Red</button>
          <button id="greenButton" class="color-button" style="background-color: green; color: white;">Green</button>
          <button id="blueButton" class="color-button" style="background-color: blue; color: white;">Blue</button>
          <button id="blackButton" class="color-button" style="background-color: black; color: white;">Black</button>
          <button id="yellowButton" class="color-button" style="background-color: yellow; color: white;">Yellow</button>
          <button id="brownButton" class="color-button" style="background-color: brown; color: white;">Brown</button>

          <button id="eraseButton" class="color-button" style="background-color: white; color: black;">Erase</button>

          <button id="clearButton" class="color-button" style="background-color: gray; color: white;">Clear</button>
          <button id="undoButton" class="color-button" style="background-color: orange; color: white;">Undo</button>
        </div>

        <!-- Whiteboard Canvas -->
        <div id="whiteboard">
          <canvas id="paint"></canvas>
        </div>
      </div>
    `; 

    initWhiteboard();
    setupButton(document.querySelector<HTMLButtonElement>("#counter")!);
  }
});

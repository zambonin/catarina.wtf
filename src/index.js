import { cities } from './data.js';
import { getDistanceAndDirection } from './geo.js';

let BULLSEYE = Math.floor(Math.random() * cities.length);
const GUESS_INPUT = document.querySelector("input[id='hy']");

window.onload = () => {
  document.querySelector("#city")
    .setAttribute("src", `static/geo/${cities[BULLSEYE].code}.svg`);
}

horsey(GUESS_INPUT, { source: [{ list: cities.map(c => c.name) }], limit: 5 });

let maxGuesses = 6;

const processGuess = (e) => {
  const city = e.target.value;
  if (e.key != "Enter" || city === '')
    return;

  const guess = cities.filter(c => city === c.name)[0];
  const target = cities[BULLSEYE];

  if (guess === undefined)
    return;

  if (guess === target) {
    addTry(city, "false");
    finishGuessBox("Parabéns, você acertou!");
    return;
  }

  if (guess !== target) {
    const [distance, direction] = getDistanceAndDirection(guess, target);
    const msg = `${city} (${direction} ${distance.toFixed(2)} km)`;

    addTry(msg, "true");
    --maxGuesses;

    GUESS_INPUT.setAttribute("placeholder",
        `Você tem mais ${maxGuesses} tentativa(s).`);
    GUESS_INPUT.value = "";
  }

  if (maxGuesses == 0) {
    finishGuessBox(`O município correto era ${target.name}.`);
  }
}

const addTry = (msg, isInvalid) => {
  const item = document.createElement("input");
  item.setAttribute("type", "text");
  item.setAttribute("placeholder", msg);
  item.setAttribute("disabled", "true");
  item.setAttribute("aria-invalid", isInvalid);
  document.querySelector("#tries").appendChild(item);
}

const finishGuessBox = (msg) => {
  GUESS_INPUT.setAttribute("placeholder", msg);
  GUESS_INPUT.setAttribute("disabled", "true");
  GUESS_INPUT.value = "";
}

GUESS_INPUT.addEventListener("keyup", processGuess);

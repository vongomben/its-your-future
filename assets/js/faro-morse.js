/**
 * Faro Morse — Accademia Digitale landing.
 * Messaggio modificabile solo qui.
 */
(function () {
  const MORSE = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    0: "-----",
    1: ".----",
    2: "..---",
    3: "...--",
    4: "....-",
    5: ".....",
    6: "-....",
    7: "--...",
    8: "---..",
    9: "----.",
    ".": ".-.-.-",
    "'": ".----.",
  };

  const MESSAGE = "OGNI ROTTA INIZIA DA UN'ISTRUZIONE";
  const UNIT = 210;

  const flare = document.getElementById("iyf-faro-flare");
  const scene = document.getElementById("iyf-faro-scene");
  const morseLive = document.getElementById("iyf-faro-morse");
  const decodedBox = document.getElementById("iyf-faro-decoded");
  const decodedText = document.getElementById("iyf-faro-decoded-text");
  const hint = document.getElementById("iyf-faro-hint");

  if (!flare || !scene || !morseLive || !decodedBox || !decodedText || !hint) return;

  const currentMessage = MESSAGE.trim().toUpperCase();
  const currentMorse = toMorse(currentMessage);
  let revealed = false;

  function toMorse(text) {
    return text
      .toUpperCase()
      .split("")
      .map(function (ch) {
        if (ch === " ") return "/";
        return MORSE[ch] || "";
      })
      .filter(function (x) {
        return x !== "";
      })
      .join(" ");
  }

  function sleep(ms) {
    return new Promise(function (res) {
      setTimeout(res, ms);
    });
  }

  function light(on) {
    flare.classList.toggle("is-lit", on);
  }

  async function playSequence(morse) {
    const symbols = morse.split(" ");
    for (let i = 0; i < symbols.length; i++) {
      const sym = symbols[i];
      if (sym === "/") {
        morseLive.textContent += "   ";
        await sleep(UNIT * 7);
        continue;
      }
      for (let s = 0; s < sym.length; s++) {
        const isDash = sym[s] === "-";
        light(true);
        morseLive.textContent += isDash ? "−" : "·";
        await sleep(isDash ? UNIT * 3 : UNIT);
        light(false);
        await sleep(UNIT);
      }
      morseLive.textContent += " ";
      await sleep(UNIT * 2);
    }
  }

  async function loop() {
    while (true) {
      morseLive.textContent = "";
      await playSequence(currentMorse);
      await sleep(3000);
      morseLive.textContent = "";
      await sleep(UNIT * 4);
    }
  }

  function revealPanel() {
    revealed = true;
    decodedText.textContent = currentMessage;
    hint.style.opacity = "0";
    decodedBox.hidden = false;
    decodedBox.classList.add("is-show");
    scene.setAttribute("aria-pressed", "true");
  }

  function hidePanel() {
    revealed = false;
    hint.style.opacity = "1";
    decodedBox.classList.remove("is-show");
    decodedBox.hidden = true;
    scene.setAttribute("aria-pressed", "false");
  }

  function toggle() {
    if (revealed) hidePanel();
    else revealPanel();
  }

  scene.addEventListener("click", toggle);
  scene.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  });

  loop();
})();

(function () {
  const APP_VERSION = "0.1.4";
  const DURATION_MS = 5 * 60 * 1000;
  const stations = window.STATIONS;
  const storage = window.GameStorage;

  const el = {
    start: document.getElementById("screen-start"),
    play: document.getElementById("screen-play"),
    end: document.getElementById("screen-end"),
    btnStart: document.getElementById("btn-start"),
    btnResume: document.getElementById("btn-resume"),
    btnLast: document.getElementById("btn-last"),
    lastResult: document.getElementById("last-result"),
    btnRestart: document.getElementById("btn-restart"),
    btnReplay: document.getElementById("btn-replay"),
    timer: document.getElementById("timer"),
    dots: document.getElementById("progress-dots"),
    stationArt: document.getElementById("station-art"),
    stationTitle: document.getElementById("station-title"),
    stationIndex: document.getElementById("station-index"),
    stationContext: document.getElementById("station-context"),
    stationBody: document.getElementById("station-body"),
    feedback: document.getElementById("feedback"),
    btnCheck: document.getElementById("btn-check"),
    endKicker: document.getElementById("end-kicker"),
    endTitle: document.getElementById("end-title"),
    endLead: document.getElementById("end-lead"),
    endList: document.getElementById("end-list"),
  };

  let state = null;
  let tickId = null;
  let matchAssign = {};
  let selectedPiece = null;
  let orderIds = [];

  function defaultState() {
    return {
      screen: "start",
      stationIndex: 0,
      completed: [],
      learned: [],
      endsAt: null,
      startedAt: null,
      finishedAt: null,
      outcome: null,
      order: {},
    };
  }

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function idsFor(station) {
    if (!state.order) state.order = {};
    if (!state.order[station.id]) {
      let ids = shuffle(station.options.map((o) => o.id));
      if (station.type === "reorder" && ids.join() === station.correct.join() && ids.length > 1) {
        [ids[0], ids[ids.length - 1]] = [ids[ids.length - 1], ids[0]];
      }
      state.order[station.id] = ids;
      persist();
    }
    return state.order[station.id];
  }

  function optionsInOrder(station) {
    const byId = Object.fromEntries(station.options.map((o) => [o.id, o]));
    return idsFor(station).map((id) => byId[id]);
  }

  function persist() {
    storage.save(state);
  }

  function remainingMs() {
    if (!state.endsAt) return DURATION_MS;
    return Math.max(0, state.endsAt - Date.now());
  }

  function formatTime(ms) {
    const s = Math.ceil(ms / 1000);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }

  function showScreen(name) {
    el.start.hidden = name !== "start";
    el.play.hidden = name !== "play";
    el.end.hidden = name !== "end";
    el.timer.hidden = name !== "play";
    document.body.dataset.screen = name;
  }

  function renderTimer() {
    const left = remainingMs();
    el.timer.textContent = formatTime(left);
    el.timer.classList.toggle("is-low", left <= 60 * 1000);
    el.timer.classList.toggle("is-up", left <= 0);
  }

  function renderDots() {
    el.dots.innerHTML = "";
    stations.forEach((st, i) => {
      const d = document.createElement("span");
      d.className = "dot";
      if (state.completed.includes(st.id)) d.classList.add("is-done");
      else if (i === state.stationIndex) d.classList.add("is-now");
      d.title = st.title;
      el.dots.appendChild(d);
    });
  }

  function setFeedback(kind, text) {
    el.feedback.hidden = !text;
    el.feedback.className = `feedback feedback--${kind || "info"}`;
    el.feedback.textContent = text || "";
  }

  function currentStation() {
    return stations[state.stationIndex];
  }

  function renderChoice(station) {
    const list = document.createElement("div");
    list.className = "choices";
    const letters = ["A", "B", "C", "D", "E", "F"];
    optionsInOrder(station).forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.dataset.id = opt.id;
      btn.innerHTML = `<span class="choice__id">${letters[i]}</span><span>${opt.text}</span>`;
      btn.addEventListener("click", () => {
        list.querySelectorAll(".choice").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        setFeedback("", "");
      });
      list.appendChild(btn);
    });
    el.stationBody.appendChild(list);
    el.btnCheck.hidden = false;
  }

  function renderMatch(station) {
    matchAssign = {};
    selectedPiece = null;
    const wrap = document.createElement("div");
    wrap.className = "match";

    const pieces = document.createElement("div");
    pieces.className = "match__pieces";
    const hint = document.createElement("p");
    hint.className = "match__hint";
    hint.textContent = "Tocca un dato, poi tocca la colonna. Oppure trascinalo.";
    pieces.appendChild(hint);

    optionsInOrder(station).forEach((opt) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.draggable = true;
      chip.dataset.id = opt.id;
      chip.textContent = opt.text;
      chip.addEventListener("click", () => {
        pieces.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-selected"));
        selectedPiece = opt.id;
        chip.classList.add("is-selected");
      });
      chip.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", opt.id);
        selectedPiece = opt.id;
      });
      pieces.appendChild(chip);
    });

    const slots = document.createElement("div");
    slots.className = "match__slots";
    station.options.forEach((opt) => {
      const slot = document.createElement("div");
      slot.className = "slot";
      slot.dataset.slot = opt.id;
      slot.innerHTML = `<span class="slot__label">${opt.slotLabel}</span><span class="slot__value">—</span>`;
      const place = () => {
        if (!selectedPiece) return;
        Object.keys(matchAssign).forEach((k) => {
          if (matchAssign[k] === opt.id) delete matchAssign[k];
        });
        matchAssign[selectedPiece] = opt.id;
        selectedPiece = null;
        pieces.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-selected"));
        refreshMatchSlots(station, slots);
        setFeedback("", "");
      };
      slot.addEventListener("click", place);
      slot.addEventListener("dragover", (e) => e.preventDefault());
      slot.addEventListener("drop", (e) => {
        e.preventDefault();
        selectedPiece = e.dataTransfer.getData("text/plain");
        place();
      });
      slots.appendChild(slot);
    });

    wrap.append(pieces, slots);
    el.stationBody.appendChild(wrap);
    el.btnCheck.hidden = false;
  }

  function refreshMatchSlots(station, slotsRoot) {
    const byId = Object.fromEntries(station.options.map((o) => [o.id, o]));
    slotsRoot.querySelectorAll(".slot").forEach((slot) => {
      const pieceId = Object.keys(matchAssign).find((k) => matchAssign[k] === slot.dataset.slot);
      const value = slot.querySelector(".slot__value");
      slot.classList.toggle("is-filled", Boolean(pieceId));
      value.textContent = pieceId ? byId[pieceId].text : "—";
    });
  }

  function renderReorder(station) {
    orderIds = idsFor(station).slice();
    const list = document.createElement("ol");
    list.className = "reorder";

    function paint() {
      list.innerHTML = "";
      orderIds.forEach((id, i) => {
        const opt = station.options.find((o) => o.id === id);
        const li = document.createElement("li");
        li.className = "reorder__item";
        li.innerHTML = `
          <span class="reorder__text">${opt.text.replace(/^\d+\.\s*/, "")}</span>
          <span class="reorder__btns">
            <button type="button" class="icon-btn" data-dir="-1" aria-label="Sposta su">▲</button>
            <button type="button" class="icon-btn" data-dir="1" aria-label="Sposta giù">▼</button>
          </span>`;
        li.querySelectorAll(".icon-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const dir = Number(btn.dataset.dir);
            const j = i + dir;
            if (j < 0 || j >= orderIds.length) return;
            [orderIds[i], orderIds[j]] = [orderIds[j], orderIds[i]];
            paint();
            setFeedback("", "");
          });
        });
        list.appendChild(li);
      });
    }

    paint();
    el.stationBody.appendChild(list);
    el.btnCheck.hidden = false;
  }

  function renderStation() {
    const station = currentStation();
    if (!station) return;
    el.stationIndex.textContent = `Stazione ${state.stationIndex + 1} di ${stations.length}`;
    if (station.image) {
      el.stationArt.hidden = false;
      el.stationArt.src = station.image;
      el.stationArt.alt = station.imageAlt || "";
    } else {
      el.stationArt.hidden = true;
      el.stationArt.removeAttribute("src");
    }
    el.stationTitle.textContent = station.title;
    el.stationContext.textContent = station.context;
    el.stationBody.innerHTML = "";
    el.btnCheck.hidden = true;
    setFeedback("", "");
    renderDots();

    if (station.type === "choice") renderChoice(station);
    else if (station.type === "match") renderMatch(station);
    else if (station.type === "reorder") renderReorder(station);
  }

  function checkAnswer() {
    const station = currentStation();
    let ok = false;

    if (station.type === "choice") {
      const selected = el.stationBody.querySelector(".choice.is-selected");
      if (!selected) {
        setFeedback("info", "Scegli un’opzione, poi conferma.");
        return;
      }
      ok = selected.dataset.id === station.correct;
    }

    if (station.type === "match") {
      const ids = station.options.map((o) => o.id);
      if (ids.some((id) => !matchAssign[id])) {
        setFeedback("info", "Metti ogni dato in una colonna, poi conferma.");
        return;
      }
      ok = ids.every((id) => matchAssign[id] === station.correct[id]);
    }

    if (station.type === "reorder") {
      ok = orderIds.join() === station.correct.join();
    }

    if (!ok) {
      setFeedback("fail", station.failMessage);
      return;
    }

    if (!state.completed.includes(station.id)) state.completed.push(station.id);
    if (!state.learned.includes(station.successMessage)) {
      state.learned.push(station.successMessage);
    }
    persist();
    setFeedback("ok", station.successMessage);

    window.setTimeout(() => {
      if (state.screen !== "play") return;
      if (state.stationIndex >= stations.length - 1) {
        finish("success");
      } else {
        state.stationIndex += 1;
        persist();
        renderStation();
      }
    }, 1400);
  }

  function finish(outcome) {
    if (state.screen === "end") return;
    state.screen = "end";
    state.outcome = outcome;
    state.finishedAt = Date.now();
    persist();
    stopTick();

    const elapsedSeconds = state.startedAt
      ? Math.round((state.finishedAt - state.startedAt) / 1000)
      : 0;
    const result = {
      outcome,
      stationsCompleted: state.completed.slice(),
      elapsedSeconds,
      remainingSeconds: Math.round(remainingMs() / 1000),
      startedAt: state.startedAt,
      finishedAt: state.finishedAt,
    };
    window.onGameComplete(result);
    renderEnd();
    showScreen("end");
  }

  function renderEnd() {
    const ok = state.outcome === "success";
    document.body.classList.toggle("is-success", ok);
    document.body.classList.toggle("is-fail", !ok);
    el.endKicker.textContent = ok ? "build 1.0.0" : "build failed";
    el.endTitle.textContent = ok ? "Deploy completato!" : "Tempo scaduto";
    el.endLead.textContent = ok
      ? "L’app per prenotare i laboratori è online, i dati sono in ordine e gli input vengono controllati. Hai fatto il giro da pulsante a cloud."
      : "La build non è partita in tempo. Niente panico: le stazioni restano, puoi riprovare e rivedere cosa fa ogni pezzo dell’app.";
    el.endList.innerHTML = "";
    const learned =
      state.learned.length > 0
        ? state.learned
        : [
            "Il front-end collega ciò che tocchi alle azioni.",
            "Il back-end riceve le richieste e parla con i dati.",
            "Il database tiene le informazioni in colonne chiare.",
            "Ogni testo che arriva da fuori va controllato.",
            "Prima di pubblicare: testi, prepari, poi fai il deploy.",
          ];
    learned.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      el.endList.appendChild(li);
    });
  }

  function startTick() {
    stopTick();
    const loop = () => {
      renderTimer();
      if (state.screen === "play" && remainingMs() <= 0) {
        finish("timeout");
        return;
      }
      tickId = window.requestAnimationFrame(loop);
    };
    tickId = window.requestAnimationFrame(loop);
  }

  function stopTick() {
    if (tickId) window.cancelAnimationFrame(tickId);
    tickId = null;
  }

  function startFresh() {
    storage.clear();
    state = defaultState();
    state.screen = "play";
    state.startedAt = Date.now();
    state.endsAt = state.startedAt + DURATION_MS;
    persist();
    showScreen("play");
    renderStation();
    startTick();
  }

  function resume() {
    state.screen = "play";
    persist();
    showScreen("play");
    renderStation();
    startTick();
  }

  function showLastEnd() {
    renderEnd();
    showScreen("end");
  }

  function paintStart() {
    const canResume =
      state.screen === "play" &&
      state.endsAt &&
      Date.now() < state.endsAt &&
      state.completed.length < stations.length;
    const hasEnd = state.outcome === "success" || state.outcome === "timeout";

    el.btnResume.hidden = !canResume;
    el.btnLast.hidden = !hasEnd;
    if (hasEnd && el.lastResult) {
      el.lastResult.hidden = false;
      el.lastResult.textContent =
        state.outcome === "success"
          ? "Ultimo turno: deploy completato. Puoi ricominciare o rivedere l’esito."
          : "Ultimo turno: tempo scaduto. Puoi riprovare o rivedere l’esito.";
    } else if (el.lastResult) {
      el.lastResult.hidden = true;
    }
    showScreen("start");
  }

  function boot() {
    const ver = document.getElementById("app-version");
    if (ver) ver.textContent = `v${APP_VERSION}`;

    const saved = storage.load();
    state = saved && saved.screen ? saved : defaultState();

    if (state.screen === "play" && state.endsAt && Date.now() >= state.endsAt && !state.outcome) {
      state.outcome = "timeout";
      state.screen = "end";
      state.finishedAt = Date.now();
      persist();
    }

    paintStart();

    el.btnStart.addEventListener("click", startFresh);
    el.btnResume.addEventListener("click", resume);
    el.btnLast.addEventListener("click", showLastEnd);
    el.btnRestart.addEventListener("click", startFresh);
    el.btnReplay.addEventListener("click", startFresh);
    el.btnCheck.addEventListener("click", checkAnswer);
  }

  boot();
})();

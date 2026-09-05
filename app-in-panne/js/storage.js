(function (global) {
  const KEY = "app-in-panne-v1";

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* private mode / quota: il gioco continua senza persistenza */
    }
  }

  function clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }

  global.GameStorage = { load, save, clear };
})(window);

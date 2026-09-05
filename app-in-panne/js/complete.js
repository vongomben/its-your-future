/**
 * Punto unico di fine partita.
 * Oggi: solo client. Domani: qui si potrà mandare il risultato a PocketBase (o altro).
 *
 * @param {{
 *   outcome: "success" | "timeout",
 *   stationsCompleted: string[],
 *   elapsedSeconds: number,
 *   remainingSeconds: number,
 *   startedAt: number,
 *   finishedAt: number
 * }} result
 */
function onGameComplete(result) {
  // Hook futuro: es. await pb.collection("partite").create(result)
  console.info("onGameComplete", result);
}

window.onGameComplete = onGameComplete;

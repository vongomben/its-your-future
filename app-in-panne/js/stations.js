/**
 * Contenuti delle 5 stazioni — App in panne
 * (niente stazione AI/copilota: il gioco si ferma al deploy)
 *
 * Header grafico opzionale per stazione:
 *   image: "asset/frontend.jpg"
 *   imageAlt: "Pulsante Prenota su un tablet"
 * Misura: 1200 × 400 px (rapporto 3:1). Su retina va bene anche 1800 × 600.
 * Formato: WebP o JPG, 80–150 KB. Soggetto al centro, niente testo piccolo.
 */
window.STATIONS = [
  {
    id: "frontend",
    title: "Riparare il front-end",
    image: "asset/frontend.jpg",
    imageAlt: "Tablet con il pulsante Prenota e un collegamento spezzato",
    context:
      "Il pulsante Prenota si vede benissimo, ma se lo tocchi non succede niente. L’interfaccia è ferma: manca il collegamento tra il click e quello che dovrebbe fare l’app.",
    type: "choice",
    options: [
      { id: "a", text: "Collegare il click del pulsante a una funzione del front-end" },
      { id: "b", text: "Cambiare solo il colore del pulsante, così sembra più cliccabile" },
      { id: "c", text: "Cancellare tutto il foglio di stile e ricominciare" },
      { id: "d", text: "Chiedere all’utente di scrivere «prenota» in una chat" },
    ],
    correct: "a",
    successMessage:
      "Giusto. Il front-end è la parte che vedi e tocchi: collega pulsanti, schermate e piccole azioni. Senza un evento click, il pulsante è solo un disegno.",
    failMessage:
      "Non ancora. Pensa a cosa succede quando tocchi Prenota: serve un’azione, non solo un cambio di aspetto.",
  },
  {
    id: "backend",
    title: "Collegare il back-end",
    image: "asset/backend.jpg",
    imageAlt: "Messaggio inviato dallo schermo che non arriva al server",
    context:
      "Ora il pulsante risponde: a schermo compare «prenotazione inviata». Però il server non tiene nulla. Manca la porta giusta verso il back-end, cioè la parte invisibile che applica le regole e salva i dati.",
    type: "choice",
    options: [
      { id: "a", text: "Mandare la prenotazione a un indirizzo API corretto (es. POST /prenotazioni)" },
      { id: "b", text: "Salvare il nome solo nella memoria dello schermo, senza server" },
      { id: "c", text: "Stampare la prenotazione e fotografarla" },
      { id: "d", text: "Nascondere il messaggio di errore e far finta che vada tutto bene" },
    ],
    correct: "a",
    successMessage:
      "Esatto. Il back-end riceve la richiesta, controlla le regole e parla con il database. L’API è l’indirizzo (e il modo) con cui front-end e back-end si parlano.",
    failMessage:
      "Riprova. Se i dati restano solo sullo schermo, al prossimo aggiornamento spariscono. Serve un passaggio verso il server.",
  },
  {
    id: "database",
    title: "Salvare i dati",
    image: "asset/database.jpg",
    imageAlt: "Schede da mettere nelle colonne di una tabella",
    context:
      "Il server è pronto, ma i dati sono in disordine. Trascina ogni informazione nella colonna giusta della tabella prenotazioni. Così poi si può cercare, filtrare e non mescolare i campi.",
    type: "match",
    options: [
      { id: "nome", text: "Giulia Rossi", slot: "nome", slotLabel: "nome" },
      { id: "lab", text: "Laboratorio robotica", slot: "laboratorio", slotLabel: "laboratorio" },
      { id: "data", text: "12 settembre", slot: "data", slotLabel: "data" },
      { id: "ora", text: "15:00–17:00", slot: "orario", slotLabel: "orario" },
    ],
    correct: {
      nome: "nome",
      lab: "lab",
      data: "data",
      ora: "ora",
    },
    successMessage:
      "Perfetto. Un database è una tabella ordinata: ogni colonna ha un significato. Così l’app può rispondere a domande tipo «chi è prenotato venerdì alle 15?».",
    failMessage:
      "Qualche campo è ancora nel posto sbagliato. Ogni informazione ha la sua colonna: nome, laboratorio, data, orario.",
  },
  {
    id: "sicurezza",
    title: "Bug di sicurezza",
    image: "asset/sicurezza.jpg",
    imageAlt: "Uno scudo ferma un testo sospetto nel campo nome",
    context:
      "Qualcuno ha scritto nel campo Nome una riga strana, che sembra codice e non un cognome. Se la salvi così com’è, l’app potrebbe fare cose non previste. Cosa fai?",
    type: "choice",
    options: [
      { id: "a", text: "Controllare e pulire il testo prima di salvarlo (validare l’input)" },
      { id: "b", text: "Salvare comunque: tanto è solo un campo nome" },
      { id: "c", text: "Spegnere il sito per una settimana" },
      { id: "d", text: "Chiedere gentilmente di non farlo più, senza altri controlli" },
    ],
    correct: "a",
    successMessage:
      "Bravo. Tutto quello che arriva dall’esterno (form, link, file) va controllato. Validare significa: accetto solo ciò che mi aspetto, il resto lo blocco o lo pulisco.",
    failMessage:
      "Attenzione: fidarsi ciecamente di un campo compilato da fuori è rischioso. Serve un controllo prima di salvare.",
  },
  {
    id: "deploy",
    title: "Preparare il deploy",
    image: "asset/deploy.jpg",
    imageAlt: "Tre passi: prova, pacchetto, pubblicazione sul cloud",
    context:
      "In locale l’app funziona. Per farla usare agli studenti deve andare online. Metti i tre passi nell’ordine in cui li farebbe un team prima di pubblicare.",
    type: "reorder",
    options: [
      { id: "test", text: "1. Provare ancora (test): click, salvataggio, casi strani" },
      { id: "build", text: "2. Preparare la build: versione pulita, pronta per il server" },
      { id: "deploy", text: "3. Deploy: pubblicare su cloud o server e controllare l’indirizzo" },
    ],
    correct: ["test", "build", "deploy"],
    successMessage:
      "Ordine giusto. Testi, prepari il pacchetto, poi lo pubblichi. Il ciclo di vita del software non finisce «quando funziona sul mio computer».",
    failMessage:
      "L’ordine non torna. Prima ti assicuri che funzioni, poi prepari la versione da pubblicare, infine la metti online.",
  },
];

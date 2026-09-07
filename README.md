# IT'S YOUR FUTURE

Sito Jekyll del progetto [its-your-future.it](https://its-your-future.it/): percorsi ludico-didattici ITS per orientamento, open day e stand.

In produzione GitHub Pages compila da solo. In locale, su un PC Windows, serve Ruby e Jekyll.

## Avvio in locale su Windows

Servono circa 15 minuti la prima volta. Poi, per riaprire il sito, basta il punto 4.

### 1. Installa Ruby (con Devkit)

Jekyll è un programma Ruby: su Windows si installa con **RubyInstaller**.

1. Apri [https://rubyinstaller.org/downloads/](https://rubyinstaller.org/downloads/).
2. Scarica **Ruby+Devkit** per **x64** (64 bit). Va bene una 3.3 o 3.4. Non prendere la versione *senza* Devkit.
3. Avvia l’installer.
4. Lascia spuntata **Add Ruby executables to your PATH**.
5. All’ultimo schermo lascia spuntato l’avvio di **MSYS2 / ridk** e premi Fine.
6. Nel terminale nero che si apre, premi **Invio** (oppure scegli l’opzione *MSYS2 and MINGW development toolchain*). Attendi che finisca senza errori.

Chiudi tutte le finestre di terminale aperte. Se dopo `ruby -v` Windows non trova Ruby, **riavvia il PC** e riprova.

Verifica in **PowerShell** o **Prompt dei comandi**:

```powershell
ruby -v
gem -v
```

Deve comparire un numero di versione, non un errore. Se compare un avviso del Microsoft Store, disinstalla l’app Ruby dello Store e usa solo RubyInstaller: gli stub in `WindowsApps` non funzionano.

### 2. Installa Bundler

Bundler legge il `Gemfile` del sito e installa Jekyll nella versione giusta.

```powershell
gem install bundler
```

### 3. Installa le gemme del sito

Apri PowerShell, entra nella cartella del repository (quella che contiene `Gemfile` e `_config.yml`) e installa le dipendenze:

```powershell
cd percorso\verso\its-your-future
bundle install
```

La prima volta può richiedere qualche minuto. Se una gemma nativa fallisce, in un nuovo terminale esegui `ridk install` e poi di nuovo `bundle install`.

### 4. Avvia il sito

Dalla stessa cartella:

```powershell
bundle exec jekyll serve
```

Quando compare `Server address`, apri nel browser:

[http://127.0.0.1:4000/](http://127.0.0.1:4000/)

Per fermare il server: **Ctrl+C** nella finestra del terminale.

Per un indirizzo esplicitamente locale puoi usare anche:

```powershell
bundle exec jekyll serve --config _config.yml,_config_dev.yml
```

HTML e CSS di solito si aggiornano da soli dopo un salvataggio. Se cambi `_config.yml`, ferma il server e rilancialo.

## Problemi frequenti

| Sintomo | Cosa fare |
|---|---|
| `ruby` / `jekyll` / `bundle` non riconosciuto | Chiudi il terminale, aprine uno nuovo. Se persiste, riavvia Windows. Controlla che RubyInstaller abbia aggiunto Ruby al PATH. |
| Si apre il Microsoft Store | Non usare Ruby dello Store. Installa Ruby+Devkit da rubyinstaller.org. |
| Porta 4000 occupata | `bundle exec jekyll serve --port 4001` e apri http://127.0.0.1:4001/ |
| Il browser mostra una versione vecchia | Ctrl+F5. Se hai cambiato `_config.yml`, riavvia Jekyll. |
| `bundle install` si ferma su una gemma C | Esegui `ridk install` (Invio per le opzioni predefinite), poi di nuovo `bundle install`. |

Non serve WSL, Docker né un editor particolare: PowerShell e un browser sono sufficienti.

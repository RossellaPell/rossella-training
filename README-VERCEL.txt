ROSSELLA TRAINING - VERSIONE VERCEL + LOGIN + PWA

Questa versione NON contiene la password nel codice.
Configurare su Vercel, in Project > Settings > Environment Variables:

APP_USERNAME = (il nome utente scelto)
APP_PASSWORD = (la password scelta)
APP_AUTH_SECRET = una stringa casuale lunga (almeno 32 caratteri)

Applicare le variabili almeno a Production. Se vuoi usare anche i Preview deployment, abilitarle anche per Preview.
Dopo aver aggiunto/modificato le variabili, eseguire un Redeploy.

File principali:
- login.html: schermata di accesso
- api/login.js: verifica credenziali lato server
- api/session.js: verifica sessione
- api/logout.js: logout
- middleware.js: blocca le pagine se non autenticati
- manifest.webmanifest + sw.js + icone: installazione come PWA

NOTA DATI:
Calendario, carichi e storico restano salvati nel localStorage del singolo browser/dispositivo.
Il login protegge l'accesso alla web app, ma non sincronizza i dati tra dispositivi.

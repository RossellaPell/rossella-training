ROSSELLA TRAINING - NOTIFICHE PUSH

Questa versione invia una notifica alle 11:00 (Europe/Rome) solo nei giorni selezionati nel calendario.
La sequenza delle schede resta A -> B -> C in base ai giorni selezionati.

PRIMA DEL DEPLOY
1. Upstash Redis deve essere collegato al progetto Vercel.
2. Upstash QStash deve essere collegato allo stesso progetto.
3. Aggiungi in Vercel > Settings > Environment Variables:

   Key: VAPID_PRIVATE_KEY
   Value: G0gAROoMuyd8rLcnt2GzYR_EUGbMNZ45OlHslsRxpGQ
   Environment: Production and Preview

4. Le variabili gia esistenti devono restare:
   APP_USERNAME
   APP_PASSWORD
   APP_AUTH_SECRET

5. Dopo avere aggiunto VAPID_PRIVATE_KEY fai un nuovo Redeploy.

ATTIVAZIONE SU IPHONE
1. Installa Rossella Training nella schermata Home usando Safari.
2. Apri l'app dalla sua icona Home (non dalla scheda Safari).
3. Accedi.
4. Tocca "Attiva notifiche".
5. Consenti le notifiche quando iOS lo chiede.
6. Tocca "Prova notifica" per verificare subito.

La prima attivazione crea/aggiorna automaticamente in QStash una pianificazione giornaliera alle 11:00 Europe/Rome.
QStash chiamera il server ogni giorno; il server inviera la push solo se la data e presente nel calendario di allenamento.

const workouts = {
  A: {
    title: 'Gambe Compatte, Ali & Dorso Profondo', accent: 'green',
    wods: [
      {name:'WOD 1', meta:'3–4 giri · 60” a fine giro', exercises:[
        {id:'a-legpress', name:'Leg Press 45°', reps:'12 reps', tip:'Piedi uniti e bassi sulla pedana', video:'https://www.youtube.com/results?search_query=leg+press+45+esecuzione'},
        {id:'a-latinversa', name:'Lat Machine Presa Inversa', reps:'10–12 reps', tip:'Palmi verso il viso · 2” fermo al petto', video:'https://www.youtube.com/results?search_query=lat+machine+presa+inversa+esecuzione'}]},
      {name:'WOD 2', meta:'3–4 giri · 60” a fine giro', exercises:[
        {id:'a-adductor', name:'Adductor Machine', reps:'12–15 reps', tip:'2” fermo a gambe chiuse', video:'https://www.youtube.com/results?search_query=adductor+machine+esecuzione'},
        {id:'a-shoulderpress', name:'Shoulder Press Machine', reps:'10–12 reps', video:'https://www.youtube.com/results?search_query=shoulder+press+machine+esecuzione'}]},
      {name:'WOD 3', meta:'Core & drenaggio', exercises:[
        {id:'a-crunch', name:'Panca Crunch Reclinabile', reps:'12–15 reps', tip:'Abdominal Bench', video:'https://www.youtube.com/results?search_query=decline+bench+crunch+esecuzione'},
        {id:'a-finisher', name:'Finisher A', reps:'5 min totali', tip:'Tapis roulant in salita costante 3 min + gambe al muro 2 min', video:'https://www.youtube.com/results?search_query=legs+up+the+wall+exercise'}]}
    ]},
  B: {
    title:'Glutei Alti & Punto Vita', accent:'yellow',
    wods:[
      {name:'WOD 1', meta:'3–4 giri · 60” a fine giro', exercises:[
        {id:'b-hipthrust', name:'Hip Thrust Machine / Booty Builder', reps:'10–12 reps', video:'https://www.youtube.com/results?search_query=hip+thrust+machine+booty+builder+esecuzione'},
        {id:'b-pulley', name:'Pulley Basso Presa Larga', reps:'12 reps', tip:'Gomiti larghi all’ombelico · strizza le scapole', video:'https://www.youtube.com/results?search_query=seated+cable+row+wide+grip+esecuzione'}]},
      {name:'WOD 2', meta:'3–4 giri · 60” a fine giro', exercises:[
        {id:'b-abductor', name:'Abductor Machine', reps:'15 reps', tip:'Busto inclinato in avanti a 45°', video:'https://www.youtube.com/results?search_query=hip+abductor+machine+leaning+forward'},
        {id:'b-pushdown', name:'Pushdown Tricipiti con Corda', reps:'12–15 reps', tip:'Apri la corda verso l’esterno in basso', video:'https://www.youtube.com/results?search_query=rope+tricep+pushdown+esecuzione'}]},
      {name:'WOD 3', meta:'Core & drenaggio', exercises:[
        {id:'b-pallof', name:'Pallof Press ai Cavi', reps:'10–12 reps per lato', tip:'2” di tenuta a braccia tese', video:'https://www.youtube.com/results?search_query=pallof+press+esecuzione'},
        {id:'b-finisher', name:'Finisher B', reps:'5 min totali', tip:'Cyclette agile resistenza media 3 min + vacuum addominale a terra 2 min', video:'https://www.youtube.com/results?search_query=stomach+vacuum+exercise'}]}
    ]},
  C: {
    title:'Tono Gambe, Cavi & Drenaggio Linfatico', accent:'blue',
    wods:[
      {name:'WOD 1', meta:'3–4 giri · 60” a fine giro', exercises:[
        {id:'c-hyper', name:'Panca 45° focus glutei', reps:'12 reps', tip:'Schiena alta curva · punte aperte. Alternativa: Seated Leg Curl 12 reps', video:'https://www.youtube.com/results?search_query=45+degree+back+extension+glute+focus'},
        {id:'c-row', name:'Vertical Row Machine', reps:'10–12 reps', tip:'Presa neutra stretta · gomiti aderenti ai fianchi', video:'https://www.youtube.com/results?search_query=vertical+row+machine+neutral+grip'}]},
      {name:'WOD 2', meta:'3–4 giri · 60” a fine giro', exercises:[
        {id:'c-calf', name:'Calf alla Leg Press', reps:'15–20 reps', tip:'Avampiedi sul bordo inferiore · ginocchia sbloccate. Alternativa: Calf su step con manubrio 15/gamba', video:'https://www.youtube.com/results?search_query=leg+press+calf+raise+esecuzione'},
        {id:'c-facepull', name:'Face Pull ai Cavi Alti', reps:'12–15 reps', tip:'Tira alla fronte aprendo i gomiti', video:'https://www.youtube.com/results?search_query=face+pull+rope+esecuzione'}]},
      {name:'WOD 3', meta:'Addome basso & scarico', exercises:[
        {id:'c-legraise', name:'Sollevamento gambe su Panca Inclinata', reps:'10–12 reps', tip:'Incline Leg Raise', video:'https://www.youtube.com/results?search_query=incline+bench+leg+raise+esecuzione'},
        {id:'c-finisher', name:'Finisher C', reps:'6 min totali', tip:'Tapis roulant in piano 3 min + gambe al muro a farfalla 3 min', video:'https://www.youtube.com/results?search_query=butterfly+legs+up+wall+stretch'}]}
    ]}
};

const requestedSheet = new URLSearchParams(location.search).get('sheet');
let currentDay = ['A','B','C'].includes(requestedSheet) ? requestedSheet : (localStorage.getItem('gymCurrentDay') || 'A');
let session = JSON.parse(localStorage.getItem('gymCurrentSession') || '{}');
let sheetRounds = JSON.parse(localStorage.getItem('gymSheetRounds') || '{}');
let history = JSON.parse(localStorage.getItem('gymHistory') || '[]');
let trainingDays = JSON.parse(localStorage.getItem('gymTrainingDays') || '[]');
let calendarCursor = (()=>{ const d=new Date(); return new Date(d.getFullYear(),d.getMonth(),1); })();

const container = document.getElementById('workoutContainer');
const tabs = [...document.querySelectorAll('.day-tab')];

function todayLabel(){return new Intl.DateTimeFormat('it-IT',{day:'2-digit',month:'short',year:'numeric'}).format(new Date())}
function lastRecord(exerciseId){
  // Compatibile sia con il vecchio storico per esercizio sia con il nuovo storico per WOD.
  for (const r of [...history].reverse()) {
    if (Array.isArray(r.exercises)) {
      const ex = r.exercises.find(x => x.exerciseId === exerciseId && x.load);
      if (ex) return {...ex, date:r.date, timestamp:r.timestamp};
    } else if (r.exerciseId === exerciseId && r.load) {
      return r;
    }
  }
  return null;
}
function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

function dateKeyFromParts(y,m,d){
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function localDateKey(date=new Date()){
  return dateKeyFromParts(date.getFullYear(),date.getMonth(),date.getDate());
}
function assignedSheet(dateKey){
  const sorted=[...new Set(trainingDays)].sort();
  const idx=sorted.indexOf(dateKey);
  return idx<0 ? null : ['A','B','C'][idx%3];
}
function persistTrainingDays(){
  trainingDays=[...new Set(trainingDays)].sort();
  localStorage.setItem('gymTrainingDays',JSON.stringify(trainingDays));
  syncTrainingDaysToCloud();
}
function renderCalendar(){
  const grid=document.getElementById('calendarGrid');
  const label=document.getElementById('calendarMonthLabel');
  if(!grid||!label) return;
  const y=calendarCursor.getFullYear(), m=calendarCursor.getMonth();
  label.textContent=new Intl.DateTimeFormat('it-IT',{month:'long',year:'numeric'}).format(calendarCursor);
  const first=new Date(y,m,1);
  const offset=(first.getDay()+6)%7;
  const daysInMonth=new Date(y,m+1,0).getDate();
  const today=localDateKey();
  let html='';
  for(let i=0;i<offset;i++) html+='<button class="calendar-day empty" tabindex="-1"></button>';
  for(let d=1;d<=daysInMonth;d++){
    const key=dateKeyFromParts(y,m,d);
    const selected=trainingDays.includes(key);
    const sheet=selected?assignedSheet(key):'';
    const classes=['calendar-day'];
    if(selected) classes.push('selected');
    if(key===today) classes.push('today');
    if(key<today) classes.push('past');
    html+=`<button class="${classes.join(' ')}" type="button" data-calendar-date="${key}" aria-label="${d} ${label.textContent}${selected?`, scheda ${sheet}`:''}"><span class="day-num">${d}</span><span class="sheet-dot">${sheet}</span></button>`;
  }
  grid.innerHTML=html;
  grid.querySelectorAll('[data-calendar-date]').forEach(btn=>btn.addEventListener('click',()=>toggleTrainingDay(btn.dataset.calendarDate)));
  renderNextWorkout();
}
function toggleTrainingDay(key){
  const idx=trainingDays.indexOf(key);
  if(idx>=0){
    trainingDays.splice(idx,1);
    toast('Giorno di allenamento rimosso');
  }else{
    trainingDays.push(key);
    persistTrainingDays();
    toast(`Allenamento aggiunto · Scheda ${assignedSheet(key)}`);
  }
  persistTrainingDays();
  renderCalendar();
}
function renderNextWorkout(){
  const el=document.getElementById('nextWorkoutCard');
  if(!el) return;
  const today=localDateKey();
  const future=[...new Set(trainingDays)].sort().filter(k=>k>=today);
  if(!future.length){
    el.innerHTML='<div class="next-workout-empty">Seleziona un giorno sul calendario per programmare il prossimo allenamento.</div>';
    return;
  }
  const key=future[0], sheet=assignedSheet(key);
  const [y,m,d]=key.split('-').map(Number);
  const label=new Intl.DateTimeFormat('it-IT',{weekday:'short',day:'numeric',month:'long'}).format(new Date(y,m-1,d));
  el.innerHTML=`<div class="next-workout-copy"><small>PROSSIMO ALLENAMENTO</small><strong>${label} · Scheda ${sheet}</strong></div><button class="next-workout-sheet" type="button" data-open-sheet="${sheet}" aria-label="Apri scheda ${sheet}">${sheet}</button>`;
  el.querySelector('[data-open-sheet]').addEventListener('click',e=>{
    currentDay=e.currentTarget.dataset.openSheet;
    localStorage.setItem('gymCurrentDay',currentDay);
    render();
    document.querySelector('.section-kicker')?.scrollIntoView({behavior:'smooth',block:'start'});
  });
}

// Se oggi e un giorno di allenamento programmato, apri automaticamente
// la scheda assegnata dal calendario (A -> B -> C). Un eventuale parametro
// ?sheet=A/B/C nel link mantiene la precedenza.
const todayScheduledSheet = assignedSheet(localDateKey());
if (!requestedSheet && todayScheduledSheet) {
  currentDay = todayScheduledSheet;
  localStorage.setItem('gymCurrentDay', currentDay);
}

function render(){
  tabs.forEach(t=>t.classList.toggle('active', t.dataset.day===currentDay));
  const d=workouts[currentDay];
  let html=`<section class="day-hero card day-${currentDay}"><span class="badge ${d.accent}">SCHEDA ${currentDay}</span><h2>${d.title}</h2><p>${todayLabel()}</p></section><section class="rounds-card card"><div><span class="rounds-kicker">SEDUTA DI OGGI</span><h3>Giri completati</h3><p>Inserisci una sola volta il numero di giri svolti per l’intera scheda.</p></div><div class="rounds-input-wrap"><input id="sheetRoundsInput" inputmode="numeric" type="number" min="0" step="1" value="${esc(sheetRounds[currentDay]||'')}" placeholder="—"><span>GIRI</span></div></section>`;
  d.wods.forEach((wod,wi)=>{
    html+=`<section class="wod card"><div class="wod-head"><div class="wod-title"><span class="badge ${d.accent}">${wod.name}</span><h3>${wi<2?'Circuito':'Finale'}</h3></div><div class="wod-meta">${wod.meta}</div></div>`;
    wod.exercises.forEach(ex=>{
      const s=session[ex.id]||{}; const last=lastRecord(ex.id);
      html+=`<div class="exercise" data-id="${ex.id}"><div class="exercise-top"><div><h4>${ex.name}</h4><p class="reps">${ex.reps}</p></div><a class="video-link" href="${ex.video}" target="_blank" rel="noopener">▶ Video</a></div>${ex.tip?`<p class="tip">${ex.tip}</p>`:''}
      <div class="track-row single-load"><div class="field"><label>CARICO KG</label><input inputmode="decimal" data-field="load" value="${esc(s.load||'')}" placeholder="${last && last.load ? `Ultimo: ${esc(last.load)} kg` : '—'}"></div><button class="done-btn ${s.done?'done':''}" data-action="done">✓</button></div></div>`;
    });
    html+=`<div class="save-row"><button class="btn primary" data-action="save-wod" data-wod="${wi}">Salva ${wod.name}</button></div></section>`;
  });
  container.innerHTML=html; bindInputs(); renderHistory(); renderCalendar();
}

function bindInputs(){
  container.querySelectorAll('.exercise').forEach(el=>{
    const id=el.dataset.id; session[id]=session[id]||{};
    el.querySelectorAll('input').forEach(input=>input.addEventListener('input',()=>{session[id][input.dataset.field]=input.value; persistSession()}));
    el.querySelector('[data-action="done"]').addEventListener('click',e=>{session[id].done=!session[id].done;e.currentTarget.classList.toggle('done',session[id].done);persistSession()});
  });
  container.querySelectorAll('[data-action="save-wod"]').forEach(btn=>btn.addEventListener('click',()=>saveWod(Number(btn.dataset.wod))));
  const roundsInput=document.getElementById('sheetRoundsInput');
  if(roundsInput) roundsInput.addEventListener('input',()=>{sheetRounds[currentDay]=roundsInput.value;localStorage.setItem('gymSheetRounds',JSON.stringify(sheetRounds));});
}
function persistSession(){localStorage.setItem('gymCurrentSession',JSON.stringify(session))}
function saveWod(index){
  const wod=workouts[currentDay].wods[index];
  const now=new Date();
  const dateKey=new Intl.DateTimeFormat('sv-SE').format(now); // YYYY-MM-DD locale-safe
  const dateLabel=new Intl.DateTimeFormat('it-IT').format(now);
  const exercises=[];

  wod.exercises.forEach(ex=>{
    const s=session[ex.id]||{};
    if(s.load||s.done){
      exercises.push({
        exerciseId:ex.id,
        exercise:ex.name,
        load:s.load||'',
        done:!!s.done
      });
    }
  });

  if(!exercises.length){
    toast('Inserisci almeno un carico o completa un esercizio');
    return;
  }

  // Un solo record per giorno + scheda. I WOD vengono aggiornati dentro lo stesso blocco.
  let dayEntry=history.find(r=>r.type==='day-session' && r.day===currentDay && r.dateKey===dateKey);
  if(!dayEntry){
    dayEntry={
      type:'day-session',
      day:currentDay,
      date:dateLabel,
      dateKey,
      timestamp:now.toISOString(),
      rounds:sheetRounds[currentDay]||'',
      wods:[]
    };
    history.push(dayEntry);
  }
  dayEntry.timestamp=now.toISOString();
  dayEntry.rounds=sheetRounds[currentDay]||dayEntry.rounds||'';
  const wodData={name:wod.name,index,exercises};
  const existingWod=dayEntry.wods.findIndex(w=>w.index===index || w.name===wod.name);
  if(existingWod>=0) dayEntry.wods[existingWod]=wodData;
  else dayEntry.wods.push(wodData);
  dayEntry.wods.sort((a,b)=>(a.index??99)-(b.index??99));

  localStorage.setItem('gymHistory',JSON.stringify(history));

  // Dopo il salvataggio svuota i campi del WOD appena registrato.
  // Il carico appena salvato resta disponibile come placeholder tramite lastRecord().
  wod.exercises.forEach(ex=>{
    session[ex.id]={load:'',done:false};
  });
  persistSession();

  render();
  toast(`${wod.name} salvato · campi pronti per la prossima volta`);
}
function renderHistory(){
  const el=document.getElementById('historyContent');
  const title=document.getElementById('historyTitle');
  const lead=document.getElementById('historyLead');
  if(title) title.textContent=`Progressi Scheda ${currentDay}`;
  if(lead) lead.textContent=`Qui trovi solo gli allenamenti e i carichi salvati per la Scheda ${currentDay}.`;
  if(!history.length){
    el.innerHTML=`<div class="history-empty">Non hai ancora salvataggi per la Scheda ${esc(currentDay)}.</div>`;
    return;
  }

  // Normalizza anche lo storico delle versioni precedenti senza perdere i carichi.
  const dayMap=new Map();
  history.forEach((r,idx)=>{
    if(r.type==='day-session' && Array.isArray(r.wods)){
      const key=`${r.dateKey||r.date}-${r.day}`;
      if(!dayMap.has(key)) dayMap.set(key,{...r,wods:[...r.wods]});
      else {
        const target=dayMap.get(key);
        (r.wods||[]).forEach(w=>{
          const pos=target.wods.findIndex(x=>x.index===w.index || x.name===w.name);
          if(pos>=0) target.wods[pos]=w; else target.wods.push(w);
        });
        if(r.rounds) target.rounds=r.rounds;
        if((r.timestamp||'')>(target.timestamp||'')) target.timestamp=r.timestamp;
      }
      return;
    }

    // Vecchio record per WOD o per esercizio: lo raggruppiamo per data + scheda.
    const key=`${r.date}-${r.day}`;
    if(!dayMap.has(key)) dayMap.set(key,{type:'legacy-day',day:r.day,date:r.date,dateKey:r.date||'',timestamp:r.timestamp||'',rounds:r.rounds||'',wods:[]});
    const target=dayMap.get(key);
    const wodName=r.wod||'WOD';
    let w=target.wods.find(x=>x.name===wodName);
    if(!w){w={name:wodName,index:Number((wodName.match(/\d+/)||['99'])[0])-1,exercises:[]};target.wods.push(w);}
    const add=Array.isArray(r.exercises)?r.exercises:[{exerciseId:r.exerciseId,exercise:r.exercise,load:r.load||'',done:!!r.done}];
    add.forEach(ex=>{
      const pos=w.exercises.findIndex(x=>x.exerciseId===ex.exerciseId);
      const clean={exerciseId:ex.exerciseId,exercise:ex.exercise,load:ex.load||'',done:!!ex.done};
      if(pos>=0) w.exercises[pos]=clean; else w.exercises.push(clean);
    });
    if((r.timestamp||'')>(target.timestamp||'')) target.timestamp=r.timestamp||target.timestamp;
  });

  const allGroups=[...dayMap.values()].sort((a,b)=>(b.timestamp||'').localeCompare(a.timestamp||''));
  const groups=allGroups.filter(g=>g.day===currentDay);

  if(!groups.length){
    el.innerHTML=`<div class="history-empty">Non hai ancora salvataggi per la Scheda ${esc(currentDay)}.</div>`;
    return;
  }

  el.innerHTML=groups.slice(0,20).map((g,i)=>{
    const wods=[...(g.wods||[])].sort((a,b)=>(a.index??99)-(b.index??99));
    const wodBlocks=wods.map(w=>{
      const detail=(w.exercises||[]).map(ex=>`<div class="history-exercise-row"><span>${esc(ex.exercise)}</span><strong>${ex.load?`${esc(ex.load)} kg`:'—'}</strong></div>`).join('');
      return `<div class="history-wod-block"><div class="history-wod-title"><strong>${esc(w.name)}</strong></div>${detail||'<div class="history-exercise-row"><span>Nessun carico registrato</span><strong>—</strong></div>'}</div>`;
    }).join('');
    return `<details class="history-item day-history" ${i===0?'open':''}><summary><div><strong>${esc(g.date)} · Scheda ${esc(g.day)}</strong><small>${g.rounds?`${esc(g.rounds)} giri · `:''}${wods.length}/3 WOD salvati</small></div><div class="history-summary-actions"><button class="delete-session-btn" type="button" data-delete-session="${esc(g.dateKey||g.date)}" data-delete-day="${esc(g.day)}" aria-label="Elimina allenamento ${esc(g.date)} Scheda ${esc(g.day)}" title="Elimina intero allenamento">⌫</button><span class="history-chevron">⌄</span></div></summary><div class="history-day-detail">${wodBlocks}</div></details>`;
  }).join('');
  el.querySelectorAll('[data-delete-session]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();deleteSavedSession(btn);}));
}
function deleteSavedSession(btn){
  const dateKey=btn.dataset.deleteSession;
  const day=btn.dataset.deleteDay;
  const group=btn.closest('.history-item');
  const label=group?.querySelector('summary strong')?.textContent || `Scheda ${day}`;
  if(!confirm(`Cestinare l'intero allenamento “${label}”? Tutti i WOD di questa seduta verranno eliminati.`)) return;

  history=history.filter(r=>{
    const rKey=r.dateKey||r.date;
    return !(r.day===day && rKey===dateKey);
  });

  localStorage.setItem('gymHistory',JSON.stringify(history));
  renderHistory();
  toast('Allenamento cestinato');
}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}

tabs.forEach(t=>t.addEventListener('click',()=>{currentDay=t.dataset.day;localStorage.setItem('gymCurrentDay',currentDay);render()}));
document.querySelectorAll('.section-toggle').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.target).classList.toggle('open')));
document.getElementById('resetSessionBtn').addEventListener('click',()=>{session={};sheetRounds[currentDay]='';localStorage.removeItem('gymCurrentSession');localStorage.setItem('gymSheetRounds',JSON.stringify(sheetRounds));document.querySelectorAll('.routine-list input').forEach(i=>i.checked=false);render();toast('Nuova seduta pronta')});
document.getElementById('exportBtn').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({history,trainingDays},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='gym-progressi.json';a.click();URL.revokeObjectURL(a.href)});
document.getElementById('importInput').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());if(Array.isArray(data.history)){history=data.history;localStorage.setItem('gymHistory',JSON.stringify(history));if(Array.isArray(data.trainingDays)){trainingDays=data.trainingDays;persistTrainingDays();}renderHistory();renderCalendar();toast('Dati importati')}}catch{toast('File non valido')}});
document.getElementById('calendarPrevBtn')?.addEventListener('click',()=>{calendarCursor=new Date(calendarCursor.getFullYear(),calendarCursor.getMonth()-1,1);renderCalendar()});
document.getElementById('calendarNextBtn')?.addEventListener('click',()=>{calendarCursor=new Date(calendarCursor.getFullYear(),calendarCursor.getMonth()+1,1);renderCalendar()});
document.getElementById('calendarTodayBtn')?.addEventListener('click',()=>{const d=new Date();calendarCursor=new Date(d.getFullYear(),d.getMonth(),1);renderCalendar()});
render();

// --- PWA + notifiche + autenticazione sessione ---
const VAPID_PUBLIC_KEY = 'BNDbJvOU-1b5Lw666E6ivf1L8S7jp3uvPjLp2Upmma4QS1MUlGFfjsCpxU7LOUpcClqcPm0thXiQ_VcEJxFfjKw';
let cloudSyncTimer = null;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

function setNotificationStatus(message, active=false) {
  const el = document.getElementById('notificationStatus');
  if (!el) return;
  el.textContent = message;
  el.classList.toggle('active', active);
}

async function syncTrainingDaysToCloud() {
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(async () => {
    try {
      await fetch('/api/calendar-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ trainingDays })
      });
    } catch (_) {}
  }, 250);
}

async function getPushStatus() {
  try {
    const r = await fetch('/api/push-status', { credentials: 'same-origin' });
    const data = await r.json();
    if (!data.redis) {
      setNotificationStatus('Database notifiche non collegato a Vercel.');
      return data;
    }
    if (!data.vapid) {
      setNotificationStatus('Manca VAPID_PRIVATE_KEY nelle Environment Variables di Vercel.');
      return data;
    }
    if (!data.qstash) {
      setNotificationStatus('QStash non risulta collegato al progetto Vercel.');
      return data;
    }
    if (typeof Notification !== 'undefined' && Notification.permission === 'denied') {
      setNotificationStatus('Notifiche bloccate nelle impostazioni del dispositivo.');
      return data;
    }
    if (data.subscribed && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      setNotificationStatus('Attive · promemoria alle 11:00 nei giorni programmati', true);
      document.getElementById('enableNotificationsBtn').textContent = 'Notifiche attive';
      document.getElementById('testNotificationBtn').hidden = false;
    } else {
      setNotificationStatus('Non ancora attive · riceverai il promemoria alle 11:00.');
    }
    return data;
  } catch (_) {
    setNotificationStatus('Impossibile controllare lo stato delle notifiche.');
    return null;
  }
}

async function enableNotifications() {
  const btn = document.getElementById('enableNotificationsBtn');
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    setNotificationStatus('Questo dispositivo/browser non supporta le notifiche push.');
    return;
  }
  btn.disabled = true;
  const oldText = btn.textContent;
  btn.textContent = 'Attivazione…';
  try {
    const status = await getPushStatus();
    if (status && (!status.redis || !status.vapid || !status.qstash)) throw new Error('Configurazione server incompleta');
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') throw new Error('Permesso notifiche non concesso');
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }
    let r = await fetch('/api/push-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ subscription: subscription.toJSON() })
    });
    let data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Errore salvataggio notifica');
    await fetch('/api/calendar-sync', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
      body: JSON.stringify({ trainingDays })
    });
    r = await fetch('/api/setup-reminder', { method: 'POST', credentials: 'same-origin' });
    data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Errore pianificazione promemoria');
    btn.textContent = 'Notifiche attive';
    document.getElementById('testNotificationBtn').hidden = false;
    setNotificationStatus('Attive · promemoria alle 11:00 nei giorni programmati', true);
    toast('Notifiche attivate alle 11:00');
  } catch (e) {
    btn.textContent = oldText;
    setNotificationStatus(e.message || 'Impossibile attivare le notifiche.');
  } finally {
    btn.disabled = false;
  }
}

async function testNotification() {
  const btn = document.getElementById('testNotificationBtn');
  btn.disabled = true;
  btn.textContent = 'Invio…';
  try {
    const r = await fetch('/api/test-notification', { method: 'POST', credentials: 'same-origin' });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Invio non riuscito');
    toast(data.sent ? 'Notifica di prova inviata' : 'Nessun dispositivo registrato');
  } catch (e) {
    setNotificationStatus(e.message || 'Errore nella notifica di prova.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Prova notifica';
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js?v=11', { updateViaCache: 'none' });
      await registration.update();
      await navigator.serviceWorker.ready;
      syncTrainingDaysToCloud();
      getPushStatus();
    } catch (_) {
      setNotificationStatus('Service worker non disponibile.');
    }
  });
}

document.getElementById('enableNotificationsBtn')?.addEventListener('click', enableNotifications);
document.getElementById('testNotificationBtn')?.addEventListener('click', testNotification);

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      const registration = await navigator.serviceWorker?.ready;
      const subscription = await registration?.pushManager?.getSubscription();
      if (subscription) await subscription.unsubscribe();
      await fetch('/api/push-unsubscribe', { method: 'POST', credentials: 'same-origin' }).catch(()=>{});
      await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
    } finally {
      location.href = '/login.html';
    }
  });
}

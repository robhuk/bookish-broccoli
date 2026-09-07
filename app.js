const pages=[
{id:'incident',title:'Incident Report Notes',fields:[
['Date','date'],['Time of incident','time'],['Headcode','headcode'],['Police called','yesno'],['Was incident perceived to involve passengers from and event / sporting fixtures or due to alcohol, delay, crowding or disruption?','yesno'],['If yes give details','textarea'],['Notes','textarea']],note:'These are contemporaneous notes at the time of an incident, ensure incident is reported and official forms completed.'},
{id:'passenger',title:'Passenger Counts',fields:[['Date','date'],['Headcode','headcode'],['Formation','formation'],['Notes','textarea']],table:true,note:'To be used when STAR mobile unavailable.'},
{id:'reservations',title:'Close Reservations / Declassified 1st / Full and Standing',fields:[['Date','date'],['Headcode','headcode'],['Last station','text'],['Request','request']]},
{id:'commission',title:'Commission and Scan Calculator',fields:[['Number of scans','number'],['Ticket sales amount (£)','number']],calculator:true},
{id:'delay',title:'Operational Delay Form',fields:[['Date','date'],['Headcode','headcode'],['Control Desk Aware','yesno'],['Cause','cause'],['Notes','textarea']]},
{id:'late_book_off',title:'Late Book Off',fields:[['Headcode','headcode'],['Delay minutes','number'],['Job number','text'],['Originally booking off at','time'],['Reason','delayreason'],['Other reason','textarea'],['My new book off time is','time']]},
{id:'61016',title:'BTP 61016 Message Builder',fields:[['HEADCODE','headcode'],['TRAIN TIME','time'],['FROM','text'],['TO','text'],['NEXT STOP','text'],['AT (HH:MM) / Time at next station','time'],['INCIDENT DETAILS','textarea']],note:'Incident description hints: Name, Age, Gender, Ethnicity, Build, Clothing, Distinguishing features, Direction of travel, Intoxicated?, Weapons?, Companions?'},
{id:'delay_repay',title:'Delay Repay',fields:[],delayRepay:true},
{id:'useful_links',title:'🔗 Useful Links',fields:[],usefulLinks:true}
];
let current=null;
function formatReportDate(value){
  if(!value)return value||'';
  const v=String(value).trim();
  // Already DD MM YYYY.
  if(/^\d{2} \d{2} \d{4}$/.test(v))return v;
  // YYYY-MM-DD from any legacy stored value.
  let m=v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(m)return `${m[3]} ${m[2]} ${m[1]}`;
  // DD/MM/YYYY or DD-MM-YYYY.
  m=v.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
  if(m)return `${m[1]} ${m[2]} ${m[3]}`;
  return v;
}
const nav=document.getElementById('nav'),form=document.getElementById('form');
const pageIcons={incident:'🚨',passenger:'👥',reservations:'🚆',commission:'💷',delay:'⏱️',late_book_off:'🕒','61016':'📱',delay_repay:'💰'};
pages.forEach(p=>{let b=document.createElement('button');b.textContent=(pageIcons[p.id]||'📄')+' '+p.title;b.onclick=()=>openPage(p.id);nav.appendChild(b)});
function goHome(){document.getElementById('formScreen').classList.remove('active');document.getElementById('home').classList.add('active')}
function openPage(id){current=pages.find(p=>p.id===id);
const generateBtn=document.querySelector('.output-actions button[onclick="generate()"]');
if(generateBtn)generateBtn.style.display=(id==='commission'||id==='delay_repay'||id==='useful_links')?'none':'inline-block';
const outputSection=document.querySelector('.output');
if(outputSection)outputSection.style.display=(id==='commission'||id==='delay_repay'||id==='useful_links')?'none':'block';
document.getElementById('emailBtn').style.display=(id==='delay_repay'||id==='commission'||id==='61016'||id==='useful_links')?'none':'inline-block';
const printBtn=document.getElementById('printBtn');
if(printBtn)printBtn.style.display=(id==='61016'||id==='passenger'||id==='useful_links')?'none':'inline-block';
document.getElementById('sms61016Btn').style.display=id==='61016'?'inline-block':'none';
document.getElementById('home').classList.remove('active');document.getElementById('formScreen').classList.add('active');document.getElementById('pageTitle').textContent=current.title;document.getElementById('subject').textContent='';document.getElementById('body').textContent='';render();if(!current.delayRepay)loadCurrent()}
function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')}
function render(){form.innerHTML='';
if(current.usefulLinks){
 const groups=[
 ['🚆 Operational',[
 ['Realtime Trains','Live times','🔴','http://www.realtimetrains.co.uk/'],
 ['Traksy','Live maps','🗺️','https://traksy.uk/'],
 ['trains.im','Live performance data','📈','https://trains.im/nationalmap/'],
 ['Where am I','Railway location finder','📍','https://drivertools.co.uk/where_am_i.html']]],
 ['🚄 XC Links',[
 ['Delay Repay','','🚆','https://www.crosscountrytrains.co.uk/help-support/delay-repay'],
 ['Customer Charter','','📋','https://www.crosscountrytrains.co.uk/about-us/passenger-charter'],
 ['Luggage Policy','','🧳','https://www.crosscountrytrains.co.uk/travel-information/on-board/luggage'],
 ['Service Updates','','⚠️','https://www.crosscountrytrains.co.uk/travel-information/service-updates'],
 ['Customer Contact info','','☎️','https://www.crosscountrytrains.co.uk/help-support/contact-us']]],
 ['📖 National Rail',[
 ['National Rail Bylaws','','⚖️','https://www.gov.uk/government/publications/railway-byelaws']]]
 ];
 groups.forEach(([title,links])=>{
   const sec=document.createElement('section');sec.className='useful-links-section';
   sec.innerHTML=`<h2>${title}</h2>`;
   links.forEach(([name,desc,logo,url])=>{
     const a=document.createElement('a');a.className='useful-link-button';a.href=url;a.target='_blank';a.rel='noopener noreferrer';
     a.innerHTML=`<span class="link-logo">${logo}</span><span class="link-copy"><strong>${name}</strong>${desc?`<small>${desc}</small>`:''}</span><span class="link-arrow">↗</span>`;
     sec.appendChild(a);
   });form.appendChild(sec);
 });return;
}
if(current.id==='commission'){
  form.className='commission-card';
  form.innerHTML=`<div class="commission-intro"><div class="commission-icon">💷</div><h2>Commission and Scan Calculator</h2><p>Scans are paid at <strong>£0.02 per scan</strong>. Ticket commission is <strong>6%</strong>.</p></div>
  <label>Number of scans<input type="number" name="number_of_scans" min="0" step="1" inputmode="numeric"></label>
  <label>Ticket sales amount (£)<input type="number" name="ticket_sales_amount" min="0" step="0.01" inputmode="decimal"></label>
  <div class="commission-results">
    <div><span>Scan value</span><strong id="scanValue">£0.00</strong></div>
    <div><span>Ticket commission (6%)</span><strong id="ticketCommission">£0.00</strong></div>
    <div class="commission-total"><span>Total commission</span><strong id="commissionTotal">£0.00</strong></div>
  </div>`;
  const updateCommission=()=>{
    const scans=Number(form.elements.number_of_scans.value||0);
    const sales=Number(form.elements.ticket_sales_amount.value||0);
    const scanValue=scans*0.02;
    const commission=sales*0.06;
    const total=scanValue+commission;
    document.getElementById('scanValue').textContent='£'+scanValue.toFixed(2);
    document.getElementById('ticketCommission').textContent='£'+commission.toFixed(2);
    document.getElementById('commissionTotal').textContent='£'+total.toFixed(2);
  };
  form.addEventListener('input',updateCommission);
  return;
}
if(current.delayRepay){
  form.className='delay-repay-card';
  form.innerHTML=`<div class="delay-repay-brand"><span class="brand-cross">cross</span><span class="brand-country">country</span><div class="by-arriva">by <b>arriva</b></div></div>
  <div class="delay-repay-rule"></div>
  <h2 class="delay-repay-title">Delay Repay</h2>
  <div class="delay-repay-clock">◷</div>
  <p class="delay-repay-intro">If your CrossCountry train has been delayed by <strong>30 minutes or more</strong> to the destination detailed on your ticket, you are entitled to compensation.</p>
  <div class="delay-repay-dash"></div>
  <img class="delay-repay-qr" src="delay-repay-qr.png" alt="Delay Repay QR code">
  <div class="delay-repay-scan"><div class="scan-icon">▣</div><div><h3>Scan this QR code</h3><p>Show this QR code to the customer so they can claim their Delay Repay online.</p></div></div>
  <div class="delay-repay-info"><span>ⓘ</span><div>Visit <b>crosscountrytrains.co.uk/delay-repay</b><br>for full terms and conditions.</div></div>`;
  return;
}
form.className='';
if(current.id==='delay'){
  const causeSelect=form.querySelector('[name="cause"]');
  if(causeSelect){
    const policeField=document.createElement('label');
    policeField.className='conditional-delay-field police-incident-number';
    policeField.style.display='none';
    policeField.innerHTML='Incident / log number<input type="text" name="incident_log_number" placeholder="Enter incident or log number">';
    form.insertBefore(policeField, causeSelect.parentElement.nextSibling);

    const otherField=document.createElement('label');
    otherField.className='conditional-delay-field other-delay-reason';
    otherField.style.display='none';
    otherField.innerHTML='Reason<input type="text" name="other_delay_reason" placeholder="Enter reason">';
    policeField.insertAdjacentElement('afterend',otherField);

    const updateDelayCauseFields=()=>{
      const cause=causeSelect.value;
      policeField.style.display=cause==='Police Attendance to train'?'block':'none';
      otherField.style.display=cause==='Other'?'block':'none';
      if(cause!=='Police Attendance to train')policeField.querySelector('input').value='';
      if(cause!=='Other')otherField.querySelector('input').value='';
    };
    causeSelect.addEventListener('change',updateDelayCauseFields);
    updateDelayCauseFields();
  }

  const incidentYesNo=[
    ['assault_on_staff','Assault on staff details','assault_on_staff_details',false],
    ['assault_on_passengers','Assault on passengers details','assault_on_passengers_details',false],
    ['damage_to_train','Damage to train details','damage_to_train_details',false],
    ['delay_caused_due_to_incident','Delay caused due to incident (minutes)','incident_delay_minutes',true],
    ['delay_caused_due_to_incident','Delay caused due to incident details','incident_delay_details',false]
  ];
  incidentYesNo.forEach(([source,label,name,isNumber])=>{
    const sourceEl=form.querySelector(`[name="${source}"]`);
    if(!sourceEl)return;
    const l=document.createElement('label');
    l.className='conditional-incident-field';
    l.style.display='none';
    l.textContent=label;
    const el=document.createElement(isNumber?'input':'textarea');
    el.name=name;
    if(isNumber){el.type='number';el.min='0';el.placeholder='XX minutes'}
    l.appendChild(el);
    sourceEl.parentElement.insertAdjacentElement('afterend',l);
    const update=()=>{const show=sourceEl.value==='Yes';l.style.display=show?'block':'none';if(!show)el.value=''};
    sourceEl.addEventListener('change',update);update();
  });
}
if(current.note){
  let n=document.createElement('div');
  if(current.id==='61016'){
    n.className='note collapsible-note';
    n.innerHTML='<div class="emergency-banner">🚨 <strong>Always call 999 in an emergency.</strong> Update XC Control when safe to do so.</div><details><summary>📝 Incident description guidance</summary><div class="collapsible-note-content"></div></details>';
    n.querySelector('.collapsible-note-content').textContent=current.note;
  }else{
    n.className='note';
    n.textContent=current.note;
  }
  form.appendChild(n)
}
current.fields.forEach(([label,type])=>{let l=document.createElement('label');l.textContent=label;let name=slug(label);let el;
if(type==='textarea'){el=document.createElement('textarea')}
else if(type==='yesno'){el=document.createElement('select');el.innerHTML='<option value=""></option><option>Yes</option><option>No</option>'}
else if(type==='formation'){el=document.createElement('select');el.innerHTML='<option value=""></option>'+['Single set 4 car','Single set 5 car','Double set 8 car','Double set 9 car','Double set 10 car','Double set (one set LOOU)'].map(x=>`<option>${x}</option>`).join('')}
else if(type==='request'){el=document.createElement('div');el.className='checks';['Report full and standing service','Request closure of reservations','Declassification of first class'].forEach(x=>{let q=document.createElement('label');q.innerHTML=`<input type="checkbox" value="${x}">${x}`;el.appendChild(q)})}
else if(type==='cause'){el=document.createElement('select');el.innerHTML='<option value=""></option><option>Passenger incident</option><option>Train fault</option><option>Infrastructure</option><option>Crowding</option><option>Late running</option><option>Other</option>'}
else if(type==='delayreason'){el=document.createElement('select');el.innerHTML='<option value=""></option>'+['Signalling failure','Train fault','Infrastructure failure','Passenger incident','Crew delay','Late running','Crowding','Awaiting relief','Other'].map(x=>`<option>${x}</option>`).join('')}
else{el=document.createElement('input');
el.type=(type==='headcode'||type==='date')?'text':type;
if(type==='headcode'){el.maxLength=4;el.pattern='[0-9][A-Za-z][0-9][0-9]';el.oninput=()=>{el.value=el.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,4)}}
if(type==='date'){
  el.inputMode='numeric';
  el.placeholder='DD MM YYYY';
  el.maxLength=10;
  const now=new Date();
  el.value=String(now.getDate()).padStart(2,'0')+' '+String(now.getMonth()+1).padStart(2,'0')+' '+now.getFullYear();
  el.oninput=()=>{const d=el.value.replace(/\D/g,'').slice(0,8);let f=d.slice(0,2);if(d.length>2)f+=' '+d.slice(2,4);if(d.length>4)f+=' '+d.slice(4,8);el.value=f}
}
el.name=name;l.appendChild(el);form.appendChild(l)})
if(current.id==='61016'){let c=document.createElement('div');c.id='smsCounter';c.className='note';c.textContent='Characters: 0 | SMS messages: 0';form.appendChild(c);form.addEventListener('input',()=>{let msg=Object.values(values()).join(' ').trim();let n=msg.length;c.textContent=`Characters: ${n} | SMS messages: ${n?Math.ceil(n/160):0}`},{once:true})}
if(current.table){
  const capacityData={
    'Single set 4 car':{first:26,standard:174,fullFirst:40,fullStandard:260},
    'Single set 5 car':{first:26,standard:236,fullFirst:40,fullStandard:350},
    'Double set 8 car':{first:52,standard:348,fullFirst:80,fullStandard:520},
    'Double set 9 car':{first:52,standard:410,fullFirst:80,fullStandard:610},
    'Double set 10 car':{first:52,standard:472,fullFirst:80,fullStandard:700}
  };
  const formationSelect=form.elements.formation;
  const summary=document.createElement('div');
  summary.className='passenger-summary';
  summary.innerHTML=`<div class="capacity-live"><div><span>First Class</span><strong id="firstTotal">0</strong><small id="firstCapacity">of 0 seats (0%)</small></div><div><span>Standard</span><strong id="standardTotal">0</strong><small id="standardCapacity">of 0 seats (0%)</small></div><div class="all-capacity"><span>Total seated capacity used</span><strong id="totalCapacityPercent">0%</strong></div></div>`;
  form.appendChild(summary);

  let wrap=document.createElement('div');wrap.className='table-wrap';
  let table=document.createElement('table');table.className='count-table';
  table.innerHTML='<thead><tr><th>Station</th><th>First class (number)</th><th>Standard (number)</th><th>Count entered</th></tr></thead><tbody>'+
    Array.from({length:15},(_,i)=>`<tr><td><input name="station_${i}"></td><td><input type="number" min="0" name="first_${i}"></td><td><input type="number" min="0" name="standard_${i}"></td><td><strong class="row-count" id="rowCount_${i}">0</strong></td></tr>`).join('')+'</tbody>';
  wrap.appendChild(table);form.appendChild(wrap);

  const details=document.createElement('details');
  details.className='capacity-details';
  details.innerHTML=`<summary>📊 Capacity guide — seated and full & standing</summary>
  <div class="table-wrap"><table class="capacity-table"><thead><tr><th>Stock type</th><th>Seated First</th><th>Seated Standard</th><th>Full & Standing First</th><th>Full & Standing Standard</th></tr></thead><tbody>
  ${Object.entries(capacityData).map(([name,c])=>`<tr><td>${name}</td><td>${c.first}</td><td>${c.standard}</td><td>${c.fullFirst}</td><td>${c.fullStandard}</td></tr>`).join('')}
  </tbody></table></div>`;
  form.appendChild(details);

  const updatePassengerCounts=()=>{
    let firstTotal=0,standardTotal=0;
    for(let i=0;i<15;i++){
      const f=Number(form.elements['first_'+i].value||0);
      const s=Number(form.elements['standard_'+i].value||0);
      firstTotal+=f;standardTotal+=s;

      const firstInput=form.elements['first_'+i];
      const standardInput=form.elements['standard_'+i];
      firstInput.classList.toggle('passenger-over-limit',f>40);
      standardInput.classList.toggle('passenger-over-limit',s>260);

      document.getElementById('rowCount_'+i).textContent=f+s;
    }
    const cap=capacityData[formationSelect.value];
    const firstCap=cap?cap.first:0, stdCap=cap?cap.standard:0;
    const firstPct=firstCap?firstTotal/firstCap*100:0;
    const stdPct=stdCap?standardTotal/stdCap*100:0;
    const totalCap=firstCap+stdCap, total=firstTotal+standardTotal;
    const totalPct=totalCap?total/totalCap*100:0;
    document.getElementById('firstTotal').textContent=firstTotal;
    document.getElementById('standardTotal').textContent=standardTotal;
    document.getElementById('firstCapacity').textContent=`of ${firstCap} seats (${firstPct.toFixed(1)}%)`;
    document.getElementById('standardCapacity').textContent=`of ${stdCap} seats (${stdPct.toFixed(1)}%)`;
    document.getElementById('totalCapacityPercent').textContent=totalPct.toFixed(1)+'%';
  };
  form.addEventListener('input',updatePassengerCounts);
  formationSelect.addEventListener('change',updatePassengerCounts);
  updatePassengerCounts();
}
}
function values(){let d={};new FormData(form).forEach((v,k)=>{if(d[k])d[k]+='; '+v;else d[k]=v});return d}
function saveCurrent(){if(current.delayRepay){alert('Delay Repay page is available offline.');return}localStorage.setItem('xc_'+current.id,JSON.stringify(values()));alert('Saved on this device.')}
function loadCurrent(){let x=localStorage.getItem('xc_'+current.id);if(!x)return;let d=JSON.parse(x);Object.entries(d).forEach(([k,v])=>{let e=form.elements[k];if(e){if(e.type==='checkbox')e.checked=v===e.value;else e.value=v}})}
function clearCurrent(){if(current.delayRepay){return}if(!confirm('Clear this form?'))return;localStorage.removeItem('xc_'+current.id);render()}
function boldHeadcode(h){return h?`<b>${h}</b>`:''}
function generate(){let d=values(),s='',b='';Object.keys(d).forEach(k=>{if(k.toLowerCase().includes('date'))d[k]=formatReportDate(d[k])});
if(current.delayRepay){s='Delay Repay';b='If your CrossCountry train has been delayed by 30 minutes or more to the destination detailed on your ticket, you are entitled to compensation.\n\nVisit crosscountrytrains.co.uk/delay-repay for full terms and conditions.'}
if(current.id==='incident'){s=`Incident report notes for ${d.headcode||'[headcode]'} on ${d.date||'[date]'}`;b=`Date: ${d.date}\nTime of incident: ${d.time_of_incident}\nHeadcode: ${d.headcode}\nPolice called: ${d.police_called}\n\nWas incident perceived to involve passengers from and event / sporting fixtures or due to alcohol, delay, crowding or disruption?\n${d.was_incident_perceived_to_involve_passengers_from_and_event_sporting_fixtures_or_due_to_alcohol_delay_crowding_or_disruption}\nIf yes give details:\n${d.if_yes_give_details||''}\n\n${d.notes||''}`}
else if(current.id==='reservations'){
  let selected=(d.request||'').split('; ').filter(Boolean);
  let requestLines=[];
  if(selected.includes('Report full and standing service'))requestLines.push('This train is full and standing');
  if(selected.includes('Request closure of reservations'))requestLines.push('I am requesting closure of on the day seat reservations');
  if(selected.includes('Declassification of first class'))requestLines.push('First class has been declassified on this service');
  let requestText=requestLines.length?requestLines.join(' / '):'[request]';
  s=`${d.headcode||'[headcode]'} - ${requestText} - ${d.date||'[date]'}`;
  b=`Date: ${d.date||''}\nHeadcode: ${d.headcode||''}\nLast station: ${d.last_station||''}\n\n${requestLines.length?requestLines.join('\n\n'):'[request]'}`;
}
else if(current.id==='late_book_off'){let reason=d.reason==='Other'?(d.other_reason||''):d.reason;s=`late book off ${d.headcode||'[HEADCODE]'} delay of ${d.delay_minutes||'[delay minutes]'} minutes`;b=`Hello, due to late running of ${d.headcode||'[headcode]'} can you please book me off late from job number ${d.job_number||'[job number]'}, originally booking off at ${d.originally_booking_off_at||'[original booking off time]'} due to ${reason||'[reason]'}\n\nMy new book off time is ${d.my_new_book_off_time_is||'[new book off time]'}`}
else if(current.id==='61016'){
  s='61016 Message';
  b=`I am a member of train crew on ${d.headcode||'[HEADCODE]'} the ${d.train_time||'[TRAIN TIME]'} ${d.from||'[FROM]'} to ${d.to||'[TO]'} next stop is ${d.next_stop||'[NEXT]'} @ ${d.at_hh_mm_time_at_next_station||'[TIME AT NEXT STATION]'} req police assistance due to ${d.incident_details||'[INCIDENT DETAILS]'}`;
}
else if(current.id==='delay'){
let effectiveCause=d.cause||'';
if(effectiveCause==='Other'&&d.other_delay_reason)effectiveCause=d.other_delay_reason;s=`Delay: delay notification ${d.headcode||'[HEADCODE]'} on ${d.date||'[DATE]'}`;b=`${String(d.control_desk_aware||'').toLowerCase()==='yes'?'The relevant route control desk is aware of the delay\n\n':''}Hello, please find attached a short summary of a delay to a service I was working,\n\nDate: ${d.date}\nHeadcode: ${d.headcode}\nControl Desk Aware: ${d.control_desk_aware}\nCause: ${effectiveCause}\n\n${d.notes||''}`
if(d.assault_on_staff==='Yes')b+=`\n\nAssault on staff: Yes${d.assault_on_staff_details?`\n${d.assault_on_staff_details}`:''}`;
if(d.assault_on_passengers==='Yes')b+=`\n\nAssault on passengers: Yes${d.assault_on_passengers_details?`\n${d.assault_on_passengers_details}`:''}`;
if(d.damage_to_train==='Yes')b+=`\n\nDamage to train: Yes${d.damage_to_train_details?`\n${d.damage_to_train_details}`:''}`;
if(d.delay_caused_due_to_incident==='Yes')b+=`\n\nDelay caused due to incident: Yes${d.incident_delay_minutes?`\nDelay minutes: ${d.incident_delay_minutes}`:''}${d.incident_delay_details?`\n${d.incident_delay_details}`:''}`;
}
else if(current.id==='commission'){let scans=Number(d.number_of_scans||0),sales=Number(d.ticket_sales_amount||0),scanValue=scans*.02,commission=sales*.06,total=scanValue+commission;s='Commission and Scan Calculator';b=`Scans: ${scans}\nScan value: £${scanValue.toFixed(2)}\nTicket sales: £${sales.toFixed(2)}\nTicket commission (6%): £${commission.toFixed(2)}\nTotal: £${total.toFixed(2)}`}
else {s=`${d.date||'[DATE]'} ${d.headcode||'[HEADCODE]'}`;let rows=[];for(let i=0;i<15;i++){if(d['station_'+i]||d['first_'+i]||d['standard_'+i])rows.push(`${d['station_'+i]||''}: First class ${d['first_'+i]||''}, Standard ${d['standard_'+i]||''}`)}b=`Date: ${d.date}\nHeadcode: ${d.headcode}\nFormation: ${d.formation}\nNotes: ${d.notes||''}\n\n${rows.join('\n')}`}
document.getElementById('subject').innerHTML='Subject: '+s.replace(d.headcode||'__','<b>'+ (d.headcode||'') +'</b>');
document.getElementById('body').textContent=b}
function copyOutput(){navigator.clipboard.writeText(document.getElementById('subject').innerText+'\n\n'+document.getElementById('body').innerText);alert('Copied.')}
function emailOutput(){
  if(current.delayRepay||current.id==='commission')return;
  generate();
  const subject=document.getElementById('subject').innerText.replace(/^Subject:\s*/,'');
  const body=document.getElementById('body').innerText;
  window.location.href='mailto:?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
}
function send61016SMS(){
  if(current.id!=='61016')return;
  generate();
  const message=document.getElementById('body').innerText;
  window.location.href='sms:61016?body='+encodeURIComponent(message);
}
function exportText(){let text=document.getElementById('subject').innerText+'\n\n'+document.getElementById('body').innerText;let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));a.download=(current?.id||'report')+'.txt';a.click();URL.revokeObjectURL(a.href)}
if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js');
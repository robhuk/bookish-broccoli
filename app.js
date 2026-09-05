const pages=[
{id:'incident',title:'Incident Report Notes',fields:[
['Date','date'],['Time of incident','time'],['Headcode','headcode'],['Police called','yesno'],['Was incident perceived to involve passengers from and event / sporting fixtures or due to alcohol, delay, crowding or disruption?','yesno'],['If yes give details','textarea'],['Notes','textarea']],note:'These are contemporaneous notes at the time of an incident, ensure incident is reported and official forms completed.'},
{id:'passenger',title:'Passenger Counts',fields:[['Date','date'],['Headcode','headcode'],['Formation','formation'],['Notes','textarea']],table:true,note:'To be used when STAR mobile unavailable.'},
{id:'reservations',title:'Close Reservations / Declassified 1st / Full and Standing',fields:[['Date','date'],['Headcode','headcode'],['Last station','text'],['Request','request']]},
{id:'commission',title:'Commission and Scan Calculator',fields:[['Number of scans','number'],['Ticket sales amount (£)','number']],calculator:true},
{id:'delay',title:'Operational Delay Form',fields:[['Date','date'],['Headcode','headcode'],['Control Desk Aware','yesno'],['Cause','cause'],['Notes','textarea']]}
];
let current=null;
const nav=document.getElementById('nav'),form=document.getElementById('form');
pages.forEach(p=>{let b=document.createElement('button');b.textContent=p.title;b.onclick=()=>openPage(p.id);nav.appendChild(b)});
function goHome(){document.getElementById('formScreen').classList.remove('active');document.getElementById('home').classList.add('active')}
function openPage(id){current=pages.find(p=>p.id===id);document.getElementById('home').classList.remove('active');document.getElementById('formScreen').classList.add('active');document.getElementById('pageTitle').textContent=current.title;document.getElementById('subject').textContent='';document.getElementById('body').textContent='';render();loadCurrent()}
function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')}
function render(){form.innerHTML='';if(current.note){let n=document.createElement('div');n.className='note';n.textContent=current.note;form.appendChild(n)}
current.fields.forEach(([label,type])=>{let l=document.createElement('label');l.textContent=label;let name=slug(label);let el;
if(type==='textarea'){el=document.createElement('textarea')}
else if(type==='yesno'){el=document.createElement('select');el.innerHTML='<option value=""></option><option>Yes</option><option>No</option>'}
else if(type==='formation'){el=document.createElement('select');el.innerHTML='<option value=""></option>'+['Single set 4 car','Single set 5 car','Double set 8 car','Double set 9 car','Double set 10 car','Double set (one set LOOU)'].map(x=>`<option>${x}</option>`).join('')}
else if(type==='request'){el=document.createElement('div');el.className='checks';['Report full and standing service','Request closure of reservations','Declassification of first class'].forEach(x=>{let q=document.createElement('label');q.innerHTML=`<input type="checkbox" value="${x}">${x}`;el.appendChild(q)})}
else if(type==='cause'){el=document.createElement('select');el.innerHTML='<option value=""></option><option>Passenger incident</option><option>Train fault</option><option>Infrastructure</option><option>Crowding</option><option>Late running</option><option>Other</option>'}
else{el=document.createElement('input');el.type=type==='headcode'?'text':type;if(type==='headcode'){el.maxLength=4;el.pattern='[0-9][A-Za-z][0-9][0-9]';el.oninput=()=>{el.value=el.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,4)}}if(type==='date')el.value=new Date().toISOString().slice(0,10)}
el.name=name;l.appendChild(el);form.appendChild(l)})
if(current.table){let wrap=document.createElement('div');wrap.className='table-wrap';let t=document.createElement('table');t.className='count-table';t.innerHTML='<thead><tr><th>Station</th><th>First class (number)</th><th>Standard (number)</th></tr></thead><tbody>'+Array.from({length:15},(_,i)=>`<tr><td><input name="station_${i}"></td><td><input type="number" name="first_${i}"></td><td><input type="number" name="standard_${i}"></td></tr>`).join('')+'</tbody>';wrap.appendChild(t);form.appendChild(wrap)}
}
function values(){let d={};new FormData(form).forEach((v,k)=>{if(d[k])d[k]+='; '+v;else d[k]=v});return d}
function saveCurrent(){localStorage.setItem('xc_'+current.id,JSON.stringify(values()));alert('Saved on this device.')}
function loadCurrent(){let x=localStorage.getItem('xc_'+current.id);if(!x)return;let d=JSON.parse(x);Object.entries(d).forEach(([k,v])=>{let e=form.elements[k];if(e){if(e.type==='checkbox')e.checked=v===e.value;else e.value=v}})}
function clearCurrent(){if(!confirm('Clear this form?'))return;localStorage.removeItem('xc_'+current.id);render()}
function boldHeadcode(h){return h?`<b>${h}</b>`:''}
function generate(){let d=values(),s='',b='';
if(current.id==='incident'){s=`Incident report notes for ${d.headcode||'[headcode]'} on ${d.date||'[date]'}`;b=`Date: ${d.date}\nTime of incident: ${d.time_of_incident}\nHeadcode: ${d.headcode}\nPolice called: ${d.police_called}\n\nWas incident perceived to involve passengers from and event / sporting fixtures or due to alcohol, delay, crowding or disruption?\n${d.was_incident_perceived_to_involve_passengers_from_and_event_sporting_fixtures_or_due_to_alcohol_delay_crowding_or_disruption}\nIf yes give details:\n${d.if_yes_give_details||''}\n\n${d.notes||''}`}
else if(current.id==='reservations'){s=`[REQUEST] - [${d.headcode||'HEADCODE'}] - [${d.date||'DATE'}]`;let r=d.request||'';b=`Date: ${d.date}\nHeadcode: ${d.headcode}\nLast station: ${d.last_station}\n\n${r.includes('Report full and standing')?'Report this train as Full and standing.\n':''}${r}`}
else if(current.id==='delay'){s=`Delay: delay notification ${d.headcode||'[HEADCODE]'} on ${d.date||'[DATE]'}`;b=`Hello, please find attached a short summary of a delay to a service I was working,\n\nDate: ${d.date}\nHeadcode: ${d.headcode}\nControl Desk Aware: ${d.control_desk_aware}\nCause: ${d.cause}\n\n${d.notes||''}`}
else if(current.id==='commission'){let scans=Number(d.number_of_scans||0),sales=Number(d.ticket_sales_amount||0),scanValue=scans*.02,commission=sales*.06,total=scanValue+commission;s='Commission and Scan Calculator';b=`Scans: ${scans}\nScan value: £${scanValue.toFixed(2)}\nTicket sales: £${sales.toFixed(2)}\nTicket commission (6%): £${commission.toFixed(2)}\nTotal: £${total.toFixed(2)}`}
else {s='Passenger counts';let rows=[];for(let i=0;i<15;i++){if(d['station_'+i]||d['first_'+i]||d['standard_'+i])rows.push(`${d['station_'+i]||''}: First class ${d['first_'+i]||''}, Standard ${d['standard_'+i]||''}`)}b=`Date: ${d.date}\nHeadcode: ${d.headcode}\nFormation: ${d.formation}\nNotes: ${d.notes||''}\n\n${rows.join('\n')}`}
document.getElementById('subject').innerHTML='Subject: '+s.replace(d.headcode||'__','<b>'+ (d.headcode||'') +'</b>');
document.getElementById('body').textContent=b}
function copyOutput(){navigator.clipboard.writeText(document.getElementById('subject').innerText+'\n\n'+document.getElementById('body').innerText);alert('Copied.')}
function exportText(){let text=document.getElementById('subject').innerText+'\n\n'+document.getElementById('body').innerText;let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));a.download=(current?.id||'report')+'.txt';a.click();URL.revokeObjectURL(a.href)}
if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js');
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const today=new Date().toISOString().slice(0,10);
$$('[data-date]').forEach(i=>{if(!i.value)i.value=today});
$$('.headcode').forEach(i=>i.addEventListener('input',()=>{let v=i.value.toUpperCase().replace(/[^A-Z0-9]/g,'');v=v.slice(0,4);if(v.length===4){v=v[0].replace(/[^0-9]/g,'')+v[1].replace(/[^A-Z]/g,'')+v.slice(2).replace(/[^0-9]/g,'')}i.value=v;}));
$$('#nav button').forEach(b=>b.onclick=()=>{const id=b.dataset.page;$$('#nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$$('.page').forEach(x=>x.classList.toggle('active',x.id===id));$('#pageTitle').textContent=b.textContent;$('.sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});});
$('#menuBtn').onclick=()=>$('.sidebar').classList.toggle('open');
function calc(){const sold=+$('#ticketsSold').value||0, rate=+$('#commissionRate').value||0, scanned=+$('#ticketsScanned').value||0;$('#commissionTotal').textContent='£'+(sold*rate).toFixed(2);$('#scanRate').value=sold?((scanned/sold)*100).toFixed(1):'0.0';}
['ticketsSold','commissionRate','ticketsScanned'].forEach(id=>$('#'+id).addEventListener('input',calc));calc();
$('#generateHtml').onclick=()=>{const c=$('#commissionTotal').textContent,s=$('#ticketsSold').value,r=$('#commissionRate').value,sc=$('#ticketsScanned').value;const out=`<!doctype html><html><body><h1>Commission & Scan Calculator</h1><p>Tickets sold: ${s}</p><p>Commission per ticket: £${r}</p><p>Tickets scanned: ${sc}</p><h2>Total commission: ${c}</h2></body></html>`;download('commission-scan-calculation.html',out,'text/html')};
$('#fareType').onchange=()=>$('#issuedTicketWrap').classList.toggle('hidden',$('#fareType').value!=='Zero fare');
const h=$('#operational .headcode'), date=$('#operational [data-date]'), summary=$('#operational textarea');
function updateEmail(){const hv=h.value||'[HEADCODE]';$('#subjectHeadcode').textContent=hv;$('#emailSummary').textContent=summary.value||'[DELAY SUMMARY]';}
[h,date,summary].forEach(x=>x.addEventListener('input',updateEmail));updateEmail();
$('#copyEmail').onclick=()=>navigator.clipboard.writeText(`Subject: Delay: delay notification ${h.value||'[HEADCODE]'} on ${date.value||'[DATE]'}\n\nHello, please find attached a short summary of a delay to a service I was working,\n\n${summary.value||'[DELAY SUMMARY]'}`);
$$('.print-btn').forEach(b=>b.onclick=()=>window.print());
$$('.export-btn').forEach(b=>b.onclick=()=>{const p=$('.page.active'),name=p.id+'.html';download(name,`<!doctype html><html><head><meta charset="utf-8"><title>${$('#pageTitle').textContent}</title><style>body{font-family:Arial;padding:30px}input,select,textarea{width:100%;padding:8px;margin:4px 0}label{display:block;margin:12px 0}</style></head><body><h1>${$('#pageTitle').textContent}</h1>${p.innerHTML}</body></html>`,'text/html')});
function download(name,data,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type}));a.download=name;a.click();URL.revokeObjectURL(a.href);}


// Progressive Web App installation and offline support.
let deferredInstallPrompt = null;
const installBanner = $('#installBanner');
const installBtn = $('#installBtn');
const dismissInstall = $('#dismissInstall');
const offlineStatus = $('#offlineStatus');

function refreshOnlineStatus(){
  const online = navigator.onLine;
  offlineStatus.textContent = online ? 'Online' : 'Offline';
  offlineStatus.classList.toggle('offline', !online);
}
window.addEventListener('online', refreshOnlineStatus);
window.addEventListener('offline', refreshOnlineStatus);
refreshOnlineStatus();

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installBanner.classList.remove('hidden');
});

installBtn?.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installBanner.classList.add('hidden');
});

dismissInstall?.addEventListener('click', () => installBanner.classList.add('hidden'));

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  installBanner.classList.add('hidden');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(console.error);
  });
}

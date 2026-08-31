
(function(){
"use strict";
function pageTitle(){
  var t=(document.querySelector("header:not(.xc-compact-header) .heading")||document.querySelector(".header .title")||document.querySelector(".hdr")||document.querySelector("h1"))?.innerText || document.title || "XC Staff App";
  return t.replace(/\s+/g," ").trim().replace(/^[^\w£]+/,"");
}
function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function getReportRoot(){
  return document.querySelector("#report:not(.hidden)") ||
         document.querySelector("#tir-report-print-v116:not(.hidden)") ||
         document.querySelector("[data-report-output]:not(.hidden)") ||
         document.querySelector(".generated-report:not(.hidden)");
}
function textFromForm(){
  var root=getReportRoot();
  if(root && root.innerText.trim()) return root.innerText.trim();
  var lines=[];
  document.querySelectorAll("main input,main select,main textarea").forEach(function(el){
    if(el.closest(".xc-actions")) return;
    var val=(el.value||"").trim();
    if(!val) return;
    var label="";
    if(el.id){
      var l=document.querySelector('label[for="'+CSS.escape(el.id)+'"]');
      if(l) label=l.innerText.trim();
    }
    if(!label && el.closest(".field")) label=(el.closest(".field").querySelector("label")||{}).innerText||"";
    if(!label) label=el.getAttribute("aria-label")||el.name||el.id||"Field";
    lines.push(label.replace(/\s+/g," ")+": "+val);
  });
  if(lines.length) return lines.join("\n");
  var main=document.querySelector("main");
  return main ? main.innerText.replace(/\n{3,}/g,"\n\n").trim() : document.body.innerText.trim();
}
function copyText(){
  var text=textFromForm();
  if(!text){setStatus("Nothing to copy.");return;}
  navigator.clipboard.writeText(text).then(function(){setStatus("Copied to clipboard.");}).catch(function(){
    var ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();
    try{document.execCommand("copy");setStatus("Copied to clipboard.");}catch(e){setStatus("Copy failed — please select the text manually.");}
    ta.remove();
  });
}
function emailText(){
  var text=textFromForm();
  if(!text){setStatus("Nothing to email.");return;}
  var subject="XC Staff App — "+pageTitle();
  window.location.href="mailto:?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(text);
}
function printPdf(){
  var isTir=/tir-builder\.html$/i.test(location.pathname);
  var tir=document.querySelector("#report");
  if(isTir && (!tir || !tir.innerText.trim() || tir.classList.contains("hidden"))){
    setStatus("Generate the TIR report first, then print / save it as PDF.");
    return;
  }
  setStatus("Opening print dialog — choose “Save as PDF” for a PDF copy.");
  if(isTir && tir){
    var sheet=document.createElement("div");
    sheet.className="xc-print-sheet";
    sheet.innerHTML='<div class="xc-print-brand"><img src="crosscountry-logo-transparent.png" alt="CrossCountry"><strong>TIR Report</strong></div>'+tir.innerHTML;
    document.body.appendChild(sheet);
    var cleanup=function(){sheet.remove();window.removeEventListener("afterprint",cleanup);};
    window.addEventListener("afterprint",cleanup);
    setTimeout(function(){window.print();setTimeout(cleanup,1200);},80);
    return;
  }
  setTimeout(function(){window.print();},80);
}
function shareEmail(){emailText();}
function setStatus(msg){
  var el=document.querySelector(".xc-action-status"); if(el) el.textContent=msg;
}
function addActions(){
  if(location.pathname.endsWith("index.html") || document.body.classList.contains("xc-home")) return;
  if(document.querySelector(".xc-actions")) return;
  var bar=document.createElement("div");bar.className="xc-actions";bar.setAttribute("data-xc-actions","true");
  bar.innerHTML='<button type="button" class="xc-print">🖨️ Print / Save PDF</button><button type="button" class="xc-copy">📋 Copy to Clipboard</button><button type="button" class="xc-email">✉️ Share via Email</button><div class="xc-action-status" aria-live="polite"></div>';
  var main=document.querySelector("main");
  var menu=document.querySelector(".xc-main-menu,.main-menu,.menu,.main-menu-btn");
  if(menu && menu.parentNode){menu.parentNode.insertBefore(bar,menu.nextSibling);}
  else if(main){main.insertBefore(bar,main.firstChild);}
  else document.body.insertBefore(bar,document.body.firstChild);
  bar.querySelector(".xc-print").addEventListener("click",printPdf);
  bar.querySelector(".xc-copy").addEventListener("click",copyText);
  bar.querySelector(".xc-email").addEventListener("click",emailText);
}
function addFooter(){
  if(document.querySelector(".xc-page-footer") || location.pathname.endsWith("index.html")) return;
  var f=document.createElement("div");f.className="xc-page-footer";
  f.innerHTML='<strong>XC Staff App</strong> · CrossCountry Train Manager tools';
  document.body.appendChild(f);
}
document.addEventListener("DOMContentLoaded",function(){addActions();addFooter();});
window.XCApp={pageTitle:pageTitle,textFromForm:textFromForm,copyText:copyText,emailText:emailText,printPdf:printPdf};
})();

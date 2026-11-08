'use strict';
// La web NO hace reservas. Una conversación de WhatsApp no significa confirmación.
const CHILDREN = [
  {id:'emeli', name:'Emeli Michell López', age:8, likes:'Peluches de panda', shirt:'10', shoes:'36', image:'assets/emeli.webp'},
  {id:'breydy', name:'Breydy Samara Figueroa Mejía', age:8, likes:'Peluches', shirt:'8', shoes:'30', image:'assets/breydy.webp'},
  {id:'nahomi', name:'Nahomi Sarai Flores Portillo', age:12, likes:'Un bolsón para la escuela', shirt:'12', shoes:'36', image:'assets/nahomi.webp'},
  {id:'oliver', name:'Oliver Josué López del Cid', age:11, likes:'Audífonos, almohadas y fútbol', shirt:'12', shoes:'36', image:'assets/oliver.webp'},
  {id:'darlin', name:'Darlin Ibeth Brisuela', age:11, likes:'Peluches de unicornio', shirt:'12', shoes:'5 (confirmar equivalencia)', image:'assets/darlin.webp'},
  {id:'nicole', name:'Nicole Angeli López Díaz', age:9, likes:'Peluches en forma de Jesús', shirt:'10–12', shoes:'34', image:'assets/nicole.webp'},
  {id:'melani', name:'Melani Alexa Pérez Méndez', age:10, likes:'Osos de peluche', shirt:'10', shoes:'Por confirmar', image:'assets/melani.webp'},
  {id:'asley', name:'Asley Gissell Pérez Méndez', age:12, likes:'Carteras, ropa y accesorios', shirt:'12', shoes:'37', image:'assets/asley.webp'},
  {id:'daniela', name:'Daniela Elizabeth Flores', age:7, likes:'Peluches', shirt:'8', shoes:'30', image:'assets/daniela.webp'},
  {id:'lucia', name:'Lucía Abigail Portillo', age:10, likes:'Peluches', shirt:'12', shoes:'36', image:null}
];
const cfg = window.CAJAS_CONFIG || {};
const whatsapp = /^\d{8,16}$/.test(cfg.whatsapp||'') ? cfg.whatsapp : '50377985997';
const states = Object.create(null);
const grid = document.getElementById('kids-grid');
const template = document.getElementById('kid-template');
const searchInput = document.getElementById('search-input');
const statusNames = {consultar:'Consultar disponibilidad',disponible:'Buscando padrino',apadrinado:'Ya tiene padrino',en_consulta:'En coordinación'};
function normalize(s){return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function whatsappLink(message){return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;}
function buildMessage(k){return `¡Bendiciones! 💖\n\nQuisiera consultar si todavía puedo apadrinar a *${k.name}* en el proyecto *Cajas de la Fe 2026*.\n\n👧🧒 *Edad:* ${k.age} años\n🎀 *Le gusta:* ${k.likes}\n👕 *Talla de camisa:* ${k.shirt}\n👟 *Talla de zapatos:* ${k.shoes}\n\n¿Podrían confirmarme si aún necesita padrino y cómo coordinamos el regalo? ¡Muchas gracias! 🎁`}
function setStatusBadge(el,status){el.textContent=statusNames[status]||statusNames.consultar;el.className=`kid-status status-${status}`;}
function createCard(k){
  const item=template.content.firstElementChild.cloneNode(true);
  item.dataset.id=k.id;
  const photo=item.querySelector('.kid-img');
  const placeholder=item.querySelector('.kid-image-placeholder');
  const showPlaceholder=()=>{photo.hidden=true;placeholder.hidden=false;item.querySelector('.kid-image').classList.add('no-photo');};
  if(k.image){photo.addEventListener('error',showPlaceholder,{once:true});photo.src=k.image;photo.alt=`Fotografía de ${k.name}`;photo.decoding='async';}
  else{showPlaceholder();}
  const status=states[k.id]||'consultar';
  setStatusBadge(item.querySelector('.kid-status'),status);
  item.querySelector('.kid-age').textContent=`${k.age} años`;
  item.querySelector('.kid-name').textContent=k.name;
  item.querySelector('.kid-likes').textContent=k.likes;
  item.querySelector('.kid-shirt').textContent=`👕 Camisa ${k.shirt}`;
  item.querySelector('.kid-shoes').textContent=`👟 Zapatos ${k.shoes}`;
  const action=item.querySelector('.kid-action');
  const helper=item.querySelector('.kid-disclaimer');
  if(status==='apadrinado'){
    action.textContent='✓ Ya tiene padrino';action.classList.add('claimed');
    action.removeAttribute('href');action.removeAttribute('target');action.setAttribute('aria-disabled','true');
    helper.textContent='¡Gracias! Ya tiene un padrino confirmado.';
  }else{
    action.textContent=status==='disponible'?'💗 Quiero apadrinar  ↗':'💬 Consultar por WhatsApp  ↗';
    action.href=whatsappLink(buildMessage(k));
    helper.textContent=status==='en_consulta'?'Hay una consulta en proceso; pregunta antes de preparar el regalo.':'La asignación se confirma con el equipo por WhatsApp.';
  }
  return item;
}
function renderKids(){
  const term=normalize(searchInput.value.trim());
  const visible=CHILDREN.filter(k=>normalize(`${k.name} ${k.likes} ${k.age}`).includes(term));
  const frag=document.createDocumentFragment();
  if(!visible.length){const el=document.createElement('div');el.className='empty-state';el.innerHTML='<span>💌</span><h3>No encontramos ese nombre</h3><p>Prueba buscando por edad, otro nombre o algún gusto.</p>';frag.appendChild(el)}
  else visible.forEach(k=>frag.appendChild(createCard(k)));
  grid.replaceChildren(frag);
  document.getElementById('count-label').textContent=`${visible.length} ${visible.length===1?'niño para conocer':'niños para conocer'}`;
}
function parseCSV(input){
  const rows=[];let row=[],word='',quoted=false;
  for(let i=0;i<input.length;i++){
    const c=input[i];
    if(c==='"' && quoted && input[i+1]==='"'){word+='"';i++;}
    else if(c==='"')quoted=!quoted;
    else if(c===',' && !quoted){row.push(word.trim());word='';}
    else if((c==='\n'||c==='\r') && !quoted){if(c==='\r'&&input[i+1]==='\n')i++;row.push(word.trim());if(row.some(x=>x))rows.push(row);row=[];word='';}
    else word+=c;
  }
  row.push(word.trim());if(row.some(x=>x))rows.push(row);
  return rows;
}
async function getPublishedStates(){
  if(!cfg.estadosCsvUrl)return;
  try{
    const url=new URL(cfg.estadosCsvUrl);
    if(url.protocol!=='https:')throw Error('URL inválida');
    const res=await fetch(url.href,{cache:'no-store',mode:'cors'});
    if(!res.ok)throw Error(`HTTP ${res.status}`);
    const rows=parseCSV(await res.text());
    if(!rows.length)return;
    const headers=rows.shift().map(h=>normalize(h.replace(/^\ufeff/,'')));
    const idCol=headers.indexOf('id'), statusCol=headers.indexOf('estado');
    if(idCol<0||statusCol<0)throw Error('El CSV requiere columnas id y estado');
    for(const row of rows){const id=normalize(row[idCol]||'');const st=normalize(row[statusCol]||'').replace(/\s+/g,'_');if(CHILDREN.some(k=>k.id===id)&&statusNames[st])states[id]=st;}
    renderKids();
  }catch(error){console.warn('No se pudo consultar la hoja de estados. Se continúa consultando por WhatsApp.',error);}
}
searchInput.addEventListener('input',renderKids);
for (const [id,msg] of [['help-wa','¡Bendiciones! Quisiera información sobre cómo apadrinar un niño en Cajas de la Fe 2026.'],['footer-wa','¡Bendiciones! Quisiera información de Cajas de la Fe 2026.']]){document.getElementById(id).href=whatsappLink(msg)}
const menu=document.getElementById('menu-toggle');const mobile=document.getElementById('mobile-navigation');
function setMenuOpen(open){menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');mobile.hidden=!open;}
menu.addEventListener('click',()=>setMenuOpen(menu.getAttribute('aria-expanded')!=='true'));
mobile.addEventListener('click',e=>{if(e.target.closest('a'))setMenuOpen(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobile.hidden){setMenuOpen(false);menu.focus();}});
document.addEventListener('click',e=>{if(!mobile.hidden&&!e.target.closest('.site-header'))setMenuOpen(false);});
window.matchMedia('(max-width: 850px)').addEventListener('change',()=>setMenuOpen(false));
renderKids();getPublishedStates();

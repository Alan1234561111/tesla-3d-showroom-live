import {cars, byId, paints, km, number, drive, photo, thumb} from './cars.js';
import {icon} from './icons.js';

const main = document.querySelector('#main');
const credits = document.querySelector('#credits-dialog');
const fullscreen = document.querySelector('#fullscreen');
const two = n => String(n).padStart(2, '0');
const settings = {light:'day', angle:'front', rotating:false, colors:{}};
const lights = [['day','日光棚','sun'],['sunset','斜陽','dusk'],['night','夜幕','moon']];
const angles = [['front','前 ¾'],['side','正側面'],['back','後 ¾'],['top','俯視']];
const app = {page:'', id:'s', pair:['s','3'], differences:false};
let viewer = null;
let studioTicket = 0;
const shapes = {s:'Model S P100D', '3':'初代 Model 3', x:'初代 Model X', y:'2021 Model Y', cybertruck:'Cybertruck 早期展示車'};

function route() {
  const [rawPage, rawId, rawSecond] = location.hash.slice(1).split('/');
  const page = ['showroom','studio','catalog','compare'].includes(rawPage) ? rawPage : 'showroom';
  const id = Object.hasOwn(byId,rawId) ? rawId : 's';
  let second = Object.hasOwn(byId,rawSecond) ? rawSecond : app.pair.find(v => v !== id);
  if (!second || second === id) second = cars.find(car => car.id !== id).id;
  return {page, id, second};
}
function path(page,id,other='') { return '#'+page+'/'+id+(other?'/'+other:''); }
function hrefBtn(page,car,text,symbol,cls='btn') {
  return `<a class="${cls}" href="${path(page,car.id)}">${icon(symbol)}<span>${text}</span></a>`;
}
function modelOptions(id) {
  return cars.map(car => `<option value="${car.id}" ${car.id===id?'selected':''}>${car.name}</option>`).join('');
}
function specLinks(car) {
  return `<a href="${car.spec}" target="_blank" rel="noopener">Tesla 車型資料 ${icon('ne',14)}</a><a href="${car.guide}" target="_blank" rel="noopener">車主手冊 · 尺寸 ${icon('ne',14)}</a>`;
}
function heroStat(symbol,value,unit,label) {
  return `<div class="hero-stat"><div class="stat-value">${value}<span>${unit}</span></div><div class="stat-label">${icon(symbol,13)}${label}</div></div>`;
}
function collection(car) {
  return `<section class="collection content-pad" aria-labelledby="collection-title">
    <div class="section-heading"><div class="section-title"><span class="orange-rule"></span><h2 id="collection-title">探索車系</h2><span class="micro sub-en" lang="en">THE LINEUP</span></div>
    <a href="${path('catalog',car.id)}" class="text-link">查看車型圖鑑 ${icon('ne',15)}</a></div>
    <div class="car-grid">${cars.map(item=>`<a class="car-card ${item===car?'selected':''}" href="${path('showroom',item.id)}" data-pick="${item.id}" ${item===car?'aria-current="true"':''} aria-label="展示 ${item.name}">
      <div class="tile-image"><img src="${thumb(item)}" alt="" width="560" height="248"><span class="tile-selected" aria-hidden="true"></span></div>
      <div class="tile-copy"><div><h3 lang="en">${item.name}</h3><p>${item.type}</p></div><span class="card-arrow">${icon('ne',14)}</span></div></a>`).join('')}</div>
  </section>`;
}
function showroom(car) {
  const index = cars.indexOf(car);
  const prev = cars[(index+cars.length-1)%cars.length], next = cars[(index+1)%cars.length];
  return `<section class="hero hero-${car.image}" aria-labelledby="hero-title">
    <div class="hero-visual"><img class="scene-photo" src="${photo(car)}" alt="${car.alt}" fetchpriority="high"></div><div class="hero-shade"></div>
    <div class="hero-inner content-pad"><div class="scene-tag">${icon('pin',14)}<span lang="en">${car.scene}</span></div>
      <div class="hero-copy"><div class="hero-eyebrow"><span class="eyeline"></span><span class="micro">TESLA COLLECTION</span><span class="eyediv"></span><span>${car.type}</span></div>
      <h1 id="hero-title" class="hero-name ${car.id==='cybertruck'?'long-name':''}" lang="en">${car.name}</h1>
      <p>${car.intro}</p></div>
      <div class="hero-actions">${hrefBtn('studio',car,'進入 3D 展間','cube','btn primary')}<a class="hero-secondary" href="${path('catalog',car.id)}">車型詳情 ${icon('ne',16)}</a></div>
      <div class="hero-bottom"><div class="hero-stats">${heroStat('bolt',km(car),'km','EPA 續航里程')+heroStat('gauge',car.accel,'s','0–60 mph'+(car.rollout?'*':''))+heroStat('motor',car.motors,'具','電動馬達')}</div>
      <div class="hero-pager"><div class="page-reading"><b>${two(index+1)}</b><span>/</span>${two(cars.length)}</div><a class="round" href="${path('showroom',prev.id)}" data-cycle="prev" aria-label="上一款車型">${icon('left',17)}</a><a class="round" href="${path('showroom',next.id)}" data-cycle="next" aria-label="下一款車型">${icon('right',17)}</a></div></div>
    </div></section>${collection(car)}`;
}
function catalog(car) {
  const rows = [['代表版本',car.trim],['EPA 續航',km(car)+' km ／ '+car.miles+' mi'],['0–60 mph 加速',car.accel+' s'+(car.rollout?'*':'')],['驅動系統',drive(car)],['車長',number(car.length)+' mm'],['車寬（不含後視鏡）',number(car.width)+' mm'],['車高',number(car.height)+' mm'],['軸距',number(car.wheelbase)+' mm'],['座位',car.seats+' 席']];
  return `<section class="subpage content-pad"><div class="page-heading"><div><span class="micro page-kicker">MODEL ARCHIVE</span><h1>車型圖鑑</h1></div><a class="text-link" href="${path('compare',car.id,app.pair.find(v=>v!==car.id)||'s')}">並排比較 ${icon('compare',16)}</a></div>
    <div class="catalog-layout"><nav class="catalog-menu" aria-label="瀏覽車型">${cars.map(item=>`<a class="archive-pick ${item===car?'active':''}" href="${path('catalog',item.id)}" ${item===car?'aria-current="true"':''}><img src="${thumb(item)}" alt=""><span><b>${item.name}</b><small>${item.type}</small></span>${icon('right',13)}</a>`).join('')}</nav>
      <article class="archive-detail"><div class="archive-image"><img src="${photo(car)}" alt="${car.alt}"><div class="archive-caption"><span class="micro">${car.trim}</span><h2 lang="en">${car.name}</h2></div><span class="archive-location">${icon('pin',13)}${car.place}</span></div>
      <div class="archive-columns"><div class="design-notes"><span class="micro page-kicker">DESIGN NOTES</span><h3>${car.tagline}</h3>
        ${car.details.map(([title,body])=>`<div class="design-point"><h4>${title}</h4><p>${body}</p></div>`).join('')}
        ${hrefBtn('studio',car,'以 3D 觀看','cube','btn primary small')}</div>
        <div class="spec-sheet"><h3>代表版本規格</h3><dl>${rows.map(([key,val])=>`<div><dt>${key}</dt><dd>${val}</dd></div>`).join('')}</dl>${car.rollout?'<p class="rollout-note">* 加速數據扣除起步滑行時間。</p>':''}<div class="source-links">${specLinks(car)}</div></div></div>
      </article></div></section>`;
}
const comparisons = [
  ['續航與動力',[
    ['EPA 續航里程',c=>km(c)+' km',c=>c.miles+' mi'],
    ['0–60 mph 加速',c=>c.accel+' s'+(c.rollout?'*':'')],
    ['驅動系統',drive],['電動馬達',c=>c.motors+' 具']]],
  ['車身尺寸',[
    ['車長',c=>number(c.length)+' mm'],['車寬（不含鏡）',c=>number(c.width)+' mm'],
    ['車高',c=>number(c.height)+' mm'],['軸距',c=>number(c.wheelbase)+' mm'],['座位',c=>c.seats+' 席']]]
];
function compareTile(car,which) {
  return `<div class="compare-tile"><img src="${thumb(car)}" alt="${car.alt}"><div class="compare-tile-caption"><label class="select-shell"><select data-compare="${which}" aria-label="${which===0?'左':'右'}側比較車型">${modelOptions(car.id)}</select>${icon('down',16)}</label><span class="trim-label">${car.trim}</span></div></div>`;
}
function compare(first,second) {
  return `<section class="subpage compare-page content-pad"><div class="page-heading"><div><span class="micro page-kicker">SIDE BY SIDE</span><h1>規格比較</h1></div><label class="diff-switch"><input type="checkbox" id="differences" ${app.differences?'checked':''}><span class="switch-track"></span>只看差異</label></div>
    <div class="comparison"><div class="compare-tiles">${compareTile(first,0)}<button class="swap round" data-action="swap" aria-label="對調比較車型" title="對調比較車型">${icon('swap',18)}</button>${compareTile(second,1)}</div>
    <table class="comparison-table"><caption class="sr-only">${first.name} 與 ${second.name} 美規代表版本比較</caption><thead><tr><th scope="col">比較項目</th><th scope="col">${first.name}</th><th scope="col">${second.name}</th></tr></thead>
    ${comparisons.map(([group,fields])=>{const rows=fields.filter(([,value])=>!app.differences||value(first)!==value(second));return rows.length?`<tbody><tr class="group-row"><th colspan="3" scope="rowgroup">${group}</th></tr>${rows.map(([key,value,sub])=>`<tr><th scope="row">${key}</th>${[first,second].map(c=>`<td>${value(c)}${sub?` <small>/ ${sub(c)}</small>`:''}</td>`).join('')}</tr>`).join('')}</tbody>`:''}).join('')}</table>
    <div class="compare-notes"><p>美規代表版本。續航依 EPA 英里估值換算至整公里。* 加速數據扣除起步滑行時間。有氣壓懸吊的車款採中段車高。</p>
      <div class="source-links"><a href="${first.spec}" target="_blank" rel="noopener">${first.name} 官方資料 ${icon('ne',13)}</a><a href="${second.spec}" target="_blank" rel="noopener">${second.name} 官方資料 ${icon('ne',13)}</a></div></div></div></section>`;
}
function colorFor(car) { return settings.colors[car.id] || car.paint; }
function studio(car) {
  const color = colorFor(car);
  return `<section class="subpage studio-page content-pad"><div class="page-heading studio-heading"><div><a class="back-link" href="${path('showroom',car.id)}">${icon('back',15)}返回展示間</a><h1>3D 展間</h1></div><label class="switch-model"><span>切換車型</span><span class="select-shell"><select id="studio-model" aria-label="切換 3D 車型">${modelOptions(car.id)}</select>${icon('down',15)}</span></label></div>
    <div class="studio-layout"><div class="viewer-box" id="viewer-box" data-light="${settings.light}">
      <div id="webgl-mount" role="region" aria-label="可拖曳的 3D 車輛展示"></div>
      <div class="viewer-heading"><span class="viewer-tag"><i></i><span id="render-label">3D STUDIO</span></span><h2 lang="en">${car.name}</h2></div>
      <div id="load-status" class="load-status" role="status"><span class="loader-dot"></span>載入 3D 模型…</div>
      <div class="viewer-tools"><button type="button" class="spin-button" data-action="spin" aria-pressed="${settings.rotating}">${icon('spin',17)}<span>環繞</span></button><span class="tool-divider"></span><button type="button" data-action="zoom-in" aria-label="放大" title="放大">${icon('plus',17)}</button><button type="button" data-action="zoom-out" aria-label="縮小" title="縮小">${icon('minus',17)}</button><button type="button" data-action="reset" aria-label="重設鏡位" title="重設鏡位">${icon('reset',16)}</button></div>
    </div><aside class="studio-panel" aria-label="展間控制"><div class="panel-caption"><span class="orange-rule"></span><h2>展間控制</h2></div>
      <fieldset class="paint-field"><legend>車身塗裝</legend><div class="paint-options">${Object.entries(paints).map(([key,p])=>`<button class="swatch" style="--swatch:${p.hex}" data-paint="${key}" aria-label="${p.name}" title="${p.name}" aria-pressed="${key===color}"></button>`).join('')}</div><span class="control-caption" id="paint-caption">${paints[color].name}</span></fieldset>
      <fieldset class="light-field"><legend>棚景燈光</legend><div class="light-options">${lights.map(([key,label,symbol])=>`<button data-light="${key}" aria-pressed="${key===settings.light}">${icon(symbol,19)}${label}</button>`).join('')}</div></fieldset>
      <fieldset><legend>觀看角度</legend><div class="angle-options">${angles.map(([key,label])=>`<button data-angle="${key}" aria-pressed="${key===settings.angle}">${label}</button>`).join('')}</div></fieldset>
      <div class="studio-hint">${icon('hand',17)}<span class="pointer-hint">拖曳旋轉，滾輪縮放</span><span class="touch-hint">拖曳旋轉，雙指縮放</span></div>
    </aside></div><div class="studio-foot"><span>立體造型取自 ${shapes[car.id]}。圖鑑規格採美規 ${car.name} ${car.trim}。</span><a class="text-link" href="${path('catalog',car.id)}">閱讀車型圖鑑 ${icon('ne',14)}</a></div></section>`;
}

function speak(message) { document.querySelector('#announcement').textContent = message; }
function updatePressed(selector,attribute,key) {
  for (const btn of main.querySelectorAll(selector)) btn.setAttribute('aria-pressed',String(btn.dataset[attribute]===key));
}
function unavailable(note,car) {
  const stage=main.querySelector('#viewer-box');
  if(!stage)return;
  stage.classList.add('fallback');
  main.querySelector('#webgl-mount').innerHTML=`<img class="backup-frame" alt="${car.name} 多角度模型圖">`;
  const fallbackImg=main.querySelector('.backup-frame');
  fallbackImg.addEventListener('error',()=>{fallbackImg.onerror=null;if(!fallbackImg.src.endsWith('scene-'+car.image+'.webp'))fallbackImg.src=photo(car);});
  function frame(){fallbackImg.src='./assets/views/'+car.image+'-'+(settings.angle||'front')+'.webp';}
  frame();
  main.querySelector('#render-label').textContent='多角度圖集';
  const status=main.querySelector('#load-status');
  status.hidden=false;
  status.className='fallback-status';
  status.innerHTML=`<span>${note}，已切換為多角度圖集。</span><button data-action="retry">重試 3D</button>`;
  main.querySelector('.viewer-tools').hidden=true;
  stage.dataset.light='day';
  updatePressed('[data-paint]','paint',car.paint);
  updatePressed('button[data-light]','light','day');
  main.querySelector('#paint-caption').textContent=paints[car.paint].name;
  for(const btn of main.querySelectorAll('button[data-paint],button[data-light]'))btn.disabled=true;
  main.querySelector('.studio-hint').textContent='點選觀看角度切換模型圖。';
  settings.angle=settings.angle||'front';
  updatePressed('[data-angle]','angle',settings.angle);
  viewer={setAngle:frame,dispose(){}};
}
async function initStudio(car,ticket) {
  let session=viewer;
  try {
    if(!session){
      const mod=await import('./viewer.js');
      if(ticket!==studioTicket)return;
      session=mod.createViewer(main.querySelector('#webgl-mount'),{
        onManual:()=>{settings.angle='';settings.rotating=false;updatePressed('[data-angle]','angle','');main.querySelector('[data-action=spin]')?.setAttribute('aria-pressed','false');},
        onHome:()=>{settings.angle='front';updatePressed('[data-angle]','angle','front');},
        onLoss:()=>{if(viewer===session){session.dispose();unavailable('繪圖連線中斷',byId[app.id]);}}
      });
      viewer=session;
    }
    session.setRotate(false);
    session.setLight(settings.light);
    await session.load(car.id,paints[colorFor(car)].hex);
    if(ticket!==studioTicket || viewer!==session)return;
    session.setAngle(settings.angle||'front',true);
    session.setColor(paints[colorFor(car)].hex);
    session.setRotate(settings.rotating);
    main.querySelector('#load-status').hidden=true;
    main.querySelector('#render-label').textContent='LIVE 3D';
    main.querySelector('#viewer-box').classList.add('live');
  } catch (err) {
    if(ticket!==studioTicket)return;
    console.warn('3D viewer:',err?.message || 'unavailable');
    session?.dispose();
    unavailable('此裝置暫時無法顯示即時 3D',car);
  }
}
function render(options={}) {
  const next=route();
  const previous={page:app.page,id:app.id};
  const restore=options.restore || (document.activeElement?.dataset.cycle ? '[data-cycle="'+document.activeElement.dataset.cycle+'"]' : '');
  const ticket=++studioTicket;
  const keepStage=app.page==='studio' && next.page==='studio' && !!viewer?.load;
  if(viewer&&!keepStage){viewer.dispose();viewer=null;}
  app.page=next.page;app.id=next.id;
  if(next.page==='compare')app.pair=[next.id,next.second];
  if(next.page==='studio' && previous.id!==next.id){settings.angle='front';settings.rotating=false;}
  const car=byId[app.id];
  document.body.dataset.page=app.page;
  for(const link of document.querySelectorAll('[data-nav]')){
    const key=link.dataset.nav;
    const active=key===app.page || (key==='showroom' && app.page==='studio');
    if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    link.href=key==='compare'?path(key,app.id,app.pair.find(id=>id!==app.id)||cars.find(c=>c!==car).id):path(key,app.id);
  }
  if(app.page==='catalog')main.innerHTML=catalog(car);
  else if(app.page==='compare')main.innerHTML=compare(car,byId[next.second]);
  else if(app.page==='studio'){
    settings.angle=settings.angle||'front';
    if(keepStage){
      const fragment=document.createElement('template');fragment.innerHTML=studio(car);
      for(const selector of ['.studio-panel','.studio-foot'])main.querySelector(selector).replaceWith(fragment.content.querySelector(selector));
      main.querySelector('.viewer-heading h2').textContent=car.name;
      main.querySelector('.back-link').href=path('showroom',car.id);
      main.querySelector('#studio-model').value=car.id;
      main.querySelector('#load-status').hidden=false;
      main.querySelector('[data-action=spin]').setAttribute('aria-pressed','false');
      main.querySelector('#render-label').textContent='3D STUDIO';
    }else main.innerHTML=studio(car);
    initStudio(car,ticket);
  }else main.innerHTML=showroom(car);
  const pageLabel={showroom:'展示間',catalog:'車型圖鑑',studio:'3D 展間',compare:'規格比較'}[app.page];
  document.title=(app.page==='compare'?'規格比較':car.name+' · '+pageLabel)+' | FORM STUDIO';
  if(previous.page && previous.page!==app.page){window.scrollTo(0,0);main.focus({preventScroll:true});}
  if(app.page==='catalog' && window.innerWidth<820){
    const active=main.querySelector('.archive-pick.active');const menu=active?.parentElement;
    if(menu)menu.scrollLeft=active.offsetLeft-menu.offsetLeft-menu.clientWidth/2+active.offsetWidth/2;
  }
  if(restore)main.querySelector(restore)?.focus({preventScroll:true});
  if(previous.page)speak(car.name+'，'+pageLabel);
}
function changePage(page,first,second) {
  const to=path(page,first,second);
  if(location.hash!==to) location.hash=to;
}
function updateFullControl() {
  const native=!!(document.documentElement.requestFullscreen && document.fullscreenEnabled || document.documentElement.webkitRequestFullscreen && document.webkitFullscreenEnabled);
  const active=!!(document.fullscreenElement || document.webkitFullscreenElement || document.body.classList.contains('focus-layout'));
  fullscreen.querySelector('.full-icon').innerHTML=icon(active?'collapse':'expand',16);
  const label=active?(native?'退出全螢幕':'退出專注'):(native?'全螢幕':'專注模式');
  fullscreen.querySelector('.full-label').textContent=label;
  fullscreen.setAttribute('aria-label',label);fullscreen.setAttribute('aria-pressed',String(active));fullscreen.title=label;
}
fullscreen.addEventListener('click',async()=>{
  try{
    if(document.fullscreenElement)await document.exitFullscreen();
    else if(document.webkitFullscreenElement)document.webkitExitFullscreen();
    else if(document.fullscreenEnabled)await document.documentElement.requestFullscreen();
    else if(document.webkitFullscreenEnabled)document.documentElement.webkitRequestFullscreen();
    else document.body.classList.toggle('focus-layout');
  } catch {document.body.classList.toggle('focus-layout');}
  updateFullControl();
});
document.addEventListener('fullscreenchange',updateFullControl);
document.addEventListener('webkitfullscreenchange',updateFullControl);
document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();main.focus();});
document.addEventListener('click',event=>{
  const btn=event.target.closest('button,a[data-pick]');
  if(!btn)return;
  if(btn.dataset.pick && window.innerWidth<700)window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  const action=btn.dataset.action;
  if(action==='credits'){credits.showModal();return;}
  if(action==='close-credits'){credits.close();return;}
  if(action==='swap'){changePage('compare',app.pair[1],app.pair[0]);return;}
  if(app.page!=='studio')return;
  const car=byId[app.id];
  if(action==='retry'){render();return;}
  if(btn.dataset.paint){
    settings.colors[car.id]=btn.dataset.paint;
    const p=paints[btn.dataset.paint];
    updatePressed('[data-paint]','paint',btn.dataset.paint);
    main.querySelector('#paint-caption').textContent=p.name;viewer?.setColor?.(p.hex);return;
  }
  if(btn.dataset.light){
    settings.light=btn.dataset.light;updatePressed('button[data-light]','light',settings.light);
    main.querySelector('#viewer-box').dataset.light=settings.light;viewer?.setLight?.(settings.light);return;
  }
  if(btn.dataset.angle){
    settings.angle=btn.dataset.angle;settings.rotating=false;updatePressed('[data-angle]','angle',settings.angle);
    main.querySelector('[data-action=spin]').setAttribute('aria-pressed','false');
    viewer?.setRotate?.(false);viewer?.setAngle?.(settings.angle);return;
  }
  if(action==='spin'){
    settings.rotating=!settings.rotating;btn.setAttribute('aria-pressed',String(settings.rotating));
    if(settings.rotating){settings.angle='';updatePressed('[data-angle]','angle','');}
    viewer?.setRotate?.(settings.rotating);
  }
  if(action==='reset'){
    settings.angle='front';settings.rotating=false;viewer?.setRotate?.(false);viewer?.setAngle?.('front');
    updatePressed('[data-angle]','angle','front');main.querySelector('[data-action=spin]').setAttribute('aria-pressed','false');
  }
  if(action==='zoom-in'||action==='zoom-out')viewer?.zoom?.(action==='zoom-in'?0.82:1.22);
});
document.addEventListener('change',event=>{
  const el=event.target;
  if(el.id==='studio-model')changePage('studio',el.value);
  else if(el.id==='differences'){app.differences=el.checked;render({restore:'#differences'});}
  else if(el.dataset.compare!==undefined){
    const i=Number(el.dataset.compare), pair=[...app.pair];
    if(el.value===pair[1-i])pair[1-i]=pair[i];
    pair[i]=el.value;changePage('compare',pair[0],pair[1]);
  }
});
credits.addEventListener('click',event=>{if(event.target===credits){const r=credits.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)credits.close();}});
document.querySelector('#credit-links').innerHTML=cars.map(c=>`<a href="${c.spec}" target="_blank" rel="noopener">${c.name} ${icon('ne',12)}</a>`).join('');
window.addEventListener('hashchange',()=>render());
updateFullControl();
render();

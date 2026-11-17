import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {rewriteForPages} from '../scripts/prepare-pages-subpath.mjs';
import {reportPreviews} from '../dist/report-previews.js';

const options={basePath:'/portfolio-v2',namespace:'portfolio-v2'};
test('every report preview and download belongs to the new deployment',()=>{
  for(const report of Object.values(reportPreviews)){
    for(const route of [report.href,...report.pages.flatMap(page=>[page.src,page.smallSrc].filter(Boolean))]){
      const script=rewriteForPages(JSON.stringify({route}),options,'report-previews.js');
      assert.equal(JSON.parse(script).route,'/portfolio-v2'+route);
    }
  }
});
test('relative assets, external links and the existing online backend retain their destinations',()=>{
  const code=`const relative='./assets/picture.webp', external='https://example.com/assets/picture.webp', api='https://listening-room-portfolio-lenovo-1102.deanslist1.chatgpt.site/api/battleship';`;
  assert.equal(rewriteForPages(code,options,'app.js'),code);
});
test('theme, opening and game sessions cannot overwrite original-site browser keys',()=>{
  for(const key of ['lr-theme','lr-opening-seen','lr-position','lr-selected-project','online_session','battleship_room_connection','battleship-local-diagnostics-v1']){
    for(const quote of ['"',"'",'`']){
      const code=`sessionStorage.setItem(${quote}${key}${quote},'value')`;
      assert.equal(rewriteForPages(code,options,'app.js'),`sessionStorage.setItem(${quote}portfolio-v2:${key}${quote},'value')`);
    }
  }
});

async function openViewer(src){
  const text=await readFile(new URL('../dist/image-viewer.js',import.meta.url),'utf8');
  const code=rewriteForPages(text,options,'image-viewer.js').replace(/^import .*;\r?\n/,'').replace('import.meta.url',JSON.stringify('https://siyiyu66.github.io/portfolio-v2/image-viewer.js'));
  const elements=new Map();
  const document={documentElement:{dataset:{},style:{setProperty(){}}},querySelector(){return {content:''};},getElementById(id){if(!elements.has(id))elements.set(id,{hidden:true,addEventListener(){}});return elements.get(id);}};
  vm.runInNewContext(code,{URL,URLSearchParams,location:{search:'?'+new URLSearchParams({src,drawing:'artwork',inkWidth:'32'})},localStorage:{getItem(){return 'light';}},document,loadTypography(){}});
  return elements;
}
test('the figure viewer accepts study pages and transparent artwork under its own base path',async()=>{
  for(const src of ['/portfolio-v2/assets/projects/spray/report/page-01.webp','/portfolio-v2/assets/projects/ichack/logo-1600.avif']){
    const elements=await openViewer(src);
    assert.equal(elements.get('image')?.src,src);
    assert.equal(elements.get('image')?.hidden,false);
    if(src.endsWith('.avif'))assert.equal(elements.get('ink-overlay')?.src,src);
  }
});
test('the viewer rejects media from the original site and arbitrary external paths',async()=>{
  for(const src of ['/assets/projects/spray/report/page-01.webp','https://example.com/picture.webp','/portfolio-v2/assets/projects/ichack/../../private.webp']){
    const elements=await openViewer(src);
    assert.equal(elements.get('image')?.src,undefined);
    assert.equal(elements.get('error')?.hidden,false);
  }
});

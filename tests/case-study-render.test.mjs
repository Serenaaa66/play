import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {tallyStudy} from '../dist/tally-study.js';
import {occupiedProject} from '../dist/occupied-study.js';
import {themeImageSource} from '../dist/case-theme-images.js';

class Element{
  constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.attributes={};this.className='';this._text='';this.properties={};this.style={setProperty:(name,value)=>{this.properties[name]=value;}};this.classList={add:name=>{this.className+=' '+name;}};}
  append(...nodes){for(const node of nodes){if(node.tagName==='#FRAGMENT')this.append(...node.children);else this.children.push(node);}}
  replaceChildren(...nodes){this.children=[];this.append(...nodes);}
  setAttribute(name,value){this.attributes[name]=value;}
  removeAttribute(name){delete this.attributes[name];}
  set textContent(value){this._text=value;this.children=[];}
  get textContent(){return this._text+this.children.map(node=>node.textContent).join('');}
  querySelectorAll(selector){return descendants(this).filter(node=>node.tagName===selector.toUpperCase());}
}
const descendants=node=>node.children.flatMap(child=>[child,...descendants(child)]);
const hasClass=(node,name)=>node.className.split(' ').includes(name);
async function render(study,theme){
  const document={documentElement:{dataset:{theme}},createElement:tag=>new Element(tag),createDocumentFragment:()=>new Element('#fragment'),createTextNode:text=>{const node=new Element('#text');node.textContent=text;return node;}};
  const strips=[];
  const code=(await readFile(new URL('../dist/project-case-study.js',import.meta.url),'utf8')).replace(/^import .*;\r?$/gm,'').replace('export function renderProjectCaseStudy','function renderProjectCaseStudy');
  const context=vm.createContext({document,URL,location:{href:'https://siyiyu66.github.io/portfolio-v2/#project/in-motion'},themeImageSource,
    mountCaseImageStrip(strip){strips.push(strip);return ()=>{};},mountCaseVideos(){return ()=>{};},mountCaseThemeImages(){return ()=>{};},renderPIDControl(){throw Error('Unexpected PID content.');}});
  vm.runInContext(code,context);
  const host=new Element('div'),dispose=context.renderProjectCaseStudy(host,study,{scroller:host,reducedMotion:true});
  return {host,strips,nodes:descendants(host),dispose};
}
test('the Tally story renders all seven chapters and ordered image groups in both themes',async()=>{
  for(const theme of ['light','dark']){
    const h=await render(tallyStudy,theme);
    assert.equal(h.nodes.filter(node=>hasClass(node,'case-chapter')).length,7);
    assert.equal(h.nodes.filter(node=>hasClass(node,'case-figure')).length,24);
    assert.equal(h.nodes.filter(node=>hasClass(node,'case-note-icon')).length,3);
    assert.equal(h.strips.length,4);
    const first=h.nodes.find(node=>hasClass(node,'case-chapter'));
    const labels=descendants(first).filter(node=>hasClass(node,'case-gallery-label')).map(node=>node.textContent);
    assert.deepEqual(labels,['Observe the work','Map the friction']);
    const diagrams=h.nodes.filter(node=>node.tagName==='IMG'&&node.dataset.themeDarkSrc);
    assert.equal(diagrams.length,3);
    assert.ok(diagrams.every(image=>image.src.endsWith('-'+theme+'.svg')));
    const viewers=h.nodes.filter(node=>node.tagName==='A'&&node.dataset.themeViewer);
    for(const link of viewers){
      const url=new URL(link.href);
      assert.equal(url.pathname,'/portfolio-v2/image-viewer.html');
      assert.ok(url.searchParams.get('src').endsWith('-'+theme+'.svg'));
    }
    const film=h.nodes.filter(node=>node.href==='https://www.youtube.com/watch?v=ZbQ81tp5KtI');
    assert.equal(film.length,0);assert.equal(h.nodes.filter(node=>node.tagName==='VIDEO').length,1);
    h.dispose();
  }
});
test('OCCUPIED ends with one inline scroll-play film after its four project images',async()=>{
  const h=await render(occupiedProject.caseStudy,'dark');
  const chapters=h.nodes.filter(node=>hasClass(node,'case-chapter'));
  assert.equal(chapters.length,3);assert.ok(hasClass(chapters[0],'case-chapter--image-led'));
  assert.equal(h.nodes.filter(node=>hasClass(node,'case-figure')).length,5);
  assert.ok(h.nodes.filter(node=>node.tagName==='IMG').every(image=>image.src.includes('/occupied/study/')));
  assert.equal(h.strips.length,0);
  const videos=h.nodes.filter(node=>node.tagName==='VIDEO');
  assert.equal(videos.length,1);
  assert.equal(videos[0].dataset.autoplayOnView,'true');
  assert.equal(videos[0].muted,true);assert.equal(videos[0].defaultMuted,true);
  assert.equal(videos[0].playsInline,true);assert.equal(videos[0].controls,true);
  assert.equal(videos[0].preload,'none');assert.equal(videos[0].autoplay,undefined);
  assert.match(videos[0].src,/\/occupied-demo\.mp4$/);
  assert.equal(h.nodes.filter(node=>node.tagName==='IFRAME').length,0);
  h.dispose();
});

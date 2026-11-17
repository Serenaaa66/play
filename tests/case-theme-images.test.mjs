import test from 'node:test';
import assert from 'node:assert/strict';
import {mountCaseThemeImages} from '../dist/case-theme-images.js';

test('theme changes update original and cloned figures, including their full-size destinations',()=>{
  const root={dataset:{theme:'light'}},images=[];let observer;
  class Observer{constructor(callback){this.callback=callback;observer=this;}observe(target,options){this.target=target;this.options=options;}disconnect(){this.disconnected=true;}}
  function image(){
    const link={dataset:{themeViewer:'true'},href:'https://siyiyu66.github.io/portfolio-v2/image-viewer.html?drawing=theme&caption=Test'};
    let src='';
    return {dataset:{themeLightSrc:'./assets/figure-light.svg',themeDarkSrc:'./assets/figure-dark.svg'},getAttribute(){return src;},setAttribute(_,value){src=value;},closest(){return link;},link};
  }
  images.push(image());
  const dispose=mountCaseThemeImages({host:{querySelectorAll(){return images;}},root,Observer,baseUrl:'https://siyiyu66.github.io/portfolio-v2/'});
  assert.equal(images[0].getAttribute('src'),'./assets/figure-light.svg');
  images.push(image()); // A reel may clone its cycle after the first paint.
  root.dataset.theme='dark';observer.callback();
  for(const item of images){
    assert.equal(item.getAttribute('src'),'./assets/figure-dark.svg');
    const viewer=new URL(item.link.href);
    assert.equal(viewer.searchParams.get('src'),'/portfolio-v2/assets/figure-dark.svg');
    assert.equal(viewer.searchParams.get('theme'),'dark');
    assert.equal(viewer.searchParams.get('caption'),'Test');
  }
  root.dataset.theme='light';observer.callback();
  assert.ok(images.every(item=>item.getAttribute('src').endsWith('-light.svg')));
  assert.deepEqual(observer.options,{attributes:true,attributeFilter:['data-theme']});
  dispose();assert.ok(observer.disconnected);
});
test('stories without themed diagrams create no extra observer',()=>{
  let created=false;
  class Observer{constructor(){created=true;}}
  const dispose=mountCaseThemeImages({host:{querySelectorAll(){return [];}},root:{},Observer,baseUrl:'https://example.com/'});
  dispose();assert.equal(created,false);
});

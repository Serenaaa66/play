import test from 'node:test';
import assert from 'node:assert/strict';
import {mountCaseVideos} from '../dist/case-video.js';

function setup(){
  const document=new EventTarget();document.hidden=false;
  const videos=[{pauses:0,pause(){this.pauses++;}},{pauses:0,pause(){this.pauses++;}}];
  let observer;
  class Observer{
    constructor(callback){this.callback=callback;this.observed=[];this.disconnected=false;observer=this;}
    observe(video){this.observed.push(video);}
    disconnect(){this.disconnected=true;}
  }
  const dispose=mountCaseVideos(videos,{Observer,visibilityTarget:document});
  return {videos,document,observer,dispose};
}

test('offscreen or background case videos pause without automatic playback',()=>{
  const h=setup();assert.deepEqual(h.observer.observed,h.videos);
  h.observer.callback([{target:h.videos[0],isIntersecting:false},{target:h.videos[1],isIntersecting:true}]);
  assert.deepEqual(h.videos.map(v=>v.pauses),[1,0]);
  h.document.hidden=true;h.document.dispatchEvent(new Event('visibilitychange'));
  assert.deepEqual(h.videos.map(v=>v.pauses),[2,1]);
  h.document.hidden=false;h.document.dispatchEvent(new Event('visibilitychange'));
  assert.deepEqual(h.videos.map(v=>v.pauses),[2,1]);h.dispose();
});

test('leaving a project disposes the video observer and visibility listener exactly once',()=>{
  const h=setup();h.dispose();h.dispose();
  assert.ok(h.observer.disconnected);
  assert.deepEqual(h.videos.map(v=>v.pauses),[1,1]);
  h.document.hidden=true;h.document.dispatchEvent(new Event('visibilitychange'));
  assert.deepEqual(h.videos.map(v=>v.pauses),[1,1]);
  assert.doesNotThrow(()=>mountCaseVideos([],{Observer:null,visibilityTarget:null})());
});

function autoSetup(play){
  const document=new EventTarget();document.hidden=false;
  const video={dataset:{autoplayOnView:'true'},paused:true,ended:false,plays:0,pauses:0,
    pause(){this.paused=true;this.pauses++;},
    play(){this.plays++;this.paused=false;return play?play(this):Promise.resolve();}};
  let observer;
  class Observer{constructor(callback,options){this.callback=callback;this.options=options;observer=this;}observe(){}disconnect(){this.disconnected=true;}}
  const dispose=mountCaseVideos([video],{Observer,visibilityTarget:document});
  const enter=ratio=>observer.callback([{target:video,isIntersecting:ratio>0,intersectionRatio:ratio}]);
  const visibility=hidden=>{document.hidden=hidden;document.dispatchEvent(new Event('visibilitychange'));};
  return {video,document,observer,enter,visibility,dispose};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));

test('only an opted-in film starts when substantially visible and pauses after leaving',async()=>{
  const h=autoSetup();
  h.enter(.2);assert.equal(h.video.plays,0);
  h.enter(.4);await settle();assert.equal(h.video.plays,1);
  h.enter(.8);h.enter(.3);assert.equal(h.video.plays,1);assert.equal(h.video.paused,false);
  h.enter(.05);assert.equal(h.video.paused,true);
  h.enter(.5);await settle();assert.equal(h.video.plays,2);
  h.dispose();assert.equal(h.video.paused,true);
});
test('native manual pause is respected until the viewer leaves and re-enters the film',async()=>{
  const h=autoSetup();h.enter(.7);await settle();h.video.pause();
  h.enter(1);h.enter(.5);assert.equal(h.video.plays,1);
  h.visibility(true);h.visibility(false);await settle();assert.equal(h.video.plays,1);
  h.enter(0);h.enter(.7);await settle();assert.equal(h.video.plays,2);
  h.dispose();
});
test('background tabs pause and resume only an active scroll-play film',async()=>{
  const h=autoSetup();h.enter(.7);await settle();
  h.visibility(true);assert.equal(h.video.paused,true);
  h.visibility(false);await settle();assert.equal(h.video.plays,2);
  h.dispose();h.visibility(true);h.visibility(false);assert.equal(h.video.plays,2);
});
test('a delayed or rejected play promise cannot restart an offscreen or disposed film',async()=>{
  let finish;
  const h=autoSetup(video=>new Promise(resolve=>{finish=()=>{video.paused=false;resolve();};}));
  h.enter(.7);h.enter(0);finish();await settle();assert.equal(h.video.paused,true);
  h.enter(.7);h.dispose();finish();await settle();assert.equal(h.video.paused,true);
  const blocked=autoSetup(()=>Promise.reject(new Error('Autoplay disabled by browser')));
  blocked.enter(.8);await settle();blocked.enter(1);assert.equal(blocked.video.plays,1);blocked.dispose();
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {projects} from '../dist/projects.js';
import {tallyStudy} from '../dist/tally-study.js';
import {occupiedProject} from '../dist/occupied-study.js';
import {coverImagePlacement} from '../dist/project-media.js';

const study=new URL('../assets/projects/in-motion/study/',import.meta.url);
const luminance=hex=>{const rgb=hex.match(/[a-f\d]{2}/gi).map(c=>parseInt(c,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
test('Tally diagrams keep every original vector path while providing readable theme palettes',async()=>{
  for(const name of ['transaction-flow','confidence-journey','customer-indecision']){
    const original=await readFile(new URL(name+'.svg',study),'utf8');
    const paths=svg=>[...svg.matchAll(/\sd="([^"]+)"/g)].map(match=>match[1]);
    for(const theme of ['light','dark']){
      const svg=await readFile(new URL(`${name}-${theme}.svg`,study),'utf8');
      assert.deepEqual(paths(svg),paths(original));
      assert.doesNotMatch(svg,/<script|<foreignObject|<image|href\s*=/);
      const ink=theme==='light'?'#49443D':'#DCD5CA',paper=theme==='light'?'#f2f2f2':'#171512';
      assert.ok(contrast(ink,paper)>=4.5);
      assert.ok(contrast('#F4EEE2','#B83E28')>=4.5);
      if(theme==='dark')assert.ok(contrast('#F58B6E',paper)>=4.5);
    }
  }
});
test('supplied transparent originals retain their bytes and alpha',async()=>{
  const proof=JSON.parse(await readFile(new URL('../docs/tally-v2-media.json',import.meta.url),'utf8'));
  for(const name of ['exploded-transparent.png','tally-mark.png']){
    const data=await readFile(new URL(name,study)),metadata=await sharp(data).metadata();
    assert.equal(createHash('sha256').update(data).digest('hex'),proof.assets.find(entry=>entry.name===name).sha256);
    assert.equal(metadata.hasAlpha,true);
  }
});
test('Tally follows research, co-design, interaction, identity, engineering and outcome in order',()=>{
  assert.deepEqual(tallyStudy.chapters.map(chapter=>chapter.label),['UX research','Co-design','Interaction design','Product identity','How it works','Renders','Final film & reflection']);
  assert.equal(tallyStudy.links.length,1);
  assert.equal(tallyStudy.links[0].href,'https://www.youtube.com/watch?v=ZbQ81tp5KtI');
  assert.equal(tallyStudy.links[0].label,'Watch the final film');
  assert.ok(!JSON.stringify(tallyStudy).includes('bell-sketch.webp'));
  assert.match(JSON.stringify(tallyStudy.chapters.at(-1)),/early sticky-note trial/i);
});
test('OCCUPIED is a distinct 2025 disc with its own shared-material maps and three concise sections',async()=>{
  assert.equal(new Set(projects.map(project=>project.id)).size,11);
  assert.equal(projects.findIndex(project=>project.id==='occupied'),projects.findIndex(project=>project.id==='spray')+1);
  assert.equal(occupiedProject.year,'2025');
  assert.match(occupiedProject.cover,/blue-door\.png$/);
  const placement=coverImagePlacement(842,666,1024,occupiedProject.coverCrop);
  const face={x:placement.x+400/842*placement.width,y:placement.y+155/666*placement.height};
  assert.ok(face.y>300&&face.y<412,'The face stays below the printed title and above the centre label.');
  assert.ok(Math.hypot(face.x-512,face.y-512)>110,'The disc centre does not obscure the face.');
  assert.equal(occupiedProject.caseStudy.chapters.length,3);
  const manifest=JSON.parse(await readFile(new URL('../assets/disc-surfaces/occupied/manifest.json',import.meta.url),'utf8'));
  assert.equal(manifest.projectId,'occupied');
  assert.equal(manifest.colorArtworkModified,false);
  for(const map of manifest.maps){assert.ok((await readFile(new URL('../assets/disc-surfaces/occupied/'+map,import.meta.url))).length>1000);}
});

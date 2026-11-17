import {uropProject} from './urop-study.js';
import {sustainableProject} from './coursework-studies.js';
import {tallyHero,tallyMetadata,tallyStudy} from './tally-study.js';
import {ichackHero,ichackMetadata,ichackStudy} from './ichack-study.js';
import {sprayProject} from './spray-study.js';
import {occupiedProject} from './occupied-study.js';
export const projects=[
{id:'in-motion',art:3,demo:false,...tallyMetadata,...tallyHero,caseStudy:tallyStudy},
occupiedProject, sprayProject,
{id:'ichack',art:6,demo:false,...ichackMetadata,...ichackHero,caseStudy:ichackStudy},
{"id":"battleship","art":7,"demo":false,"name":"Battleship","discTitle":"Battleship","discSubtitle":"TACTICAL NAVAL WARFARE","year":"2026","category":"Game Development / JavaScript","role":"Designer & Developer","cover":"./assets/games/battleship/assets/background pic.webp","coverCrop":{"zoom":1,"positionX":0.5,"positionY":0.5},"hero":"./assets/games/battleship/assets/background pic.webp","heroAlt":"Orange and blue naval fleets facing one another across the ocean","overview":"A browser-based naval strategy game with AI and multiplayer modes","description":"A functional Battleship engine with cinematic UI, three AI difficulties, same-device play and room-code multiplayer.","headline":"Command the ocean.","lede":"A Computing 2 game project by Siyi Yu. Deploy your fleet, read the battlefield and outmanoeuvre your opponent.","sections":[],"game":"./assets/games/battleship/index.html"},
{id:'between-spaces',art:0,demo:false,year:'2026',category:'Software Engineering / Biomechanical Simulation',discTitle:'UROP',discSubtitle:'UNDERGRADUATE RESEARCH',cover:'./assets/projects/urop/urop-cover.jpg',coverCrop:{zoom:1,positionX:.2,positionY:.5},...uropProject},
{id:'soft-signals',art:4,demo:false,...sustainableProject}
];

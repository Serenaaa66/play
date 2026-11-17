// Content and project evidence supplied by Siyi Yu. Year confirmed as 2025.
const media='./assets/projects/occupied/study/';
export const occupiedProject={
  id:'occupied',art:10,demo:false,name:'OCCUPIED!',discTitle:'OCCUPIED!',
  discSubtitle:'PLAYFUL PHYSICAL INTERACTION',year:'2025',
  category:'Interaction Design / Physical Computing',
  cover:media+'blue-door.png',coverInk:'#eee7d9',
  coverCrop:{zoom:1,positionX:.5,positionY:.32},
  hero:media+'blue-door.png',heroFit:'contain',
  heroAlt:'A character peeks above the blue door of the OCCUPIED! physical installation',
  overview:'An interactive installation turning an awkward everyday moment into play',
  description:'Knocks, light switches and a stolen sheet of paper trigger a playful character’s reactions.',
  headline:'Gamifying everyday frustration.',
  lede:'An interactive physical installation turning a common awkward moment into a playful brand experience. A closed toilet door becomes the starting point for a small, surprising game.',
  collection:'Experiential Design',
  credits:[
    ['EXPERIENCE','Experiential Marketing · Gamification · User Empathy'],
    ['TOOLKIT','C++ · Bela · Sensors · Servo Mechanisms']
  ],
  caseStudy:{
    chapters:[
      {
        label:'First impression',title:'OCCUPIED!',layout:'image-led',
        intro:'A familiar closed door, an unexpected face and an invitation to interact. The installation turns an awkward interruption into a playful physical encounter.',
        notes:[
          ['Experiential marketing','Create a memorable encounter.'],
          ['Gamification','Reward curiosity with a response.'],
          ['User empathy','Start with a familiar human moment.']
        ],
        figures:[{src:media+'blue-door.png',width:842,height:666,wide:true,caption:'First encounter · A character peeks over the blue door'}]
      },
      {
        label:'Interactive storytelling & user journey',title:'Knock. Peek. Push your luck.',
        intro:[
          'The journey moves from a normal state towards a win state through actions such as knocking, opening the door or “stealing” toilet paper.',
          'Each action triggers a different combination of voice, light and movement. Timed transitions let the character react, recover and invite the next interaction.',
          'A physical game designed to create memorable, shareable moments.'
        ],
        figures:[{src:media+'interaction-map.png',width:1182,height:836,wide:true,maxWidth:1120,diagram:true,caption:'User journey · Physical actions, character reactions and timed states'}]
      },
      {
        label:'From concept to reality',title:'Make every action count.',
        intro:'Electronics and C++ game logic bring the interaction into a working physical prototype. Sensor selection makes the actions intuitive, while servo mechanisms, light and audio give the character a clear response.',
        notes:[
          ['Sense','A piezo disc detects knocks; switches detect the door, light control and removed paper.'],
          ['Respond','Five servos control body movement, the door, the arms and the paper mechanism.']
        ],
        figureGroups:[
          {label:'Electronics & control',figures:[{src:media+'electronics.png',width:1158,height:813,wide:true,maxWidth:1120,diagram:true,caption:'Electronics · Sensors, five servo motors, COB LED and audio connected to Bela'}]},
          {label:'Build & test',figures:[{src:media+'prototype-testing.png',width:1795,height:1010,wide:true,maxWidth:1120,caption:'Prototype development · Wiring, mechanisms, sensor checks and hands-on testing'}]}
        ]
      }
    ]
  }
};

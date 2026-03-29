// ===== SET 1 =====
export default [
  // ── MORAL DILEMMAS (6) ──
  {
    id:'1m1',category:'moral',type:'subjective',
    text:'Your best friend confesses they cheated on an important exam. What do you do?',
    options:['Report them to the teacher immediately','Talk to them privately and urge them to confess','Help them hide it because friendship matters most','Ignore it — it\'s not your problem'],
    weights:{0:{empathy:1,leadership:2},1:{empathy:3,leadership:1},2:{empathy:2,practicality:1},3:{practicality:2}}
  },
  {
    id:'1m2',category:'moral',type:'subjective',
    text:'You find a wallet with ₹5,000 and an ID card on the road. What would you do?',
    options:['Keep the money — finders keepers','Try to contact the owner using the ID','Hand it over to the nearest police station','Take the money but return the wallet and cards'],
    weights:{0:{practicality:3},1:{empathy:3,leadership:1},2:{empathy:2,leadership:2},3:{practicality:2}}
  },
  {
    id:'1m3',category:'moral',type:'subjective',
    text:'A classmate is being bullied online. You are not close to them. What do you do?',
    options:['Report the bullying to a teacher or authority','Stand up for them publicly online','Send them a private supportive message','Stay out of it — you don\'t want to get involved'],
    weights:{0:{leadership:2,empathy:1},1:{leadership:3,empathy:2},2:{empathy:3},3:{practicality:2}}
  },
  {
    id:'1m4',category:'moral',type:'subjective',
    text:'You accidentally break an expensive item at a friend\'s house. Nobody saw it. What do you do?',
    options:['Tell your friend immediately and offer to pay','Stay quiet and hope nobody notices','Blame it on someone else','Tell them later when the time feels right'],
    weights:{0:{empathy:3,leadership:1},1:{practicality:2},2:{practicality:1},3:{empathy:2,practicality:1}}
  },
  {
    id:'1m5',category:'moral',type:'subjective',
    text:'Your team member takes credit for your idea during a presentation. How do you react?',
    options:['Confront them publicly right away','Talk to them privately after the meeting','Let it go — ideas are meant to be shared','Bring it up with the team lead separately'],
    weights:{0:{leadership:2},1:{empathy:2,leadership:2},2:{empathy:3},3:{leadership:3,practicality:1}}
  },
  {
    id:'1m6',category:'moral',type:'subjective',
    text:'You discover a company you admire is secretly polluting a river. What matters most to you?',
    options:['Exposing them publicly on social media','Reporting them to environmental authorities','Boycotting their products quietly','It\'s not my responsibility'],
    weights:{0:{leadership:3,creativity:1},1:{leadership:2,empathy:2},2:{empathy:2,practicality:1},3:{practicality:2}}
  },

  // ── TECH & LOGIC (6) ──
  {
    id:'1t1',category:'tech',type:'objective',correct:2,
    text:'What does "HTTP" stand for?',
    options:['Hyper Text Transfer Program','High Tech Transfer Protocol','Hyper Text Transfer Protocol','Home Tool Transfer Protocol'],
    weights:{}
  },
  {
    id:'1t2',category:'tech',type:'objective',correct:1,
    text:'Which data structure uses FIFO (First In, First Out)?',
    options:['Stack','Queue','Tree','Graph'],
    weights:{}
  },
  {
    id:'1t3',category:'tech',type:'objective',correct:3,
    text:'What is the output of: console.log(typeof null) in JavaScript?',
    options:['"null"','"undefined"','"boolean"','"object"'],
    weights:{}
  },
  {
    id:'1t4',category:'tech',type:'objective',correct:0,
    text:'Which sorting algorithm has the best average-case time complexity?',
    options:['Merge Sort — O(n log n)','Bubble Sort — O(n²)','Selection Sort — O(n²)','Insertion Sort — O(n²)'],
    weights:{}
  },
  {
    id:'1t5',category:'tech',type:'objective',correct:2,
    text:'In binary, what is the decimal value of 1010?',
    options:['8','12','10','14'],
    weights:{}
  },
  {
    id:'1t6',category:'tech',type:'objective',correct:1,
    text:'Which protocol is used to send emails?',
    options:['FTP','SMTP','HTTP','SSH'],
    weights:{}
  },

  // ── REASONING (6) ──
  {
    id:'1r1',category:'reasoning',type:'objective',correct:2,
    text:'Complete the series: 2, 6, 12, 20, 30, ?',
    options:['40','38','42','36'],
    weights:{}
  },
  {
    id:'1r2',category:'reasoning',type:'objective',correct:1,
    text:'If all Bloops are Razzies, and all Razzies are Lazzies, then:',
    options:['All Lazzies are Bloops','All Bloops are Lazzies','All Razzies are Bloops','None of these'],
    weights:{}
  },
  {
    id:'1r3',category:'reasoning',type:'objective',correct:3,
    text:'A clock shows 3:15. What is the angle between the hour and minute hands?',
    options:['0°','15°','5.5°','7.5°'],
    weights:{}
  },
  {
    id:'1r4',category:'reasoning',type:'objective',correct:0,
    text:'Find the odd one out: Apple, Mango, Potato, Banana',
    options:['Potato','Apple','Mango','Banana'],
    weights:{}
  },
  {
    id:'1r5',category:'reasoning',type:'objective',correct:2,
    text:'If FRIEND is coded as GSJFOE, how is CANDLE coded?',
    options:['DBOEMF','DBOEMF','DBOEMF','DBOFME'],
    weights:{}
  },
  {
    id:'1r6',category:'reasoning',type:'objective',correct:1,
    text:'A man walks 5 km south, then 3 km east, then 5 km north. How far is he from start?',
    options:['5 km','3 km','8 km','13 km'],
    weights:{}
  },

  // ── PERSONALITY & VOLUNTEERING (6) ──
  {
    id:'1p1',category:'personality',type:'subjective',
    text:'If you could volunteer for any cause, which would you pick?',
    options:['Teaching underprivileged children','Environmental clean-up drives','Organizing community health camps','Building tech solutions for NGOs'],
    weights:{0:{empathy:3,leadership:1},1:{empathy:2,practicality:1},2:{empathy:2,leadership:2},3:{logic:2,creativity:2}}
  },
  {
    id:'1p2',category:'personality',type:'subjective',
    text:'In a group project, you naturally tend to:',
    options:['Take charge and delegate tasks','Come up with creative ideas','Do detailed research and analysis','Mediate conflicts and keep the team together'],
    weights:{0:{leadership:3},1:{creativity:3},2:{logic:3},3:{empathy:3}}
  },
  {
    id:'1p3',category:'personality',type:'subjective',
    text:'How do you handle failure?',
    options:['Analyze what went wrong and plan better','Get upset but bounce back quickly','Seek advice from mentors','Move on to the next thing immediately'],
    weights:{0:{logic:3,practicality:1},1:{empathy:1,leadership:2},2:{empathy:2,practicality:1},3:{practicality:3}}
  },
  {
    id:'1p4',category:'personality',type:'subjective',
    text:'What motivates you the most?',
    options:['Making a positive impact on society','Personal growth and learning','Financial stability and success','Recognition and achievement'],
    weights:{0:{empathy:3},1:{creativity:2,logic:1},2:{practicality:3},3:{leadership:3}}
  },
  {
    id:'1p5',category:'personality',type:'subjective',
    text:'Which department would you join in a volunteer organization?',
    options:['Marketing & Outreach','Operations & Logistics','Content & Creative','Technology & Data'],
    weights:{0:{leadership:2,creativity:1},1:{practicality:3},2:{creativity:3},3:{logic:3}}
  },
  {
    id:'1p6',category:'personality',type:'subjective',
    text:'When facing a big decision, you rely mostly on:',
    options:['Logic and data','Gut feeling and intuition','Advice from trusted people','Past experiences'],
    weights:{0:{logic:3},1:{creativity:2,empathy:1},2:{empathy:3},3:{practicality:3}}
  },

  // ── CREATIVE / APTITUDE (6) ──
  {
    id:'1c1',category:'creative',type:'subjective',
    text:'You\'re given one day to build anything. What do you create?',
    options:['A mobile app that solves a real problem','A short film or music video','A community garden or public art piece','A business plan for a startup'],
    weights:{0:{logic:2,creativity:2},1:{creativity:3},2:{empathy:2,creativity:2},3:{leadership:2,practicality:2}}
  },
  {
    id:'1c2',category:'creative',type:'subjective',
    text:'Which superpower would you choose?',
    options:['Mind reading — understand everyone','Time travel — fix past mistakes','Teleportation — explore everywhere','Super intelligence — solve any problem'],
    weights:{0:{empathy:3},1:{practicality:3},2:{creativity:3},3:{logic:3}}
  },
  {
    id:'1c3',category:'creative',type:'subjective',
    text:'How do you prefer to express yourself?',
    options:['Writing stories or blogs','Drawing, painting, or designing','Public speaking or debating','Building things with code or tools'],
    weights:{0:{creativity:3,empathy:1},1:{creativity:3},2:{leadership:3},3:{logic:2,creativity:1}}
  },
  {
    id:'1c4',category:'creative',type:'subjective',
    text:'A blank wall in your school needs decorating. You suggest:',
    options:['A colorful mural painted by students','An interactive digital display','A gallery of student achievements','A motivational quote wall'],
    weights:{0:{creativity:3},1:{logic:2,creativity:2},2:{leadership:2,empathy:1},3:{empathy:2}}
  },
  {
    id:'1c5',category:'creative',type:'subjective',
    text:'If you could master one skill instantly, it would be:',
    options:['Playing a musical instrument','Coding and AI development','Public speaking and negotiation','Graphic design and animation'],
    weights:{0:{creativity:3},1:{logic:3},2:{leadership:3},3:{creativity:3}}
  },
  {
    id:'1c6',category:'creative',type:'subjective',
    text:'Your ideal weekend activity is:',
    options:['Attending a hackathon or workshop','Visiting an art gallery or museum','Volunteering at a local shelter','Planning and organizing an event'],
    weights:{0:{logic:2,creativity:1},1:{creativity:3},2:{empathy:3},3:{leadership:3}}
  }
];

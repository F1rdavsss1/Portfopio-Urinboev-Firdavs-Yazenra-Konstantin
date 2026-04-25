import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

/* ── DATA ── */
const DEVS = [
  {
    id: 'firdavs', name: 'Уринбоев Фирдавс', initials: 'УФ', role: 'Junior Developer',
    desc: 'Разрабатываю Telegram-ботов и веб-сайты. Люблю чистый код и интересные задачи.',
    skills: [
      { name: 'JavaScript', pct: 50 }, { name: 'TypeScript', pct: 40 },
      { name: 'Python', pct: 35 },     { name: 'HTML / CSS', pct: 100 },
    ],
    abilities: [
      { icon: '🤖', title: 'Telegram боты',  sub: 'inline · FSM · платёжные · уведомления',  color: '#4fc3f7' },
      { icon: '🌐', title: 'Веб-сайты',      sub: 'адаптивная вёрстка · SPA · лендинги',      color: '#81c784' },
      { icon: '🔗', title: 'REST API',        sub: 'интеграции · fetch · axios · авторизация', color: '#ffb74d' },
      { icon: '🗄️', title: 'Базы данных',    sub: 'SQLite · PostgreSQL · запросы · схемы',    color: '#ce93d8' },
    ],
    projects: [
      { name: 'Игра «Замок»',         tech: 'Python',     desc: 'Текстовая RPG с инвентарём' },
      { name: 'Змейка',                tech: 'JavaScript', desc: 'Классическая аркада' },
      { name: 'Крестики-нолики',       tech: 'JavaScript', desc: 'PvP и режим против ИИ' },
      { name: 'Камень-ножницы-бумага', tech: 'JavaScript', desc: 'Против компьютера' },
      { name: 'Угадай число',          tech: 'JavaScript', desc: 'Логическая игра' },
    ],
  },
  {
    id: 'konstantin', name: 'Яценко Константин', initials: 'ЯК', role: 'Junior Developer',
    desc: 'Создаю ботов и сайты. Интересуюсь автоматизацией и игровой разработкой.',
    skills: [
      { name: 'JavaScript', pct: 40 }, { name: 'TypeScript', pct: 30 },
      { name: 'Python', pct: 35 },     { name: 'HTML / CSS', pct: 55 },
    ],
    abilities: [
      { icon: '🤖', title: 'Telegram боты',  sub: 'inline · FSM · платёжные · уведомления',  color: '#4fc3f7' },
      { icon: '🌐', title: 'Веб-сайты',      sub: 'адаптивная вёрстка · SPA · лендинги',      color: '#81c784' },
      { icon: '��', title: 'REST API',        sub: 'интеграции · fetch · axios · авторизация', color: '#ffb74d' },
      { icon: '🗄️', title: 'Базы данных',    sub: 'SQLite · PostgreSQL · запросы · схемы',    color: '#ce93d8' },
    ],
    projects: [
      { name: 'Игра «Замок»',         tech: 'Python',     desc: 'Текстовая RPG с инвентарём' },
      { name: 'Змейка',                tech: 'JavaScript', desc: 'Классическая аркада' },
      { name: 'Крестики-нолики',       tech: 'JavaScript', desc: 'PvP и режим против ИИ' },
      { name: 'Камень-ножницы-бумага', tech: 'JavaScript', desc: 'Против компьютера' },
      { name: 'Угадай число',          tech: 'JavaScript', desc: 'Логическая игра' },
    ],
  },
];
const STATS = [
  { label: 'Проектов', val: 10, sfx: '+' }, { label: 'Технологий', val: 5, sfx: '' },
  { label: 'Ботов', val: 8, sfx: '+' },     { label: 'Месяцев опыта', val: 12, sfx: '' },
];
const TIMELINE = [
  { year: '2023', title: 'Начало пути',        desc: 'Первые шаги. HTML, CSS, основы Python.' },
  { year: '2024', title: 'JavaScript & Боты',  desc: 'Освоили JS, первые Telegram-боты, ретро-игры.' },
  { year: '2025', title: 'TypeScript & React', desc: 'Переход на TS. Первые React-проекты и REST API.' },
  { year: '2026', title: 'Сейчас',             desc: 'Fullstack, командные проекты, Weather & News App.' },
];

/* ── WEB + CHAIN + MOLECULES CANVAS ── */
const ArtCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let raf: number;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);

    /* --- NODES for web/chain --- */
    type Node = { x:number; y:number; vx:number; vy:number; r:number; gold:boolean };
    const N = 55;
    const nodes: Node[] = Array.from({length:N}, () => ({
      x: Math.random()*c.width, y: Math.random()*c.height,
      vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35,
      r: 1.5 + Math.random()*2.5,
      gold: Math.random() < .18,
    }));

    /* --- MOLECULES (H2O style) --- */
    type Mol = { x:number; y:number; vx:number; vy:number; angle:number; va:number; size:number; gold:boolean };
    const mols: Mol[] = Array.from({length:14}, () => ({
      x: Math.random()*c.width, y: Math.random()*c.height,
      vx: (Math.random()-.5)*.5, vy: (Math.random()-.5)*.5,
      angle: Math.random()*Math.PI*2, va: (Math.random()-.5)*.015,
      size: 10 + Math.random()*14,
      gold: Math.random() < .4,
    }));

    /* --- CHAIN LINKS --- */
    type Link = { x:number; y:number; vx:number; vy:number; angle:number; va:number };
    const links: Link[] = Array.from({length:8}, () => ({
      x: Math.random()*c.width, y: Math.random()*c.height,
      vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3,
      angle: Math.random()*Math.PI*2, va: .008,
    }));

    const GOLD = 'rgba(212,175,55,';
    const PINK = 'rgba(255,92,168,';
    const WHT  = 'rgba(220,220,220,';

    const drawMolecule = (m: Mol, t: number) => {
      const col = m.gold ? GOLD : PINK;
      const s = m.size;
      const pulse = 1 + Math.sin(t*.001 + m.x)*.08;
      const ps = s * pulse;
      /* oxygen atom */
      ctx.beginPath(); ctx.arc(m.x, m.y, ps*.55, 0, Math.PI*2);
      ctx.strokeStyle = col+'.7)'; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.beginPath(); ctx.arc(m.x, m.y, ps*.2, 0, Math.PI*2);
      ctx.fillStyle = col+'.25)'; ctx.fill();
      /* hydrogen atoms */
      for (const sign of [-1,1]) {
        const hx = m.x + Math.cos(m.angle + sign*.9)*ps;
        const hy = m.y + Math.sin(m.angle + sign*.9)*ps*.7;
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(hx, hy);
        ctx.strokeStyle = col+'.3)'; ctx.lineWidth = .8; ctx.stroke();
        ctx.beginPath(); ctx.arc(hx, hy, ps*.28, 0, Math.PI*2);
        ctx.strokeStyle = col+'.5)'; ctx.lineWidth = 1; ctx.stroke();
      }
    };

    const drawChainLink = (lk: Link) => {
      const col = GOLD;
      const w = 22, h = 12;
      ctx.save();
      ctx.translate(lk.x, lk.y);
      ctx.rotate(lk.angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, w, h, 0, 0, Math.PI*2);
      ctx.strokeStyle = col+'.55)'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, w*.55, h*.55, 0, 0, Math.PI*2);
      ctx.strokeStyle = col+'.25)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
    };

    let t = 0;
    const tick = () => {
      t++;
      ctx.clearRect(0,0,c.width,c.height);

      /* move nodes */
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x<0||n.x>c.width)  n.vx*=-1;
        if (n.y<0||n.y>c.height) n.vy*=-1;
      });

      /* draw web edges */
      const DIST = 140;
      for (let i=0;i<N;i++) {
        for (let j=i+1;j<N;j++) {
          const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
          const d=Math.sqrt(dx*dx+dy*dy);
          if (d<DIST) {
            const a=(1-d/DIST)*.35;
            const bothGold = nodes[i].gold && nodes[j].gold;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x,nodes[i].y);
            ctx.lineTo(nodes[j].x,nodes[j].y);
            ctx.strokeStyle = bothGold ? GOLD+a+')' : WHT+(a*.6)+')';
            ctx.lineWidth = bothGold ? 1.2 : .6;
            ctx.stroke();
          }
        }
      }

      /* draw nodes */
      nodes.forEach(n => {
        const pulse = 1 + Math.sin(t*.02+n.x*.01)*.3;
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r*pulse,0,Math.PI*2);
        ctx.fillStyle = n.gold ? GOLD+'.8)' : PINK+'.6)';
        ctx.fill();
        if (n.gold) {
          ctx.beginPath(); ctx.arc(n.x,n.y,n.r*pulse*2.5,0,Math.PI*2);
          ctx.strokeStyle = GOLD+'.15)'; ctx.lineWidth=1; ctx.stroke();
        }
      });

      /* draw molecules */
      mols.forEach(m => {
        m.x+=m.vx; m.y+=m.vy; m.angle+=m.va;
        if (m.x<-50||m.x>c.width+50)  m.vx*=-1;
        if (m.y<-50||m.y>c.height+50) m.vy*=-1;
        drawMolecule(m, t);
      });

      /* draw chain links */
      links.forEach(lk => {
        lk.x+=lk.vx; lk.y+=lk.vy; lk.angle+=lk.va;
        if (lk.x<-40||lk.x>c.width+40)  lk.vx*=-1;
        if (lk.y<-40||lk.y>c.height+40) lk.vy*=-1;
        drawChainLink(lk);
      });

      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="art-canvas" />;
};

/* ── 3D CUBE ── */
const Cube: React.FC = () => {
  const [rot, setRot] = useState({ x: -20, y: 30 });
  const drag = useRef<{ active:boolean; lx:number; ly:number }>({ active:false, lx:0, ly:0 });
  const autoRef = useRef<number>(0);
  useEffect(() => {
    let last = 0;
    const loop = (t: number) => {
      if (!drag.current.active) { const dt=t-last; setRot(r=>({...r,y:r.y+dt*.02})); }
      last=t; autoRef.current=requestAnimationFrame(loop);
    };
    autoRef.current=requestAnimationFrame(loop);
    return () => cancelAnimationFrame(autoRef.current);
  }, []);
  const onDown = useCallback((e: React.PointerEvent) => {
    drag.current={active:true,lx:e.clientX,ly:e.clientY};
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);
  const onMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx=e.clientX-drag.current.lx, dy=e.clientY-drag.current.ly;
    drag.current.lx=e.clientX; drag.current.ly=e.clientY;
    setRot(r=>({x:r.x-dy*.5,y:r.y+dx*.5}));
  }, []);
  const onUp = useCallback(() => { drag.current.active=false; }, []);
  const faces = [
    {cls:'front',label:'JS'},{cls:'back',label:'TS'},
    {cls:'left',label:'PY'},{cls:'right',label:'CSS'},
    {cls:'top',label:'{ }'},{cls:'bottom',label:'</>'},
  ];
  return (
    <div className="cube-scene" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
      <div className="cube" style={{transform:`rotateX(${rot.x}deg) rotateY(${rot.y}deg)`}}>
        {faces.map(f=>(
          <div key={f.cls} className={`cube-face cube-face--${f.cls}`}><span>{f.label}</span></div>
        ))}
      </div>
      <div className="cube-shadow"/>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   SOLAR SYSTEM  — NASA-style, pure canvas, zoom on click
══════════════════════════════════════════════════════ */
const PLANET_DATA = [
  { name:'Меркурий', color:'#b0b0b0', r:4,  orbit:72,  speed:4.15,  angle:0.5,
    grad:['#d0d0d0','#909090','#606060'],
    info:{ dist:'57.9 млн км', period:'88 дней', moons:0, radius:'2 439 км', temp:'-180 / +430°C',
           desc:'Ближайшая к Солнцу планета. Почти нет атмосферы, огромные перепады температур.' }},
  { name:'Венера',   color:'#e8cda0', r:7,  orbit:108, speed:1.62,  angle:1.2,
    grad:['#f5e0a0','#c8a050','#906020'],
    info:{ dist:'108.2 млн км', period:'225 дней', moons:0, radius:'6 051 км', temp:'+465°C',
           desc:'Самая горячая планета. Плотная атмосфера из CO₂ создаёт парниковый эффект.' }},
  { name:'Земля',    color:'#4fc3f7', r:8,  orbit:148, speed:1.0,   angle:2.1,
    grad:['#60d0ff','#2060c0','#104080'],
    info:{ dist:'149.6 млн км', period:'365 дней', moons:1, radius:'6 371 км', temp:'-88 / +58°C',
           desc:'Наш дом. Единственная известная планета с жизнью. 71% поверхности — океаны.' }},
  { name:'Марс',     color:'#e07050', r:6,  orbit:196, speed:0.53,  angle:3.4,
    grad:['#f08060','#b04030','#702010'],
    info:{ dist:'227.9 млн км', period:'687 дней', moons:2, radius:'3 389 км', temp:'-125 / +20°C',
           desc:'Красная планета. Имеет самый высокий вулкан — Олимп (21 км).' }},
  { name:'Юпитер',   color:'#c8a87a', r:20, orbit:264, speed:0.084, angle:0.8,
    grad:['#e0c090','#a07840','#604820'], ring:false,
    info:{ dist:'778.5 млн км', period:'12 лет', moons:95, radius:'69 911 км', temp:'-110°C',
           desc:'Крупнейшая планета. Большое Красное Пятно — шторм длиной более 350 лет.' }},
  { name:'Сатурн',   color:'#e8d5a0', r:17, orbit:332, speed:0.034, angle:2.6, ring:true,
    grad:['#f0e0a8','#c0a060','#806030'],
    info:{ dist:'1.43 млрд км', period:'29 лет', moons:146, radius:'58 232 км', temp:'-140°C',
           desc:'Планета с кольцами из льда и камней. Плотность меньше воды!' }},
  { name:'Уран',     color:'#7de8e8', r:12, orbit:392, speed:0.012, angle:4.1,
    grad:['#90f0f0','#40b0b0','#207070'],
    info:{ dist:'2.87 млрд км', period:'84 года', moons:28, radius:'25 362 км', temp:'-195°C',
           desc:'Вращается «лёжа на боку» — ось наклонена на 98°. Имеет слабые кольца.' }},
  { name:'Нептун',   color:'#4060e8', r:11, orbit:448, speed:0.006, angle:5.5,
    grad:['#5070f8','#2040c0','#102080'],
    info:{ dist:'4.50 млрд км', period:'165 лет', moons:16, radius:'24 622 км', temp:'-200°C',
           desc:'Самые сильные ветры в Солнечной системе — до 2 100 км/ч.' }},
];
type PD = typeof PLANET_DATA[0];
const SolarSystem: React.FC<{ fullscreen?: boolean }> = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;

    /* ── resize ── */
    const resize = () => {
      const p = c.parentElement;
      c.width  = p ? p.clientWidth  : window.innerWidth;
      c.height = p ? p.clientHeight : Math.round(window.innerHeight * 0.88);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c.parentElement || c);

    /* ── camera ── */
    const cam   = { x: 0, y: 0, zoom: 1 };
    let tgtCam  = { x: 0, y: 0, zoom: 1 };
    const drag  = { on: false, lx: 0, ly: 0, moved: false };

    /* ── focus state ── */
    let focused: PD | null = null;
    let frozenAngles: Record<string, number> = {};   // planet name → frozen angle
    let infoAlpha = 0;
    let t = 0;
    let raf: number;

    /* ── stars ── */
    const STARS = Array.from({ length: 320 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.5 + 0.2,
      a: Math.random() * 0.75 + 0.15,
      ph: Math.random() * Math.PI * 2,
    }));

    const screenPos: { x: number; y: number; r: number; p: PD }[] = [];
    const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

    /* ════════════════════════════════════
       DRAW PLANET — detailed sphere
    ════════════════════════════════════ */
    const drawPlanet = (
      wx: number, wy: number, pr: number, p: PD, selfRot: number
    ) => {
      ctx.save();
      ctx.translate(wx, wy);

      /* atmosphere glow */
      const atm = ctx.createRadialGradient(0, 0, pr * 0.85, 0, 0, pr * 1.9);
      atm.addColorStop(0, p.color + '22');
      atm.addColorStop(0.5, p.color + '10');
      atm.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(0, 0, pr * 1.9, 0, Math.PI * 2);
      ctx.fillStyle = atm; ctx.fill();

      /* base sphere */
      const bg = ctx.createRadialGradient(-pr * 0.3, -pr * 0.3, pr * 0.02, 0, 0, pr);
      bg.addColorStop(0, p.grad[0]);
      bg.addColorStop(0.5, p.grad[1]);
      bg.addColorStop(1, '#010103');
      ctx.beginPath(); ctx.arc(0, 0, pr, 0, Math.PI * 2);
      ctx.fillStyle = bg; ctx.fill();

      /* clip to sphere for all surface details */
      ctx.save();
      ctx.beginPath(); ctx.arc(0, 0, pr, 0, Math.PI * 2); ctx.clip();

      /* ── per-planet surface ── */
      if (p.name === 'Земля') {
        /* ocean base already done; add continent patches */
        ctx.fillStyle = 'rgba(46,125,50,0.55)';
        const patches = [
          [-0.15, -0.2, 0.28], [0.1, 0.05, 0.22], [-0.3, 0.1, 0.18],
          [0.25, -0.3, 0.15],  [0.0, 0.3, 0.2],
        ];
        patches.forEach(([dx, dy, rs]) => {
          const px2 = dx * pr + Math.cos(selfRot) * pr * 0.1;
          const py2 = dy * pr;
          ctx.beginPath(); ctx.arc(px2, py2, rs * pr, 0, Math.PI * 2);
          ctx.fill();
        });
        /* polar ice */
        ctx.fillStyle = 'rgba(220,240,255,0.7)';
        ctx.beginPath(); ctx.ellipse(0, -pr * 0.88, pr * 0.35, pr * 0.14, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(0,  pr * 0.88, pr * 0.28, pr * 0.11, 0, 0, Math.PI * 2); ctx.fill();
        /* cloud wisps */
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = pr * 0.06;
        for (let ci = 0; ci < 5; ci++) {
          const cy2 = -pr * 0.5 + ci * pr * 0.25;
          const lw2 = Math.sqrt(Math.max(0, pr * pr - cy2 * cy2));
          const off = Math.sin(selfRot + ci) * lw2 * 0.3;
          ctx.beginPath();
          ctx.moveTo(-lw2 * 0.6 + off, cy2);
          ctx.bezierCurveTo(-lw2 * 0.2 + off, cy2 - pr * 0.04, lw2 * 0.2 + off, cy2 + pr * 0.04, lw2 * 0.6 + off, cy2);
          ctx.stroke();
        }
      } else if (p.name === 'Юпитер') {
        /* horizontal bands */
        const bands = [
          [0.0,  0.12, 'rgba(180,130,80,0.5)'],
          [0.15, 0.08, 'rgba(220,180,120,0.4)'],
          [0.25, 0.1,  'rgba(160,100,60,0.45)'],
          [-0.15,0.09, 'rgba(200,160,100,0.4)'],
          [-0.28,0.07, 'rgba(140,90,50,0.4)'],
          [0.38, 0.06, 'rgba(190,150,90,0.35)'],
          [-0.4, 0.06, 'rgba(170,120,70,0.35)'],
        ];
        bands.forEach(([cy2, hw, col]) => {
          const y0 = (cy2 as number) * pr;
          const h  = (hw as number) * pr;
          const lw2 = Math.sqrt(Math.max(0, pr * pr - y0 * y0));
          ctx.fillStyle = col as string;
          ctx.beginPath();
          ctx.ellipse(0, y0, lw2, h, 0, 0, Math.PI * 2);
          ctx.fill();
        });
        /* Great Red Spot */
        const gx = Math.cos(selfRot * 0.4) * pr * 0.25;
        const gy = pr * 0.18;
        ctx.fillStyle = 'rgba(180,60,40,0.6)';
        ctx.beginPath(); ctx.ellipse(gx, gy, pr * 0.18, pr * 0.1, 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(220,100,60,0.4)';
        ctx.lineWidth = pr * 0.03;
        ctx.beginPath(); ctx.ellipse(gx, gy, pr * 0.22, pr * 0.13, 0.3, 0, Math.PI * 2); ctx.stroke();
      } else if (p.name === 'Марс') {
        /* polar ice caps */
        ctx.fillStyle = 'rgba(240,245,255,0.65)';
        ctx.beginPath(); ctx.ellipse(0, -pr * 0.82, pr * 0.3, pr * 0.12, 0, 0, Math.PI * 2); ctx.fill();
        /* craters */
        const craters = [[0.2,-0.3,0.1],[-0.25,0.15,0.08],[0.05,0.25,0.12],[-0.1,-0.1,0.07]];
        craters.forEach(([cx2, cy2, cr]) => {
          ctx.strokeStyle = 'rgba(100,40,20,0.4)';
          ctx.lineWidth = pr * 0.025;
          ctx.beginPath(); ctx.arc((cx2 as number)*pr, (cy2 as number)*pr, (cr as number)*pr, 0, Math.PI*2); ctx.stroke();
          ctx.fillStyle = 'rgba(80,30,15,0.2)';
          ctx.beginPath(); ctx.arc((cx2 as number)*pr, (cy2 as number)*pr, (cr as number)*pr*0.6, 0, Math.PI*2); ctx.fill();
        });
        /* dust storm wisp */
        ctx.strokeStyle = 'rgba(200,120,60,0.2)';
        ctx.lineWidth = pr * 0.04;
        ctx.beginPath(); ctx.moveTo(-pr*0.4, pr*0.1); ctx.bezierCurveTo(-pr*0.1, pr*0.05, pr*0.1, pr*0.15, pr*0.4, pr*0.05); ctx.stroke();
      } else if (p.name === 'Сатурн') {
        /* bands */
        const sbands = [[0.0,0.1,'rgba(200,170,100,0.4)'],[0.15,0.07,'rgba(170,140,80,0.35)'],[-0.18,0.08,'rgba(190,155,90,0.35)']];
        sbands.forEach(([cy2, hw, col]) => {
          const y0 = (cy2 as number)*pr, h = (hw as number)*pr;
          const lw2 = Math.sqrt(Math.max(0, pr*pr - y0*y0));
          ctx.fillStyle = col as string;
          ctx.beginPath(); ctx.ellipse(0, y0, lw2, h, 0, 0, Math.PI*2); ctx.fill();
        });
      } else if (p.name === 'Уран') {
        /* subtle horizontal haze */
        for (let i = 0; i < 6; i++) {
          const cy2 = -pr * 0.7 + i * pr * 0.28;
          const lw2 = Math.sqrt(Math.max(0, pr*pr - cy2*cy2));
          ctx.strokeStyle = 'rgba(100,220,220,0.08)';
          ctx.lineWidth = pr * 0.05;
          ctx.beginPath(); ctx.moveTo(-lw2, cy2); ctx.lineTo(lw2, cy2); ctx.stroke();
        }
      } else if (p.name === 'Нептун') {
        /* storm spot */
        const nx = Math.cos(selfRot * 0.6) * pr * 0.2;
        ctx.fillStyle = 'rgba(20,20,180,0.5)';
        ctx.beginPath(); ctx.ellipse(nx, -pr*0.2, pr*0.15, pr*0.09, 0.2, 0, Math.PI*2); ctx.fill();
        /* bands */
        for (let i = 0; i < 5; i++) {
          const cy2 = -pr*0.6 + i*pr*0.3;
          const lw2 = Math.sqrt(Math.max(0, pr*pr - cy2*cy2));
          ctx.strokeStyle = 'rgba(60,80,220,0.12)';
          ctx.lineWidth = pr*0.04;
          ctx.beginPath(); ctx.moveTo(-lw2, cy2); ctx.lineTo(lw2, cy2); ctx.stroke();
        }
      } else if (p.name === 'Венера') {
        /* thick cloud swirls */
        for (let i = 0; i < 7; i++) {
          const cy2 = -pr*0.7 + i*pr*0.23;
          const lw2 = Math.sqrt(Math.max(0, pr*pr - cy2*cy2));
          const off = Math.sin(selfRot*0.5 + i*0.8) * lw2*0.2;
          ctx.strokeStyle = 'rgba(255,240,180,0.15)';
          ctx.lineWidth = pr*0.07;
          ctx.beginPath(); ctx.moveTo(-lw2+off, cy2); ctx.lineTo(lw2+off, cy2); ctx.stroke();
        }
      } else if (p.name === 'Меркурий') {
        /* many craters */
        const mcraters = [[0.1,-0.2,0.09],[-0.2,0.1,0.07],[0.3,0.2,0.06],[-0.05,0.3,0.08],[0.2,-0.35,0.05],[-0.3,-0.2,0.06]];
        mcraters.forEach(([cx2, cy2, cr]) => {
          ctx.strokeStyle = 'rgba(80,80,80,0.5)';
          ctx.lineWidth = pr*0.02;
          ctx.beginPath(); ctx.arc((cx2 as number)*pr,(cy2 as number)*pr,(cr as number)*pr,0,Math.PI*2); ctx.stroke();
          ctx.fillStyle = 'rgba(50,50,50,0.25)';
          ctx.beginPath(); ctx.arc((cx2 as number)*pr,(cy2 as number)*pr,(cr as number)*pr*0.5,0,Math.PI*2); ctx.fill();
        });
      }

      /* latitude grid lines (always) */
      for (let i = 1; i < 8; i++) {
        const ly = -pr + (2*pr*i/8);
        const lw2 = Math.sqrt(Math.max(0, pr*pr - ly*ly));
        ctx.beginPath(); ctx.moveTo(-lw2, ly); ctx.lineTo(lw2, ly);
        ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 0.4; ctx.stroke();
      }

      ctx.restore(); /* end clip */

      /* specular highlight */
      const sp = ctx.createRadialGradient(-pr*0.28, -pr*0.28, 0, 0, 0, pr);
      sp.addColorStop(0, 'rgba(255,255,255,0.32)');
      sp.addColorStop(0.4, 'rgba(255,255,255,0.06)');
      sp.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(0, 0, pr, 0, Math.PI*2);
      ctx.fillStyle = sp; ctx.fill();

      /* terminator shadow */
      const sh = ctx.createRadialGradient(pr*0.5, 0, 0, pr*0.3, 0, pr*1.1);
      sh.addColorStop(0, 'transparent');
      sh.addColorStop(0.6, 'rgba(0,0,8,0.25)');
      sh.addColorStop(1, 'rgba(0,0,8,0.7)');
      ctx.beginPath(); ctx.arc(0, 0, pr, 0, Math.PI*2);
      ctx.fillStyle = sh; ctx.fill();

      /* Saturn rings (drawn after sphere) */
      if (p.ring) {
        ctx.restore(); ctx.save(); ctx.translate(wx, wy);
        ctx.scale(1, 0.22);
        const rc = [
          'rgba(232,213,160,0.55)', 'rgba(210,185,130,0.4)',
          'rgba(190,160,100,0.28)', 'rgba(170,140,80,0.18)',
        ];
        for (let ri = 0; ri < 4; ri++) {
          ctx.beginPath(); ctx.arc(0, 0, pr*(1.45 + ri*0.32), 0, Math.PI*2);
          ctx.strokeStyle = rc[ri]; ctx.lineWidth = pr*0.2; ctx.stroke();
        }
      }

      ctx.restore();
    };

    /* ════════════════════════════════════
       DRAW INFO PANEL
    ════════════════════════════════════ */
    const drawInfo = (sx: number, sy: number, sr: number, p: PD, alpha: number) => {
      if (alpha <= 0) return;
      ctx.save(); ctx.globalAlpha = alpha;
      const W = c.width;
      const panelW = Math.min(270, W * 0.3);
      const onRight = sx + sr + 28 + panelW < W - 16;
      const panelX = onRight ? sx + sr + 28 : sx - sr - 28 - panelW;
      const panelY = Math.max(16, sy - 120);

      /* connector */
      ctx.beginPath();
      ctx.moveTo(onRight ? sx + sr : sx - sr, sy);
      ctx.lineTo(onRight ? panelX : panelX + panelW, sy);
      ctx.strokeStyle = p.color + 'aa'; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(onRight ? sx+sr : sx-sr, sy, 3.5, 0, Math.PI*2);
      ctx.fillStyle = p.color; ctx.fill();

      /* panel */
      ctx.fillStyle = 'rgba(5,5,12,0.93)';
      ctx.beginPath(); ctx.roundRect(panelX, panelY, panelW, 238, 7); ctx.fill();
      ctx.strokeStyle = p.color + '50'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(panelX, panelY, panelW, 238, 7); ctx.stroke();
      /* top bar */
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.roundRect(panelX, panelY, panelW, 3, [3,3,0,0]); ctx.fill();

      /* name */
      ctx.fillStyle = p.color;
      ctx.font = 'bold 18px "Inter",system-ui,sans-serif';
      ctx.fillText(p.name, panelX+14, panelY+28);

      /* desc */
      ctx.fillStyle = 'rgba(165,165,185,0.92)';
      ctx.font = '11px "Inter",system-ui,sans-serif';
      const words = p.info.desc.split(' ');
      let line = ''; let ly2 = panelY + 50;
      for (const w of words) {
        const test = line + w + ' ';
        if (ctx.measureText(test).width > panelW - 28) {
          ctx.fillText(line.trim(), panelX+14, ly2); line = w+' '; ly2 += 15;
        } else line = test;
      }
      ctx.fillText(line.trim(), panelX+14, ly2);

      /* facts */
      const facts: [string,string][] = [
        ['Расстояние', p.info.dist], ['Период', p.info.period],
        ['Спутников', String(p.info.moons)], ['Радиус', p.info.radius],
        ['Температура', p.info.temp],
      ];
      let fy = panelY + 106;
      facts.forEach(([k, v]) => {
        ctx.fillStyle = 'rgba(95,95,115,0.88)';
        ctx.font = '9px monospace';
        ctx.fillText(k.toUpperCase(), panelX+14, fy);
        ctx.fillStyle = 'rgba(215,215,235,0.96)';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(v, panelX+14, fy+14);
        fy += 29;
      });

      ctx.fillStyle = 'rgba(85,85,105,0.65)';
      ctx.font = '9px monospace';
      ctx.fillText('ESC / клик — назад', panelX+14, panelY+228);
      ctx.restore();
    };

    /* ════════════════════════════════════
       TICK
    ════════════════════════════════════ */
    const tick = () => {
      /* advance time only when not focused */
      if (!focused) t += 0.005;

      const W = c.width, H = c.height;
      const cx = W/2, cy = H/2;

      cam.x    = lerp(cam.x,    tgtCam.x,    0.08);
      cam.y    = lerp(cam.y,    tgtCam.y,    0.08);
      cam.zoom = lerp(cam.zoom, tgtCam.zoom, 0.08);

      if (focused) infoAlpha = Math.min(1, infoAlpha + 0.04);
      else         infoAlpha = Math.max(0, infoAlpha - 0.06);

      ctx.clearRect(0, 0, W, H);

      /* stars */
      STARS.forEach(s => {
        s.ph += 0.01;
        const a = s.a * (0.65 + Math.sin(s.ph)*0.35);
        ctx.beginPath(); ctx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,'+a+')'; ctx.fill();
      });

      ctx.save();
      ctx.translate(cx + cam.x, cy + cam.y);
      ctx.scale(cam.zoom, cam.zoom);

      const bs = Math.min(W, H) / 1000;

      /* orbits */
      PLANET_DATA.forEach(p => {
        ctx.beginPath(); ctx.arc(0, 0, p.orbit*bs, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 0.6/cam.zoom; ctx.stroke();
      });

      /* sun */
      const sunR = 26*bs;
      const sg = ctx.createRadialGradient(0,0,0,0,0,sunR*3.5);
      sg.addColorStop(0,'#fffce8'); sg.addColorStop(0.12,'#ffe040');
      sg.addColorStop(0.4,'#ff8800'); sg.addColorStop(1,'transparent');
      ctx.beginPath(); ctx.arc(0,0,sunR*3.5,0,Math.PI*2); ctx.fillStyle=sg; ctx.fill();
      const cp = 1 + Math.sin(t*2.5)*0.07;
      const cg = ctx.createRadialGradient(0,0,sunR,0,0,sunR*5*cp);
      cg.addColorStop(0,'rgba(255,150,20,0.1)'); cg.addColorStop(1,'transparent');
      ctx.beginPath(); ctx.arc(0,0,sunR*5*cp,0,Math.PI*2); ctx.fillStyle=cg; ctx.fill();

      /* planets */
      screenPos.length = 0;
      PLANET_DATA.forEach(p => {
        const orb = p.orbit * bs;
        /* use frozen angle if focused, else live */
        const angle = focused && frozenAngles[p.name] !== undefined
          ? frozenAngles[p.name]
          : p.angle + t * p.speed;
        const wx = Math.cos(angle)*orb;
        const wy = Math.sin(angle)*orb;
        const pr = Math.max(p.r*bs * Math.max(1, 1.5/cam.zoom), 2.5);
        const sx = cx + cam.x + wx*cam.zoom;
        const sy = cy + cam.y + wy*cam.zoom;
        screenPos.push({ x:sx, y:sy, r:pr*cam.zoom, p });

        /* self-rotation */
        const selfRot = t * p.speed * 8;
        drawPlanet(wx, wy, pr, p, selfRot);

        /* name label */
        if (cam.zoom < 3.5) {
          ctx.fillStyle = 'rgba(185,185,205,' + Math.min(0.72, 0.85/cam.zoom) + ')';
          ctx.font = (9/cam.zoom)+'px monospace';
          ctx.fillText(p.name, wx+pr+3/cam.zoom, wy+3/cam.zoom);
        }
      });

      ctx.restore();

      /* info panel */
      if (focused || infoAlpha > 0) {
        const sp = screenPos.find(s => s.p.name === focused?.name);
        if (sp && focused) drawInfo(sp.x, sp.y, sp.r, focused, infoAlpha);
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    /* ── focus / reset ── */
    const focusPlanet = (p: PD) => {
      /* freeze all planet angles at current positions */
      frozenAngles = {};
      PLANET_DATA.forEach(pd => {
        frozenAngles[pd.name] = pd.angle + t * pd.speed;
      });
      focused = p; infoAlpha = 0;
      const bs = Math.min(c.width, c.height)/1000;
      const angle = frozenAngles[p.name];
      const wx = Math.cos(angle)*p.orbit*bs;
      const wy = Math.sin(angle)*p.orbit*bs;
      const zTarget = Math.min(c.width, c.height)/(p.r*bs*13);
      tgtCam.x = -wx*zTarget;
      tgtCam.y = -wy*zTarget;
      tgtCam.zoom = Math.min(zTarget, 9);
    };

    const resetView = () => {
      focused = null; frozenAngles = {};
      tgtCam = { x:0, y:0, zoom:1 };
    };

    /* ── events ── */
    const onDown = (e: PointerEvent) => {
      drag.on=true; drag.moved=false;
      drag.lx=e.clientX; drag.ly=e.clientY;
      c.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.on) return;
      const dx=e.clientX-drag.lx, dy=e.clientY-drag.ly;
      if (Math.abs(dx)+Math.abs(dy)>3) drag.moved=true;
      tgtCam.x+=dx; tgtCam.y+=dy;
      drag.lx=e.clientX; drag.ly=e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      drag.on=false;
      if (drag.moved) return;
      const rect=c.getBoundingClientRect();
      const mx=e.clientX-rect.left, my=e.clientY-rect.top;
      if (focused) { resetView(); return; }
      for (const sp of screenPos) {
        if (Math.sqrt((mx-sp.x)**2+(my-sp.y)**2)<sp.r+12) { focusPlanet(sp.p); return; }
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      tgtCam.zoom = Math.max(0.3, Math.min(10, tgtCam.zoom*(e.deltaY>0?0.88:1.14)));
    };
    const onKey = (e: KeyboardEvent) => { if (e.key==='Escape') resetView(); };
    const onCursor = (e: PointerEvent) => {
      const rect=c.getBoundingClientRect();
      const mx=e.clientX-rect.left, my=e.clientY-rect.top;
      let hit=false;
      for (const sp of screenPos) {
        if (Math.sqrt((mx-sp.x)**2+(my-sp.y)**2)<sp.r+12) { hit=true; break; }
      }
      c.style.cursor = hit?'pointer':drag.on?'grabbing':'grab';
    };

    c.addEventListener('pointerdown', onDown);
    c.addEventListener('pointermove', onMove);
    c.addEventListener('pointermove', onCursor);
    c.addEventListener('pointerup', onUp);
    c.addEventListener('wheel', onWheel, { passive:false });
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      c.removeEventListener('pointerdown', onDown);
      c.removeEventListener('pointermove', onMove);
      c.removeEventListener('pointermove', onCursor);
      c.removeEventListener('pointerup', onUp);
      c.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return <canvas ref={ref} className="ss-canvas-full" />;
};

/* ── GOLD MOLECULE (Au FCC lattice) ── */
const GoldMolecule: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const drag = useRef({ active: false, lx: 0, ly: 0 });
  const rotRef = useRef({ x: -20, y: 30 });

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const W = 480, H = 480;
    c.width = W; c.height = H;
    const cx = W / 2, cy = H / 2;

    // background particles
    const bgPts = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      ph: Math.random() * Math.PI * 2,
    }));

    // Au FCC unit cell corners + face centers, scaled up
    const S = 100;
    const rawAtoms = [
      // corners
      [-1,-1,-1],[1,-1,-1],[-1,1,-1],[1,1,-1],
      [-1,-1, 1],[1,-1, 1],[-1,1, 1],[1,1, 1],
      // face centers
      [0,0,-1],[0,0,1],[-1,0,0],[1,0,0],[0,-1,0],[0,1,0],
    ].map(([x,y,z]) => ({ x: x*S, y: y*S, z: z*S }));

    // bonds: connect atoms closer than 1.5*S
    const bonds: [number,number][] = [];
    for (let i = 0; i < rawAtoms.length; i++)
      for (let j = i+1; j < rawAtoms.length; j++) {
        const dx = rawAtoms[i].x-rawAtoms[j].x;
        const dy = rawAtoms[i].y-rawAtoms[j].y;
        const dz = rawAtoms[i].z-rawAtoms[j].z;
        if (Math.sqrt(dx*dx+dy*dy+dz*dz) < S*1.55) bonds.push([i,j]);
      }

    let raf: number;
    const project = (x: number, y: number, z: number) => {
      const rx = rotRef.current.x * Math.PI / 180;
      const ry = rotRef.current.y * Math.PI / 180;
      const x1 = x*Math.cos(ry) - z*Math.sin(ry);
      const z1 = x*Math.sin(ry) + z*Math.cos(ry);
      const y2 = y*Math.cos(rx) - z1*Math.sin(rx);
      const z2 = y*Math.sin(rx) + z1*Math.cos(rx);
      const fov = 500;
      const sc = fov / (fov + z2 + 400);
      return { sx: cx + x1*sc, sy: cy + y2*sc, sc, z: z2 };
    };

    let t = 0;
    const tick = () => {
      t++;
      if (!drag.current.active) {
        rotRef.current.y += 0.25;
        rotRef.current.x += 0.08;
      }
      ctx.clearRect(0, 0, W, H);

      // bg gold dust
      bgPts.forEach(p => {
        p.ph += 0.02;
        const alpha = 0.15 + Math.sin(p.ph) * 0.12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212,175,55,' + alpha + ')';
        ctx.fill();
      });

      const projected = rawAtoms.map(a => project(a.x, a.y, a.z));

      // bonds
      bonds.forEach(([i, j]) => {
        const a = projected[i], b = projected[j];
        const alpha = 0.25 + 0.15 * ((a.sc + b.sc) / 2);
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.strokeStyle = `rgba(212,175,55,${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // atoms sorted by z
      const sorted = projected.map((p, i) => ({ ...p, i })).sort((a, b) => a.z - b.z);
      sorted.forEach(({ sx, sy, sc, i }) => {
        const r = 10 * sc;
        const isCorner = i < 8;
        const g = ctx.createRadialGradient(sx - r*0.3, sy - r*0.3, 0, sx, sy, r);
        if (isCorner) {
          g.addColorStop(0, '#fff8d0');
          g.addColorStop(0.4, '#f0d060');
          g.addColorStop(1, '#8b6914');
        } else {
          g.addColorStop(0, '#ffe080');
          g.addColorStop(0.4, '#d4af37');
          g.addColorStop(1, '#6b5010');
        }
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(r, 3), 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        // glow
        ctx.beginPath();
        ctx.arc(sx, sy, r * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212,175,55,0.08)';
        ctx.fill();
        // label Au
        if (sc > 0.75) {
          ctx.fillStyle = 'rgba(255,240,150,0.7)';
          ctx.font = `bold ${Math.round(8 * sc)}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('Au', sx, sy);
        }
      });

      raf = requestAnimationFrame(tick);
    };
    tick();

    const onDown = (e: PointerEvent) => {
      drag.current = { active: true, lx: e.clientX, ly: e.clientY };
      c.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      rotRef.current.y += (e.clientX - drag.current.lx) * 0.5;
      rotRef.current.x += (e.clientY - drag.current.ly) * 0.5;
      drag.current.lx = e.clientX; drag.current.ly = e.clientY;
    };
    const onUp = () => { drag.current.active = false; };
    c.addEventListener('pointerdown', onDown);
    c.addEventListener('pointermove', onMove);
    c.addEventListener('pointerup', onUp);
    c.addEventListener('pointerleave', onUp);

    return () => {
      cancelAnimationFrame(raf);
      c.removeEventListener('pointerdown', onDown);
      c.removeEventListener('pointermove', onMove);
      c.removeEventListener('pointerup', onUp);
      c.removeEventListener('pointerleave', onUp);
    };
  }, []);

  return (
    <div className="obj-wrap">
      <canvas ref={ref} className="obj-canvas" style={{ cursor: 'grab' }} />
      <div className="obj-hint">перетащи для вращения</div>
    </div>
  );
};

/* ── ABILITY CARD ── */
type Ability = { icon:string; title:string; sub:string; color:string };
const AbilityCard: React.FC<{ab:Ability; idx:number}> = ({ab,idx}) => {
  const [on, setOn] = useState(false);
  return (
    <div className={`m-ab-card ${on?'m-ab-card--on':''}`}
      style={{animationDelay:`${idx*.1}s`,'--ab-color':ab.color} as React.CSSProperties}
      onMouseEnter={()=>setOn(true)} onMouseLeave={()=>setOn(false)}>
      <div className="m-ab-card-top">
        <span className="m-ab-card-icon">{ab.icon}</span>
        <span className="m-ab-card-title">{ab.title}</span>
        <span className="m-ab-card-arrow">↗</span>
      </div>
      <div className="m-ab-card-sub">{ab.sub}</div>
      <div className="m-ab-card-bar"><div className="m-ab-card-bar-fill"/></div>
    </div>
  );
};

/* ── PROJECT CARD ── */
const ProjectCard: React.FC<{pr:{name:string;tech:string;desc:string};idx:number}> = ({pr,idx}) => {
  const [open, setOpen] = useState(false);
  const cols: Record<string,string> = {Python:'#4fc3f7',JavaScript:'#ffb74d',TypeScript:'#81c784'};
  const col = cols[pr.tech]??'#ce93d8';
  return (
    <div className={`m-proj ${open?'m-proj--open':''}`}
      style={{animationDelay:`${idx*.08}s`,'--proj-color':col} as React.CSSProperties}
      onClick={()=>setOpen(o=>!o)} role="button" tabIndex={0}
      onKeyDown={e=>e.key==='Enter'&&setOpen(o=>!o)}>
      <div className="m-proj-head">
        <span className="m-proj-name">{pr.name}</span>
        <div className="m-proj-right">
          <span className="m-chip m-chip--sm m-chip--colored" style={{'--chip-color':col} as React.CSSProperties}>{pr.tech}</span>
          <span className="m-proj-toggle">{open?'-':'+'}</span>
        </div>
      </div>
      <div className="m-proj-body"><p className="m-proj-desc">{pr.desc}</p></div>
      <div className="m-proj-line"/>
    </div>
  );
};

/* ── COUNTER ── */
const Counter: React.FC<{to:number;sfx:string;run:boolean}> = ({to,sfx,run}) => {
  const [n,setN]=useState(0);
  useEffect(()=>{
    if(!run)return;
    let v=0;
    const id=setInterval(()=>{v+=Math.ceil(to/40);if(v>=to){setN(to);clearInterval(id);}else setN(v);},30);
    return ()=>clearInterval(id);
  },[run,to]);
  return <>{n}{sfx}</>;
};

/* ── TYPEWRITER ── */
const useTyped = (words: string[]) => {
  const [txt,setTxt]=useState('');
  const [wi,setWi]=useState(0);
  const [ci,setCi]=useState(0);
  const [del,setDel]=useState(false);
  useEffect(()=>{
    const w=words[wi];
    const t=setTimeout(()=>{
      if(!del){setTxt(w.slice(0,ci+1));if(ci+1===w.length)setTimeout(()=>setDel(true),1800);else setCi(c=>c+1);}
      else{setTxt(w.slice(0,ci-1));if(ci-1===0){setDel(false);setCi(0);setWi(p=>(p+1)%words.length);}else setCi(c=>c-1);}
    },del?40:90);
    return ()=>clearTimeout(t);
  },[ci,del,wi,words]);
  return txt;
};

/* ── MAIN ── */
const Portfolio: React.FC = () => {
  const [vis,setVis]=useState<Record<string,boolean>>({});
  const [skillW,setSkillW]=useState<Record<string,number>>({});
  const [active,setActive]=useState('hero');
  const [scrollY,setScrollY]=useState(0);
  const typed=useTyped(['Portfolio','Dev Team','JS & TS','Web & Bots']);

  useEffect(()=>{
    const fn=()=>setScrollY(window.scrollY);
    window.addEventListener('scroll',fn,{passive:true});
    return ()=>window.removeEventListener('scroll',fn);
  },[]);

  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting&&e.target.id){
          setVis(p=>({...p,[e.target.id]:true}));
          setActive(e.target.id);
        }
      });
    },{threshold:.1});
    document.querySelectorAll('[data-obs]').forEach(el=>obs.observe(el));
    return ()=>obs.disconnect();
  },[]);

  useEffect(()=>{
    DEVS.forEach(dev=>{
      if(vis[`card-${dev.id}`]){
        dev.skills.forEach((sk,i)=>{
          setTimeout(()=>setSkillW(p=>({...p,[`${dev.id}-${sk.name}`]:sk.pct})),300+i*150);
        });
      }
    });
  },[vis]);

  const nav=[
    {id:'hero',label:'Главная'},{id:'team',label:'Команда'},
    {id:'timeline',label:'Путь'},{id:'stats',label:'Статистика'},
    {id:'solar',label:'Солнечная система'},
    {id:'objects',label:'Молекула Au'},
    {id:'collab',label:'Проект'},
    ...DEVS.map((d,i)=>({id:`card-${d.id}`,label:`Dev ${i+1}`})),
  ];
  const go=useCallback((id:string)=>{
    document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
  },[]);

  return (
    <div className="m">
      <ArtCanvas/>

      <nav className="m-nav">
        {nav.map(n=>(
          <button key={n.id} className={`m-nd ${active===n.id?'m-nd--on':''}`} onClick={()=>go(n.id)}>
            <span className="m-nd-tip">{n.label}</span>
          </button>
        ))}
      </nav>

      {/* HERO */}
      <section id="hero" data-obs className="m-hero">
        <div className="m-hero-left" style={{transform:`translateY(${scrollY*.15}px)`}}>
          <p className="m-label">Dev Team · 2026</p>
          <h1 className="m-hero-title">{typed}<span className="m-cur">|</span></h1>
          <p className="m-hero-sub">{DEVS.map(d=>d.name).join(' & ')}</p>
          <div className="m-hero-line"/>
          <div className="m-hero-tags">
            {['JS','TS','Python','Bots','Web'].map((t,i)=>(
              <span key={t} className="m-tag" style={{animationDelay:`${.8+i*.1}s`}}>{t}</span>
            ))}
          </div>
        </div>
        <div className="m-hero-right"><Cube/></div>
        <div className="m-scroll-hint"><div className="m-scroll-line"/><span>scroll</span></div>
      </section>

      {/* TEAM */}
      <section id="team" data-obs className={`m-sec ${vis['team']?'m-vis':''}`}>
        <p className="m-label">// команда</p>
        <h2 className="m-sec-title">Разработчики</h2>
        <div className="m-team">
          {DEVS.map((dev,i)=>(
            <div key={dev.id} className="m-member" style={{animationDelay:`${i*.2}s`}}>
              <div className="m-photo">
                <div className="m-photo-rings">
                  <div className="m-photo-ring m-photo-ring--1"/>
                  <div className="m-photo-ring m-photo-ring--2"/>
                  <div className="m-photo-ring m-photo-ring--3"/>
                </div>
                <div className="m-photo-av">{dev.initials}</div>
                <div className="m-photo-label">📷 фото</div>
              </div>
              <div className="m-member-info">
                <h3 className="m-member-name">{dev.name}</h3>
                <span className="m-member-role">{dev.role}</span>
                <p className="m-member-desc">{dev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" data-obs className={`m-sec ${vis['timeline']?'m-vis':''}`}>
        <p className="m-label">// путь развития</p>
        <h2 className="m-sec-title">Как мы росли</h2>
        <div className="m-timeline">
          {TIMELINE.map((t,i)=>(
            <div key={i} className="m-tl-item" style={{animationDelay:`${i*.15}s`}}>
              <div className="m-tl-left"><div className="m-tl-year">{t.year}</div></div>
              <div className="m-tl-connector">
                <div className="m-tl-dot"/>
                {i<TIMELINE.length-1&&<div className="m-tl-line"/>}
              </div>
              <div className="m-tl-right">
                <div className="m-tl-title">{t.title}</div>
                <div className="m-tl-desc">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section id="stats" data-obs className={`m-sec ${vis['stats']?'m-vis':''}`}>
        <p className="m-label">// цифры</p>
        <h2 className="m-sec-title">Статистика</h2>
        <div className="m-stats">
          {STATS.map((s,i)=>(
            <div key={s.label} className="m-stat" style={{animationDelay:`${i*.12}s`}}>
              <div className="m-stat-val"><Counter to={s.val} sfx={s.sfx} run={!!vis['stats']}/></div>
              <div className="m-stat-lbl">{s.label}</div>
              <div className="m-stat-bar">
                <div className="m-stat-fill" style={{width:vis['stats']?'100%':'0',transitionDelay:`${i*.15+.3}s`}}/>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SOLAR SYSTEM ══ */}
      <section id="solar" data-obs className="ss-fullsec">
        <div className="ss-ui-hint">
          <span>☀️ Солнечная система</span>
          <span className="ss-ui-sep">·</span>
          <span>клик на планету — приближение</span>
          <span className="ss-ui-sep">·</span>
          <span>колёсико — масштаб</span>
          <span className="ss-ui-sep">·</span>
          <span>ESC — назад</span>
        </div>
        <SolarSystem />
      </section>
      {/* ══ GOLD MOLECULE ══ */}
      <section id="objects" data-obs className={`m-sec ${vis['objects']?'m-vis':''}`}>
        <p className="m-label">// молекула золота</p>
        <h2 className="m-sec-title">Au — Золото</h2>
        <div className="gold-mol-wrap">
          <div className="gold-mol-left">
            <p className="gold-mol-desc">
              Кристаллическая решётка золота — гранецентрированный куб (ГЦК / FCC).
              14 атомов Au: 8 угловых + 6 центров граней. Именно такая структура
              даёт золоту его пластичность и блеск.
            </p>
            <div className="gold-mol-facts">
              {[
                {label:'Атомный номер',val:'79'},
                {label:'Атомная масса',val:'196.97 г/моль'},
                {label:'Тип решётки',val:'ГЦК (FCC)'},
                {label:'Параметр решётки',val:'4.08 Å'},
              ].map(f => (
                <div key={f.label} className="gold-mol-fact">
                  <span className="gold-mol-fact-label">{f.label}</span>
                  <span className="gold-mol-fact-val">{f.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="gold-mol-right">
            <GoldMolecule/>
          </div>
        </div>
      </section>

      {/* COLLAB */}
      <section id="collab" data-obs className={`m-sec ${vis['collab']?'m-vis':''}`}>
        <p className="m-label">// совместный проект</p>
        <h2 className="m-sec-title">Weather &amp; News</h2>
        <div className="m-collab">
          <div className="m-collab-left">
            <p className="m-collab-desc">Сайт погоды и новостей в реальном времени. Геолокация, прогноз на 7 дней, фильтрация новостей по категориям, умный поиск.</p>
            <div className="m-collab-stack">
              {['React','TypeScript','REST API','CSS'].map(t=>(<span key={t} className="m-chip">{t}</span>))}
            </div>
            <div className="m-collab-feats">
              {[
                {icon:'🌡️',t:'Погода',d:'Температура, влажность, ветер, прогноз 7 дней'},
                {icon:'📰',t:'Новости',d:'Категории, поиск, актуальные статьи'},
                {icon:'🗺️',t:'Геолокация',d:'Автоопределение города'},
                {icon:'⚡',t:'Скорость',d:'Кэш, оптимизация, мгновенный UI'},
              ].map((f,i)=>(
                <div key={i} className="m-feat" style={{animationDelay:`${i*.1}s`}}>
                  <span className="m-feat-icon">{f.icon}</span>
                  <div><div className="m-feat-title">{f.t}</div><div className="m-feat-desc">{f.d}</div></div>
                </div>
              ))}
            </div>
            <div className="m-collab-authors">
              {DEVS.map(d=>(<div key={d.id} className="m-author"><div className="m-author-av">{d.initials}</div><span>{d.name}</span></div>))}
            </div>
          </div>
          <div className="m-collab-right">
            <div className="m-browser">
              <div className="m-browser-bar">
                <span className="m-dot m-dot--r"/><span className="m-dot m-dot--y"/><span className="m-dot m-dot--g"/>
                <span className="m-browser-url">weather-news.app</span>
              </div>
              <div className="m-browser-body">
                <div className="m-mock-weather">
                  <div className="m-mock-city">Москва</div>
                  <div className="m-mock-temp">+18°</div>
                  <div className="m-mock-cond">Переменная облачность</div>
                  <div className="m-mock-meta"><span>💧 62%</span><span>💨 5 м/с</span></div>
                  <div className="m-mock-days">
                    {[['Пн','☀️','+22'],['Вт','🌤','+19'],['Ср','⛅','+16'],['Чт','🌧','+14'],['Пт','☀️','+21']].map(([d,e,t])=>(
                      <div key={d} className="m-mock-day"><span>{d}</span><span>{e}</span><span>{t}°</span></div>
                    ))}
                  </div>
                </div>
                <div className="m-mock-news">
                  <div className="m-mock-news-hd">Новости</div>
                  {['Технологии','Наука','Спорт','Мир'].map((cat,i)=>(
                    <div key={cat} className="m-mock-news-row" style={{animationDelay:`${i*.1}s`}}>
                      <span className="m-chip m-chip--sm">{cat}</span>
                      <div className="m-mock-news-bar"/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEV CARDS */}
      {DEVS.map((dev,di)=>(
        <section key={dev.id} id={`card-${dev.id}`} data-obs className={`m-sec ${vis[`card-${dev.id}`]?'m-vis':''}`}>
          <p className="m-label">// developer_0{di+1}</p>
          <div className="m-card">
            <div className="m-card-head">
              <div className="m-av-wrap">
                <div className="m-av-ring m-av-ring--1"/><div className="m-av-ring m-av-ring--2"/>
                <div className="m-av">{dev.initials}</div>
              </div>
              <div>
                <h2 className="m-card-name">{dev.name}</h2>
                <span className="m-chip">{dev.role}</span>
                <p className="m-card-desc">{dev.desc}</p>
              </div>
              <div className="m-card-idx">0{di+1}</div>
            </div>
            <div className="m-card-body">
              <div className="m-blk">
                <h3 className="m-blk-title">Навыки</h3>
                {dev.skills.map((sk,si)=>(
                  <div key={sk.name} className={`m-skill${sk.pct===100?' m-skill--max':''}`} style={{animationDelay:`${si*.1}s`}}>
                    <div className="m-skill-row">
                      <span className="m-skill-name">{sk.name}{sk.pct===100&&<span className="m-skill-badge">MASTER</span>}</span>
                      <span className="m-skill-pct">{sk.pct}%</span>
                    </div>
                    <div className="m-skill-track">
                      <div className="m-skill-fill" style={{width:`${skillW[`${dev.id}-${sk.name}`]??0}%`}}>
                        <div className="m-skill-shim"/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="m-blk">
                <h3 className="m-blk-title">Умения</h3>
                <div className="m-ab-grid">
                  {dev.abilities.map((ab,ai)=>(<AbilityCard key={ai} ab={ab} idx={ai}/>))}
                </div>
              </div>
              <div className="m-blk m-blk--full">
                <h3 className="m-blk-title">Проекты</h3>
                <div className="m-projs">
                  {dev.projects.map((pr,pi)=>(<ProjectCard key={pi} pr={pr} idx={pi}/>))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <footer className="m-footer">
        <div className="m-footer-line"/>
        <p className="m-footer-brand">Dev Team</p>
        <p className="m-footer-names">{DEVS.map(d=>d.name).join(' & ')}</p>
        <p className="m-footer-copy">Made with <span className="m-heart">♥</span> · 2026</p>
      </footer>
    </div>
  );
};
export default Portfolio;







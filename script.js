// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Preloader hide
window.addEventListener("load", () => {
  setTimeout(()=>document.getElementById("preloader").style.display="none", 1600);
});

// Typing phrases
const phrases = ["Physics Lover","JEE Aspirant","Web Developer","Problem Solver","Lifelong Learner"];
const typingEl = document.getElementById("typing");
let pi=0,pj=0,deleting=false,buffer=[]; 
(function typeLoop(){
  typingEl.textContent = buffer.join("");
  if(!deleting && pj < phrases[pi].length){ buffer.push(phrases[pi][pj++]); }
  else if(!deleting && pj===phrases[pi].length){ deleting=true; setTimeout(typeLoop,1300); return; }
  else if(deleting && pj>0){ buffer.pop(); pj--; }
  else { deleting=false; pi=(pi+1)%phrases.length; }
  setTimeout(typeLoop, deleting?50:140);
})();

// Parallax on scroll
const parallaxEls = Array.from(document.querySelectorAll("canvas[data-parallax]"));
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  parallaxEls.forEach(cv => {
    const factor = parseFloat(cv.dataset.parallax || "0.1");
    cv.style.transform = `translateY(${y*factor}px)`;
  });
});

// Intersection Observer to start/stop heavy animations
const observers = {};
function makeObserver(id, startFn, stopFn){
  const el = document.getElementById(id);
  let isRunning = false;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        if(!isRunning){ startFn(); isRunning=true; }
      } else {
        if(isRunning){ stopFn && stopFn(); isRunning=false; }
      }
    });
  },{threshold:0.2});
  io.observe(el);
  observers[id]=io;
}

// Utility for DPI canvas
function fitCanvas(c){
  const dpr = window.devicePixelRatio || 1;
  const rect = c.getBoundingClientRect();
  c.width = Math.round(rect.width * dpr);
  c.height = Math.round(rect.height * dpr);
  const ctx = c.getContext("2d");
  ctx.setTransform(dpr,0,0,dpr,0,0);
  return ctx;
}

// ===== HERO: Particles (always running, mobile-reduced) =====
const pcv = document.getElementById("particles");
const pctx = fitCanvas(pcv);
let particles = [];
let pAnim;
function initParticles(){
  const count = window.innerWidth < 768 ? 60 : 120;
  particles = [];
  for(let i=0;i<count;i++){
    particles.push({
      x: Math.random()*pcv.clientWidth,
      y: Math.random()*pcv.clientHeight,
      vx: (Math.random()-0.5)*0.8,
      vy: (Math.random()-0.5)*0.8,
      r: Math.random()*2+0.6
    });
  }
}
function drawParticles(){
  pctx.clearRect(0,0,pcv.clientWidth,pcv.clientHeight);
  pctx.fillStyle = "#ffffff";
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>pcv.clientWidth)p.vx*=-1;
    if(p.y<0||p.y>pcv.clientHeight)p.vy*=-1;
    pctx.beginPath(); pctx.arc(p.x,p.y,p.r,0,Math.PI*2); pctx.fill();
  });
  pAnim = requestAnimationFrame(drawParticles);
}
function startParticles(){ cancelAnimationFrame(pAnim); initParticles(); drawParticles(); }
window.addEventListener("resize", ()=>{ fitCanvas(pcv); startParticles(); });
startParticles();

// ===== ABOUT: Waves (lazy) =====
const wcv = document.getElementById("waves");
const wctx = fitCanvas(wcv);
let wAnim=0, wT=0;
function drawWaves(){
  wctx.clearRect(0,0,wcv.clientWidth,wcv.clientHeight);
  wctx.lineWidth = 2;
  wctx.strokeStyle = "#666";
  wctx.beginPath();
  const mid = wcv.clientHeight/2;
  for(let x=0;x<wcv.clientWidth;x++){
    const y = mid + Math.sin(x*0.018 + wT)*34 + Math.sin(x*0.004 + wT*0.7)*14;
    if(x===0) wctx.moveTo(x,y); else wctx.lineTo(x,y);
  }
  wctx.stroke();
  wT += 0.05;
  wAnim = requestAnimationFrame(drawWaves);
}
function startWaves(){ cancelAnimationFrame(wAnim); fitCanvas(wcv); drawWaves(); }
function stopWaves(){ cancelAnimationFrame(wAnim); }

// ===== PROJECTS: Planetary (mouse-reactive, lazy) =====
const plcv = document.getElementById("planetary");
const plctx = fitCanvas(plcv);
let plAnim=0, orbitA=0, mouseX=0, mouseY=0;
plcv.addEventListener("mousemove",(e)=>{
  const r = plcv.getBoundingClientRect();
  mouseX = (e.clientX - (r.left + r.width/2))/r.width;
  mouseY = (e.clientY - (r.top + r.height/2))/r.height;
});
function drawPlanetary(){
  plctx.clearRect(0,0,plcv.clientWidth,plcv.clientHeight);
  const cx = plcv.clientWidth/2, cy = plcv.clientHeight/2;
  // subtle tilt via save/restore & translate/rotate
  plctx.save();
  plctx.translate(cx, cy);
  plctx.rotate(mouseX*0.3);
  // star
  plctx.beginPath(); plctx.arc(0,0,28,0,Math.PI*2); plctx.fillStyle="#c9c9c9"; plctx.fill();
  // orbit 1
  const R1 = Math.min(cx,cy)*0.35;
  plctx.strokeStyle="#444"; plctx.beginPath(); plctx.arc(0,0,R1,0,Math.PI*2); plctx.stroke();
  // planet 1
  const px1 = R1*Math.cos(orbitA), py1 = R1*Math.sin(orbitA);
  plctx.beginPath(); plctx.arc(px1,py1,12,0,Math.PI*2); plctx.fillStyle="#8aa"; plctx.fill();
  // moon for planet 1
  const r2 = 30;
  const mx1 = px1 + r2*Math.cos(orbitA*2.2), my1 = py1 + r2*Math.sin(orbitA*2.2);
  plctx.beginPath(); plctx.arc(mx1,my1,4,0,Math.PI*2); plctx.fillStyle="#ccd"; plctx.fill();

  // orbit 2 (farther planet)
  const R2 = Math.min(cx,cy)*0.60;
  plctx.strokeStyle="#666"; plctx.beginPath(); plctx.arc(0,0,R2,0,Math.PI*2); plctx.stroke();
  // planet 2
  const px2 = R2*Math.cos(orbitA*0.7), py2 = R2*Math.sin(orbitA*0.7);
  plctx.beginPath(); plctx.arc(px2,py2,16,0,Math.PI*2); plctx.fillStyle="#5ad"; plctx.fill();
  // moon 1 for planet 2
  const r3 = 38;
  const mx2 = px2 + r3*Math.cos(orbitA*1.5), my2 = py2 + r3*Math.sin(orbitA*1.5);
  plctx.beginPath(); plctx.arc(mx2,my2,5,0,Math.PI*2); plctx.fillStyle="#bdf"; plctx.fill();
  // moon 2 for planet 2
  const r4 = 52;
  const mx3 = px2 + r4*Math.cos(orbitA*2.3), my3 = py2 + r4*Math.sin(orbitA*2.3);
  plctx.beginPath(); plctx.arc(mx3,my3,3.5,0,Math.PI*2); plctx.fillStyle="#fff7"; plctx.fill();


  plctx.restore();
  orbitA += 0.01 + Math.abs(mouseX)*0.01;
  plAnim = requestAnimationFrame(drawPlanetary);
}
function startPlanetary(){ cancelAnimationFrame(plAnim); fitCanvas(plcv); drawPlanetary(); }
function stopPlanetary(){ cancelAnimationFrame(plAnim); }

// ===== ACHIEVEMENTS: Double Pendulum (mouse-reactive, lazy) =====
const dcv = document.getElementById("doublePendulum");
const dctx = fitCanvas(dcv);
let r1 = 120, r2 = 110, m1 = 10, m2 = 10;
let a1 = Math.PI/2, a2 = Math.PI/2, a1_v=0, a2_v=0, g = 0.9;
let dAnim=0, gTiltX=0, gTiltY=0;
dcv.addEventListener("mousemove",(e)=>{
  const rect = dcv.getBoundingClientRect();
  const nx = (e.clientX - (rect.left + rect.width/2))/rect.width;
  const ny = (e.clientY - (rect.top + rect.height/2))/rect.height;
  gTiltX = nx*0.5; gTiltY = ny*0.5;
});
function drawPendulum(){
  dctx.clearRect(0,0,dcv.clientWidth,dcv.clientHeight);
  const ox = dcv.clientWidth/2, oy = dcv.clientHeight/3;
  // gravity components (tilt by mouse)
  const gx = g * gTiltX, gy = g * (1 + gTiltY);

  // equations (modified to include gx, gy by projecting along angles – approximation)
  const num1 = - (2*m1+m2) * gy * Math.sin(a1) - m2*gy*Math.sin(a1-2*a2) - 2*Math.sin(a1-a2)*m2*(a2_v*a2_v*r2 + a1_v*a1_v*r1*Math.cos(a1-a2));
  const den1 = r1 * (2*m1 + m2 - m2*Math.cos(2*a1-2*a2));
  const a1_a = num1/den1 + gx*0.001;

  const num2 = 2*Math.sin(a1-a2)*(a1_v*a1_v*r1*(m1+m2) + gy*(m1+m2)*Math.cos(a1) + a2_v*a2_v*r2*m2*Math.cos(a1-a2));
  const den2 = r2 * (2*m1 + m2 - m2*Math.cos(2*a1-2*a2));
  const a2_a = num2/den2 + gx*0.001;

  const x1 = ox + r1*Math.sin(a1), y1 = oy + r1*Math.cos(a1);
  const x2 = x1 + r2*Math.sin(a2), y2 = y1 + r2*Math.cos(a2);

  dctx.strokeStyle="#888"; dctx.lineWidth=1.2;
  dctx.beginPath(); dctx.moveTo(ox,oy); dctx.lineTo(x1,y1); dctx.lineTo(x2,y2); dctx.stroke();
  dctx.fillStyle="#ddd"; dctx.beginPath(); dctx.arc(x1,y1,m1,0,Math.PI*2); dctx.fill();
  dctx.beginPath(); dctx.arc(x2,y2,m2,0,Math.PI*2); dctx.fill();

  a1_v += a1_a; a2_v += a2_a; a1 += a1_v; a2 += a2_v;
  //a1_v *= 0.995; a2_v *= 0.995; // damping

  dAnim = requestAnimationFrame(drawPendulum);
}
function startPendulum(){
  cancelAnimationFrame(dAnim);
  fitCanvas(dcv);
  // mobile simplification
  if(window.innerWidth<768){ r1=100;r2=90; g=0.8; }
  else { r1=120;r2=110; g=0.9; }
  drawPendulum();
}
function stopPendulum(){ cancelAnimationFrame(dAnim); }

// Observe sections (lazy start)
makeObserver("about", startWaves, stopWaves);
makeObserver("projects", startPlanetary, stopPlanetary);
makeObserver("achievements", startPendulum, stopPendulum);

// Typing for section headings on reveal
const headings = document.querySelectorAll("h2.heading");
const hIO = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      const el = en.target;
      const text = el.dataset.full || el.textContent;
      el.dataset.full = text;
      el.textContent = "";
      let k=0;
      (function t(){ if(k<=text.length){ el.textContent=text.slice(0,k++); setTimeout(t, 30); } })();
      hIO.unobserve(el);
    }
  });
},{threshold:0.6});
headings.forEach(h=>hIO.observe(h));

// Dramatic background color shifts on enter
["about","projects","achievements","contact"].forEach(id=>{
  const sec = document.getElementById(id);
  new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        gsap.to(document.body, {backgroundColor: getComputedStyle(sec).backgroundColor, duration: 0.6});
      }
    });
  },{threshold:0.5}).observe(sec);
});

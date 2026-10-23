// Scroll reveals without waiting for React: these run while the HTML is still being parsed.
// RevealStart goes first in <body>: it turns reveals on only where IntersectionObserver exists.
// RevealWatch goes last: it shows every .reveal as it reaches the screen, including ones added later
// by client navigation. Elements get a data-in attribute, which React never touches.
// Besides the observer, a light scroll check shows anything already above the bottom of the screen,
// so a jump (an anchor link, the End key, a fast fling) never leaves skipped content hidden.

const start = `if('IntersectionObserver' in window)document.documentElement.setAttribute('data-reveal','')`;

const watch = `(function(){if(!('IntersectionObserver' in window))return;
var pending=new Set(),seen=new WeakSet();
function show(el){el.setAttribute('data-in','');pending.delete(el);io.unobserve(el)}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)show(e.target)})},{rootMargin:'0px 0px -6% 0px'});
function add(el){if(seen.has(el)||el.hasAttribute('data-in'))return;seen.add(el);pending.add(el);io.observe(el)}
function scan(root){if(root.matches&&root.matches('.reveal'))add(root);if(root.querySelectorAll)root.querySelectorAll('.reveal').forEach(add)}
var queued=false;function sweep(){queued=false;var edge=innerHeight;pending.forEach(function(el){if(el.isConnected&&el.getBoundingClientRect().top<edge)show(el)})}
function later(){if(!queued){queued=true;requestAnimationFrame(sweep)}}
scan(document);addEventListener('scroll',later,{passive:true});addEventListener('resize',later);
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)scan(n)})});later()}).observe(document.body,{childList:true,subtree:true});})()`;

export function RevealStart() {
  return <script dangerouslySetInnerHTML={{ __html: start }} />;
}

export function RevealWatch() {
  return <script dangerouslySetInnerHTML={{ __html: watch }} />;
}

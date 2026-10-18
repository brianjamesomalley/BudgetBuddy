'use strict';
(function(){
var KEY='sprout-bills-v3',FEE=10,PAY=700;
var MOODS=['😊','😐','😟','😱'];
var LINES=['I’m good. Thanks for stopping by.','Um, it’s been a minute…','Do you remember me?? I’m getting worried.','HELLO?? I’M RIGHT HERE!!'];
var TIER=['Gone cold','Distant','Friendly','Close','Besties'];
function fresh(){return{day:1,att:3,bal:900,streak:0,bills:[
 {id:'rent',name:'Rent',face:'🐻',amt:1200,due:6,charge:80,decay:3,fees:0},
 {id:'power',name:'Electric',face:'🦊',amt:90,due:4,charge:70,decay:6,fees:0},
 {id:'phone',name:'Phone',face:'🐱',amt:55,due:9,charge:65,decay:7,fees:0},
 {id:'car',name:'Car insurance',face:'🐢',amt:140,due:12,charge:75,decay:4,fees:0},
 {id:'stream',name:'Streaming',face:'🦦',amt:15,due:3,charge:60,decay:11,fees:0}]}}
var S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!S||!S.bills)S=fresh();
var $=function(i){return document.getElementById(i)};
var msg=null;
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function stage(c){return c>66?0:c>33?1:c>10?2:3}
function bcol(c){return c>66?'#8ab870':c>33?'#e8a820':'#e8503a'}
function total(b){return b.amt+b.fees*FEE}
function dueText(b){return b.due>1?'Due in '+b.due+' days':b.due===1?'Due tomorrow':b.due===0?'Due today':'Late by '+(-b.due)+'d'}
function hearts(c){var n=Math.ceil(Math.max(0,c)/20),s='';for(var i=0;i<5;i++)s+=i<n?'♥':'♡';return s}
function find(id){return S.bills.filter(function(b){return b.id===id})[0]}
function worst(){return S.bills.slice().sort(function(a,b){return a.charge-b.charge})[0]}
function fog(){
 var low=worst().charge,fees=S.bills.reduce(function(n,b){return n+b.fees},0);
 var d=Math.max(0,Math.min(1,(60-low)/60+fees*.12));
 $('fog').style.opacity=d.toFixed(2);$('fog').className=d>.7?'hot':'';
}
function render(){
 var w=worst(),st=stage(w.charge),acc='';
 if(S.streak>=2)acc+='🔥';
 if(S.bills.some(function(b){return b.fees}))acc+='⚠️';
 if(S.bal>=1500)acc+='💰';
 $('hero').className='hero s'+st+(st>=2?' h'+st:'');
 $('hero').innerHTML='<div class="face">'+w.face+'<span class="mood">'+MOODS[st]+'</span></div><div class="acc">'+acc+'</div><div class="hname">'+w.name+'</div><div class="hint">✨ tap me to spend time</div>';
 var bub=$('bubble');
 bub.className='bubble'+(st===3?' glitch':'');
 bub.textContent=msg||(w.fees?'Now there’s a fee. I didn’t want this.':LINES[st]);
 $('bal').textContent='💵 $'+S.bal;
 $('day').textContent='Day '+S.day;
 $('streak').textContent='🔥 '+S.streak+' day'+(S.streak===1?'':'s');
 var a='';for(var i=0;i<3;i++)a+='<span class="dot'+(i<S.att?'':' off')+'"></span>';
 $('att').innerHTML='Time today '+a;
 var bills=S.bills.slice().sort(function(x,y){return x.charge-y.charge});
 $('list').innerHTML=bills.map(function(b){
  var s=stage(b.charge),sc=Math.min(1.9,1+b.fees*.2),t=total(b),can=S.bal>=t;
  return '<div class="row s'+s+'"><div class="top"><span class="rf">'+b.face+'</span><div class="rn"><span class="nm">'+b.name+'</span> <span class="amt">$'+t+'</span>'
  +'<div class="sub">'+dueText(b)+(b.fees?' · <span class="late">+$'+(b.fees*FEE)+' fees</span>':'')+'</div></div>'
  +'<div style="text-align:right"><div class="hearts">'+hearts(b.charge)+'</div><div class="sub">'+TIER[Math.min(4,Math.ceil(b.charge/20)-1<0?0:Math.ceil(b.charge/20)-1)]+'</div></div></div>'
  +'<div class="bar"><div class="fill" style="width:'+Math.max(0,b.charge)+'%;background:'+bcol(b.charge)+'"></div></div>'
  +'<div class="btns"><button class="pill" data-a="look" data-id="'+b.id+'"'+(S.att<1?' disabled':'')+'>💬 Spend time</button>'
  +'<button class="pill pay" data-a="pay" data-id="'+b.id+'"'+(can?'':' disabled')+' style="transform:scale('+sc+')">'+(can?'Pay $'+t:'Need $'+(t-S.bal))+'</button></div></div>';
 }).join('');
 fog();save();
}
function look(b){
 if(S.att<1){msg='No time left today. Tomorrow.';return}
 S.att--;b.charge=Math.min(100,b.charge+15);msg='You spent time with '+b.name+'. ♥ '+hearts(b.charge);
}
$('hero').addEventListener('click',function(){look(worst());render()});
$('list').addEventListener('click',function(e){
 var t=e.target.closest('button');if(!t)return;
 var b=find(t.dataset.id);if(!b)return;
 if(t.dataset.a==='look')look(b);
 if(t.dataset.a==='pay'&&S.bal>=total(b)){S.bal-=total(b);msg='Paid '+b.name+'. It lights up. New cycle starts.';b.charge=100;b.fees=0;b.due=30}
 render();
});
$('next').addEventListener('click',function(){
 S.day++;S.att=3;var n=[];
 S.bills.forEach(function(b){
  b.charge=Math.max(0,b.charge-b.decay);b.due--;
  if(b.due<0&&b.charge<=0){b.fees++;n.push(b.name+' added a late fee')}
  else if(b.charge<=10)n.push(b.name+' is almost gone');
 });
 var ok=S.bills.every(function(b){return b.charge>33&&!b.fees});
 S.streak=ok?S.streak+1:0;
 if(S.day%7===1){S.bal+=PAY;n.unshift('Payday! +$'+PAY)}
 msg=n.length?n.join('. ')+'.':'A quiet day. Everything faded a little.';
 render();
});
$('reset').addEventListener('click',function(){S=fresh();msg='Fresh start. Everyone is happy to see you.';render()});
render();
})();

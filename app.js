
let doc, htm, bod, nav, M, I, mobile, S, Q, hC, aC, rC, tC, GamePlayer, GameBoard, GamePiece; 
addEventListener('load', ()=>{
doc = document; htm = doc.documentElement; bod = doc.body; nav = navigator; M = tag=>doc.createElement(tag); I = id=>doc.getElementById(id);
mobile = /Mobi/i.test(nav.userAgent);
S = (selector, within)=>{
  let w = within || doc;
  return w.querySelector(selector);
}
Q = (selector, within)=>{
  let w = within || doc;
  return w.querySelectorAll(selector);
}
hC = (node, className)=>{
  return node.classList.contains(className);
}
aC = (node, ...classNames)=>{
  node.classList.add(...classNames);
  return aC;
}
rC = (node, ...classNames)=>{
  node.classList.remove(...classNames);
  return rC;
}
tC = (node, className)=>{
  node.classList.toggle(className);
  return tC;
}
GamePlayer = function(player){
  this.player = player; this.pieces = []; this.using; 
  this.addPiece = (piece, x, y)=>{
    this.pieces.push([piece, x, y]);
    return this;
  }
}
GameBoard = function(wide = 8, high = 8){
  this.table = M('table'); this.tbody = M('tbody');
  this.table.className = 'gameboard'; this.using;
  const t = this, all = [];
  const sizeIt = where=>{
    this.table.style.width = where.getBoundingClientRect().height+'px';
     let q = Q('td', this.tbody), tb = this.table.getBoundingClientRect(), tt = tb.top, tl = tb.left, b, bt, bl;
    for(let n of q){
      b = n.getBoundingClientRect(); bt = b.top-tt; bl = b.left-tl;
      all.push([bt, bt+b.height, bl, bl+b.width, n]);
    }
  }
  for(let i=0,tr,shit=0; i<high; i++){
    tr = M('tr');
    for(let n=0,td; n<wide; n++){
      td = M('td'); tr.appendChild(td); 
    }
    this.tbody.appendChild(tr);
  }
  const grabIt = function(){
    if(!t.using){
      this.style.width = this.style.height = this.parentNode.getBoundingClientRect().width+'px';
      aC(this, 'using'); aC(t.table, 'using'); t.using = this;
    }
  }
  const moveIt = e=>{
    const u = this.using;
    if(u){
      const s = u.style, h = u.getBoundingClientRect().width/2;
      s.top = e.clientY-h+'px'; s.left = e.clientX-h+'px';
    }
  }
  const dropIt = e=>{
    if(this.using){
      const tb = this.table, x = e.clientX-tb.offsetLeft, y = e.clientY-tb.offsetTop;
      let n;
      for(let a of all){
        n = a[4];
        if(y >= a[0] && y <= a[1] && x >= a[2] && x <= a[3] && !n.hasChildNodes()){
          n.appendChild(this.using);
          break;
        }
      }
      rC(this.table, 'using'); rC(this.using, 'using'); this.using = undefined;
    }
  }
  this.addPiece = (player, x, y, piece)=>{
    if(mobile){
      piece.piece.ontouchstart = grabIt;
    }
    else{
      piece.piece.onmousedown = grabIt;
    }
    player.addPiece(piece, x, y);
    this.tbody.rows[y].cells[x].appendChild(piece.piece);
    return this;
  }
  this.appendTo = where=>{
    where.appendChild(this.table); sizeIt(where); 
    onresize = ()=>{
      sizeIt(where);
    }
    if(mobile){
      ontouchmove = e=>{
        moveIt(e.touches[0]);
      }
      ontouchend = e=>{
        dropIt(e.touches[0]);
      }
    }
    else{
      onmousemove = moveIt; onmouseup = dropIt;
    }
    return this;
  }
  this.table.appendChild(this.tbody);
}
GamePiece = function(className){
  this.piece = M('div'); this.piece.className = className;
}


const board = new GameBoard, player1 = new GamePlayer('player 1'), player2 = new GamePlayer('player 2');
const page = I('page');
function redDisk(){
  return new GamePiece('red_disk');
}
function blackDisk(){
  return new GamePiece('black_disk');
}
for(let i=0,n=1,p,l=8; i<l; i+=2,n+=2){
  p = redDisk(); board.addPiece(player1, i, 5, p); 
  p = redDisk(); board.addPiece(player1, n, 6, p); 
  p = redDisk(); board.addPiece(player1, i, 7, p);
  p = blackDisk(); board.addPiece(player2, n, 0, p); 
  p = blackDisk(); board.addPiece(player2, i, 1, p);
  p = blackDisk(); board.addPiece(player2, n, 2, p);
}
board.appendTo(page);
});
 
//var deck = document.getElementById('deck');
var cards = [2,3,4,5,6,7,8,9,10,11,12,13,14];
var suits = ['s','h','c','d'];
var deckList = [];
var stacks = [];
var dump = [];
for (var i=0;i<cards.length;i++){
  for (var s=0;s<suits.length;s++){
    deckList.push({'value':cards[i],'suit':suits[s]});
  }
}

function shuffle(){
  //randomly places cards in front or behind one another;
  deckList.sort(function(){
    return 0.5 - Math.random();
  })
}

function dealDeck(players){
  //deal deck to X number of players;
  var stackLength = deckList.length/players;
  //var stacks = [];
  for (var i=0;i<players;i++){
    var stack = {'player':i,'stack':[]};
    stacks.push(stack);
  }
  for (var i=0;i<stackLength;i++){
    for (var s=0;s<stacks.length;s++){
      stacks[s].stack.push(deckList.pop());
    }
  }
  //return stacks;
}

function getCards(){
  var p1 = stacks[0].stack.splice(0,1)[0];
  var p2 = stacks[1].stack.splice(0,1)[0];
  return [p1,p2];
}

//remove first item from array, if greater than add removed items to winner's array;
function play(plays){
  var p1 = plays[0];
  var p2 = plays[1];
  var winner;
  if (p1.value > p2.value){
    stacks[0].stack.push(p1);
    stacks[0].stack.push(p2);
    winner = 0;
  }else if(p1.value < p2.value){
    stacks[1].stack.push(p1);
    stacks[1].stack.push(p2);
    winner = 1;
  }else{
    draw();
  }
  console.log(stacks[0].stack.length,stacks[1].stack.length);
  return winner;
}

function draw(){

  var dump1 = stacks[0].stack.splice(0,3);
  var dump2 = stacks[1].stack.splice(0,3);
  dump = (dump.length == 0)?dump1.concat(dump2):dump.concat(dump1).concat(dump2);

  console.log(dump);

  var winner = play(getCards());
  for (var i=0;i<dump.length;i++){
    stacks[winner].stack.push(dump[i]);
  }
}

function playGame(){
  while (stacks[0].stack.length > 0 || stacks[1].stack.length >0){
    play(getCards());
  }
}

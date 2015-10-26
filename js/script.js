var cards = [2,3,4,5,6,7,8,9,10,11,12,13,14];
var special = ['J','Q','K','A'];
var suits = ['s','h','c','d'];
var deckList = [];
var stacks = [];
var dump = [];
var deck = document.getElementById('deck');
for (var i=0;i<cards.length;i++){
  for (var s=0;s<suits.length;s++){
    deckList.push({'value':cards[i],'suit':suits[s]});
    // var disp = (cards[i]-11 >= 0)?special[cards[i]-11]:cards[i];
    var card = document.createElement('div');
    card.className = 'card';
    // card.setAttribute('suit',suits[s]);
    // card.setAttribute('value',cards[i]);
    // card.setAttribute('disp',disp);
    deck.appendChild(card);
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
  for (var i=0;i<players;i++){
    var stack = {'player':i,'stack':[]};
    stacks.push(stack);

    var pStack = document.createElement('div');
    pStack.className = 'stack contain';
    document.body.appendChild(pStack);
  }
  for (var i=0;i<stackLength;i++){
    for (var s=0;s<stacks.length;s++){
      stacks[s].stack.push(deckList.pop());
    }
  }
  deal(players);
}

function deal(players){
  var childCount = deck.childElementCount;
  var pStacks = document.querySelectorAll('.stack');
  for (var i=0;i<childCount;i++){
    for (var b=0;b<players.length;b++){
      pStacks[b].appendChild(deck.children[0]);
    }
  }
}

function getCards(){
  //get the top card from each stack
  var p1 = stacks[0].stack.splice(0,1)[0];
  var p2 = stacks[1].stack.splice(0,1)[0];
  return [p1,p2];
}

function play(plays){
  var p1 = plays[0];
  var p2 = plays[1];
  var winner;
  //compare results of getCards(). If one is greater than the other, add to
  //end of winning stack
  if (p1.value > p2.value){
    stacks[0].stack.push(p1);
    stacks[0].stack.push(p2);
    winner = 0;
  }else if(p2.value > p1.value){
    stacks[1].stack.push(p1);
    stacks[1].stack.push(p2);
    winner = 1;
  }else{
    //if there's a tie, the cards played and three more cards each get added to the dump pile
    //play again to see who gets them
    burn(plays);
    return;
  }
  //if there's anything in the dump pile and there's a winner,
  //add contents of dump pile to winner's stack
  if (dump.length>0 && winner){
    while (dump.length>0){
      stacks[winner].stack.push(dump.pop());
    }
  }
}

function burn(plays){
  var burns = getBurnCounts();
  var dump1 = stacks[0].stack.splice(0,burns[0]);
  var dump2 = stacks[1].stack.splice(0,burns[1]);
  var theseBurns = plays.concat(dump1,dump2);
  dump = (dump.length == 0)?theseBurns:dump.concat(theseBurns);
}

function getBurnCounts(){
  //if you have fewer than three cards, returns the amount each player can
  //burn and still play
  var burns = [];
  for (var i=0;i<stacks.length;i++){
    var burn = (stacks[i].stack.length>3)?3:stacks[i].stack.length - 1;
    burns.push(burn)
  }
  return burns;
}

// function draw(){
//   var burns = getBurnCounts();
//   var dump1 = stacks[0].stack.splice(0,burns[0]);
//   var dump2 = stacks[1].stack.splice(0,burns[1]);
//   dump = (dump.length == 0)?dump1.concat(dump2):dump.concat(dump1).concat(dump2);
//
//   console.log(dump);
//
//   var winner = play(getCards());
//   for (var i=0;i<dump.length;i++){
//     stacks[winner].stack.push(dump[i]);
//   }
// }

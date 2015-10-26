var deck = document.getElementById('deck');
var cards = [2,3,4,5,6,7,8,9,10,11,12,13,14];
var suits = ['s','h','c','d'];
var deckList = [];
for (var i=0;i<cards.length;i++){
  for (var s=0;s<suits.length;s++){
    var card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('value', cards[i]);
    card.setAttribute('suit', suits[s]);
    deck.appendChild(card);
    deckList.push({'value':cards[i],'suit':suits[s]});
  }
}
console.log(deckList);

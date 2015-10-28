# wdi-project1
Project 1 - War

War is a pretty simple game to play. Each player gets half of a deck of cards, draws the top card from their stack, and the whoever played the highest card wins, and adds the cards drawn to the bottom of their stack. When cards of equal value are drawn, they are in War. Each player discards up to three additional cards, then the winner of the subsequent draw gets all the cards that have been discarded. The game continues until one player has all the cards. Again, pretty simple and no skill involved whatsoever.

I programmed War by breaking the game down into it's component parts:
1. A deck of cards gets shuffled.
2. The cards are dealt evenly among players.
3. Each player plays a card.
4. If the played cards are of equal value, each player discards up to three cards from their stack, then they play again.
5. The player with the high card add all discarded cards to the bottom of their deck.
6. Repeat x Infinity until someone has all the cards.

I first programmed the basic game logic in Javascript. I generated a deck of cards using nested arrays of the card values and suits, and split the deck into two arrays, one for each player. Cards were played from each stack array using the `.pop()` method, values were compared, and the items were added back to the winning array using the `.push()` method. When there was a War, each stack array `.splice()`'d the next three elements and added them to a burnPile array, and the next time a player won a round, the contents of the burnPile would be `.push()`'d to the winning array.

Functionally, this worked fine. In the DOM I could use some deception. There would need to be 52 elements representing each card because a user would only want to see the cards in play. Instead, I thought it would be interesting to treat each card as a discrete piece of data. I used d3.js to bind data to card elements, so I could then compare each actual card at play rather than values from an array.



Initial User Stories:
1. A player should be able to start a game/get a stack of cards so that they can play War.
2. A player should be able to click their stack so that they can play a card.
3. A player should be able to keep track of how many cards each player has so that they can know the score.
4. A player should be able to restart a game so that they do not have to play until the end (game could take a while to finish)
5. A player should be able to view his/her stack so they can determine if they want to continue the game.

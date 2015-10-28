# wdi-project1
###Project 1 - War

####Overview
War is a pretty simple game to play. Each player gets half of a deck of cards, draws the top card from their stack, and the whoever played the highest card wins. The winner then adds all the cards drawn to the bottom of their stack. When cards of equal value are drawn, players are in 'War'. Each player discards up to three additional cards, and the winner of the subsequent draw gets all the cards that have been discarded. The game continues until one player has all the cards. Again, pretty simple and no skill involved whatsoever.

####Approach
I programmed War by breaking the game down into its component parts:

1. A deck of cards gets shuffled.
2. The cards are dealt evenly among players.
3. Each player plays a card.
4. If the played cards are of equal value, each player discards up to three cards from their stack, then they play again.
5. The player with the high card adds all discarded cards to the bottom of their stack.
6. Repeat ad infinitum until someone has all the cards.

#####Vanilla Javascript
I first programmed the basic game logic in Javascript. I generated a deck of cards using nested arrays of the card values and suits, and split the deck into two arrays, one for each player. Cards were played from each stack array using the `.pop()` method, values were compared, and the items were added back to the winning array using the `.push()` method. When there was a War, each stack array `.splice()`'d the next three elements and added them to a burnPile array, and the next time a player won a round, the contents of the burnPile would be `.push()`'d to the winning array.

Functionally, this worked fine. In the DOM I could use some deception. There wouldn't need to be 52 elements representing each card because a user would only want to see the cards in play. There would be an element for each card in play, and their values would correspond to whatever is being `.pop()`'d from each array.

#####d3.js and CSS transitions
Instead, I thought it would be interesting to treat each card as a discrete piece of data. I used [d3.js](http://d3js.org/) to bind data to card elements, so I could then compare each actual card at play rather than values from the arrays. In place of arrays, I used `svg:g` elements to contain "cards", which were also `svg:g` elements with unique card data bound to them. I track where each card belongs during each step of the game by adding/modifying classes and attributes: `stack='X'` for which player's stack a card belongs to, `.inPlay` for when a card is actively in play, and `.burn` for when a card is in the burn pile. [CSS transitions](http://www.w3schools.com/css/css3_transitions.asp) were used to move card elements around the DOM by declaring CSS rules for each state a card could be in. For instance, when a `.card`'s stack attribute = 1, it is positioned in a different place than if it had the class `.burn`.

Structurally, my code is composed mostly of a single global variable called `war`. Inside `war`, variables are stored, methods are called, and the program is executed. A counter keeps track of each play and another variable tracks the score, which are used to update the score chart and counts. The score chart was also programmed in d3, as `svg:path` element with a `d` attribute that gets recalculated after each play.

####Unsolved Problems
* I would have liked to allow for more players, but the division (52/3 ?) didn't make sense to me.
* Clicking auto-finish could cause the page to freeze sometimes. My guess is that the game ends in a tie, where both stack might mirror each other, causing an unending loop.
* When a game ends in a War, the cards are in an odd place. This can be fixed when the reset button is clicked, but it looks a bit weird before then.

####Installation Instructions
* Fork and clone the repo.
* Can be run in gh-pages.
* View Application [here](http://cpgruber.github.io/wdi-project1).
* View Code [here](https://github.com/cpgruber/wdi-project1/tree/master).

####User Stories:
1. A player should be able to start a game/get a stack of cards so that they can play War.
2. A player should be able to click their a button so that they can play a card.
3. A player should be able to keep track of how many cards each player has so that they can know the score.
4. A player should be able to restart a game so that they do not have to play until the end (game could take a while to finish)
5. A player should be able to click a button to automatically finished the game so they don't have to click a button a billion times.

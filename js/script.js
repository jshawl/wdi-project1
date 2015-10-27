// still to do:
// make shuffling actually shuffle deck
// clean up animations
// maybe add analysis, look at score, history trending up/down
//

var war = {
  buildDeck: function(){
    var cards = [2,3,4,5,6,7,8,9,10,11,12,13,14];
    var special = ['J','Q','K','A'];
    var suits = ['s','h','c','d'];
    var unicodes = {s:"\u2660",h:"\u2665",c:"\u2663",d:"\u2666"};
    var deckList = [];
    for (var i=0;i<cards.length;i++){
      for (var s=0;s<suits.length;s++){
        deckList.push({
          'value':cards[i],
          'suit':suits[s],
          'unicode':unicodes[suits[s]],
          'display':(cards[i]>10)?special[cards[i]-11]:cards[i]
        });
      }
    }
    return deckList;
  },
  buildComponents:function(){
    this.components.svg = d3.select('body').append('svg').attr('height',900).attr('width',1000);
    this.components.deck = this.components.svg.append('g').attr('id','deck');
    this.components.inPlay = this.components.svg.append('g').attr('id','inPlay');
    this.components.burnPile = this.components.svg.append('g').attr('id','burn');
    this.components.cardBG = this.components.svg.append('defs')
      .append('pattern').attr('id','cardBg').attr('patternUnits','userSpaceOnUse')
        .attr('width',100).attr('height',100)
      .append('image').attr('xlink:href','assets/skulls.png')
        .attr('x',0).attr('y',0).attr('width',100).attr('height',100);
  },
  components:{},
  buildCards:function(){
    var cards = this.components.deck.selectAll('.card').data(this.yates(this.buildDeck()))
      .enter().append('g').attr('class','card')
      .attr('suit', function(d){return d.suit})
      .attr('num',function(d){return d.value});

    cards.append('rect').attr('class','front');
    cards.append('text')
      .text(function(d){
        var uni = d.unicode;
        var number = d.display;
        return uni+number})
    cards.append('rect').attr('class','back').attr('fill','url(#cardBg)');
    return cards;
  },
  shuffle:function(){
    // this.components.deck.selectAll('.card').sort(function(d){
    //   return 0.5-Math.random();
    // })
    this.components.deck.attr('class','shuffling').transition().delay(1000).attr('class','');
  },
  yates:function(array){
    var m = array.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  },
  dealDeck:function(players){
    this.players = players;
    this.components.stackG = this.components.svg.selectAll('.stack')
      .data(d3.range(players));
    this.components.stackG.enter().append('g')
      .attr('class',function(d,i){return 'stack p'+i});
    this.components.stackG.exit().remove();
    this.deal();
  },
  deal:function(){
    var players = this.players;
    this.components.deck.selectAll('.card').each(function(d,i){
      var stackNum = i%players;
      d3.select(this).transition().delay(50*i).attr('stack',stackNum);
      var that = d3.select(this).remove();
      d3.select('.p'+stackNum).append(function(){
        return that.node();
      })
    })
  },
  getPlays:function (){
    var playArr = [];
    var inPlay = this.components.inPlay;
    var plays = this.components.stackG.each(function(d,i){
      var play = d3.select(this).select('.card')
      var p = parseInt(play.attr('num'));
      play.transition().delay(200).attr('class','card inPlay');
      playArr.push(p);

      var that = play.remove();
      inPlay.append(function(){
        return that.node();
      })
    });
    return playArr;
  },
  playHand: function(plays){
    var winner;
    if (plays[0]>plays[1]){
      winner = 0;
    }else if (plays[1]>plays[0]){
      winner = 1;
    }else{
      this.burn(plays);
      return;
    }
    this.giveWinner(winner);
    var burnLength = this.components.burnPile.selectAll('.card')[0].length;
    if (burnLength>0){
      this.giveWinnerBurn(winner);
    }
    return winner;
  },
  burn:function(plays){
    var burnCounts = this.getBurnCounts();
    var burnPile = this.components.burnPile;
    this.components.stackG.each(function(d,i){
      var dump = d3.select(this).selectAll('.card').filter(function(e,j){return j<burnCounts[i]});
      dump.each(function(f,k){
        d3.select(this).transition().delay(500).attr('class','card burn');
        var that = d3.select(this).remove();
        burnPile.append(function(){
          return that.node();
        })
      })
    })
    this.components.inPlay.selectAll('.card')
      .each(function(d,i){
        d3.select(this).transition().delay(500).attr('class','card burn');
        var that = d3.select(this).remove();
        burnPile.append(function(){
          return that.node();
        });
      });
  },
  getBurnCounts:function(){
    var burns = [];
    this.components.stackG.each(function(d,i){
      var len = d3.select(this).selectAll('.card')[0].length;
      var burn = (len>3)?3:len - 1;
      burns.push(burn);
    })
    return burns;
  },
  giveWinner:function(winner){
    var winnings = this.components.inPlay.selectAll('.card')
      .transition().delay(1000)
      .attr('class','card').attr('stack',winner);
    winnings.each(function(d,i){
      var that = d3.select(this).remove();
      d3.select('.p'+winner).append(function(){
        return that.node();
      })
    })
  },
  giveWinnerBurn:function(winner){
    this.components.burnPile.selectAll('.card').each(function(d,i){
      d3.select(this).transition().delay(500).attr('class','card').attr('stack',winner)
      var that = d3.select(this).remove();
      d3.select('.p'+winner).append(function(){
        return that.node();
      });
    });
  },
  resetDeck:function(){
    var deck = this.components.deck;
    this.components.svg.selectAll('.card')
      .each(function(d,i){
      var that = d3.select(this).remove();
      deck.append(function(){
        return that.node();
      })
    })
    .transition().delay(300).attr('class','card').attr('stack',null)
  }
}
war.buildComponents();
war.buildCards();
d3.select('#shuffle').on('click',function(){
  war.shuffle();
});
d3.select('#deal').on('click', function(){
  war.dealDeck(2);
});
d3.select('#play').on('click', function(){
  var plays = war.getPlays();
  war.playHand(plays);
});
d3.select('#reset').on('click',function(){
  war.resetDeck();
});

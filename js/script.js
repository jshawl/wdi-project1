var cards = [2,3,4,5,6,7,8,9,10,11,12,13,14];
var special = ['J','Q','K','A'];
var suits = ['s','h','c','d'];
var deckList = [];

var colors = d3.scale.linear().domain([2,8,14]).range(['blue','green','red']);

var svg = d3.select('body').append('svg').attr('height',900).attr('width',1000).style('fill','none');
var deck = svg.append('g').attr('id','deck');
var inPlay = svg.append('g').attr('id','inPlay');
var burnPile = svg.append('g').attr('id','burn');
var stackG;

for (var i=0;i<cards.length;i++){
  for (var s=0;s<suits.length;s++){
    deckList.push({'value':cards[i],'suit':suits[s]});
  }
  deck.selectAll('.card').data(deckList).enter().append('rect').attr('class','card')
    .attr('d',function(d){
      return d.value + d.suit;
    })
    .attr('num', function(d){
      return d.value;
    })
    .style('fill',function(d){return colors(d.value)}).style('height','200px').style('width','150px');
}

function shuffle(){
  deck.selectAll('.card').sort(function(d){
    return 0.5-Math.random();
  })
}

function dealDeck(players){
  //deal deck to X number of players;
  stackG = svg.selectAll('.stack').data(d3.range(players)).enter().append('g')
    .attr('class',function(d,i){return 'stack p'+i})
  deal();
}

function deal(){
  deck.selectAll('.card').each(function(d,i){
    var stackNum = i%2;

    d3.select(this)
      .attr('stack',stackNum)
      .transition().duration(300).delay(function() { return i * 50; })
      .attr('transform',function(){
        var x = (i%2==0)?50:500;
        var y = 400;
        return 'translate('+x+','+y+')';
      })

    var that = d3.select(this).remove();
    d3.select('.p'+stackNum).append(function(){
      return that.node()
    })
  })
}

function getCards(){
  //get the top card from each stack
  var play0 = d3.select('.p0').select('.card').attr('class','card inPlay')
  play0.transition().duration(300)
    .attr('transform','translate(200,200)');

  var play1 = d3.select('.p1').select('.card').attr('class','card inPlay')
  play1.transition().duration(300)
    .attr('transform','translate(350,200)');

    var p1 = parseInt(play0.attr('num'));
    var p2 = parseInt(play1.attr('num'));

  d3.selectAll('.inPlay').each(function(d,i){
    var that = d3.select(this).remove();
    inPlay.append(function(){
      return that.node()
    })
  })
  return [p1,p2];
}

function play(plays){
  var p1 = plays[0];
  var p2 = plays[1];
  var winner;
  //compare results of getCards(). If one is greater than the other, add to
  //end of winning stack
  if (p1 > p2){
    winner = 0;
  }else if(p2 > p1){
    winner = 1;
  }else{
    //if there's a tie, the cards played and three more cards each get added to the dump pile
    //play again to see who gets them
    burn(plays);
    return;
  }
  //move append contents of inPlay to winning stack
  inPlay.selectAll('.inPlay').attr('class','card').attr('stack',winner)
    .transition().duration(300).delay(function(){return i*50})
    .attr('transform', function(){
      var x = (winner==0)?50:500;
      var y = 400;
      return 'translate('+x+','+y+')';
    })
    .each("end",function(d,i){
      var that = d3.select(this).remove();
      d3.select('.p'+winner).append(function(){
        return that.node();
      })
    })

  //if there's anything in the dump pile and there's a winner,
  //add contents of dump pile to winner's stack
  var dumpLen = burnPile.selectAll('.card')[0].length;
  if (dumpLen>0 && winner>=0){
    burnPile.selectAll('.card')
      .each(function(d,i){
        d3.select(this)
          .transition().duration(300).delay(function() { return 300 + (i * 50); })
          .attr('transform',function(){
            var x = (winner==0)?50:500;
            var y = 400;
            return 'translate('+x+','+y+')';
          })

        var that = d3.select(this).remove();
        d3.select('.p'+winner).append(function(){
          return that.node();
        })
      });
  }

  //not sure why this isn't adding up to 52
  //console.log(d3.select('.p0').selectAll('.card')[0].length,d3.select('.p1').selectAll('.card')[0].length);
}

function burn(plays){
  var burns = getBurnCounts();
  var dump1 = d3.select('.p0').selectAll('.card').filter(function(d,i){return i<burns[0]})
    .each(function(d,i){
      d3.select(this)
        .transition().duration(300).delay(function() { return 300 + (i * 50); })
        .attr('transform',function(){
          var x = 500;
          var y = 50;
          return 'translate('+x+','+y+')';
        })

      var that = d3.select(this).remove();
      burnPile.append(function(){
        return that.node();
      })
    });

  var dump2 = d3.select('.p1').selectAll('.card').filter(function(d,i){return i<burns[1]})
    .each(function(d,i){
      d3.select(this)
        .transition().duration(300).delay(function() { return 300 + (i * 50); })
        .attr('transform',function(){
          var x = 500;
          var y = 50;
          return 'translate('+x+','+y+')';
        })

      var that = d3.select(this).remove();
      burnPile.append(function(){
        return that.node();
      })
    });

  inPlay.selectAll('.inPlay').attr('class','card')
    .each(function(d,i){
      d3.select(this)
        .transition().duration(300).delay(function() { return 600+ (i * 50); })
        .attr('transform',function(){
          var x = 500;
          var y = 50;
          return 'translate('+x+','+y+')';
        })

      var that = d3.select(this).remove();
      burnPile.append(function(){
        return that.node();
      })
    });
}

function getBurnCounts(){
  //if you have fewer than three cards, returns the amount
  //each player can burn and still be able to play
  var burns = [];
  for (var i=0;i<stackG[0].length;i++){
    var stackLength = d3.select('.p'+i).selectAll('.card')[0].length;
    var burn = (stackLength>3)?3:stackLength - 1;
    burns.push(burn);
  }
  return burns;
}

function playRound(){
  var plays = getCards();
  play(plays);
}

function reset(){

}

d3.select('button').on("click", playRound);

shuffle()
shuffle()
shuffle()
dealDeck(2);

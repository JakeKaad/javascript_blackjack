// Player and a Dealer
// Player receives a hand of 2  cards face up
// Dealer receives a hand of 2 cards, one face down
// number cards are worth face value, jack, queen and king are worth 10, ace is 1 or 11
// player can hit, to receive an extra card.
// player can stay, passing turn to dealer
// deck has 52 cards
// deck can shuffle
//

var Card = {
  value: 0,
  suit: 0,
  assignValue: function(value) {
    this.value = value;
  },
  assignSuit: function(suit) {
    this.suit = suit;
  },
  displayText: function() {
    return this.value + " of " + this.suit;
  }
}

var Player =  {
  initialize: function() {
    this.hand = [];
    this.dealer = false;
    this.turn = true;
    this.score = 0;
    this.showDealerCard = true;
    this.name = "user"
  },
  hit: function(deck) {
    deck.dealCard(this.hand);
  },
  flop: function(deck) {
    this.hit(deck);
    this.hit(deck);
  },
  stay: function() {
    this.turn = false;
  },
  makeDealer: function() {
    this.dealer = true;
    this.showDealerCard = false;
    this.turn = false;
    this.name = "dealer"
  },

  dealerHitOrStay: function() {
    return this.score < 17;
  },
  handValues: function() {
    var handValues = [];
    this.hand.forEach(function(card){
      handValues.push(card.value)
    });
    return handValues;
  }
};

var Deck =  {
  initialize: function() {
    this.createDeck();
    this.shuffle();
  },
  cardValues: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
  suitValues: ["spades", "clubs", "diamonds", "hearts"],
  createDeck: function(cardValues) {
    this.cards = [];
    for(var si = 0; si < this.suitValues.length; si++) {
      for(var vi = 0; vi < this.cardValues.length; vi++ ){
        var newCard = Object.create(Card);
        newCard.assignValue(this.cardValues[vi]);
        newCard.assignSuit(this.suitValues[si]);
        this.cards.push(newCard);
      }
    }
  },
  dealCard: function(hand) {
    hand.push(this.cards.pop());
  },
  shuffle: function(){
    this.cards = randomize(this.cards);
  }
};

var Game = {
  initialize: function() {
    this.user = Object.create(Player);
    this.user.initialize();
    this.dealer = Object.create(Player);
    this.dealer.initialize();
    this.dealer.makeDealer();
    this.gameDeck = Object.create(Deck);
    this.gameDeck.initialize();
    this.dealFlop();
  },
  dealFlop: function() {
    this.user.flop(this.gameDeck);
    this.dealer.flop(this.gameDeck);
  },
  showDealerCard: function() {
    this.dealer.showDealerCard = true;
  },
  passTurn: function(){
    this.user.turn = false;
  },
  calculateScore: function(handValues) {
    var runningTotal = 0
    handValues.forEach(function(value) {
      if (parseInt(value)) {
        runningTotal += parseInt(value)
      } else if (value === "A"){
        runningTotal += 11;
      } else {
        runningTotal += 10;
      }
    })


    for (var i = 0; i < handValues.length; i++) {
      if ((handValues[i] === "A") && (runningTotal > 21)) {
        runningTotal -= 10
      }
    }
    return runningTotal;
  },
  determineWinner: function() {
    if (this.dealer.hand.length === 2 && this.dealer.score === 21 || this.user.score > 21 ) {
      return false;
    } else if (((this.player.hand.length === 2) && (this.user.score === 21)) || (this.dealer.score > 21)) {
      return true;
    } else if (this.dealer.score > this.user.score) {
      return false;
    } else {
      return true;
    }
  }
};



$(function(){
  $("#start-game").click(function(){
    var newGame = Object.create(Game);
    newGame.initialize();
    var user = newGame.user;
    var dealer = newGame.dealer;
    var gameDeck = newGame.gameDeck;
    showPlayerHand(dealer);
    showPlayerHand(user);
    user.score = newGame.calculateScore(user.handValues())
    dealer.score = newGame.calculateScore(dealer.handValues())
    $("#user-score").text(user.score);

    $("#hit").click(function(){
      user.hit(gameDeck);
      showPlayerHand(user);
      user.score = newGame.calculateScore(user.handValues())
      $("#user-score").text(user.score);

      if (user.score > 21) {
        newGame.showDealerCard();
        $("#user-buttons").hide();
        $("#dealer-score").text(dealer.score);

        if (dealer.score < 17) {
          $("#dealer-button").show();
        } else if (dealer.score >= 17) {
          $("#results").show()
        }
        showPlayerHand(dealer);
      }
    });

    $("#stay").click(function(){
      newGame.showDealerCard();
      $("#user-buttons").hide();
      $("#dealer-score").text(dealer.score);

      if (dealer.score < 17) {
        $("#dealer-button").show();
      } else if (dealer.score > 17) {
        $("#results").show()
      }
      showPlayerHand(dealer);
    });

    $("#dealer-button").click(function(){
      dealer.hit(gameDeck);
      showPlayerHand(dealer);
      dealer.score = newGame.calculateScore(dealer.handValues());
      $("#dealer-score").text(dealer.score);
      if (dealer.score > 16) {
        $("#dealer-button").hide();
        $("#results").show()
      }
    });

    $("#show-results").click(function(){
      $("#show-results").hide();
      $("#hidden-display").show();

      if (newGame.determineWinner) {
        $("#results-display").text("User")
      } else {
        $("#results-display").text("Dealer")
      }
    });



  });
});

var showPlayerHand = function(player){
  $("#user-cards").text("");
  $("#dealer-cards").text("");
  if (!player.showDealerCard) {
    $('#dealer-cards').append(player.hand[0].displayText())
  } else if (player.name === "user") {
    for( var i = 0; i < player.hand.length; i++) {
      $("#user-cards").append(player.hand[i].displayText() + " ")
    }
  } else {
    for( var i = 0; i < player.hand.length; i++) {
      $("#dealer-cards").append(player.hand[i].displayText() + " ")
    }
  }
}

//Fisher-Yates shuffle function

function randomize(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

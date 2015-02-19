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
}

var Player =  {
  initialize: function() {
    this.hand = [];
    this.dealer = false;
    this.turn = true;
    this.score = 0;
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
  },

  dealerHitOrStay: function() {
    return this.score < 17;
  },
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
};




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

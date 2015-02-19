describe("Card", function(){
  describe("value", function(){
    it("returns the value of the card", function(){
      var aceOfSpades = Object.create(Card);
      aceOfSpades.assignValue("A")
      expect(aceOfSpades.value).to.equal("A")
    });
  });

  describe("suit", function(){
    it("returns the suit of the card", function(){
      var aceOfSpades = Object.create(Card);
      aceOfSpades.assignSuit("Spades")
      expect(aceOfSpades.suit).to.equal("Spades")
    });
  });
});

describe("Player", function(){
  describe("Hit", function(){
    it("deals the player a new card", function(){
      var randomDeckNoWay = Object.create(Deck);
      randomDeckNoWay.createDeck();
      var user = Object.create(Player);
      user.initialize();
      user.hit(randomDeckNoWay);
      expect(user.hand.length).to.equal(1);
    });
  });

  describe("flop", function(){
    it("deals the player initial two cards", function(){
      var randomDeckNoWay = Object.create(Deck);
      randomDeckNoWay.createDeck();
      var user = Object.create(Player);
      user.initialize();
      user.flop(randomDeckNoWay);
      expect(user.hand.length).to.equal(2);
    });
  });

  describe("stay", function(){
    it("sets turn to false", function(){
      var user = Object.create(Player);
      user.initialize();
      user.stay();
      expect(user.turn).to.be.false;
    });
  });

  describe("makeDealer", function() {
    it("sets dealer to true", function() {
      var user = Object.create(Player);
      user.initialize();
      user.makeDealer();
      expect(user.dealer).to.be.true;
    });
  });

  describe("dealerHitorStay", function() {
    it("returns true if score is below 17", function(){
      var dealer = Object.create(Player);
      dealer.initialize();
      dealer.makeDealer();
      expect(dealer.dealerHitOrStay()).to.be.true;
    });
  });
});

describe("Deck", function(){
  describe("createDeck", function(){
    it ("returns a product of suits and values", function(){
      var newDeck = Object.create(Deck);
      newDeck.createDeck();
      expect(newDeck.cards.length).to.equal(52);
    });
  });

  describe("dealCard", function(){
    it("reduces the deck size by 1", function(){
      var newDeck = Object.create(Deck);
      var player = Object.create(Player);
      player.initialize();
      newDeck.createDeck()
      newDeck.dealCard(player.hand);
      expect(newDeck.cards.length).to.equal(51);
    });
  });

  describe("shuffle", function() {
    it("randomizes card order", function() {
      var newDeck = Object.create(Deck);
      newDeck.createDeck();
      newDeck.shuffle();
      expect(newDeck.cards[0].value).to.not.equal("2")
    });
  });
});

describe("Game", function() {
  describe("dealFlop", function(){
    it("deals two cards to each player", function(){
      var newGame = Object.create(Game);
      newGame.initialize();
      newGame.dealFlop();
      expect(newGame.user.hand.length).to.equal(2);
      expect(newGame.dealer.hand.length).to.equal(2);
    });
  });

  describe("showDealerCard", function() {
    it("changes player property showDealerCard to true", function() {
      var newGame = Object.create(Game);
      newGame.initialize();
      newGame.showDealerCard();
      expect(newGame.dealer.showDealerCard).to.be.true;
    });
  });

  describe("passTurn", function(){
    it("sets player turn property to false", function() {
      var newGame = Object.create(Game);
      newGame.initialize();
      newGame.passTurn();
      expect(newGame.user.turn).to.be.false;
    });
  });

  describe("calculateScore", function() {
    it("sets score to 2 when hand has a 2 in it", function() {
      var newGame = Object.create(Game);
      newGame.initialize();
      expect(newGame.calculateScore(["2"])).to.equal(2);
    });

    it("sets score to 4 when hand has 2 2's in it", function(){
      var newGame = Object.create(Game);
      newGame.initialize();
      expect(newGame.calculateScore(["2", "2"])).to.equal(4);
    });

    it("sets the score to 15 when the hand has a Jack and a 5 in it", function(){
      var newGame = Object.create(Game);
      newGame.initialize();
      expect(newGame.calculateScore(["J", "5"])).to.equal(15);
    })

    it("sets score to 11 if an Ace is drawn", function() {
      var newGame = Object.create(Game);
      newGame.initialize();
      expect(newGame.calculateScore(["A"])).to.equal(11);
    });

    it("sets score to 12 if the hand has two aces", function() {
      var newGame = Object.create(Game);
      newGame.initialize();
      expect(newGame.calculateScore(["A", "A"])).to.equal(12);
    });
    it("calculates large hands correctly", function(){
      var newGame = Object.create(Game);
      newGame.initialize();
      expect(newGame.calculateScore(["A", "A", "A", "A", "2", "K"])).to.equal(16);
    });
  });
});

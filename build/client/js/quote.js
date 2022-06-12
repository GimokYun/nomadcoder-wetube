"use strict";

var quotePart = document.getElementById("quotePart");
var quote = document.getElementById("quote");
var quoteAuthor = document.getElementById("quoteAuthor");
var quoteBtnLeft = document.getElementById("quoteBtnLeft");
var quoteBtnRight = document.getElementById("quoteBtnRight");
var quotes = [{
  quote: "Know what you own, and know why you own it.",
  author: "Peter Lynch"
}, {
  quote: "People who succeed in the stock market also accept periodic losses, setbacks, and unexpected occurrences. Calamitous drops do not scare them out of the game.",
  author: "Peter Lynch"
}, {
  quote: "Big companies have small moves, small companies have big moves.",
  author: "Peter Lynch"
}, {
  quote: "Look for small companies that are already profitable and have proven that their concept can be replicated.",
  author: "Peter Lynch"
}, {
  quote: "Don't look for the needle in the haystack. Just buy the haystack!",
  author: "John C. Bogle"
}, {
  quote: "The greatest enemy of a good plan is the dream of a perfect plan.",
  author: "John C. Bogle"
}, {
  quote: "When there are multiple solutions to a problem, choose the simplest one.",
  author: "John C. Bogle"
}, {
  quote: "The two greatest enemies of the equity fund investor are expenses and emotions.",
  author: "John C. Bogle"
}, {
  quote: "The most important rule is the eternal law of reversion to the mean (RTM) in the financial markets.",
  author: "John C. Bogle"
}, {
  quote: "I'm only rich because I know when I'm wrong.",
  author: "George Soros"
}, {
  quote: "Misconceptions play a prominent role in my view of the world.",
  author: "George Soros"
}, {
  quote: "It's not whether you're right or wrong, but how much money you make when you're right and how much you lose when you're wrong.",
  author: "George Soros"
}, {
  quote: "Price is what you pay. Value is what you get.",
  author: "Warren Buffett"
}, {
  quote: "Be fearful when others are greedy and greedy when others are fearful.",
  author: "Warren Buffett"
}, {
  quote: "Risk comes from not knowing what you're doing.",
  author: "Warren Buffett"
}, {
  quote: "It’s better to hang out with people better than you. Pick out associates whose behavior is better than yours and you’ll drift in that direction.",
  author: "Warren Buffett"
}, {
  quote: "Games are won by players who focus on the playing field, not by those whose eyes are glued to the scoreboard.",
  author: "Warren Buffett"
}, {
  quote: "We both insist on a lot of time being available almost every day to just sit and think. That is very uncommon in American business. We read and think.",
  author: "Charles T. Munger"
}, {
  quote: "Spend each day trying to be a little wiser than you were when you woke up. Day by day, and at the end of the day, you will get out of life what you deserve.",
  author: "Charles T. Munger"
}, {
  quote: "There is no better teacher than history in determining the future.",
  author: "Charles T. Munger"
}, {
  quote: "People calculate too much and think too little.",
  author: "Charles T. Munger"
}, {
  quote: "The intelligent investor is a realist who sells to optimists and buys from pessimists.",
  author: "Benjamin Graham"
}, {
  quote: "In the short run, the market is a voting machine but in the long run, it is a weighing machine.",
  author: "Benjamin Graham"
}, {
  quote: "Those who do not remember the past are condemned to repeat it.",
  author: "Benjamin Graham"
}, {
  quote: "Investing isn’t about beating others at their game. It’s about controlling yourself at your own game.",
  author: "Benjamin Graham"
}, {
  quote: "When profit margins of a whole industry rise because of repeated price increases, the indication is not a good one for the long-range investor.",
  author: "Philip A. Fisher"
}, {
  quote: "The stock market is almost magical because it always leads the economy. It goes down long before the economy drops and then heads higher long before the economy rebounds. It always has.",
  author: "Kenneth L. Fisher"
}, {
  quote: "If you’re not failing, you’re not pushing your limits, and if you’re not pushing your limits, you’re not maximizing your potential.",
  author: "Ray Dalio"
}, {
  quote: "It’s more important to do big things well than to do the small things perfectly.",
  author: "Ray Dalio"
}];
var index = Math.floor(Math.random() * quotes.length);
var chosenQuote = quotes[index];
quote.innerText = "\"".concat(chosenQuote.quote, "\"");
quoteAuthor.innerText = chosenQuote.author;

var quoteAppear = function quoteAppear() {
  if (index + 1 === quotes.length) {
    index = 0;
    var newQuote = quotes[index];
    quote.innerText = "\"".concat(newQuote.quote, "\"");
    quoteAuthor.innerText = newQuote.author;
  } else {
    index = index + 1;
    var _newQuote = quotes[index];
    quote.innerText = "\"".concat(_newQuote.quote, "\"");
    quoteAuthor.innerText = _newQuote.author;
  }

  quotePart.classList.remove("quoteRight");
  quotePart.classList.add("quoteLeft");
};

var quoteAnimation = function quoteAnimation() {
  quotePart.classList.remove("quoteRightReverse");
  quotePart.classList.remove("quoteLeftReverse");
  quotePart.classList.remove("quoteLeft");
  quotePart.classList.add("quoteRight");
  setTimeout(quoteAppear, 500);
};

var quoteAppearReverse = function quoteAppearReverse() {
  if (index - 1 === 0) {
    index = quotes.length - 1;
    var newQuote = quotes[index];
    quote.innerText = "\"".concat(newQuote.quote, "\"");
    quoteAuthor.innerText = newQuote.author;
  } else {
    index = index - 1;
    var _newQuote2 = quotes[index];
    quote.innerText = "\"".concat(_newQuote2.quote, "\"");
    quoteAuthor.innerText = _newQuote2.author;
  }

  quotePart.classList.remove("quoteLeftReverse");
  quotePart.classList.add("quoteRightReverse");
};

var quoteAnimationReverse = function quoteAnimationReverse() {
  quotePart.classList.remove("quoteLeft");
  quotePart.classList.remove("quoteRight");
  quotePart.classList.remove("quoteRightReverse");
  quotePart.classList.add("quoteLeftReverse");
  setTimeout(quoteAppearReverse, 500);
};

var quoteInterval = setInterval(quoteAnimation, 10000);

var handleClickBtnRight = function handleClickBtnRight() {
  clearInterval(quoteInterval);
  quoteAnimation();
  quoteInterval = setInterval(quoteAnimation, 10000);
};

var handleClickBtnLeft = function handleClickBtnLeft() {
  clearInterval(quoteInterval);
  quoteAnimationReverse();
  quoteInterval = setInterval(quoteAnimation, 10000);
};

if (quoteBtnLeft) {
  quoteBtnLeft.addEventListener("click", handleClickBtnLeft);
}

if (quoteBtnRight) {
  quoteBtnRight.addEventListener("click", handleClickBtnRight);
}
window.addEventListener('load', function () {
  let images = [
    './images/angry.jpg',
    './images/bird.jpg',
    './images/bob.png',
    './images/cat.jpg',
    './images/dark.jpg',
    './images/elf.jpg',
    './images/girl.png',
    './images/hero.png',
    './images/jerry.jpg',
    './images/lion.jpg',
    './images/mikey.jpg',
    './images/monkey.jpg',
    './images/panda.png',
    './images/pica.png',
    './images/rocket.jpg',
    './images/star.jpg',
    './images/tomato.png',
    './images/turtle.png',
    './images/ugly.jpg',
    './images/elephant.jpg',
  ];

  // Select DOM elements to start new game
  const newGameBtn = document.querySelector('.new-game-btn');
  const modalNewGameContainer = document.querySelector(
    '.modal-new-game-container'
  );
  const closeModalNewGameBtn = document.querySelector('#close-modal-new-game');
  const startNewGameBtn = document.querySelector('.new-game-start-btn');

  // close modal
  closeModalNewGameBtn.addEventListener('click', function () {
    modalNewGameContainer.classList.remove('show-new-game-modal');
  });

  // open new game modal
  newGameBtn.addEventListener('click', function () {
    modalNewGameContainer.classList.add('show-new-game-modal');
  });

  // set number of players and cards and close modal
  startNewGameBtn.addEventListener('click', function (e) {
    e.preventDefault();

    // new game set up
    let players = 1;
    let cards = 12;

    players = parseInt(document.querySelector('#players').value);

    cards = parseInt(document.querySelector('#cards').value);

    // close modal
    modalNewGameContainer.classList.remove('show-new-game-modal');

    //call start game function
    start(players, cards);
  });

  // init game with the number of players and cards selected
  function start(players, cards) {
    // set players
    setPlayers(players);
    // set shuffle cards
    setCards(cards);
    // play
    play();
  }

  // Set players
  function setPlayers(players) {
    let playersContainer = document.querySelector('.players');

    let playersArray = [];

    // prevent invalid input from keyboard
    if (players < 1) {
      players = 1;
    }
    if (players > 4) {
      players = 4;
    }

    // create players
    for (let i = 0; i < players; i++) {
      playersArray.push(
        `<div class="player ${i == 0 ? 'player-active' : ''}" id=${i + 1}>
          <h4>player ${i + 1}</h4>
          ${
            i <= players - 1
              ? `<p>
                score: <span>0</span>
              </p>`
              : ''
          }
        </div>`
      );
    }

    playersContainer.innerHTML = playersArray.join('');
  }

  // Set cards
  function setCards(cards) {
    let cardsContainer = document.querySelector('.cards');

    let cardsArray = [];

    // prevent invalid numbers from keyboard
    if (cards < 12) {
      cards = 12;
    }
    if (cards > 20) {
      cards = 20;
    }

    // create cards
    for (let i = 0; i < cards; i++) {
      let card = `<div data-shown-number='0' class="card">
    <img src="${images[i]}" alt="card" class="card-img">
      </div>`;

      // duplicate cards of each image
      cardsArray.push(card);
      cardsArray.push(card);
    }

    // shuffle all cards
    shuffleCards(cardsArray);

    cardsContainer.innerHTML = shuffleCards(cardsArray).join('');

    return shuffleCards(cardsArray);

    //shuffle cards
    function shuffleCards(array) {
      let allIndex = [];
      let randomNumbers = [];

      // create a new array with the numbers of index
      for (let i = 0; i < array.length; i++) {
        allIndex.push(i);
      }

      // shuffle all index on index array
      for (let i = 0; i < array.length; i++) {
        // generate a random number between 0 and index length
        const randomNum = random(allIndex.length);

        // pushes the aleatory index in the random array
        randomNumbers.push(allIndex[randomNum]);

        // update the allIndex array - remove the preview number
        allIndex = allIndex.filter((item) => item !== allIndex[randomNum]);
      }

      // generate a random integer number from 0 to max
      function random(max) {
        return Math.floor(Math.random() * max);
      }

      // return a new array with index changed.
      let shuffleArray = randomNumbers.map((item) => array[item]);

      return shuffleArray;
    }
  }

  // play function
  function play() {
    // select all cards and convert nodeList to array
    let cardArray = Array.from(document.querySelectorAll('.card'));

    // variable to compare cards
    let selectCards = [];

    // show only 2 cards for each player
    cardArray.forEach(function (card, index) {
      card.addEventListener('click', function () {
        // select image from card
        const img = card.querySelector('.card-img');
        // show card not shown
        if (!img.classList.contains('show-card')) {
          // change the number of times a card has been shown
          let shownNumber = parseInt(img.parentElement.dataset.shownNumber);

          shownNumber += 1;

          img.parentElement.dataset.shownNumber = shownNumber;

          // display only two cards
          if (selectCards.length < 2) {
            img.classList.add('show-card');
          }

          selectCards.push(index);
          //update cards shown 2 by 2 after 2 seconds
          if (selectCards.length === 2) {
            setTimeout(function () {
              update(selectCards);
            }, 2000);
          }
        }
      });
    });

    function update(compare) {
      // compare two cards
      let first = cardArray[compare[0]];
      let second = cardArray[compare[1]];

      // key to score
      let score = false;

      // checking if the images sources matches
      if (first.firstElementChild.src === second.firstElementChild.src) {
        score = true;
      } else {
        first.firstElementChild.classList.remove('show-card');
        second.firstElementChild.classList.remove('show-card');
      }

      // reset the selected cards
      selectCards = [];

      // update player and pass the result
      updatePlayer(score, first, second);
    }

    // update player
    function updatePlayer(score, first, second) {
      // select all players and convert nodeList to array
      let playerArray = Array.from(document.querySelectorAll('.player'));
      let playerId = null;

      playerArray.forEach(function (player) {
        // change score and get the id of the active player
        if (player.classList.contains('player-active')) {
          // score
          if (score) {
            let scoreNumber = parseInt(
              player.lastElementChild.firstElementChild.innerHTML
            );

            // calculates the score as a function of the number of turn of the each card
            scoreNumber += scoreValue(first, second);

            player.lastElementChild.firstElementChild.innerHTML = scoreNumber;

            // checking for the end of the game
            endOfGame();
          }

          // getting the id
          playerId = parseInt(player.id);
        }
      });

      // change player if not score and there is more than one player
      if (playerArray.length > 1 && !score) {
        // next id's player
        if (playerId === playerArray.length) {
          playerId = 1;
        } else {
          playerId += 1;
        }
        // change the active player
        playerArray.forEach(function (player) {
          // remove the active player
          if (player.classList.contains('player-active')) {
            player.classList.remove('player-active');
          }
          // activate the next player
          if (parseInt(player.id) === playerId) {
            player.classList.add('player-active');
          }
        });
      }
    }

    // calculate the scare value
    function scoreValue(first, second) {
      // select the number of turns of each card inside an array
      const valuesArray = [
        parseInt(first.dataset.shownNumber),
        parseInt(second.dataset.shownNumber),
      ];

      // calcuates the score with conditions
      let score = valuesArray.reduce(function (total, value) {
        if (value === 1) {
          total += 10;
        }
        if (value === 2) {
          total += 40;
        }
        if (value === 3) {
          total += 30;
        }
        if (value === 4) {
          total += 20;
        }
        if (value > 4) {
          total += 10;
        }

        return total;
      }, 0);

      // returns the score accumulated
      return score;
    }

    // end game function
    function endOfGame() {
      // select all cards images
      const cardsImg = Array.from(document.querySelectorAll('.card-img'));

      // if all cards are being shown the game is over
      const finishCondition = cardsImg.every(function (img) {
        return img.classList.contains('show-card');
      });

      if (finishCondition) {
        endModal();
      }
    }

    //end game
    function endModal() {
      // select end modal
      const modalEndGameContainer = document.querySelector(
        '.modal-end-game-container'
      );

      // display modal
      modalEndGameContainer.classList.add('show-end-game-modal');

      // select close modal
      const closeModalEndGameBtn = document.querySelector(
        '#close-modal-end-game'
      );
      // select new game button
      const startNewGameBtnAgain = document.querySelector(
        '#new-game-start-btn-again'
      );

      // close modal
      closeModalEndGameBtn.addEventListener('click', function () {
        modalEndGameContainer.classList.remove('show-end-game-modal');
      });

      // close end modal and open the new game modal
      startNewGameBtnAgain.addEventListener('click', function () {
        modalEndGameContainer.classList.remove('show-end-game-modal');

        modalNewGameContainer.classList.add('show-new-game-modal');
      });

      // select body end modal
      const ranking = document.querySelector('.ranking');

      // select all players
      const players = Array.from(document.querySelectorAll('.player'));

      //select score and id of each player
      let playersRanking = players
        .map(function (player) {
          let scoreNumber = parseInt(
            player.lastElementChild.firstElementChild.innerHTML
          );
          let playerId = player.id;

          // map method return an object with the score and a div with the description of the player
          return {
            score: scoreNumber,
            innerHTML: `<div class='player-rank'><h3>player ${playerId}</h3><p>score: <span>${scoreNumber}</span></p></div>`,
          };
        })
        // ordering (increase) the array by score
        .sort(function (a, b) {
          return a.score - b.score;
        })
        // decrease order
        .reverse()
        // return description of each player in decrease order
        .map(function (item) {
          return item.innerHTML;
        });

      playersRanking.join('');
      ranking.innerHTML = playersRanking;
      // end of end game
    }
  }
});

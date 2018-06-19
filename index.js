// create the board (makes for a cleaner, easier-to-follow game)
{
  const guess = document.querySelector('.guess');
  let guessHTML = guess.outerHTML;
  let outerHTML = '';
  for (let i = 0; i < +document.querySelector('#count').dataset.count; ++i) outerHTML += guessHTML;
  guess.outerHTML = outerHTML;
}

// aesthetic adjustment
document.querySelector('button').style.width = `${document.querySelector('table').offsetWidth}px`;


// collect all possible colors
const colors = new Array(...document.querySelectorAll('#colors option'))
  .map(({value}) => value);

// helper to get counts of each color, for use in judging
const count = (guess) => guess.reduce((memo, color) => {
  memo[color] = memo[color] || 0;
  memo[color] += 1;
  return memo;
}, {});


// set the solution, using `colors`
new Array(...document.querySelectorAll('#solution th'))
  .map((th) => th.dataset.value = colors[Math.floor(Math.random() * colors.length)]);
const solution = new Array(...document.querySelectorAll('#solution th'))
  .map((th) => th.dataset.value);
// cache the color counts for faster judging
solution.count = count(solution);

// handler for user guesses
function guess() {
  const countEl = document.querySelector('#count');
  let tries = +countEl.dataset.count;

  const guess = new Array(...document.querySelectorAll('#guess input'))
    .map(({value}) => value);
  guess.count = count(guess);

  const [numCorrectColor, numCorrectPlace] = judge(guess);

  const tr = document.querySelectorAll('tr')[tries];
  record(guess, numCorrectColor, numCorrectPlace, tr);

  tries -= 1;
  countEl.dataset.count = countEl.innerText = tries;

  if (numCorrectPlace === guess.length) {
    // victory!
    reveal(true);
  } else if (tries === 0) {
    // loss :(
    reveal(false);
  }
}

function judge(guess) {
  let numCorrectColor = Object.keys(guess.count).reduce((n, color) => {
    const correct = Math.min(solution.count[color] || 0, guess.count[color]);
    return n + correct;
  }, 0);

  let numCorrectPlace = 0;
  for (let i = 0; i < guess.length; ++i) {
    if (guess[i] === solution[i]) numCorrectPlace += 1;
  }

  numCorrectColor -= numCorrectPlace;

  return [numCorrectColor, numCorrectPlace];
}

function record(guess, numCorrectColor, numCorrectPlace, tr) {
  guess
    .forEach((color, i) => tr.querySelectorAll('td')[i].querySelector('.color').style.backgroundColor = color);

  const response = tr.querySelector('.response');
  for (let i = 0; i < numCorrectColor; ++i) {
    const el = document.createElement('div');
    el.style.backgroundColor = 'white';
    response.appendChild(el);
  }
  for (let i = 0; i < numCorrectPlace; ++i) {
    const el = document.createElement('div');
    el.style.backgroundColor = 'black';
    response.appendChild(el);
  }
}

function reveal(victory) {
  document.querySelector('[type="submit"]').style.display = 'none';

  new Array(...document.querySelectorAll('#solution th'))
    .map((th) => th.querySelector('.color').style.backgroundColor = th.dataset.value);

  const status = document.querySelector('#status');
  if (victory) {
    status.innerText = 'You\'ve won! Refresh to play again';
  } else {
    status.innerText = 'You\'ve lost. Refresh to play again';
  }
}

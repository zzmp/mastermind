// aesthetic adjustment
document.querySelector('button').style.width = `${document.querySelector('table').offsetWidth}px`;

// collect all possible colors
const colors = new Array(...document.querySelectorAll('#colors option')).map(({value}) => value);

// helper to get counts of each color, for use in judging
const count = (guess) => guess.reduce((memo, color) => {
  memo[color] = memo[color] || 0;
  memo[color] += 1;
  return memo;
}, {});


// set the solution, using `colors`
new Array(...document.querySelectorAll('#solution th')).map((th) => {
  th.dataset.value = colors[Math.floor(Math.random() * colors.length)];
});
const solution = new Array(...document.querySelectorAll('#solution th')).map((th) => th.dataset.value);
// cache the color counts for faster judging
solution.count = count(solution);

// handler for user guesses
function guess() {
  // get the guess
  const guess = new Array(...document.querySelectorAll('#guess input')).map(({value}) => value);

  const [numCorrectColor, numCorrectPlace] = judge(guess);
  record(guess, numCorrectColor, numCorrectPlace);

  const count = document.querySelector('#count');
  let tries = +count.dataset.count;
  tries -= 1;
  count.dataset.count = count.innerText = tries;

  if (numCorrectPlace === guess.length) {
    // victory!
    reveal(true);
  } else if (tries === 0) {
    // loss :(
    reveal(false);
  }
}

function judge(guess) {
  guess.count = count(guess);
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

function record(guess, numCorrectColor, numCorrectPlace) {
  const tr = document.createElement('tr');
  guess.forEach((color) => {
    const td = document.createElement('td');
    td.style.backgroundColor = color;
    tr.appendChild(td);
  });

  const response = document.createElement('td');
  response.classList.add('response');
  console.log(numCorrectColor, numCorrectPlace);
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
  tr.appendChild(response);

  const guessEl = document.querySelector('#guess');
  guessEl.parentNode.insertBefore(tr, guessEl);
}

function reveal(victory) {
  document.querySelector('[type="submit"]').style.display = 'none';

  new Array(...document.querySelectorAll('#solution th')).map((th) => {
    th.style.backgroundColor = th.dataset.value;
  });

  const status = document.querySelector('#status');
  if (victory) {
    status.innerText = 'You\'ve won! Refresh to play again';
  } else {
    status.innerText = 'You\'ve lost. Refresh to play again';
  }
}

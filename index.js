//Variables
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const {width} = canvas;
const {height} = canvas;

//Draw
function draw() {
  context.clearRect(0, 0, width, height);
  drawBall();
  moveBall();

  drawPaddle();
  movePaddle();

  drawBricks();
  collisionDetection();

  drawScore();

  drawLives();

  requestAnimationFrame(draw);
}

//Ball
let xBall = width / 2;
let yBall = height / 2;

let dxBall = 4;
let dyBall = -4;

const radiusBall = 10;

function drawBall() {
  context.beginPath();
  context.arc(xBall, yBall, radiusBall, 0, Math.PI * 2, false);
  context.fillStyle = '#00D06C';
  context.fill();
  context.closePath();
}

function moveBall() {
  if (yBall + dyBall < radiusBall) {
    dyBall = -dyBall;
  } else if (yBall + dyBall > height - radiusBall) {
    if (xBall > xPaddle && xBall < xPaddle + widthPaddle) {
      dyBall = -dyBall;
    } else {
      lives--;
      if (!lives) {
        //insert Highscore if under Top10
        alert('Game Over');
        score = 0;
        lives = 3;
        document.location.reload();
      } else {
        setTimeout(() => {}, 2000);
        xBall = width / 2;
        yBall = height / 2;
        dxBall = 4;
        dyBall = -4;
        xPaddle = (width - widthPaddle) / 2;
      }
    }
  }

  if (xBall + dxBall < radiusBall || xBall + dxBall > width - radiusBall) {
    dxBall = -dxBall;
  }

  xBall += dxBall;
  yBall += dyBall;
}

//Paddle
const heightPaddle = 10;
const widthPaddle = 80;
let xPaddle = (width - widthPaddle) / 2;
const yPaddle = height - heightPaddle;

let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function drawPaddle() {
  context.beginPath();
  context.rect(xPaddle, yPaddle, widthPaddle, heightPaddle);
  context.fillStyle = '#4ABDAC';
  context.fill();
  context.closePath();
}

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  }
}

function movePaddle() {
  if (rightPressed && xPaddle < width - widthPaddle) {
    xPaddle += 7;
  } else if (leftPressed && xPaddle > 0) {
    xPaddle -= 7;
  }
}

//Bricks
const rowCountBrick = 3;
const columnCountBrick = 5;
const widthBrick = 110;
const heightBrick = 20;
const paddingBrick = 10;
const offSetTopBrick = 30;
const offSetLeftBrick = 30;

const bricks = [];
for (let i = 0; i < columnCountBrick; i++) {
  bricks[i] = [];
  for (let j = 0; j < rowCountBrick; j++) {
    bricks[i][j] = { x: 0, y: 0, status: 1 };
  }
}

function drawBricks() {
  for (let i = 0; i < columnCountBrick; i++) {
    for (let j = 0; j < rowCountBrick; j++) {
      if (bricks[i][j].status === 1) {
        const xBrick = i * (widthBrick + paddingBrick) + offSetLeftBrick;
        const yBrick = j * (heightBrick + paddingBrick) + offSetTopBrick;

        bricks[i][j].x = xBrick;
        bricks[i][j].y = yBrick;

        context.beginPath();
        context.rect(xBrick, yBrick, widthBrick, heightBrick);
        context.fillStyle = '4ABDAC';
        context.fill();
        context.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (let i = 0; i < columnCountBrick; i++) {
    for (let j = 0; j < rowCountBrick; j++) {
        const currentBrick = bricks[i][j];

      if (currentBrick.status === 1) {
        if (
          xBall > currentBrick.x &&
          xBall < currentBrick.x + widthBrick &&
          yBall > currentBrick.y &&
          yBall < currentBrick.y + heightBrick
        ) {
          dyBall = -dyBall;
          currentBrick.status = 0;
          score++;

          if (score === rowCountBrick * columnCountBrick) {
            alert('You win');
            document.location.reload();
          }
        }
      }
    }
  }
}

//Score
let score = 0;

const scoreField = document.getElementById('score');

function drawScore() {
  scoreField.innerHTML = `Score ${score}`;
}

//Lives
let lives = 3;

const livesField = document.getElementById('lives');

function drawLives() {
  livesField.innerHTML = `Lives ${lives}`;
}

//Start
const startButton = document.getElementById('start');
startButton.addEventListener('click', startGame, false);

function startGame(e) {
  startButton.style.display = 'none';
  canvas.style.display = 'block';
  setInterval(setTime, 1000);
  progress(startTime, startTime, $('#progress'));
  draw();
}

//Time
const timeField = document.getElementById('time');
let startTime = 60;

function setTime() {
  startTime--;
  if (!startTime) {
    alert('Game over');
    document.location.reload();
  }
  timeField.innerHTML = `0:${paddingTime(startTime)}`;
}

function paddingTime(number) {
  return (number < 10 ? '0' : '') + number;
}

//Progessbar
function progress(timeleft, timetotal, $element) {
    const progressBarWidth = timeleft * $element.width() / timetotal;
  $element
    .find('div')
    .animate(
      { width: progressBarWidth },
      timeleft === timetotal ? 0 : 1000,
      'linear'
    );
  if (timeleft > 0) {
    setTimeout(() => { 
      progress(timeleft - 1, timetotal, $element);
    }, 1000);
  }
}

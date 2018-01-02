var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 10;

var player1Score = 0;
var player2Score = 0;

const _win_score = 5;
var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const _thickness = 10;
const _paddle_height = 100;

window.onload = function (params) {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  var framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener('mousemove', function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - (_paddle_height / 2);
  });

  canvas.addEventListener('mousedown', function (evt) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  })

}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
  }
}

function ballReset() {
  if (player1Score >= _win_score || player2Score >= _win_score) {
    showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return { x: mouseX, y: mouseY };
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + (_paddle_height / 2);
  if (paddle2YCenter < ballY - 35) { // prevent the right paddle shake
    paddle2Y += 10;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 10;
  }
}

function showWinScreen() {
  canvasContext.fillStyle = 'white';
  if (player1Score >= _win_score) {
    canvasContext.fillText('Left Player Won!', 350, 200);
  } else {
    canvasContext.fillText('Right Player Won!', 350, 200);
  }
  canvasContext.fillText('Click To Continue', 350, 500);
}

// transform the coordinate of the ball
function moveEverything() {
  if (showingWinScreen) {
    showWinScreen();
    return;
  }
  computerMovement();
  // increase the X coordinate
  ballX += ballSpeedX;
  // increase the Y coordinate
  ballY += ballSpeedY;
  // detects the X coordinate of the ball, and when it reaches the boundary, gives it an inverse value to bounce the ball
  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + _paddle_height) {
      ballSpeedX = -ballSpeedX;
      var delta1Y = ballY - (paddle1Y + _paddle_height / 2);
      ballSpeedY = delta1Y * 0.35;
    } else {
      player2Score++;
      ballReset();
    }

  }

  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + _paddle_height) {
      ballSpeedX = -ballSpeedX;
      var delta2Y = ballY - (paddle2Y + _paddle_height / 2);
      ballSpeedY = delta2Y * 0.35;
    } else {
      player1Score++;
      ballReset();
    }
  }
  // detects the Y coordinate of the ball, and when it reaches the boundary, gives it an inverse value to bounce the ball
  if (ballY < 0 || ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function drawEverything() {

  // next line blank out the screen with black
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  if (showingWinScreen) {
    showWinScreen();
    return;
  }
  drawNet();
  // this is the left player paddle
  colorRect(0, paddle1Y, _thickness, _paddle_height, 'white');
  // this is the right player paddle
  colorRect(canvas.width - _thickness, paddle2Y, _thickness, _paddle_height, 'white');
  // next line create the ball
  colorCircle(ballX, ballY, 10, 'white');
  // add a score text on top
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
}


function colorRect(leftX, topY, width, height, drawColoar) {
  canvasContext.fillStyle = drawColoar;
  canvasContext.fillRect(leftX, topY, width, height);
}
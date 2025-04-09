
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
const canvasSize = 400;

let snake, direction, food, score, game, isGameOver = false;

function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  isGameOver = false;
  document.getElementById("score").textContent = "Score: " + score;
  document.getElementById("restartBtn").disabled = false;

  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };

  if (game) clearInterval(game);
  game = setInterval(draw, 150);
}

function restartGame() {
  initGame();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function setDirection(dir) {
  if (isGameOver) return;
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  else if (dir === "UP" && direction !== "DOWN") direction = "UP";
  else if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
  else if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
}

function drawRoundedRect(x, y, size, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + size, y, x + size, y + size, radius);
  ctx.arcTo(x + size, y + size, x, y + size, radius);
  ctx.arcTo(x, y + size, x, y, radius);
  ctx.arcTo(x, y, x + size, y, radius);
  ctx.fill();
}

function draw() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    drawRoundedRect(
      snake[i].x,
      snake[i].y,
      box,
      6,
      i === 0 ? "#00ff88" : "#00cc66"
    );
  }

  // Draw food
  ctx.shadowColor = "#f00";
  ctx.shadowBlur = 10;
  drawRoundedRect(food.x, food.y, box, 5, "#ff0033");
  ctx.shadowBlur = 0;

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;

  // Game over
  if (
    headX < 0 || headY < 0 ||
    headX >= canvasSize || headY >= canvasSize ||
    snake.some((segment, idx) => idx !== 0 && segment.x === headX && segment.y === headY)
  ) {
    clearInterval(game);
    isGameOver = true;
    document.getElementById("restartBtn").disabled = false;
    alert("💀 Game Over! Your score: " + score);
    return;
  }

  let newHead = { x: headX, y: headY };

  // Eat food
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("score").textContent = "Score: " + score;
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

initGame();

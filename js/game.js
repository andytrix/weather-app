// Set the background image from localStorage
const bg = localStorage.getItem("latestBgImage") || "default.jpg";
document.body.style.backgroundImage = `url('img/${bg}')`;
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";
document.body.style.backgroundRepeat = "no-repeat";

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player setup
const playerImage = new Image();
playerImage.src = "img/player.png";

const player = {
  x: 130,
  y: 360,
  width: 40,
  height: 40,
  speed: 50
};

// Raindrops and game state
const raindrops = [];
let score = 0;
let gameOver = false;

// Draw the player on the canvas
function drawPlayer() {
  if (playerImage.complete) {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
  } else {
    playerImage.onload = () => {
      ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    };
  }
}

// Draw raindrops on the canvas
function drawRaindrops() {
  ctx.fillStyle = "#007aff";
  raindrops.forEach(drop => {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.quadraticCurveTo(
      drop.x - drop.r,
      drop.y + drop.r * 2,
      drop.x,
      drop.y + drop.r * 3
    );
    ctx.quadraticCurveTo(
      drop.x + drop.r,
      drop.y + drop.r * 2,
      drop.x,
      drop.y
    );
    ctx.fill();
  });
}

// Update raindrops' positions and check for collisions
function updateRaindrops() {
  for (let i = raindrops.length - 1; i >= 0; i--) {
    raindrops[i].y += 3;

    // Check for collision with the player
    if (
      raindrops[i].y + raindrops[i].r * 3 > player.y &&
      raindrops[i].x > player.x &&
      raindrops[i].x < player.x + player.width
    ) {
      gameOver = true;
    }

    // Remove raindrops that fall off the canvas and update the score
    if (raindrops[i].y > canvas.height) {
      raindrops.splice(i, 1);
      score++;
      document.getElementById("score").textContent = score;
    }
  }
}

// Spawn a new raindrop at a random position
function spawnRaindrop() {
  const radius = 5;
  const x = Math.random() * (canvas.width - radius * 2) + radius;
  raindrops.push({ x, y: 0, r: radius });
}

// Show the restart button on the canvas when the game is over
function showRestartButtonInCanvas() {
  const buttonWidth = 120;
  const buttonHeight = 30;
  const buttonX = (canvas.width - buttonWidth) / 2;
  const buttonY = 250;

  canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (
      gameOver &&
      mouseX >= buttonX &&
      mouseX <= buttonX + buttonWidth &&
      mouseY >= buttonY &&
      mouseY <= buttonY + buttonHeight
    ) {
      location.reload();
    }
  });

  ctx.fillStyle = "#222";
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
  ctx.fillStyle = "#fff";
  ctx.font = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Restart", canvas.width / 2, buttonY + 20);
}

// Show instructions above the canvas
function showInstructions() {
  const instruction = document.createElement("p");
  const box = document.querySelector(".info-box");
  box.insertBefore(instruction, box.querySelector("canvas"));
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawRaindrops();
  updateRaindrops();

  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, 200);
    ctx.fillText("Score: " + score, canvas.width / 2, 230);
    showRestartButtonInCanvas();
    return;
  }

  requestAnimationFrame(gameLoop);
}

// Spawn raindrops at regular intervals
setInterval(spawnRaindrop, 800);

// Start the game loop
gameLoop();
showInstructions();

// Handle keyboard controls for player movement
document.addEventListener("keydown", e => {
  if ((e.key === "ArrowLeft" || e.key === "a" || e.key === "A") && player.x > 0) {
    player.x -= player.speed;
  } else if ((e.key === "ArrowRight" || e.key === "d" || e.key === "D") && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
});

// Handle touch controls for player movement
canvas.addEventListener("touchstart", e => {
  if (gameOver) return;

  const touchX = e.touches[0].clientX;
  const canvasRect = canvas.getBoundingClientRect();
  const canvasMid = canvasRect.left + canvasRect.width / 2;

  if (touchX < canvasMid && player.x > 0) {
    player.x -= player.speed;
  } else if (touchX >= canvasMid && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
});

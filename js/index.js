const playerCraft = document.querySelector('.player');
const playArea = document.querySelector('#area');
const enemyImage= ['./img/mine-1.gif', './img/mine-2.gif'];
const instructionText = document.querySelector('.instructions');
const startButton = document.querySelector('.start-button');
let enemyInterval;
let score = 0;

let gameBcK = new Image();
gameBcK.src = 'img/bground.jpg';

let sfxShoot=document.getElementById("sfxShoot");
let sfxExplosion=document.getElementById("sfxExplosion");
let Key = {
  ArrowUp: 38,
  ArrowDown: 40,
  SpaceBar: 32,
  W: 87,
  S: 83,
}
let GameDimensions = {
  width: 600,
  height: 600,
  playerMove: 30,
  playerHeight: 60,
  enemyHeight: 40,
  missleHeight: 20,
  missleWidth: 30
}

function playerMovement(event) {
    if(event.keyCode === Key.ArrowUp || event.keyCode === Key.W) {
      event.preventDefault();
      moveUp();
    } else if(event.keyCode === Key.ArrowDown || event.keyCode === Key.S) {
        event.preventDefault();
        moveDown();
    } else if(event.keyCode === Key.SpaceBar) {
        event.preventDefault();
        fireMissle();
    }
  }


  function moveUp() {
    let topPosition = parseInt(getComputedStyle(playerCraft).getPropertyValue('top'));
    if(topPosition < (GameDimensions.playerHeight/2)) {
      return false;
    } else {
        let position = parseInt(topPosition);
        position -= GameDimensions.playerMove;
        playerCraft.style.top = `${position}px`;
    }
  }
  
  function moveDown() {
    let topPosition = parseInt(getComputedStyle(playerCraft).getPropertyValue('top'));
    if(topPosition >= (GameDimensions.height-GameDimensions.playerHeight-(GameDimensions.playerHeight/2))) {
      return
    } else {
        let position = topPosition;
        position += GameDimensions.playerMove;
        playerCraft.style.top = `${position}px`;
    }
  }

  //Fire Missile
  function fireMissle() {
    sfxShoot.play();
    let missle = createMissleElement();
    playArea.appendChild(missle);
    moveMissle(missle);
  }

  function createMissleElement() {
    let xPosition = parseInt(window.getComputedStyle(playerCraft).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(playerCraft).getPropertyValue('top'));
    let newMissle = document.createElement('img');
    newMissle.src = './img/missile.gif';
    newMissle.classList.add('missle');
    newMissle.style.left = `${xPosition}px`;
    newMissle.style.top = `${yPosition - 18}px`;
    return newMissle;
  }

  function moveMissle(missle) {
    let missleInterval = setInterval(() => {
      let xPosition = parseInt(missle.style.left);
      let enemies = document.querySelectorAll('.enemy');

      enemies.forEach((enemy) => {
        if(checkMissleCollision(missle, enemy)) {
          sfxExplosion.play();
          score++;
          scoreboardRefresh();
          enemy.src = './img/explosion.gif';
          enemy.classList.remove('enemy');
          enemy.classList.add('dead-enemy');
          missle.remove();
      }
      });

      if (xPosition >= 420) {
        clearInterval(missleInterval);
        missle.remove();
      } else {
        missle.style.left = `${xPosition + 8}px`;
      }
    }, 15);

}

//Random enemy creating
function createEnemies() {
    let newEnemy = document.createElement('img');
    let enemyRan = enemyImage[Math.floor(Math.random() * enemyImage.length)];
    newEnemy.src = enemyRan;
    newEnemy.classList.add('enemy');
    newEnemy.classList.add('enemy-transition');
    newEnemy.style.left = '420px';
    newEnemy.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newEnemy);
    moveEnemy(newEnemy);
  }


//Enemy Movement.

  function moveEnemy(enemy){
    let moveEnemyInterval = setInterval(() => {
      let xPosition = parseInt(window.getComputedStyle(enemy).getPropertyValue('left'));
  
      if (xPosition <= 50) {
        if(Array.from(enemy.classList).includes('dead-enemy')) {
          enemy.remove();
        } else {
            gameOver();
        } 
      } else {
           //console.log(score);
          if(score<5) {
            enemy.style.left = `${xPosition - 4}px`;
          } else if(score<10) {
            enemy.style.left = `${xPosition - 5}px`;
          }else if(score<20) {
            enemy.style.left = `${xPosition - 6}px`;
          }else {
            enemy.style.left = `${xPosition - 7}px`;
          }
      }
    }, 30);
  }

  function checkMissleCollision(missle, enemy) {
    let missleTop = parseInt(missle.style.top);
    let missleLeft = parseInt(missle.style.left);
    let missleCenter = missleTop + (GameDimensions.missleHeight/2);
    let missleBottom = missleTop + GameDimensions.missleHeight;
    
    let enemyTop = parseInt(enemy.style.top);
    let enemyLeft = parseInt(enemy.style.left);
    let enemyBottom = enemyTop + GameDimensions.enemyHeight;
    

    if (missleLeft + GameDimensions.missleWidth >= enemyLeft) {
      if (missleCenter <= enemyBottom && missleCenter >= enemyTop-20) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

//Scoreboard
let scoreboardRefresh = () => {
    document.getElementById("score").innerHTML = "Score: " + score;
  }



//Start game and button work
startButton.addEventListener('click', (event) => {
    playGame();
  })

  function playGame() {
    scoreboardRefresh();
    startButton.style.display = 'none';
    instructionText.style.display = 'none';
    window.addEventListener('keydown', playerMovement);
    enemyInterval = setInterval(() => {
      createEnemies();
    }, 2000);
  }

  

//Gameover

  function gameOver() {
    score = 0;
    window.removeEventListener('keydown', playerMovement);
    clearInterval(enemyInterval);
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach((enemy) => enemy.remove());
    let missles = document.querySelectorAll('.missle');
    missles.forEach((missle) => missle.remove());
    setTimeout(() => {
      document.getElementById("restart-button").innerHTML = "RESTART";
      document.getElementById("game-over").innerHTML = "YOU FAIL PLEASE TRY AGAIN!";
      playerCraft.style.top = "250px";
      startButton.style.display = "block";
      instructionText.style.display = "block";
    });
  }

  
 


  
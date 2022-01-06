const playerCraft = document.querySelector('.player');
const playArea = document.querySelector('#area');
const enemyImage= ['./img/mine-1.gif', './img/mine-2.gif'];
const instructionText = document.querySelector('.instructions');
const startButton = document.querySelector('.start-button');
let enemyInterval;
let score = 0;

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
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
    let topPosition = getComputedStyle(playerCraft).getPropertyValue('top');
    if(topPosition === "0px") {
      return
    } else {
        let position = parseInt(topPosition);
        position -= 50;
        playerCraft.style.top = `${position}px`;
    }
  }
  
  function moveDown() {
    let topPosition = getComputedStyle(playerCraft).getPropertyValue('top');
    if(topPosition === "500px") {
      return
    } else {
        let position = parseInt(topPosition);
        position += 50;
        playerCraft.style.top = `${position}px`;
    }
  }

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
    newMissle.src = './img/missle.gif';
    newMissle.classList.add('missle');
    newMissle.style.left = `${xPosition}px`;
    newMissle.style.top = `${yPosition - 10}px`;
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
          enemy.src = '/img/explosion.gif';
          enemy.classList.remove('enemy');
          enemy.classList.add('dead-enemy');
      }
 
    })

    if (xPosition === 340) {
        missle.remove();
      } else {
          missle.style.left = `${xPosition + 8}px`;
      }
    }, 15);

}

function createEnemies() {
    let newEnemy = document.createElement('img');
    let enemyRan = enemyImage[Math.floor(Math.random() * enemyImage.length)];
    newEnemy.src = enemyRan;
    newEnemy.classList.add('enemy');
    newEnemy.classList.add('enemy-transition');
    newEnemy.style.left = '400px';
    newEnemy.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newEnemy);
    moveEnemy(newEnemy);
  }



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
          enemy.style.left = `${xPosition - 4}px`;
      }
    }, 30);
  }

  function checkMissleCollision(missle, enemy) {
    let missleTop = parseInt(missle.style.top);
    let missleLeft = parseInt(missle.style.left);
    let missleCenter = missleTop + 15;
    let missleBottom = missleTop - 20;
    
    let enemyTop = parseInt(enemy.style.top);
    let enemyLeft = parseInt(enemy.style.left);
    let enemyBottom = enemyTop - 30;
    
    if (missleLeft != 340 && missleLeft + 40 >= enemyLeft) {
      if (missleTop <= enemyTop && missleTop >= enemyBottom || missleCenter <= enemyTop && missleCenter >= enemyBottom || missleBottom <= enemyTop && missleTop >= enemyBottom) {
        return true;
      } else {
          return false;
      }
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

  

//OVER

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
      document.getElementById("game-over").innerHTML = "You fail please try Again";
      playerCraft.style.top = "250px";
      startButton.style.display = "block";
      instructionText.style.display = "block";
    });
  }

  
 


  
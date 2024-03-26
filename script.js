const startButton = document.getElementById("start-button")
const restartButton = document.getElementById("restart-button")
const instructions = document.getElementById("instructions-text")
const finals = document.getElementById("over")
const mainPlayArea = document.getElementById("main-play-area")
const shooter = document.getElementById("player-controlled-shooter")
const monsterImgs = ['images/monster-1.png', 'images/monster-2.png', 'images/monster-3.png', 'images/monster-4.png', 'images/monster-5.png', 'images/monster-6.png', 'images/monster-7.png', 'images/monster-8.png', 'images/monster-9.png']
const monsterPosition = ['0px', '30px', '60px', '90px', '120px']
const scoreCounter = document.querySelector('#score span')
const score = document.querySelector('#score')


startButton.addEventListener("click", (event) => {
    playGame()
})

restartButton.addEventListener("click", (event) => {
    restartButton.style.display = 'none'
    finals.style.display = 'none'
    playGame()
})

function letShipFly(event) {
    if (event.code === "ArrowUp") {
        event.preventDefault()
        moveUp()
    } else if (event.code === "ArrowDown") {
        event.preventDefault()
        moveDown()
    } 
}

document.addEventListener('keyup', function(event) {
    if(event.key === " ") {
        fireLaser() 
    }
});         

function moveUp() {
    let topPosition = window.getComputedStyle(shooter).getPropertyValue('top')
    if (shooter.style.top === "0px") {
        return
    } else {
        let position = parseInt(topPosition)
        position -= 30
        shooter.style.top = `${position}px`
    }
}

function moveDown() {
    let topPosition = window.getComputedStyle(shooter).getPropertyValue('top')
    if (shooter.style.top === "120px") {
        return
    } else {
        let position = parseInt(topPosition)
        position += 30
        shooter.style.top = `${position}px`
        
    }
}

function fireLaser() {
    let laser = createLaserElement()
    mainPlayArea.appendChild(laser)
    moveLaser(laser)
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(shooter).getPropertyValue('left'))
    let yPosition = parseInt(window.getComputedStyle(shooter).getPropertyValue('top'))
    let newLaser = document.createElement('img')
    newLaser.src = 'images/laser.png'
    newLaser.classList.add('laser')
    newLaser.style.left = `${xPosition + 30}px`
    newLaser.style.top = `${yPosition + 5}px`
    return newLaser
}

function moveLaser(laser) {
    setInterval(() => {
        let xPosition = parseInt(laser.style.left)
        let monsters = document.querySelectorAll(".monster")
        let lasers = document.querySelectorAll(".laser")
        monsters.forEach(monster => {
            lasers.forEach(laser => {
            if (checkLaserCollision(laser, monster)) {
                monster.classList.remove("monster")
                monster.classList.add("dead-monster")
                laser.classList.remove("laser")
                laser.classList.add("dead-laser")
                scoreCounter.innerText = parseInt(scoreCounter.innerText) + 50
                    let v = scoreCounter.innerText
                    if(v == 250 || v == 500 || v == 750 ||v == 1000 || 
                    v == 2000 || v == 3000 || v == 4000 ||v == 5000 ||
                    v == 6500 || v == 8000 || v == 9500 ||v == 11000 || v == 12500) {
                    a = a - 2.5 
                    }
            }
        })
    })
        if (xPosition < 590) {
            laser.style.left = `${xPosition + 4}px`
        } else if (xPosition === 590) {
            laser.remove() 
        }
    }, 7.5)
}

function createMonster() {
    let newMonster = document.createElement('img')
    let monsterSpriteImg = monsterImgs[Math.floor(Math.random() * monsterImgs.length)]
    newMonster.src = monsterSpriteImg
    newMonster.classList.add('monster')
    newMonster.style.left = '575px'
    newMonster.style.top = monsterPosition[Math.floor(Math.random() * monsterPosition.length)]
    mainPlayArea.appendChild(newMonster)
    moveMonster(newMonster)
}

let a = 35
function moveMonster(monster) {
    setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(monster).getPropertyValue('left'))
        if (xPosition <= 12) {
            if (Array.from(monster.classList).includes("dead-monster")) {
                monster.remove()
            } else {
                gameOver()
            }
        } else {
            monster.style.left = `${xPosition - 4}px`
        }
    }, a)
}

function checkLaserCollision(laser, monster) {
    let laserLeft = parseInt(laser.style.left)
    let laserTop = parseInt(laser.style.top)
    let monsterTop = parseInt(monster.style.top)
    let monsterLeft = parseInt(monster.style.left)
    if (laserLeft != 590 && laserLeft >= monsterLeft) {
        if ((laserTop <= monsterTop + 30 && laserTop >= monsterTop)) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

function gameOver() {
    window.removeEventListener("keydown", letShipFly)
    clearInterval(monsterdrop)
    let monsters = document.querySelectorAll(".monster")
    monsters.forEach(monster => monster.remove())
    let lasers = document.querySelectorAll(".laser")
    lasers.forEach(laser => laser.remove())
    setTimeout(() => {
        a = 35
        finals.style.display = "block"
        finals.innerHTML = (`Game Over! Os aliens invadiram o planeta! <br/><br/> Score: ${scoreCounter.innerText}`)
        shooter.style.top = "60px"
        restartButton.style.display = "block"
        scoreCounter.innerText = 0
    }, 1000)
}

function playGame() {
    scoreCounter.innerText = 0
    startButton.style.display = 'none'
    instructions.style.display = 'none'
    score.style.display = 'block'
    window.addEventListener("keydown", letShipFly)
    monsterdrop = setInterval(() => { createMonster()
        if (scoreCounter.innerText > 1000 && scoreCounter.innerText % 4) {
            createMonster(), 5500}
            if (scoreCounter.innerText > 3000 && scoreCounter.innerText % 3) {
                createMonster(), 3500}
        }, 1200)
}


/*  ********** Online / Offline Detection **********  */

// Request a small image at an interval to determine status
// ** Get a 1x1 pixel image here: http://www.1x1px.me/
// ** Use this code with an HTML element with id="status"

const checkOnlineStatus = async () => {
    try {
      const online = await fetch("images/controls.png");
      return online.status >= 200 && online.status < 300; // either true or false
    } catch (err) {
      return false; // definitely offline
    }
  };
  
  setInterval(async () => {
    const result = await checkOnlineStatus();
    const statusDisplay = document.getElementById("status");
    statusDisplay.textContent = result ? "Status da rede: Online" : "Status da rede: Offline";
  }, 3000); // probably too often, try 30000 for every 30 seconds
  
  // forgot to include async load event listener in the video! 
  window.addEventListener("load", async (event) => {
    const statusDisplay = document.getElementById("status");
    statusDisplay.textContent = (await checkOnlineStatus())
      ? "Status da rede: Online"
      : "Status da rede: Offline";
  });

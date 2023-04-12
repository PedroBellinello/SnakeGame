const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const sound = new Audio('./audio/Snake Game Sound.mp3');
let gameoverSound = document.getElementById("gameover-sound");


let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;


//get the high score from local storage 
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;


//change food position based in grid template
const changeFoodPosition = () => {
    //passing  random 0 - 30 value as food position
    foodX = Math.floor(Math.random() * 50) + 1;
    foodY = Math.floor(Math.random() * 50) + 1;
}


const handleGameOver = () => {
    //clear the timer and reloading the page on game over
    clearInterval(setIntervalId);
    alert("Game Over! Press ok to replay....");
    location.reload();
}

const changeDirection = (e) => {
    //change velocity and value of the snake based on the key press
    switch (e.key) {
        case "ArrowUp": case "w":
            if (velocityY != 1) {
                velocityX = 0;
                velocityY = -1;
            }
        break;
        case "ArrowDown": case "s":
            if (velocityY != -1) {
                velocityX = 0;
                velocityY = 1;
            }
        break;
        case "ArrowLeft": case "a":
            if (velocityX != 1) {
                velocityX = -1;
                velocityY = 0;
            }
        break;
        case "ArrowRight": case "d":
            if (velocityX != -1) {
                velocityX = 1;
                velocityY = 0;
            }
        break;
        default:
    break;
 }
}



controls.forEach(key => {
    //call changedirection on each click and passing the key dataset value as an object
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
    
})

const initGame = () => {
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"> </div>`;

    //check if snake hit the food
    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        //pushing food position to snake body array
        snakeBody.push([foodX, foodY]);
        // add 1 to score after the snake hit the food
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);

        //adding the score in the html element 
        scoreElement.innerText = `Score: ${score}`;

        highScoreElement.innerText = `High Score ${highScore}`;

        //play sound when the snake hits the food
        sound.currentTime = 0.8; //set the current time of the audio to 0.8
        sound.play(); //play the sound
        setTimeout(() => {
            sound.pause(); //pause the sound after 1 second
        }, 1000);
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        //shift forward values of elements in the snake body one by one
        snakeBody[i] = snakeBody[i - 1];
    }

    //set first element of snake body to current snake position
    snakeBody[0] = [snakeX, snakeY];

    //updating the snake's head position based in the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    
    //teleport snake to the opposite edge after the snake hit the wall
    switch(true) {
        case (snakeX <= 0):
            snakeX = 50;
            break;
        case (snakeX > 50):
            snakeX = 1;
            break;
        case (snakeY <= 0):
            snakeY = 50;
            break;
        case (snakeY > 50):
            snakeY = 1;
            break;
        default:
            gameOver = false;
            break;
    }



    for (let i = 0; i < snakeBody.length; i++) {
         //add a div for each part of snake body
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    
         // check if the snake head hit the body, if hit's set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
            // play game over sound
            gameoverSound.play();
        }
    }

    playBoard.innerHTML =  htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keydown", changeDirection);
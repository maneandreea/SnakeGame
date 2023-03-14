//select everything
const board = document.getElementById('gameBoard');
const ctx = board.getContext('2d'); //method
// drawing on the canvas requires drawing context = methods/properties
const scoreDisplay = document.querySelector('.score');
const startButton = document.getElementById('startButton');
const animatedSnake = document.getElementById('snakeAnimation');
const gameOverScreen = document.querySelector('.gameOverScreen');
const restartButton = document.getElementById('playGameAgain');

//declare variables
let score = 0;
let timerID;
let currentDirection = '';
let hasGameStarted = false;
let eat = new Audio(); 
let dead = new Audio();
eat.src = 'audio/eat.mp3';
dead.src = 'audio/the-end.mp3'

//using a new unit to draw things on the board to make sure everything is aligned
const sqSize = 25; 
// horizontal SQ = width/sq  
// vertical SQ = heigth/sq
let food = {
    x:Math.floor(Math.random() * board.height/sqSize),
    y:Math.floor(Math.random() * board.width/sqSize),
}

//start game and hide animation
startButton.addEventListener('click', hideMe);
function hideMe(){
  startButton.style.visibility='hidden';
  animatedSnake.style.visibility='hidden';  
  board.style.visibility = 'visible';
  scoreDisplay.style.visibility = 'visible';
}

// creating the game board
function createBoard(){
    ctx.fillStyle = 'rgba(0, 0, 0, 0.86)'; 
     //default color is black
    board.style.border = '3px solid #fff'
    ctx.fillRect(0,0, board.width, board.height); // it draws a rectangle and it fills it at the same time
    // axis x and y for the 0-0 positions, then it fills it to be equal to canvases width and height
}

//creating the Snake which is by default made out of 3 squares
let snake = [
    {x:2, y:0}, // HEAD
    {x:1, y:0}, // BODY
    {x:0, y:0} // TAIL
];

//function to draw a single square on the canvas to help us draw the snake
function drawSQ(x,y,color){
    ctx.fillStyle = color;
    //defines the colour that fills the square
    ctx.fillRect(x * sqSize,y * sqSize,sqSize,sqSize);  
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.86)'; 
    // stroke = border of the square, which is filled with the board colour
    ctx.strokeRect(x * sqSize,y * sqSize,sqSize,sqSize);
}

//for each tile/square we use the fillSquare function that calls the drawSQ function 
function drawSnake(){
    snake.forEach(fillSq);
    function fillSq(tile,i){
      //if snake's index = 0 then it gets a particular color different than the body
         if (i == 0){  
          const color = '#ab0c0a';
          drawSQ (tile.x, tile.y, color);
         }
         else {
          color = '#89c2a7';
          drawSQ (tile.x, tile.y, color);
         }                   
    }
  }
  
function moveSnake(){
    if (!hasGameStarted) return;
    //selecting snake's head, both x and y positions 
    const head = {...snake[0]}; 
       
        if (currentDirection == 'ArrowRight'){
        head.x +=1;
    }   else 
        if (currentDirection == 'ArrowLeft'){
        head.x -=1;
    }   else 
        if (currentDirection == 'ArrowUp'){
        head.y -=1;
    }   else 
        if (currentDirection == 'ArrowDown'){
        head.y +=1;
    }
    
    //if snake ate food we randomize food on the canvas again, else snake keeps on moving 
    //check if snake's head x and y match food's x and y coordinates
    if (snake[0].x === food.x && snake[0].y === food.y){
      //increment score
        score++;
        eat.play();
      //randomize food again
        updateFoodPosition(); 
                    
    } else{
     //removes the tail to create the ilussion of moving, and the snake keeps it length
      snake.pop();
    }
    
    //inserts new element in the array, new head coordinates
    snake.unshift(head);   
 }    

//adding event listeners for key
document.addEventListener('keydown', setDirection);
function setDirection(e) {
        if (
        (e.key == 'ArrowLeft' &&
          currentDirection !== 'ArrowRight') ||
        (e.key == 'ArrowRight' &&
          currentDirection !== 'ArrowLeft') ||
        (e.key == 'ArrowUp' &&
          currentDirection !== 'ArrowDown') ||
        (e.key == 'ArrowDown' &&
          currentDirection !== 'ArrowUp')
      ) {
       
        if (!hasGameStarted){
            hasGameStarted = true;
            timerID = setInterval(loop, 1000/10); // function loop is being called 10 times every 1 second
        }
                currentDirection = e.key;
      }
}

// function to randomize the food position
//it uses a callback function for each tile in the snake to check if the x and y coordinates of a tile are equal to food's coordinates
//while they are equal, so the snake and food are on top of each other it will continue generating a new position for the food
  function updateFoodPosition(){
    while (
        snake.some((tile) => tile.x === food.x && tile.y === food.y)
      ) {
        food = {
          x: Math.floor(Math.random() * board.width/sqSize),
          y: Math.floor(Math.random() * board.height/sqSize),
        }
      }
} 
  
//similar function to drawSQ but instead it uses drawImage property to fill the canvas with the selected picture
//drawImage(image, x, y, width, height)    
//the image will be "drawed" after the picture has been loaded
function drawFood(x,y){
        const img = new Image();
        img.src = 'food.png';
       
            ctx.drawImage(img, x*sqSize, y*sqSize,sqSize,sqSize);      
}

//Calls the drawFood function to render on screen
function loadFoodOnscreen(){
        drawFood(food.x, food.y);
    }

//hitWall collision check
function wallCollision(){
   return (snake[0].x < 0 || 
        snake[0].x >= board.width/sqSize ||
        snake[0].y < 0 ||
        snake[0].y >= board.height/sqSize)
};

//selfColission check tiles
function selfCollision(){
    const snakeBody = [...snake];
    const head = snakeBody.shift();
  
    return snakeBody.some(
      (square) => square.x === head.x && square.y === head.y
    );
}

const atStartSnakeLength = snake.length;
function showScore(){
    score = snake.length - atStartSnakeLength;
    scoreDisplay.innerText = `Your score is ⭐${score}`;
}

function gameOver(){
    showScore();
    gameOverScreen.style.visibility='visible';
    board.style.visibility = 'hidden';      
}
  
function loop(){
   createBoard();
   loadFoodOnscreen();
   moveSnake();
   drawSnake();
   showScore();
   if (wallCollision() || selfCollision()){
       dead.play();
       clearInterval(timerID); 
        gameOver();
        
         //stopping the game 
       }
   }
loop();

//play Again? 
restartButton.addEventListener('click', restartGame);
function restartGame(){
    snake = [
            { x: 2, y: 0 }, 
            { x: 1, y: 0 }, 
            { x: 0, y: 0 }, 
          ];
     //  //reset direction     
     currentDirection = '';
     // clear the canvas
     ctx.clearRect(0,0, board.width, board.height);
     //hide the game-over screen     
     gameOverScreen.style.visibility='hidden';
     //show the canvas
     board.style.visibility = 'visible';
     hasGameStarted = false;
     //enter again the loop
     loop(); 
}


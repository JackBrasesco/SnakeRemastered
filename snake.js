canvas = document.getElementById("canvas");
ctx = canvas.getContext('2d');
console.log("files at https://github.com/JackBrasesco/SnakeRemastered/")
//arrays for food and body (food array exists in case I want to add a special food
//that has a chance of appearing in which case there could be two foods at once)
food = []
body = []
//setup score
score = 0
document.getElementById("score").innerHTML = "SCORE: " + score
//game starts as true by default
gamerun = true
//load first piece of food
startingFood = new Food(0,0)
startingFood.generateFoodPosition();
food.push(startingFood);
//load image for food
var apple = new Image()
apple.src = 'apple.png'

//body part constructor
function Body(x,y,id) {
  //name of the body (its index in the array)
  this.id = id;
  //x position of the body part
  this.x = x,
  //y position of the body part
  this.y = y,
  //last position of the body part
  this.lastPosition = [x,y],
  //draws the body
  this.draw =  function() {
    ctx.beginPath();
    ctx.rect(this.x,this.y,50,50);
    ctx.fillStyle = "ffff00";
    ctx.fillRect(this.x,this.y,50,50);
    ctx.stroke();
  },
  //updates last position of the body part
  this.updateLastPosition = function() {
    this.lastPosition = [this.x,this.y];
  },
  //moves the body based on the last position of the body part one before it in
  //the array (or the head if its the first one)
  this.move = function() {
    if (this.id == 0) {
      this.x = head.lastPosition[0];
      this.y = head.lastPosition[1];
    } else {
      this.x = body[this.id - 1].lastPosition[0];
      this.y = body[this.id - 1].lastPosition[1];
    }
  }
};

//food constructor
function Food(x,y) {
  //food x position
  this.x = x,
  //food y position
  this.y = y,
  //generates a new position for the food (called after last food is eaten)
  this.generateFoodPosition = function() {
    newX = Math.floor(Math.random() * 28) * 50;
    newY = 100 + (Math.floor(Math.random() * 12) * 50);
    this.x = newX;
    this.y = newY;
    //makes sure new food isnt generated on part of the body
    for (i=0;i<body.length;i++) {
      if (this.x == body[i].x && this.y == body[i].y)
      this.generateFoodPosition()
    }
  },
  //draws food
  this.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = '#ffff00';
    ctx.drawImage(apple,this.x,this.y,50,50)
    ctx.stroke();
  }
}

//object for the head of the snake
head = {
  //x position of the head
  x: 400,
  //y position of the head
  y: 500,
  //last position of the head for use by the body
  lastPosition: [400,500],
  //direction the head is facing
  direction: 'right',
  //checks if head and food are occupying the same space
  touchingFood: function() {
    for (i=0;i<food.length; i++) {
      if (this.x == food[i].x && this.y == food[i].y) {
        this.addBody();
        food[i].generateFoodPosition();
        score += 1
        document.getElementById("score").innerHTML = "SCORE: " + score
      };
  }},
  //checks if head and part of body are touching and ends the game if they are
  touchingBody: function() {
    for (i=0;i<body.length;i++) {
      if (this.x == body[i].x && this.y == body[i].y) {
        gameOver();
      };
  }},
  //creates a new body object and adds it to the body array
  addBody: function() {
    body.push(new Body(this.lastPosition[0],this.lastPosition[1],body.length))
  },
  //updates the last position of the head
  updateLastPosition: function() {
    this.lastPosition = [this.x,this.y];
  },
  //checks if the head is out of bounds and ends the game if it is
  checkBounds: function() {
    if (this.x > 1350) {
      gameOver()
    }
    if (this.x < 0) {
      gameOver()
    }
    if (this.y > 650) {
      gameOver()
    }
    if (this.y < 0) {
      gameOver()
    }
  },
  //moves the head based on the direction it is facing
  move: function() {
    if (this.direction == "right") {
      this.x += 50
    }
    else if (this.direction == "left") {
      this.x -= 50
    }
    else if (this.direction == "down") {
      this.y += 50
    }
    else if (this.direction == "up") {
      this.y -= 50
    }
  },
  //draws the head on the canvas
  draw: function () {
    ctx.fillStyle = "ffff00";
    ctx.beginPath();
    ctx.rect(this.x,this.y,50,50);
    ctx.fillRect(this.x,this.y,50,50);
    ctx.stroke();
  }
}

//basically the update function in phaser, checks for collisions and moves and
//draws snake and food for 8 frames a second
function gameUpdate() {
    setTimeout(function() {
      if (gamerun) {
      window.addEventListener('keypress',changeDirection)
      head.touchingBody();
      head.touchingFood();
      ctx.clearRect(0,0,1400,800);
      head.updateLastPosition();
      head.move();
      head.draw();
      head.checkBounds();
      for (i=0;i<body.length;i++) {
        body[i].updateLastPosition();
        body[i].move();
        body[i].draw();
      }
      for (i=0;i<food.length;i++) {
        food[i].draw();
      }
      requestAnimationFrame(gameUpdate);
    };
  }, 1000/10)
}

//keydown function, used to change the direction of the snake mostly but pressing 'r' reloads the page to start the game
function changeDirection(e) {
  console.log(e.keyCode)
  //on 'S' keypress
  if (e.keyCode == 115 && head.direction != 'up') {
    head.direction = ('down');
  }
  //on 'A' keypress
  else if (e.keyCode == 97 && head.direction != 'right') {
    head.direction = ("left");
  }
  //on 'W' keypress
  else if (e.keyCode == 119 && head.direction != 'down') {
    head.direction = ("up");
  }
  //on 'D' keypress
  else if (e.keyCode == 100 && head.direction != 'left') {
    head.direction = ("right")
  }
  //on 'R' keypress
  else if (e.keyCode == 114) {
    window.location.reload(true)
  }
};

//stops the snake and adds the restart message to the top of the screen
function gameOver() {
  gamerun = false
  document.getElementById("score").innerHTML = "SCORE: " + score + ".   Press 'r' to restart"
};

//first RAF
requestAnimationFrame(gameUpdate);



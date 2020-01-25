canvas = document.getElementById("canvas");
ctx = canvas.getContext('2d');
food = []
body = []
score = 0
document.getElementById("score").innerHTML = "SCORE: " + score
gamerun = true
startingFood = new Food(0,0)
startingFood.generateFoodPosition();
food.push(startingFood);
var apple = new Image()
apple.src = 'apple.png'

function Body(x,y,id) {
  this.id = id;
  this.x = x,
  this.y = y,
  this.lastPosition = [x,y],
  this.draw =  function() {
    ctx.beginPath();
    ctx.rect(this.x,this.y,50,50);
    ctx.fillStyle = "ffff00";
    ctx.fillRect(this.x,this.y,50,50);
    ctx.stroke();
  },
  this.updateLastPosition = function() {
    this.lastPosition = [this.x,this.y];
  },
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


function Food(x,y) {
  this.x = x,
  this.y = y,
  this.generateFoodPosition = function() {
    newX = Math.floor(Math.random() * 28) * 50;
    newY = 100 + (Math.floor(Math.random() * 12) * 50);
    this.x = newX;
    this.y = newY;
  },
  this.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = '#ffff00';
    ctx.drawImage(apple,this.x,this.y,50,50)
    ctx.stroke();
  }
}

head = {
  x: 400,
  y: 500,
  lastPosition: [400,500],
  direction: 'right',
  touchingFood: function() {
    for (i=0;i<food.length; i++) {
      if (this.x == food[i].x && this.y == food[i].y) {
        this.addBody();
        food[i].generateFoodPosition();
        score += 1
        document.getElementById("score").innerHTML = "SCORE: " + score
      };
  }},
  touchingBody: function() {
    for (i=0;i<body.length;i++) {
      if (this.x == body[i].x && this.y == body[i].y) {
        gameOver();
      };
  }},
  addBody: function() {
    body.push(new Body(this.lastPosition[0],this.lastPosition[1],body.length))
  },
  updateLastPosition: function() {
    this.lastPosition = [this.x,this.y];
  },
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
  draw: function () {
    ctx.fillStyle = "ffff00";
    ctx.beginPath();
    ctx.rect(this.x,this.y,50,50);
    ctx.fillRect(this.x,this.y,50,50);
    ctx.stroke();
  }
}

function gameUpdate() {
    setTimeout(function() {
      if (gamerun) {
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
  }, 1000/8)
}

function changeDirection(e) {
  if (e.keyCode == 115 && head.direction != 'up') {
    head.direction = ('down');
  }
  else if (e.keyCode == 97 && head.direction != 'right') {
    head.direction = ("left");
  }
  else if (e.keyCode == 119 && head.direction != 'down') {
    head.direction = ("up");
  }
  else if (e.keyCode == 100 && head.direction != 'left') {
    head.direction = ("right")
  }
}

function gameOver() {
  gamerun = false
}


window.addEventListener('keypress',changeDirection)
requestAnimationFrame(gameUpdate);
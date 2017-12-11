var gameMode = 0;

var P1_Paddle;
var P2_Paddle;

var keys = [];

var theBall;
var ballX = [];
var ballY = [];

//1 = white, 2 = red, 3 = blue
var ballColor = [];

function setup() 
{
  createCanvas(640, 480);
  frameRate(60);
  SetPaddles();
  SetBall();
}

function draw() 
{
  background(255);
  DrawSign();
  CheckMove_P1();
  CheckMove_P2();
  if(gameMode == 1)
  {
    
    
    DrawBallTrail();
    P1_Paddle.DrawPaddle();
    P2_Paddle.DrawPaddle();
    theBall.draw();
  }
  
  
  
}

//Draws the sign of the game
function DrawSign() 
{
  //photo trim
  fill(163, 121, 53);
  rect(0, 0, 640, 480);
  fill(255);
  rect(30, 30, 580, 420);

  stroke(0);
  line(0, 0, 30, 30);
  line(640, 0, 610, 30);
  line(0, 480, 30, 450);
  line(640, 480, 610, 450);

  //Start Sign
  if (gameMode == 0) {
    line(320, 120, 200, 150);
    line(320, 120, 440, 150);
    fill(255, 255, 0);
    ellipse(320, 120, 5, 5);
    fill(255, 250, 211);
    rect(200, 150, 240, 160);

    fill(255, 250, 230);
    rect(230, 165, 180, 40);
    
    fill(0);
    textSize(24);
    text("Painterly Pong", 240, 195);
    
    
    //Check if mouse is over play button
    if(mouseX < 350 && mouseX > 290)
    {
      if(mouseY < 300 && mouseY > 260)
      {
        noStroke();
        fill(255);
        rect(285, 265, 70, 40); 
        if(mouseIsPressed)
        {
          gameMode = 1;
          print(gameMode);
        }
      }
    }
    stroke(0);
    fill(255,0,0);
    rect(290, 270, 60, 30);
    fill(255);
    textSize(18);
    text("Play", 303, 293);
  }
}

//Key Press Listener
//These functions have a problem where only 1 player can move, need to find a fix for this.
function CheckMove_P1()
{
  if(keyIsPressed && key == 'a')
  {
    keys[0] = true;
    keys[1] = false;
  }
  if(keyIsPressed && key == 'd')
  {
    keys[1] = true;
    keys[0] = false
  }

  //player 1 up paddle
  if(keys[0])
  {
    if(P1_Paddle.y > 30)
    {
      P1_Paddle.y-=2;
      //print(P1_Paddle.y);
      P1_Paddle.DrawPaddle();
    }
  }
  //player 1 down paddle
  if(keys[1])
  {
    if(P1_Paddle.y < 370)
    {
      P1_Paddle.y+=2; 
      //print(P1_Paddle.y);
      P1_Paddle.DrawPaddle();
    }
  }
}
//Player 2 key press
function CheckMove_P2()
{
  if(keyIsPressed && key == 'j')
  {
    keys[2] = true;
    keys[3] = false;
  }

  
  if(keyIsPressed && key == 'l')
  {
    keys[3] = true; 
    keys[2] = false;
  }

  
  //player 2 up paddle
  if(keys[2])
  {
    if(P2_Paddle.y > 30)
    {
      P2_Paddle.y-=2;
      //print(P2_Paddle.y);
      P2_Paddle.DrawPaddle();
    }
  }
  //player 2 down paddle
  if(keys[3])
  {
    if(P2_Paddle.y < 370)
    {
      P2_Paddle.y+=2; 
      //print(P2_Paddle.y);
      P2_Paddle.DrawPaddle();
    }
  }  
}


function SetPaddles()
{
   P1_Paddle = new Paddle(70, 30, 1);
   P2_Paddle = new Paddle(570, 30, 2);
}

function SetBall()
{
   theBall = new Ball(-1, -1);
}

function DrawBallTrail()
{
  for(var i = 0; i < ballX.length; i++)
  {
    //print(ballX[i] + " " + ballY[i] + " " + ballColor[i]);
    if(ballColor[i] == 1)
    {
      noStroke();
      fill(255,150,150);
      ellipse(ballX[i], ballY[i],15,15);
      stroke(0);
    }
    if(ballColor[i] == 2)
    {
      noStroke();
      fill(150,150,255);
      ellipse(ballX[i], ballY[i],15,15);
      stroke(0);      
    }
  }
}

function Ball(x,y)
{
  this.x = 320;
  this.y = 240;
  
  this.xVel = x;
  this.yVel = y;
  
  this.speed = 1;
  this.controller = 0;
  this.counter = 0;
  
  this.draw = function()
  {
    this.counter++;
    this.x += this.xVel * this.speed;
    this.y += this.yVel * this.speed;
    
    //Edge Detect Y axis
    if(this.y < 30 || this.y > 450)
    {
      this.yVel *= -1; 
    }
    
    //Edge Detect X axis
    if(this.x < 30 || this.x > 610)
    {
      this.x = 320;
      this.xVel *= -1;  
      this.speed = 1;
    }
    
    //Paddle Detect P1
    if(this.x-15 < P1_Paddle.x + 20 && this.x+15 > P1_Paddle.x)
    {
      if(this.y-15 < P1_Paddle.y + 80 && this.y+15 > P1_Paddle.y)
      {
        this.speed+=0.25;
        this.xVel *= -1;
        //this.yVel *= -1;
        this.controller = 1;
      }
    }
    //Paddle Detect P2
    if(this.x > P2_Paddle.x && this.x < P2_Paddle.x + 20)
    {
      if(this.y > P2_Paddle.y && this.y < P2_Paddle.y + 80)
      {
        this.speed+=0.25;
        this.xVel *= -1;
        //this.yVel *= -1;
        this.controller = 2;
      }
    }
    if(this.controller == 0)
    {
      fill(255);
    }
    if(this.controller == 1)
    {
      fill(255,0,0);
    }
    if(this.controller == 2)
    {
      fill(0,0,255); 
    }
    
    ellipse(this.x, this.y, 15, 15);
    
    if(this.counter == 7)
    {
      this.counter = 0;
      ballX[ballX.length] = this.x;
      ballY[ballY.length] = this.y;
      ballColor[ballColor.length] = this.controller;  
    }

    
    
    
  }
}

function Paddle(x, y, playerNum)
{
  this.x = x;
  this.y = y;
  this.player = playerNum
  
  this.DrawPaddle = function()
  {
    if(this.player == 1)
    {
      fill(255,0,0);
      rect(this.x,this.y,20,80);
    }
    if(this.player == 2)
    {
      fill(0,0,255);
      rect(this.x,this.y,20,80);
    }
  }
}
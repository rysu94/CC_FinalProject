/*
Final Project: Painterly Pong
By: Ryan Su

This sketch has 2 players play a game of pong. As they play, the canvas
will slowly become painted red & blue. By the end of the game, the player
with the most canvas covered will win.
*/

//This handles the game mode of the sketch
var gameMode = 0;

var timer = 0;
var adjustedTimer = 0;

var P1_Paddle;
var P2_Paddle;

var keys = [];

var theBall;
var ballX = [];
var ballY = [];
var ballSize = [];

//1 = white, 2 = red, 3 = blue
var ballColor = [];

var pixelCounted = false;
var redPixels = 0;
var bluePixels = 0;

var particles = [];
var bullets = [];


var P1_Wall;
var P2_Wall;


//Sound Variables
var paddleNoise;
var boomNoise;
var backgroundNoise;
var gameNoise;
var gameEnd;

function preload()
{
  paddleNoise = loadSound("Beep.ogg");
  boomNoise = loadSound("boom1.ogg");
  backgroundNoise = loadSound("8Bit_Theme.mp3");
  gameNoise = loadSound("8Bit_TitleScreen.mp3");
  gameEnd = loadSound("win.ogg");
}

function setup() 
{
  createCanvas(640, 480);
  frameRate(60);
  SetPaddles();
  SetBall();
  backgroundNoise.setLoop(true);
  backgroundNoise.setVolume(0.5);
  backgroundNoise.play();
}

function draw() 
{
   background(255);
  DrawFrame();
  //Start
  if(gameMode == 0)
  {
    DrawSign();
  }
  
  
  //Main Game
  if(gameMode == 1)
  {
    CheckMove_P1();
    CheckMove_P2();
    DrawBallTrail();
    P1_Paddle.DrawPaddle();
    P2_Paddle.DrawPaddle();
    theBall.draw();
    
    //Change Game Timer
    if(adjustedTimer > 0)
    {
      timer++;
    }
    if(timer == 60)
    {
      adjustedTimer--;
      timer = 0;
    }
    if(adjustedTimer == 0)
    {
      gameMode = 2;
      timer = 0;
    }
    
    //Move Particles
    for(var partNum = 0; partNum < particles.length; partNum++)
    {
      //Initialize particle
      if(!particles[partNum].init)
      {
        particles[partNum].Initialize();
        particles[partNum].init = true;
      }
      
      particles[partNum].MoveParticle();
    }

    //Move Bullets
    for(var bulletNum = 0; bulletNum < bullets.length; bulletNum++)
    {
      bullets[bulletNum].move();
      
     //reassign bullet indexes
     for(var p = 0; p < bullets.length; p++)
     {
       bullets[p].index = p;
     }  
     
    }


    //draw walls
    if(P1_Wall != null)
    {
      P1_Wall.draw();
    }

    if(P2_Wall != null)
    {
      P2_Wall.draw();
    }

  }
  
  //Game Ending
  if(gameMode == 2)
  {
    DrawBallTrail();
    fill(0);
    textSize(48);
    text("Nice Painting!", 190, 195);
    timer++;
    CheckPlayAgain();
    if(timer >= 180)
    {
      gameNoise.setVolume(0.1);
      DrawEnd();
      if(!pixelCounted)
      {
        CountPixels();
      }  
    }
  }
  DrawTimer();
}

//Draws te end Screen
function DrawEnd()
{ 
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
    if(redPixels > bluePixels)
    {
      text("Red Wins!", 265, 195);
    }
    if(bluePixels > redPixels)
    {
      text("Blue Wins!", 265, 195); 
    }
    if(redPixels == bluePixels)
    {
      text("Draw!", 240, 195); 
    }
    
  
    fill(0);
    textSize(14);
    text("P1 covered " + ((redPixels/(height*width))*100).toPrecision(3) +  "% of the canvas.", 210, 230);
    text("P2 covered " + ((bluePixels/(height*width))*100).toPrecision(3) + "% of the canvas.", 210, 250);
  
    stroke(0);
    fill(255,0,0);
    rect(270, 270, 100, 30);
    fill(255);
    textSize(18);
    text("Play Again", 280, 293);
}

//Draws the Game's timer
function DrawTimer()
{
  textSize(18);
  fill(255);
  text("Time Left: " + adjustedTimer, 500, 20); 
  
}

function DrawFrame()
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
}

//Draws the sign of the game
function DrawSign() 
{
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
    
    textSize(14);
    text("P1: Use W & S to move, D to shoot.", 210, 230);
    text("P2: Use I & K to move, J to shoot.", 210, 250);
    
    //Check if mouse is over play button
    if(mouseX < 350 && mouseX > 290)
    {
      if(mouseY < 300 && mouseY > 260)
      {
        noStroke();
        fill(255,255,0);
        rect(285, 265, 70, 40); 
        if(mouseIsPressed)
        {
          gameEnd.play();
          gameMode = 1;
          adjustedTimer = 60;
          paddleNoise.play();
          backgroundNoise.stop();
          gameNoise.setLoop(true);
          gameNoise.setVolume(0.5);
          gameNoise.play();
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

//Check Play Again
function CheckPlayAgain()
{
    //Check if mouse is over play button
    if(mouseX < 350 && mouseX > 290)
    {
      if(mouseY < 300 && mouseY > 260)
      {
        noStroke();
        fill(255,255,0);
        rect(285, 265, 70, 40); 
        stroke(0);
        if(mouseIsPressed)
        {
          gameMode = 1;
          adjustedTimer = 60;
          timer = 0;

          //reset the ball
          theBall.reset();

          gameNoise.setVolume(0.5);

          /*
          if(particles.length > 0)
          {
            for(var ipart = particles.length; ipart >= 0; ipart--)
           {
            particles[ipart].splice(ipart,1);
            }  
          }

          if(bullets.length > 0)
          {
            for(var iBull = bullets.length; iBull >=0; iBull--)
            {
              bullets[iBull].splice(iBull,1);
            }
          }
          */
          
          for(var iball = ballX.length; iball >= 0; iball--)
          {
            ballX.splice(iball,1);
            ballY.splice(iball,1);
            ballSize.splice(iball,1);
            ballColor.splice(iball,1);
          }
          
        }
      }
    } 
}

//Shoot Listener
function keyTyped()
{
  if(key == 'd' && gameMode == 1)
  {
    paddleNoise.play();
    bullets[bullets.length] = new Bullet(P1_Paddle.x, P1_Paddle.y, 1, bullets.length);
  }

  if(key == 'j' && gameMode == 1)
  {
    paddleNoise.play();
    bullets[bullets.length] = new Bullet(P2_Paddle.x, P2_Paddle.y, 2, bullets.length);
  }
  /*
  if(key == 'a' && gameMode == 1)
  {
    paddleNoise.play();
    P1_Wall = new Wall(P1_Paddle.x, P1_Paddle.y, 1);
  }

  if(key == 'l' && gameMode == 1)
  {
    paddleNoise.play();
    P2_Wall = new Wall(P2_Paddle.x, P2_Paddle.y, 2);
  }
  */
}


//Key Press Listener
//These functions have a problem where only 1 player can move, need to find a fix for this.
function CheckMove_P1()
{
  if(keyIsPressed && key == 'w')
  {
    keys[0] = true;
    keys[1] = false;
  }
  if(keyIsPressed && key == 's')
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
  if(keyIsPressed && key == 'i')
  {
    keys[2] = true;
    keys[3] = false;
  }

  
  if(keyIsPressed && key == 'k')
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

//Initializes the paddle objects
function SetPaddles()
{
   P1_Paddle = new Paddle(70, 30, 1);
   P2_Paddle = new Paddle(570, 30, 2);
}

//Initializes the ball object
function SetBall()
{
   theBall = new Ball(-1, -1);
}

//This draws the trail the ball leaves
function DrawBallTrail()
{
  for(var i = 0; i < ballX.length; i++)
  {
    //print(ballX[i] + " " + ballY[i] + " " + ballColor[i]);
    if(ballColor[i] == 1)
    {
      noStroke();
      fill(255,100,100);
      ellipse(ballX[i], ballY[i],ballSize[i],ballSize[i]);
      stroke(0);
    }
    if(ballColor[i] == 2)
    {
      noStroke();
      fill(100,100,255);
      ellipse(ballX[i], ballY[i],ballSize[i],ballSize[i]);
      stroke(0);      
    }
  }
}

//The ball class
function Ball(x,y)
{
  this.x = 320;
  this.y = 240;
  
  this.xVel = x;
  this.yVel = y;
  
  this.speed = 1;
  this.controller = 0;
  this.counter = 0;
  
  this.size = 15;

  this.timer = 0;

  this.reset = function()
  {
      this.x = 320;
      this.y = 240;
  
      this.xVel = x;
      this.yVel = y;
  
      this.speed = 1;
      this.controller = 0;
      this.counter = 0;
      this.timer = 0;
      this.size = 15;
  }
  
  this.draw = function()
  {
    this.timer++;
    this.counter++;
    this.x += this.xVel * this.speed;
    this.y += this.yVel * this.speed;
    
    //Edge Detect Y axis
    if(this.y < 38 || this.y > 442)
    {
      this.yVel *= -1; 
      this.size+=2;
      this.speed+=0.25;
      paddleNoise.play();
    }
    
    //Edge Detect X axis
    if(this.x < 38)
    {
      //Create Particles
      particles[particles.length] = new HitParticles(this.x, this.y, this.size, 5, 2, false, false);
      
      //Reset the ball
      this.x = 320;
      this.xVel *= -1;  
      this.speed = 1;
      this.size = 15;
      this.controller = 2;
      boomNoise.play();
      
      
    }
    if(this.x > 602)
    {
      //Create Particles
      particles[particles.length] = new HitParticles(this.x, this.y, this.size, 5, 1, false, false);
      
      //Reset the ball
      this.x = 320;
      this.xVel *= -1;  
      this.speed = 1;
      this.size = 15;
      this.controller = 1;
      boomNoise.play();
      
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
        this.size+=2;
        paddleNoise.play();
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
        this.size+=2;
        paddleNoise.play();
      }
    }

    /*
    //Wall detect p1
    if(P1_Wall != null && this.x-15 > P1_Wall.x + 20 && this.x+15 < P1_Wall.x)
    {
      if(this.y-15 > P1_Wall.y + 80 && this.y+15 > P1_Wall.y)
      {
        this.speed+=0.25;
        this.xVel *= -1;
        //this.yVel *= -1;
        this.controller = 1;
        this.size+=2;
        paddleNoise.play();
        P1_Wall = null;        
      }
    } 
    //qall Detect P2
    if(P2_Wall != null && this.x > P2_Wall.x && this.x < P2_Wall.x + 20)
    {
      if(this.y > P2_Wall.y && this.y < P2_Wall.y + 80)
      {
        this.speed+=0.25;
        this.xVel *= -1;
        //this.yVel *= -1;
        this.controller = 2;
        this.size+=2;
        paddleNoise.play();
        P2_Wall = null
      }
    }
    */


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
    
    ellipse(this.x, this.y, this.size, this.size);
    
    if(this.counter == 5)
    {
      this.counter = 0;
      ballX[ballX.length] = this.x;
      ballY[ballY.length] = this.y;
      ballColor[ballColor.length] = this.controller;  
      ballSize[ballSize.length] = this.size;
    }    
  }
}

//The paddle class
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

//Class responsible for generating particle systems
function HitParticles(x,y, size, numParticles, controller, init, flip)
{
  //particle index
  this.init = init;
  
  //Particle Origin
  this.x = x;
  this.y = y;
  
  //Size of the particles
  this.size = size;
  
  //Number of Particles
  this.numPart = numParticles;
  
  //Controller of the particles
  this.controller = controller;
  
  //This will hold the variables for particles.
  this.partX = [];
  this.partY = [];
  this.partVelX = [];
  this.partVelY = [];
  
  this.counter = 0;

  this.reverse = flip;
  
  this.Initialize = function()
  {
    for(var i = 0; i < this.numPart; i++)
    {
      this.partX[i] = this.x;
      this.partY[i] = this.y;
      //P1, Right
      if(this.controller === 1)
      {
        this.partVelX[i] = -random(1, 2);
        if(flip)
        {
          this.partVelX[i] = random(1, 2);
        }

      }
      //P2, Left
      if(this.controller === 2)
      {
        this.partVelX[i] = random(1, 2); 
        if(flip)
        {
          this.partVelX[i] = -random(1, 2); 
        }
      }      
      this.partVelY[i] = -random(0.1, 0.5);
    }
  }
  
  //This will move the particle
  this.MoveParticle = function()
  {
    
    this.counter++;
    
    for(var j = 0; j < this.partX.length; j++)
    {
       if(this.controller == 1)
       {
          fill(255,0,0); 
          for(var part1 = 0; part1 < this.partX.length; part1++)
          {
            if(!this.flip && this.partY[part1] < 442 && this.partX[part1] > 38)
            {
              ellipse(this.partX[part1], this.partY[part1], this.size, this.size);
              this.partX[part1] += this.partVelX[part1];
              this.partY[part1] += this.partVelY[part1];
              this.partVelY[part1]+= 0.005;
            
              if(this.counter == 5)
              {     
                ballX[ballX.length] = this.partX[part1];
                ballY[ballY.length] = this.partY[part1];
                ballColor[ballColor.length] = 1;  
                ballSize[ballSize.length] = this.size;
              }
              
            }
            if(this.flip && this.partY[part1] < 442 && this.partX[part1] < 602)
            {
              ellipse(this.partX[part1], this.partY[part1], this.size, this.size);
              this.partX[part1] += this.partVelX[part1];
              this.partY[part1] += this.partVelY[part1];
              this.partVelY[part1]+= 0.005;
            
              if(this.counter == 5)
              {     
                ballX[ballX.length] = this.partX[part1];
                ballY[ballY.length] = this.partY[part1];
                ballColor[ballColor.length] = 1;  
                ballSize[ballSize.length] = this.size;
              }
              
            }
            
          }
       }
    
      
      if(this.controller == 2)
      {
          fill(0,0,255); 
          for(var part2 = 0; part2 < this.partX.length; part2++)
          {
            if(!this.flip && this.partY[part2] < 442 && this.partX[part2] < 602)
            {
              ellipse(this.partX[part2], this.partY[part2], this.size, this.size);
              this.partX[part2] += this.partVelX[part2];
              this.partY[part2] += this.partVelY[part2];
              this.partVelY[part2]+= 0.005;
            
              if(this.counter == 5)
              {
                ballX[ballX.length] = this.partX[part2];
                ballY[ballY.length] = this.partY[part2];
                ballColor[ballColor.length] = 2;  
                ballSize[ballSize.length] = this.size;  
              }
      
            }
            if(this.flip && this.partY[part2] < 442 && this.partX[part2] > 38)
            {
              ellipse(this.partX[part2], this.partY[part2], this.size, this.size);
              this.partX[part2] += this.partVelX[part2];
              this.partY[part2] += this.partVelY[part2];
              this.partVelY[part2]+= 0.005;
            
              if(this.counter == 5)
              {
                ballX[ballX.length] = this.partX[part2];
                ballY[ballY.length] = this.partY[part2];
                ballColor[ballColor.length] = 2;  
                ballSize[ballSize.length] = this.size;  
              }
      
            }            

          }
      }
      
      //reset the counter
      if(this.counter == 5)
      {
        this.counter = 0;
      }
      
    }
  }
  
}

//This is the bullet class
function Bullet(x, y, controller, index)
{
  this.x = x;
  this.y = y + 40;
  this.index = index;

  this.drawing = false;

  this.controller = controller;

  
  this.move = function()
  {

    //red
    if(this.controller == 1)
    {
      this.x += 5;
      fill(255,0,0);    
    }

    //blue
    if(this.controller == 2)
    {
      this.x -= 5;
      fill(0,0,255);
    }
    rect(this.x - 10, this.y - 10, 10, 10);
    //Check Collision


    //Wall collision
    if(this.x < 38 || this.x > 602)
    {
      bullets.splice(this.index, 1);
    }

    //Ball collision
    if(theBall.timer > 60 && (this.x-10) > theBall.x - (theBall.size/2) && (this.x-10) < theBall.x + (theBall.size/2))
    {
      if((this.y-10) > theBall.y - (theBall.size/2) && (this.y-10) < theBall.y + (theBall.size/2))
      {
        theBall.timer = 0;

        bullets.splice(this.index, 1);

        boomNoise.setVolume(0.55);
        boomNoise.play();
        theBall.controller = this.controller;
        theBall.size += 0.5;
        theBall.yVel *= -1;
        ballX[ballX.length] = this.x - 10;
        ballY[ballY.length] = this.y - 10;
        ballColor[ballColor.length] = this.controller;  
        ballSize[ballSize.length] = 50; 

        if(this.controller == 1)
        {
          particles[particles.length] = new HitParticles(this.x, this.y, 20, 3, 1, false, true);
        }

        if(this.controller == 2)
        {
          particles[particles.length] = new HitParticles(this.x, this.y, 20, 3, 2, false, true);
        }

      }
    }   
  }
}

function Wall(x,y,controller)
{
  this.x = x;
  this.y = y;
  this.controller = controller;

  this.life = 5;

  this.draw = function()
  {
    if(this.controller == 1)
    {
      fill(255,0,0);
      rect(this.x + 35, this.y, 20, 80);
    }
    if(this.controller == 2)
    {
      fill(0,0,255);
      rect(this.x - 35, this.y, 20, 80);
    }
  }



}








//Access the pixel array to count how many red and blue pixels there are
function CountPixels()
{
  pixelCounted = true;
  loadPixels();
  redPixels = 0;
  bluePixels = 0;
  //loop though the pixel array
  for(var x = 0; x < height; x++)
  {
    for(var y = 0; y < width; y++)
    {
      var index = (x + y * width) * 4;
      //Check for red
      if(pixels[index] === 255 && pixels[index+1] === 100 && pixels[index+2] === 100)
      {
        redPixels++;
      }
      
      //Check for blue
      if(pixels[index] === 100 && pixels[index+1] === 100 && pixels[index+2] === 255)
      {
        bluePixels++;
      }
    }
  } 
  //print(redPixels + " " + bluePixels);
  updatePixels();
}
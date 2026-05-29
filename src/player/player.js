export class Player extends Phaser.Physics.Arcade.Sprite {
    init(){
        //this are the character states (ex. walking, facing left... right... etc)
        //This is especially for flipping the sprites, DO NOT REMOVE
        this.facingRight = true;
        this.facingLeft = false;

        //char check
        this.Char1 = true;
        this.Char2 = false;
        this.CharChange = false;

        //background
        //movement spud
        this.onLadder = false
        this.abilityCooldown = false
        this.charstateWalk = false;
        this.charstateIdle = true;
        this.charstateJump = false;
        this.charstateAbility = false;
        this.charstateFall = false;
        this.charstateHurt = false;
        this.upStun = false;
        this.charstateDead = false;
        this.charstateRun = false;
        this.charstateSkidd = false;
        this.invAfterHit = false;
        this.checkforpreventingSkiddafterStun = false
        this.charstateThroughPlatform = false
        this.invPreventer = false
        this.charstateThrowing = false
        this.charstateVictory = false
        this.charstateClimb = false
        this.climbDisabling = false
        this.charstateUp = false
        this.charstateDown = false

        this.CharKey = "hoots"
    }

    constructor (scene, x, y)
    {
        super(scene, x, y, "hoots");


        this.init()


        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        //console.log("Player Created!");
        
        this.body.setSize(7, 13)
        this.body.setOffset(5, 3);




        //console.log("The player's hitbox should be mesured to fit the sprites");
        //  Player physics properties. Give the little guy a slight bounce.
        this.setBounce(0);
        
        this.debugBodyColor = 0xffffff;
        //console.log("Player's MISC configs should work now...");
        //  Our player animations, turning, walking left and walking right

    }
    update (cursors, keyA, keyS, keyD, keyW, keySPACEBAR, key2, skiddSound, jumpSound, activeStomp, gameOver, time, walkSound, sprintSound, sprintDustRepos, registry){
        //Updates

        //Special //console logs

        /*if(this.abilityCooldown){
            //console.log("Cooldown")
        }
        if(this.coyoteTime){
            //console.log("Coyote time")
        }
        else if(!this.coyoteTime){
            //console.log("nope")
        }*/
        
        
        //special sound handler

        if(this.body.onFloor()){
            jumpSound.stop()
            activeStomp.stop()
        }
        
        if(!this.charstateAbility && activeStomp.isPlaying){
            activeStomp.stop()
        }


        //char starts here
        if(!this.charstateDead && !this.charstateVictory)
        {
        //states for flipping the char
            if(!this.charstateSkidd){
                if(this.facingLeft == true){
                    this.setFlipX(true);
                    ////console.log("Fliping player anims to the Left")
                }
                else if(this.facingRight == true){
                    this.setFlipX(false);
                    ////console.log("Fliping player anims to the Right")
                }
            }

            if(!this.charstateHurt && !this.charstateSkidd){
                if(cursors.left.isDown && !cursors.right.isDown && this.body.velocity.x >= 0){
                    this.facingLeft = true;
                    this.facingRight = false;
                }
                else if(cursors.right.isDown && !cursors.left.isDown && this.body.velocity.x <= 0){
                    this.facingLeft = false;
                    this.facingRight = true;
                }
            else if((cursors.left.isDown && cursors.right.isDown || cursors.left.isDown && cursors.right.isDown)){
                if(this.body.velocity.x > 0){
                    this.facingLeft = false;
                    this.facingRight = true;
                }
                else if(this.body.velocity.x < 0){
                    this.facingLeft = true;
                    this.facingRight = false;
                }
            }

        }

        //now this is where things get spicy

        //states for movement

        //inv after hit
        if(this.invAfterHit && !this.invPreventer){
            this.invPreventer = true
            
                if(!this.flashing){
                    this.flashOn = true
                    this.flashing = true
                }
                time.delayedCall(3000, () =>{
                    if(this.invAfterHit){
                        this.flashing = false
                        this.flashOn = false
                        this.setAlpha(1)
                        
                        this.invAfterHit = false
                        this.invPreventer = false
                    }
                })
            
        }

        if (this.flashing){
            if(this.flashOn){
                this.flashOn = false
                this.setAlpha(0)
                time.delayedCall(100, ()=>{
                    this.setAlpha(1)
                    time.delayedCall(100, ()=>{
                        this.flashOn = true
                    })
                })
            }
        }

            
            if(!this.charstateHurt && !this.charstateThrowing){
                //this is for preventing skidd while touching a wall >:|
                if(this.body.blocked.left || this.body.blocked.right){

                    this.charstatePushing = true
                    this.charstateRun = false
                }
                else if(!this.body.blocked.left && !this.body.blocked.right && this.charstatePushing){
                    time.delayedCall(50, () =>{
                        this.charstatePushing = false
                    })
                        
                }

                    
                    if(this.charstateWalk && !this.charstateRun && !this.charstateSkidd){
                        ////console.log("State: Walking");
                        if(this.facingLeft){
                            this.setVelocityX(-80);
                            //////console.log("Left, normal speed");
                        }
                        else if(this.facingRight){
                            this.setVelocityX(80);
                            ////console.log("Right, normal speed");                
                        }
                    }
                    else if(this.charstateRun && this.charstateWalk && !this.charstateSkidd){
                        ////console.log("State: Running");
                        if(this.facingLeft){
                            this.setVelocityX(-160);
                            ////console.log("Left, fast speed");
                        }
                        else if(this.facingRight){
                            this.setVelocityX(160);
                            ////console.log("Right, fast speed");                
                        }
                    }
                    else if(this.charstateSkidd){
                        ////console.log("State: Skidding")
                        if(!skiddSound.isPlaying && this.body.onFloor()){
                            skiddSound.play()
                        }
                        else if(!this.body.onFloor()){
                            skiddSound.stop()
                        }
                        if(!this.charstateIdle){
                            if(cursors.left.isDown){
                                this.setAccelerationX(-250);
                                ////console.log("Pushing right");
                            }
                            else if(cursors.right.isDown){
                                this.setAccelerationX(250);
                                ////console.log("Pushing left");                
                            }
                        }    
                        else if(this.charstateIdle){
                            if(this.facingLeft){
                                this.setAccelerationX(250);
                                ////console.log("Pushing right");
                            }
                            else if(this.facingRight){
                                this.setAccelerationX(-250);
                                ////console.log("Pushing left");                
                            }
                        }             
                    }
                    else if(this.charstateIdle){
              
                        this.setAccelerationX(0);
                        this.setAccelerationY(0);
                        
                        this.setVelocityX(0);

                        if(this.charstateClimb && !(this.charstateUp && this.charstateDown)){
                            this.setVelocityY(0)
                        }
                        
                        
                        ////console.log("State: idle");
                    }
                if(this.charstateClimb){
                        if(this.charstateUp){
                            this.setVelocityY(-80)
                        }
                        else if(this.charstateDown){
                            this.setVelocityY(80)
                        }
                        else{
                            this.setVelocityY(0)
                        }
                    }

                if(this.charstateJump && !this.charstateFall){
                    this.setVelocityY(-250);
                    ////console.log("State: Jumping");
                }
                else if(this.charstateFall && !this.charstateJump){
                    this.setAccelerationY(900);
                    ////console.log("State: Falling");
                }
                else if(this.charstateFall && this.charstateJump){
                    this.setAccelerationY(0);
                    ////console.log("State: Maintaining jump");
                }
                else if(this.charstateAbility){
                    this.setVelocityX(0);
                    this.setVelocityY(400)
                    ////console.log("State: Stomp")
                }
            }
            else if(this.charstateHurt){

                ////console.log("State: Hurt");
                
                if(this.facingLeft){
                    this.setVelocityX(100);
                    ////console.log("Pushed right");
                }
                else if(this.facingRight){
                    this.setVelocityX(-100);
                    ////console.log("Pushed left");                
                }
            }
            else if(this.charstateThrowing && !this.charstateHurt){
                this.setVelocityX(0)
                this.setVelocityY(0)
            }


            if (this.upStun){
                this.body.setVelocityY(-90)
                this.charstateHurt = true;
                time.delayedCall(100, () => {

                    this.upStun = false
                })
            }

            
            if(!this.charstateClimb && !this.charstateDead && !this.charstateVictory){
                if(this.coyoteTime && !this.body.onFloor()){
                this.setGravityY(100)
                }
                else if(!this.coyoteTime){
                    this.setGravityY(600)
                }
            }
        }
        else if(this.charstateDead || this.charstateVictory){
            this.setVelocityX(0);
            this.setVelocityY(0);
            this.setGravityY(0)
            ////console.log("State: Dead")
        }


        if(this.charstateClimb && !this.charstateDead){
            this.setGravityY(0)
        }
 
    

        

        //Keybinds
        if(this.onLadder && cursors.up.isDown && !this.charstateClimb){
            this.charstateClimb = true
            this.charstateJump = false
            this.charstateFall = false
            this.climbDisabling = true
            time.delayedCall(100, ()=>{
                this.climbDisabling = false
            })
        }
        else if(!this.onLadder && this.charstateClimb && !this.climbDisabling){
            this.charstateClimb = false
            this.charstateFall = true
        } 

        if(this.charstateClimb){
            if(cursors.up.isDown && !cursors.down.isDown){
                this.charstateUp = true
                this.charstateDown = false
            }
            else if(!cursors.up.isDown && cursors.down.isDown){
                this.charstateUp = false
                this.charstateDown = true
            }
            else if(!cursors.up.isDown && !cursors.down.isDown){
                this.charstateUp = false
                this.charstateDown = false
            }
        }
        else if(!this.charstateClimb){
            this.charstateUp = false
            this.charstateDown = false
        }


        if(!this.charstateVictory && !this.charstateDead){
            if(this.coyoteTime && !this.body.onFloor()){
                time.delayedCall(100,() => {
                    if(!this.body.onFloor()){
                        this.coyoteTime = false
                        if(!cursors.down.isDown && !this.charstateClimb){
                            this.charstateFall = true
                        }
                    }
                    
                })
            }
            if(!this.charstateHurt && !this.charstateThrowing){
                //general walk
                if(cursors.left.isDown || cursors.right.isDown){
                        this.charstateWalk = true
                    if((keyS.isDown || keyW.isDown) && !this.charstateClimb){
                        this.charstateRun = true
                        if(((cursors.left.isDown && this.body.velocity.x > 80) || (cursors.right.isDown && this.body.velocity.x < -80)) && (!this.charstatePushing)){
                            this.charstateSkidd = true
                        }
                        else if((cursors.left.isDown && this.body.velocity.x < 80) || (cursors.right.isDown && this.body.velocity.x > -80) || (this.charstatePushing)){
                            this.charstateSkidd = false
                        }
                    }
                    else if((!keyS.isDown || !keyW.isDown) || (!this.body.onFloor() && !this.coyoteTime)){
                        this.charstateRun = false
                        this.charstateSkidd = false
                    }
                    
                }
                //jumping and falling
                if((keyD.isDown || keySPACEBAR.isDown) && ((this.body.onFloor() || this.charstateClimb) || this.coyoteTime)){
                    if(!jumpSound.isPlaying){
                        jumpSound.play()
                    }
                    this.coyoteTime = false
                    this.onLadder = false
                    this.charstateClimb = false
                    this.charstateJump = true;
                    this.charstateFall = false;
                    this.charstateSkidd = false
                }
                else if(!cursors.down.isDown && !this.charstateClimb){
                    if((cursors.up.isDown || keyD.isDown || keySPACEBAR.isDown) && !this.body.onFloor() && this.body.velocity.y < -1 && !this.coyoteTime){
                        this.charstateJump = true;
                        this.charstateFall = true 
                    }
                    else if(!this.body.onFloor() && (this.body.velocity.y >= -1 && (keyD.isDown || keySPACEBAR.isDown) || (!keyD.isDown || keySPACEBAR.isDown))){
                        
                        if(this.charstateJump){
                            this.charstateJump = false;
                            this.charstateFall = true;
                            this.charstateAbility = false
                            this.charstateSkidd = false
                        }
                    }
                }
                else if(!this.body.onFloor() && cursors.down.isDown && !this.coyoteTime && !this.charstateClimb){
                    if(!this.charstateAbility && this.Char1){
                        this.charstateJump = false;
                        this.charstateFall = false;
                        //this.charstateWalk = false
                        this.charstateAbility = true;
                        if(!activeStomp.isPlaying && this.charstateAbility){
                            activeStomp.play()
                        }
                        
        
                    }

                }
                
                else if(keyA.isDown && !this.abilityCooldown){
                    this.charstateThrowing = true
                    if(this.charstateSkidd){
                        this.charstateSkidd = false
                    }
                }
                
            }

            else if(this.body.onFloor()){
                this.charstateHurt = false;
                
                time.delayedCall(300, () =>{
                    this.checkforpreventingSkiddafterStun = false
                })
            };

            if(!this.charstateHurt && !this.charstateThrowing && !this.charstateVictory){
                if((this.body.onFloor() && (!keyD.isDown || keySPACEBAR.isDown)|| !this.body.onFloor()) && (!cursors.left.isDown && !cursors.right.isDown || cursors.left.isDown && cursors.right.isDown) || (this.body.velocity.x == 0 && (this.body.touching.left || this.body.touching.right))){
                    if((this.body.velocity.x >= 160 || this.body.velocity.x <= -160) && !this.checkforpreventingSkiddafterStun){
                        if(this.charstateRun){
                            this.charstateSkidd = true
                        }
                        this.charstateIdle = true
                    }
                    else if(this.body.velocity.x < 160 && this.body.velocity.x > -160 || this.checkforpreventingSkiddafterStun){
                        this.charstateIdle = true
                        this.charstateSkidd = false
                    }
                }
                else if (keyA.isDown || cursors.down.isDown || keyD.isDown || keySPACEBAR.isDown || cursors.left.isDown || cursors.right.isDown || cursors.up.isDown){
                    this.charstateIdle = false
                }

                if(this.body.onFloor()){
                    this.charstateFall = false;
                    this.charstateAbility = false;
                    this.coyoteTime = true;

                };
                if(this.body.onFloor() && this.charstateAbility){
                    this.charstateAbility = false
                }

                

                if(this.charstateIdle){
                    this.charstateWalk = false;
                    if(this.body.onFloor()){
                        this.charstateAbility = false
                    }

                }

            }
                //gameover ig
            if (gameOver)
            {
                this.charstateDead = true;
            }
            if(this.charstateHurt){
                this.checkforpreventingSkiddafterStun = true
            }
        }

        if(!this.charstateVictory){
            if(!this.charstateDead && !this.charstateHurt && !this.charstateThrowing){
                if (this.charstateWalk && this.body.onFloor() && !this.charstateJump)
                {
                    if(!this.charstateSkidd && this.body.velocity.y == 0){
                        if((this.body.velocity.x < 0 && this.body.velocity.x > -89) || (this.body.velocity.x > 0 && this.body.velocity.x < 89)){
                            this.play(Phaser.Utils.String.Format('%1_walk', [this.CharKey]), true);
                        }
                        else if(this.body.velocity.x <= -90 || this.body.velocity.x >= 90){
                            this.play(Phaser.Utils.String.Format('%1_run', [this.CharKey]), true);
                        }
                    }
                        else if(this.charstateSkidd){
                        this.play(Phaser.Utils.String.Format('%1_skidd', [this.CharKey]), true);
                    }
                
                }

                else if (this.charstateJump && this.body.velocity.y <= -1){
                    this.play(Phaser.Utils.String.Format('%1_jump', [this.CharKey]), true);
                }
                else if (this.charstateFall && this.body.velocity.y >= 1){
                    this.play(Phaser.Utils.String.Format('%1_fall', [this.CharKey]), true)
                }
                else if(this.charstateAbility && !this.body.onFloor() && !this.charstateFall){
                    this.play(Phaser.Utils.String.Format('%1_stomp', [this.CharKey]), true)
                }

                else if(this.charstateIdle && this.body.onFloor())
                {
                    if(this.charstateSkidd){
                        this.play(Phaser.Utils.String.Format('%1_skidd', [this.CharKey]), true);
                    }
                    else{
                        this.play(Phaser.Utils.String.Format('%1_idle', [this.CharKey]), true);
                    }
                }
                else if(this.charstateClimb){
                    if(this.body.velocity.x == 0 && this.body.velocity.y == 0){
                        this.play(Phaser.Utils.String.Format('%1_climb', [this.CharKey]), false)
                    }
                    else{
                        this.play(Phaser.Utils.String.Format('%1_climb', [this.CharKey]), true)
  
                    }
                }

            }
            else if(this.charstateThrowing && !this.charstateDead && !this.charstateHurt){
                this.play(Phaser.Utils.String.Format('%1_bombThrow', [this.CharKey]), true)
            }
            else if(this.charstateDead){
                this.play(Phaser.Utils.String.Format('%1_dead', [this.CharKey]), true)
            }
            else if (this.charstateHurt && !this.body.onFloor()){
                this.play(Phaser.Utils.String.Format('%1_hurt', [this.CharKey]), true)
            }
        }
        else if(this.charstateVictory){
            this.play(Phaser.Utils.String.Format('%1_victory', [this.CharKey]), true);
        }


        //sfx handler for walk and sprint

        if(this.charstateWalk && this.body.onFloor() && !this.charstateVictory){
            
            if(!this.charstateSkidd && this.charstateRun && !this.body.blocked.left && !this.body.blocked.right){
                if(!sprintSound.isPlaying && !this.walkSoundPlay){
                    this.walkSoundPlay = true
                    this.pitch = Phaser.Math.FloatBetween(-200, 200)
                    sprintSound.detune = this.pitch
                    
                    sprintSound.play()

                    time.delayedCall(100, ()=>{
                        this.walkSoundPlay = false
                        
                    })
                }
            }
            else{
                if(!this.charstateSkidd && !walkSound.isPlaying && !this.walkSoundPlay){
                    this.walkSoundPlay = true
                    this.pitch = Phaser.Math.FloatBetween(20, 200)
                    walkSound.detune = this.pitch
                    walkSound.play()

                    time.delayedCall(200, ()=>{
                        this.walkSoundPlay = false
                    })
                }
            }
        }
        else if(this.charstateClimb && (this.body.velocity.y != 0 || !this.charstateIdle)){
            if(!sprintSound.isPlaying && !this.walkSoundPlay){
                    this.walkSoundPlay = true
                    this.pitch = Phaser.Math.FloatBetween(-200, 200)
                    sprintSound.detune = this.pitch
                    
                    sprintSound.play()

                    time.delayedCall(100, ()=>{
                        this.walkSoundPlay = false
                        
                    })
                }
        }

        

    }


}

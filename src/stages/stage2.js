//import { TheFuckingTumor } from '../bosses/tumor.js';
import { Boss } from '../bosses/yourself_stage2.js';
import { PlayerBomb } from '../player/bomb_player.js';
import { Player } from '../player/player.js';

export class Stage2 extends Phaser.Scene{
    constructor(){
        super({key: "stage2"})
    }
    init(){
        this.bossLockCamera = false
        this.skiddSound
        this.jumpSound
        this.activeStomp = false
        this.playerBombOnScreen = false
        this.sprintDustRepos = true
        this.hpCheck = 3
        this.stageName = "stage2"
        this.gameOver = false
        this.discAppear = true
        this.wallCount = 0
    }
    create(){
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keySPACEBAR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);



        this.input.keyboard.on('keydown-ENTER', () =>
        {
                if(!this.player.charstateDead){
                    //console.log('Pausing game...')
                    /*this.scene.launch('pause', {
                        score: this.score,
                        bombLoad: this.bombsThatShouldSpawn,
                        level: this.level,
                        stageName: this.stageName,
                    })*/
                    this.scene.pause('stage2')
                    this.stagetrack.pause()
                    this.scene.launch("pause", {
                        stageName: this.stageName
                    })
                }
                else{
                    //console.log("You can't pause the game right now...")
                }
        });

        //sounds
        this.jumpSound = this.sound.add('jump')
        this.skiddSound = this.sound.add('skidd')
        this.activeStomp = this.sound.add('stomp_activate')
        this.sound.add("hurt")
        this.pullOutSound = this.sound.add("pullOut")
        this.throwSound = this.sound.add("throw")
        this.sprintSound = this.sound.add("sprint")
        this.walkSound = this.sound.add("walk")
        this.gameOverJingle = this.sound.add("gameOver")

        this.victoryJingle = this.sound.add("victoryJingle")

        this.explosionSound = this.sound.add("explosion1")
        this.wallBreakSound = this.sound.add("wallBreak")
        this.platCrackSound = this.sound.add("crack")

        this.stagetrack = this.sound.add("stage2")

        this.sound.add("select")
        /*
        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            acceleration: 1.0,
            drag: 0.0005,
            maxSpeed: 0.0008
        };
        */

        //this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig)

        this.stagetrack.play()
        this.stagetrack.loop = true
        this.stage2Tilemap = this.add.tilemap('stage2Tilemap');

        const floorTile = this.stage2Tilemap.addTilesetImage("tileset_stage2", "tileset_stage2");
        const BCTile = this.stage2Tilemap.addTilesetImage("tileset_stage2", "tileset_stage2");
        const breakableWallTile = this.stage2Tilemap.addTilesetImage("tileset_stage2", "tileset_stage2");
        const spikeTile = this.stage2Tilemap.addTilesetImage("tileset_stage2", "tileset_stage2");
        const platformTile = this.stage2Tilemap.addTilesetImage("tileset_stage2", "tileset_stage2");


        const spawnPoint = this.stage2Tilemap.findObject("playerSpawn", obj => obj.name === "playerSpawn")

        

        const BCLayer = this.stage2Tilemap.createLayer("BackgroundDeco", BCTile)
        this.breakableWallLayer = this.stage2Tilemap.createLayer("breakableWall", breakableWallTile)
        const spikesLayer = this.stage2Tilemap.createLayer("spike", spikeTile);
        const floorLayer = this.stage2Tilemap.createLayer("platforms", floorTile)
        this.wobblePlatLayer = this.stage2Tilemap.createLayer("wobblePlat", platformTile)

        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        this.playerBomb = new PlayerBomb(this, 0, 0);
        this.playerBomb.anims.play("bomb", true).setVisible(false)
        
        // Activa colisión en todos los tiles excepto el vacío
        floorLayer.setCollisionByExclusion([-1]);
        spikesLayer.setCollisionByExclusion([-1]);
        this.breakableWallLayer.setCollisionByExclusion([-1]);
        this.wobblePlatLayer.setCollisionByExclusion([-1]);
        // Convierte la capa en cuerpos físicos
        this.physics.add.collider(this.player, floorLayer);
        this.physics.add.collider(this.player, spikesLayer, this.playerHit, null, this);

        
        this.physics.add.collider(this.player, this.breakableWallLayer, this.hitTilePlayer, null, this)

        this.physics.add.collider(this.playerBomb, floorLayer)
        this.physics.add.collider(this.playerBomb, spikesLayer)
        this.physics.add.collider(this.playerBomb, this.breakableWallLayer, this.hitTile, null, this)
        this.physics.add.overlap(this.playerBomb, this.breakableWallLayer, this.hitTile, null, this)


        this.platformActive = this.physics.add.collider(this.player, this.wobblePlatLayer, this.wobbleTileDestroy, null, this)
        this.physics.add.collider(this.playerBomb, this.wobblePlatLayer)
        
        //camera
        this.cameras.main.startFollow(this.player, false, 0.5, 0.5);
        


        //effects
        this.effects = this.physics.add.group()

        this.runDust = this.effects.create(0, 0, "effects_hoots").setVisible(false)
        this.runDust.debugBodyColor = 0xffffff


        //life stuff
        this.scene.launch("lifeSystem")

        this.registry.set('gotHit', false);

        //Disc stuff
        let discWasColected = this.registry.get('disc2Collected')
        
        if(discWasColected === true){
            this.discAppear = false
            console.warn("Disc 2 was already collected! Skipping...")
        }

        if(this.discAppear){
            this.discSpawn = this.physics.add.group()

            const discStageXY = this.stage2Tilemap.findObject("disc", obj => obj.name === "disc")
            this.disc = this.discSpawn.create(discStageXY.x, discStageXY.y, "disc2")
        
            this.physics.add.collider(this.player, this.disc, this.discInter, null, this)
        }

        //boss

        const boss = this.stage2Tilemap.findObject("boss", obj => obj.name === "boss")
        this.boss = new Boss(this, boss.x, boss.y)

        this.bossCol = this.physics.add.overlap(this.player, this.boss, this.victory, null, this)
        this.bossCol2 = this.physics.add.overlap(this.playerBomb, this.boss, this.victory, null, this)

    };
    update(/*delta*/){

        if(!this.gameOver && !this.scene.isActive('pause') && !this.scene.isActive("discText") && !this.bossLockCamera && !this.onVictory){
            if(this.stagetrack.isPaused)
                this.stagetrack.resume()
        }
        else{
            this.stagetrack.pause()
        }

        //update Boss
        this.boss.update(this.stageName)

        //platform handler
        if(this.player.charstateJump){
            this.platformActive.active = false
        }
        else if(!this.player.charstateJump){
            this.platformActive.active = true
        }

        //more life
        if(this.wallCount >= 20){
            this.wallCount = 0
            //console.log(this.wallCount)
            let hp = this.registry.get('hp');
            if(hp < 3){
                this.registry.set('hp', (hp + 1));
                this.sound.play("select")
            }
            
        }

        const camLock1 = this.stage2Tilemap.findObject("cameraLock", obj => obj.name === "camStart")
        const camLock2 = this.stage2Tilemap.findObject("camlock2", obj => obj.name === "camFinish")
        const camUnlock = this.stage2Tilemap.findObject("camDisc", obj => obj.name === "discUnlock")
        const camUnlockLimit = this.stage2Tilemap.findObject("camDisc", obj => obj.name === "discLimit")

        //camera rebounding
        if(this.player.x < camUnlock.x || this.player.y < camUnlock.y){
            this.canDieFromVoid = true
            this.cameras.main.setBounds(camLock1.x, camLock1.y, camLock2.x, camLock2.y)
        }
        else if(this.player.x >= camUnlock.x && this.player.y >= camUnlock.y){
            this.cameras.main.setBounds(camLock1.x, camLock1.y, undefined, camUnlockLimit.y)
            this.canDieFromVoid = false
        }
            


        if((this.hpCheck == 0 || this.player.y > camLock2.y + 32 && this.canDieFromVoid) && !this.gameOver){
            this.registry.set('hp', (0));
            this.gameOverHandler()
            this.gameOver = true
            //console.log("game over bish")
        }
        this.player.update(this.cursors, this.keyA, this.keyS, this.keyD, this.keyW, this.keySPACEBAR, this.key2, this.skiddSound, this.jumpSound, this.activeStomp, this.gameOver, this.time, this.walkSound, this.sprintSound, this.sprintDustRepos, this.registry);

        if(!this.gameOver){

            //effects

            if(this.sprintDustRepos && this.player.walkSoundPlay && this.player.charstateRun && this.player.body.onFloor() && !this.player.body.blocked.left && !this.player.body.blocked.right){
                this.sprintDustRepos = false
                var substractPos = 0
                if(this.player.facingLeft){
                    this.runDust.setFlipX(true)
                    substractPos = 16
                }
                else if(this.player.facingRight){
                    this.runDust.setFlipX(false)
                    substractPos = -16
                }

                this.runDust.setPosition(this.player.x + substractPos, this.player.y)
                this.runDust.anims.play("sprintDust", true).setVisible(true)
                this.time.delayedCall(100, ()=>{
                                
                    this.sprintDustRepos = true
                })
                
                
            }
            //bombUpdate
            this.playerBomb.update(this.time, this.forcedExplode, this.explosionSound)
            //96
            
            
            this.cameraView = this.cameras.main.worldView
            
            
            if (!this.cameraView.contains(this.playerBomb.x, this.playerBomb.y) && this.playerBombOnScreen == true){
                this.playerBombOnScreen = false
                this.time.delayedCall(500, ()=>{
                    if (!this.cameraView.contains(this.playerBomb.x, this.playerBomb.y)){
                        this.playerBomb.setVisible(false).setVelocityX(0).setVelocityY(0).setGravityY(0)
                        this.abilityCooldown = false
                    }
                    else{
                        this.playerBombOnScreen = true
                    }
                })
            }
                //this.controls.update(delta)

            if(this.keyA.isDown && !this.cursors.down.isDown && !this.player.abilityCooldown && this.playerBomb.bombExploded && !this.player.charstateVictory){

                this.pullOutSound.play()
                this.explosionSound.stop()
                this.forcedExplode = false
                this.playerBomb.setVelocityX(0).setVisible(true).anims.play("bomb", true)
                this.playerBombOnScreen = true
                this.player.charstateThrowing = true
                this.bombExploded = false
                this.bombReposition = true
                this.playerBomb.x = this.player.x
                this.playerBomb.y = this.player.y - 16
                this.time.delayedCall(100, ()=>{
                    if(!this.forcedExplode){
                        this.throwSound.play()
                        if(!this.player.body.onFloor()){
                            this.player.charstateThrowing = false
                        }
                        
                        this.playerBomb.body.setGravityY(600);
                        if(!this.player.charstateRun){
                            if(this.player.facingLeft){
                                this.playerBomb.setVelocityX(-200)
                            }
                            else if(this.player.facingRight){
                                this.playerBomb.setVelocityX(200)
                            }
                        }
                        else if(this.player.charstateRun){
                            if(this.player.facingLeft){
                                this.playerBomb.setVelocityX(-300)
                            }
                            else if(this.player.facingRight){
                                this.playerBomb.setVelocityX(300)
                            }
                            
                        }
                        if(!this.player.body.onFloor()){
                                this.player.coyoteTime = true
                        }
                        this.time.delayedCall(200, ()=>{
                            this.player.charstateThrowing = false
                        })
                    }
                    else
                        this.player.charstateThrowing = false
                })
                
            }

            if(this.playerBombOnScreen && this.playerBomb.visible){
                this.player.abilityCooldown = true
            }
            else if ((!this.playerBombOnScreen && !this.playerBomb.visible) || !this.playerBomb.visible){
                this.player.abilityCooldown = false
                //this.playerBomb.bombExploded = false
                
            }

            if(this.playerBomb.bombExploded.visible && this.playerBomb.bombExploded){
                this.playerBomb.setVisible(false)
            }

            if(this.playerBomb.body.velocity.x == 0){
                this.playerBomb.setVelocityY(0)
                this.playerBomb.body.setGravityY(0);
            }

            //sound manager
            
            if(this.throwSound.isPlaying && this.pullOutSound.isPlaying){
                this.pullOutSound.stop()
            }
            if(this.jumpSound.isPlaying && this.throwSound.isPlaying){
                this.throwSound.stop()
            }
        }


        //victory manager

        
    }

    //victory
    victory(){
        if(this.boss.visible && !this.onVictory){
            this.onVictory = true
            this.boss.visible = false
            this.bossCol.active = false
            this.bossCol2.active = false
            //this.loopBossMusic.stop()
            
            this.time.delayedCall(1200, ()=>{
                this.player.charstateVictory = true
                if(!this.victoryJingle.isPlaying){
                    this.victoryJingle.play()
                }
                this.victoryJingle.on('complete', ()=>{
                    this.cameras.main.fadeOut(0, 0, 0, 0x000)
                    this.stageName = "stage3"
                    this.time.delayedCall(600, ()=>{
                        this.scene.launch("stageIntro", {
                            stageName: this.stageName
                        })
                        this.scene.stop("lifeSystem")
                        this.scene.stop("stage2")
                        
                    })
                })
            })
            
                
        }
    }

    playerHit(){
        
        if(((!this.player.upStun && !this.player.invAfterHit) && (this.player.body.onFloor() || !this.player.body.onFloor())) && !this.gameOver){
            this.player.upStun = true
            this.wallCount = 0
            let hp = this.registry.get('hp');
            this.registry.set('hp', (hp - 1));
            let hpChecking = this.registry.get('hp');
            this.hpCheck = hpChecking
            this.player.invAfterHit = true
            this.sound.play("hurt")
            this.gameOverHandler()
        };
            
        
    }
    //disc
    discInter(player, disc){
        this.sound.play("select")
        this.stagetrack.pause()
        this.disc.destroy()
        this.time.delayedCall(100, ()=>{
            this.cameras.main.fadeOut(0, 0, 0, 0x000)
        })

        this.registry.get('disc2Collected');
        this.registry.set('disc2Collected', true);

        let discsCollected = this.registry.get('discsCollected');
        this.registry.set('discsCollected', (discsCollected + 1));
        
        ////console.log("interaction")
        this.time.delayedCall(500, ()=>{

            this.scene.launch("discText", {
                stageName: this.stageName
            })
            this.cameras.main.fadeIn(0, 0, 0, 0x000)
            this.scene.pause('stage2')

        })
        
    }
    hitTile(playerBomb, tile) {
        if(this.playerBombOnScreen && tile && tile.collides){
            let hp = this.registry.get('hp');
            if(!this.forcedExplode && hp < 3){
                this.wallCount++
                ////console.log(this.wallCount)
            }
            this.forcedExplode = true
            
            // Remove the tile
            this.breakableWallLayer.removeTileAt(tile.x, tile.y);

            // Destroy the tile object itself to free memory
            tile.destroy(); 

            ////console.log("Tile destroyed at: " + tile.x + ", " + tile.y);

            if(this.explosionSound.isPlaying){
                this.explosionSound.stop()
            }
            if(!this.wallBreakSound.isPlaying){
                this.wallBreakSound.play()
            }
        }
    }
    hitTilePlayer(player, tile) {
        if(this.player.charstateAbility && this.player.body.onFloor()){
            let hp = this.registry.get('hp');
            if(hp < 3){
                this.wallCount++
            
            ////console.log(this.wallCount)  
            }
            
            // Remove the tile
            this.breakableWallLayer.removeTileAt(tile.x, tile.y);

            // Destroy the tile object itself to free memory
            tile.destroy(); 

            ////console.log("Tile destroyed at: " + tile.x + ", " + tile.y);
        
            if(this.explosionSound.isPlaying){
                this.explosionSound.stop()
            }
            if(!this.wallBreakSound.isPlaying){
                this.wallBreakSound.play()
            }
        }
    }

    wobbleTileDestroy(player, tile){
        if(!this.platCrackSound.isPlaying){
            this.platCrackSound.play()
        }
            this.time.delayedCall(500, ()=>{

                this.wobblePlatLayer.removeTileAt(tile.x, tile.y);
                //console.log("tile should be destroyed")
                tile.destroy(); 
                    
            })
        
    }
    gameOverHandler(){
        let hp = this.registry.get('hp');
        if(!this.gameOver && hp == 0){
            this.gameOver = true
            this.time.delayedCall (200, ()=>{
                this.gameOverJingle.play()
                this.time.delayedCall (1000, ()=>{
                    
                    this.scene.stop("lifeSystem")
                    this.cameras.main.fadeOut(0, 0, 0, 0x000)
                    this.time.delayedCall (2500, ()=>{
                        this.scene.launch("stageIntro", {
                            stageName: this.stageName
                        })
                        this.scene.stop('stage2')
                    })
                })
            })

        }
    }
}
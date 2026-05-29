import { TheFuckingTumor } from '../bosses/tumor.js';
import { PlayerBomb } from '../player/bomb_player.js';
import { Player } from '../player/player.js';

export class Stage1 extends Phaser.Scene{
    constructor(){
        super({key: "stage1"})
    }
    init(){
        this.bossLockCamera = false
        this.skiddSound
        this.jumpSound
        this.activeStomp = false
        this.playerBombOnScreen = false
        this.sprintDustRepos = true
        this.hpCheck = 3
        this.stageName = "stage1"
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
                    this.scene.pause('stage1')
                    this.stageTrack.pause()
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

        this.loopBossMusic = this.sound.add("boss")

        this.stageTrack = this.sound.add("stage1")

        this.sound.add("select")

        this.stageTrack.play()
        this.stageTrack.loop = true
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

        this.stage1Tilemap = this.add.tilemap('stage1Tilemap');

        const floorTile = this.stage1Tilemap.addTilesetImage("floor", "floor");
        const BCTile = this.stage1Tilemap.addTilesetImage("floor", "floor");
        const breakableWallTile = this.stage1Tilemap.addTilesetImage("breakableWall", "breakableWall");
        const spikeTile = this.stage1Tilemap.addTilesetImage("spike", "spike");


        const spawnPoint = this.stage1Tilemap.findObject("playerSpawn", obj => obj.name === "playerSpawn")

        

        const BCLayer = this.stage1Tilemap.createLayer("BackgroundDeco", BCTile)
        this.breakableWallLayer = this.stage1Tilemap.createLayer("breakableWall", breakableWallTile)
        const spikesLayer = this.stage1Tilemap.createLayer("spike", spikeTile);
        const floorLayer = this.stage1Tilemap.createLayer("platforms", floorTile)

        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        this.playerBomb = new PlayerBomb(this, 0, 0);
        this.playerBomb.anims.play("bomb", true).setVisible(false)
        
        // Activa colisión en todos los tiles excepto el vacío
        floorLayer.setCollisionByExclusion([-1]);
        spikesLayer.setCollisionByExclusion([-1]);
        this.breakableWallLayer.setCollisionByExclusion([-1]);
        // Convierte la capa en cuerpos físicos
        this.physics.add.collider(this.player, floorLayer);
        this.physics.add.collider(this.player, spikesLayer, this.playerHit, null, this);

        
        this.physics.add.collider(this.player, this.breakableWallLayer, this.hitTilePlayer, null, this)

        this.physics.add.collider(this.playerBomb, floorLayer)
        this.physics.add.collider(this.playerBomb, spikesLayer)
        this.physics.add.collider(this.playerBomb, this.breakableWallLayer, this.hitTile, null, this)
        this.physics.add.overlap(this.playerBomb, this.breakableWallLayer, this.hitTile, null, this)
        
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
        let discWasColected = this.registry.get('disc1Collected')
        
        if(discWasColected === true){
            this.discAppear = false
            console.warn("Disc 1 was already collected! Skipping...")
        }

        if(this.discAppear){
            this.discSpawn = this.physics.add.group()

            const discStageXY = this.stage1Tilemap.findObject("disc", obj => obj.name === "disc")
            this.disc = this.discSpawn.create(discStageXY.x, discStageXY.y, "disc1")
        
            this.physics.add.collider(this.player, this.disc, this.discInter, null, this)
        }

        //boss
        const tumor = this.stage1Tilemap.findObject("theFuckingTumor", obj => obj.name === "tumor_spawn")

        this.tumor = new TheFuckingTumor(this, tumor.x, tumor.y)
        
        this.bossColliderPlayer = this.physics.add.collider(this.player, this.tumor, this.playerHit, null, this)
        this.bossColliderBomb = this.physics.add.collider(this.playerBomb, this.tumor, this.bossHit, null, this)
    };
    update(/*delta*/){

        //updating music

        if(this.bossLockCamera && !this.loopBossMusic.isPlaying && !this.gameOver && !this.onVictory){
            
            this.stageTrack.stop()
            this.loopBossMusic.addMarker({
                name: 'loopPoint',
                start: 8.55, // Start playing from 5 seconds
                config: {
                    loop: true // Automatically loop within the marker
                }
            });

            this.loopBossMusic.play()
            
            this.loopBossMusic.on('complete', () => {
                this.loopBossMusic.play('loopPoint'); // Play again
            });
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
        //updating the tumor
        this.tumor.update(this.time)
        
        if(this.gameOver){
            this.physics.pause()
        }

        const camLock1 = this.stage1Tilemap.findObject("cameraLock", obj => obj.name === "camStart")
        const camLockBoss = this.stage1Tilemap.findObject("camBoss", obj => obj.name === "bossLock")
        const camLock2 = this.stage1Tilemap.findObject("camlock2", obj => obj.name === "camFinish")

        //camera rebounding
        if(!this.bossLockCamera && this.player.x < camLockBoss.x && this.player.x < 110){
            this.cameras.main.setBounds(0, camLock1.y, undefined, 16)

        }
        else if (this.player.x > 110 && this.player.x < camLockBoss.x && !this.bossLockCamera){
            this.cameras.main.setBounds(camLock1.x, camLock1.y, undefined, 16)

        }
        else if(this.player.x >= camLockBoss.x){

            this.cameras.main.setBounds(camLockBoss.x, camLockBoss.y, 16, 16)

            
            if(!this.bossLockCamera){
                this.bossLockCamera = true
            }
            
            
        }

        if((this.hpCheck == 0 || this.player.y > camLock2.y + 32) && !this.gameOver){
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

            if(this.keyA.isDown && (!this.cursors.down.isDown && !this.player.body.onFloor() || this.player.body.onFloor()) && !this.player.abilityCooldown && this.playerBomb.bombExploded && !this.player.charstateVictory){
    
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
                    else{
                        this.player.charstateThrowing = false
                    }
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


        if(!this.gameOver && !this.scene.isActive('pause') && !this.scene.isActive('discText') && !this.bossLockCamera && !this.onVictory){
            if(this.stageTrack.isPaused)
                this.stageTrack.resume()
        }

        if(this.scene.isActive('discText')){
            this.stageTrack.pause()
        }

        
    }

    victory(){
        if(this.tumor.tumorDeath && !this.onVictory){
            this.onVictory = true
            this.loopBossMusic.stop()
            this.time.delayedCall(900, ()=>{
                this.player.charstateVictory = true
                if(!this.victoryJingle.isPlaying){
                    this.victoryJingle.play()
                }
                this.victoryJingle.on('complete', ()=>{
                    this.cameras.main.fadeOut(0, 0, 0, 0x000)
                    this.stageName = "stage2"
                    this.time.delayedCall(600, ()=>{
                        this.scene.launch("stageIntro", {
                            stageName: this.stageName
                        })
                        this.scene.stop("lifeSystem")
                        this.scene.stop("stage1")
                        
                    })
                })
            })
                
        }
    }
    //boss hit
    bossHit(){
        if(!this.forcedExplode && this.tumor.tumorHP >= 0){

            this.sound.play("wallBreak")
            this.tumor.tumorHP--
            this.forcedExplode = true
        
            //console.log(this.tumor.tumorHP)
            this.bossColliderBomb.active = false
            this.bossColliderPlayer.active = false
            this.tumor.tumorHit = true


            this.time.delayedCall(100, ()=>{
                this.victory()
            })
            this.time.delayedCall(1000, ()=>{
                this.bossColliderBomb.active = true
                this.bossColliderPlayer.active = true
                this.tumor.tumorHit = false
                
            })
        }
    }
    //hit player

    playerHit(){
        
        if((!this.player.upStun && !this.player.invAfterHit) && (this.player.body.onFloor() || !this.player.body.onFloor())){
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
        this.stageTrack.pause()
        this.disc.destroy()
        this.time.delayedCall(100, ()=>{
            this.cameras.main.fadeOut(0, 0, 0, 0x000)
        })

        this.registry.get('disc1Collected');
        this.registry.set('disc1Collected', true);

        let discsCollected = this.registry.get('discsCollected');
        this.registry.set('discsCollected', (discsCollected + 1));
        
        this.time.delayedCall(500, ()=>{

            this.stageTrack.pause()
            this.scene.launch("discText", {
                stageName: this.stageName
            })
            this.cameras.main.fadeIn(0, 0, 0, 0x000)
            this.scene.pause('stage1')
            

        })
        
    }
    hitTile(playerBomb, tile) {
        if(this.playerBombOnScreen && tile && tile.collides){
            let hp = this.registry.get('hp');
            if(!this.forcedExplode && hp < 3){
                this.wallCount++
                //console.log(this.wallCount)
            }
            this.forcedExplode = true
            
            // Remove the tile
            this.breakableWallLayer.removeTileAt(tile.x, tile.y);

            // Destroy the tile object itself to free memory
            tile.destroy(); 

            //console.log("Tile destroyed at: " + tile.x + ", " + tile.y);

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
            
            //console.log(this.wallCount)  
            }
            
            // Remove the tile
            this.breakableWallLayer.removeTileAt(tile.x, tile.y);

            // Destroy the tile object itself to free memory
            tile.destroy(); 

            //console.log("Tile destroyed at: " + tile.x + ", " + tile.y);
        
            if(this.explosionSound.isPlaying){
                this.explosionSound.stop()
            }
            if(!this.wallBreakSound.isPlaying){
                this.wallBreakSound.play()
            }
        }
    }

    gameOverHandler(){
        
        let hp = this.registry.get('hp');
        if(!this.gameOver && hp == 0){
            this.gameOver = true
            this.loopBossMusic.stop()
            this.stageTrack.stop()
            this.time.delayedCall (200, ()=>{
                this.gameOverJingle.play()
                this.time.delayedCall (1000, ()=>{
                    
                    this.scene.stop("lifeSystem")
                    this.cameras.main.fadeOut(0, 0, 0, 0x000)
                    this.time.delayedCall (2500, ()=>{
                        this.scene.launch("stageIntro", {
                            stageName: this.stageName
                        })
                        this.scene.stop('stage1')
                    })
                })
            })

        }
    }
}
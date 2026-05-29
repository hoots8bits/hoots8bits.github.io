export class TheFuckingTumor extends Phaser.Physics.Arcade.Sprite {
    
    init(){
            this.tumorHP = 4
            this.tumorHit = false
            this.tumorDeath = false
            this.invPreventer = false
        }
    constructor(scene, x, y){
        
        super(scene, x, y, "tumor");
        this.init()

        scene.add.existing(this);
        scene.physics.add.existing(this);
        //console.log("the tumor ahh");
        //this.setCircle(4)
        
        this.body.setSize(54, 29);
        this.body.setOffset(5, 3)
        this.setImmovable(true);
        this.setVelocityX(0)
        this.setVelocityY(0)

        //console.log("The player's hitbox should be mesured to fit the sprites");
        //  Player physics properties. Give the little guy a slight bounce.
        this.debugBodyColor = 0xffff00;
        //console.log("Player's MISC configs should work now...");
    }
    update(time){

        //hp handler
        if(this.tumorHP < 0){
            this.tumorHP = 0
            
        }

        if(this.tumorHP == 0){
            this.tumorDeath = true
        }

        //anims

        if(!this.tumorDeath){
            if(!this.tumorHit){
                this.play("tumor_idle", true)

                
                this.flashing = false
                this.flashOn = false
                this.setAlpha(1)
                
                this.invPreventer = false
            }
            else if(this.tumorHit){
                this.play("tumor_hurt", true)
                this.invPreventer = true
            
                if(!this.flashing){
                    this.flashOn = true
                    this.flashing = true
                }
                
            
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
        }


        if(this.tumorDeath){
            this.anims.play("tumor_dead", true)
        }
        
        if(this.visible){
            if(!this.tumorHit){
                this.debugBodyColor = 0xff0000
            }
            else if(this.tumorHit){
                this.debugBodyColor = 0xffff00
            }
        }
        else if(!this.visible){
            this.debugBodyColor = 0xffffff
            this.body.setEnable(false)
        }
    }
}
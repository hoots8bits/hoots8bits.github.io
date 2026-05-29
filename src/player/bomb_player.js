export class PlayerBomb extends Phaser.Physics.Arcade.Sprite {
    
    init(){
            this.bombExploded = true
        }
    constructor(scene, x, y){
        
        super(scene, x, y, "bomb_hoots");
        this.init()

        scene.add.existing(this);
        scene.physics.add.existing(this);
        //console.log("Player's Bomb Created!");
        this.setCircle(4)
        this.setOffset(4, 4)




        //console.log("The player's hitbox should be mesured to fit the sprites");
        //  Player physics properties. Give the little guy a slight bounce.
        this.setBounce(1);
        this.body.setGravityY(600);
        this.debugBodyColor = 0xff0000;
        //console.log("Player's MISC configs should work now...");
    }
    update(time, forcedExplode, explosionSound){
        if(((this.body.blocked.left || this.body.blocked.right) || forcedExplode) && this.visible){
            this.play("bombExplote", true)
            this.body.setGravityY(0);
            this.setVelocityX(0)
            this.setVelocityY(0)
            if(!explosionSound.isPlaying){
                explosionSound.play()
            }
            
            
        }

        if(this.visible){
            this.debugBodyColor = 0xff0000
        }
        else if(!this.visible){
            this.debugBodyColor = 0x0000ff
        }
    }
}
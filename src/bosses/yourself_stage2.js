export class Boss extends Phaser.Physics.Arcade.Sprite {
    
    init(){
        this.visible = true
        }
    constructor(scene, x, y){
        
        super(scene, x, y, "bossStage2");
        this.init()

        scene.add.existing(this);
        scene.physics.add.existing(this);
        ////console.log("...");
        //this.setCircle(4)
        this.body.setSize(32, 48)
        this.body.setOffset(0, 0)
        
        this.setImmovable(true);
        this.setVelocityX(0)
        this.setVelocityY(0)

        //  Player physics properties. Give the little guy a slight bounce.
        this.debugBodyColor = 0xffff00;
    }
    update(stageName){
        if(stageName == "stage4"){
            this.play("stage4Boss_idle", true)
            this.setFlipX(true)
        }
        else if(stageName == "stage2"){
            this.play("stage2Boss_idle", true)
        }
    }
    
}
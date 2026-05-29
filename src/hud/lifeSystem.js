export class LifeSystem extends Phaser.Scene{
    constructor(){
        super({key:"lifeSystem"})
    }
    init(){
        this.hp = 3
        this.onePer = false
    }
    create(){
        this.heartsHUD = this.physics.add.group()

        this.heart1 = this.heartsHUD.create(32, 16, "heartHud")
        this.heart1.anims.play("heart_full", true)
        this.heart2 = this.heartsHUD.create(56, 16, "heartHud")
        this.heart2.anims.play("heart_full", true)
        this.heart3 = this.heartsHUD.create(80, 16, "heartHud")
        this.heart3.anims.play("heart_full", true)
    
        this.registry.set('hp', 3);

        this.registry.events.on('changedata-hp', (parent, value) => {
            if(value <= 0) {
                value = 0;
            }
                if(value >= 1){
                    this.heart1.anims.play("heart_full", true)
                }
                else{
                    this.heart1.anims.play("heart_broken", true)
                };
                if(value >= 2){
                    this.heart2.anims.play("heart_full", true)
                }
                else{
                    this.heart2.anims.play("heart_broken", true)
                };
                if(value >= 3){
                    this.heart3.anims.play("heart_full", true)
                }
                else{
                    this.heart3.anims.play("heart_broken", true)
                };
            } 
            
        );
    
    
    }
    /*update(){

    }*/
}
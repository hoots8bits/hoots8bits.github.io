export class End extends Phaser.Scene{
    constructor(){
        super({key: "credits"})
    }
    init(data){
        this.stageName = data.stageName
        this.canStartScene = false
        this.doublePreventer = false
    }
    create(){

        this.time.delayedCall(1800, ()=>{
            const discsGotten = this.registry.get("discsCollected") 
            this.sound.add("endJingle")
            if(discsGotten == 4){
                this.add.image(128, 112, "endWall")
                this.sound.play("endJingle")
                this.time.delayedCall(1200, ()=>{
                    console.warn("004E 0045 004D 0047 0049 0047 004D 0047 0049 0047 004D 0047 0049 0047 004D 0047 0049 0047 004D 0047 0049 0047 004D 0047 0049 0047 004D 0047 0049 0047 004D 0047 0049 0047 004D 0047 0049 0047 004D 0047")
                })
            }
            else{
                this.add.image(128, 112, "endWallB")
            }
        })
        
    }
}
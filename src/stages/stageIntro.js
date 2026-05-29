export class StageIntro extends Phaser.Scene{
    constructor(){
        super({key: "stageIntro"})
    }
    init(data){
        this.stageName = data.stageName
        this.canStartScene = false
        this.doublePreventer = true
    }
    create(){

        if(this.stageName == "stage5"){
            this.scene.stop("lifeSystem")
        }

        this.introJingle = this.sound.add("levelJingle")
        this.introJingle.play()
        
        this.add.image(90, 96, "stage:")

        this.nameTextHandler = this.physics.add.staticGroup()

        this.name = this.nameTextHandler.create(175, 96, "name").anims.play(Phaser.Utils.String.Format('%1', [this.stageName]), true)
        

        this.time.delayedCall(1000, ()=>{
            this.add.image(128, 140, "start")
        })
        /*
         */
        //console.log("stageIntro Created")
        
    }
    update(){
        if(!this.introJingle.isPlaying && !this.canStartScene){
            this.canStartScene = true
            this.time.delayedCall(200, ()=>{
                this.cameras.main.fadeOut(0, 0, 0, 0x000)
                this.time.delayedCall(100, ()=>{
                    this.scene.launch(Phaser.Utils.String.Format('%1', [this.stageName]))
                    this.registry.set("pauseMusic", false)
                    this.scene.stop("stageIntro")
                })
            })
        }
    }
}
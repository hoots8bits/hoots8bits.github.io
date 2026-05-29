export class Apparition extends Phaser.Scene{
    constructor(){
        super({key: "apparition"})
    }
    init(data){
        this.stageName = data.stageName
        this.canStartScene = false
        this.doublePreventer = false
    }
    create(){
        this.glitchSFX = this.sound.add("glitch")
        this.musicTrack = this.sound.add("stage1")
        this.musicTrack.play()
        this.musicTrack.loop = true
        this.add.image(128, 112, "thing1")
        this.aparition = this.add.image(123, 112, "thing2").setAlpha(0)
        this.input.keyboard.on('keydown-ENTER', () =>{
            if(!this.doublePreventer){
                this.doublePreventer = true
                alert("You made it a bit far, huh?")
                alert("Wanna play a chase game, Hoots?")
                alert("Silly question, you want to! After all, you will always be chased by reality. Make this interesting.")
                
                this.time.delayedCall(500, ()=>{
                    this.musicTrack.stop()
                    this.cameras.main.fadeOut(0, 0, 0, 0x000)
                    this.time.delayedCall(500, ()=>{
                        this.stageName = "stage4"
                        this.scene.launch("stageIntro", {
                            stageName: this.stageName
                        })
                        this.scene.stop("apparition")
                    })
                })
            }
        })       
        
    }
}
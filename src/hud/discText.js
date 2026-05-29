export class discText extends Phaser.Scene{
    constructor(){
        super({key: "discText"})
    }
    init(data){
        this.stageName = data.stageName
        this.doublePreventer = true
        this.minusRate = false
    }
    create(){

        /*
         */
        this.time.delayedCall(1000, ()=>{
            this.add.image(128, 112, Phaser.Utils.String.Format('disc_%1', [this.stageName]))
            this.doublePreventer = false
        })
        this.input.keyboard.on('keydown-ENTER', () =>
        {
            alert("This disc will now be on your hands, don't look for it anymore")
            if(!this.doublePreventer){
                this.doublePreventer = true
                this.cameras.main.fadeOut(0, 0, 0, 0x000)
                this.time.delayedCall(500, ()=>{
                    if(this.stageName == "stage4"){
                        this.stageName = "stage5"
                        this.scene.launch("stageIntro", {
                            stageName: this.stageName
                        })
                    }
        
                    else if(this.stageName == "stage3"){
                        this.scene.launch("apparition")
                        this.scene.stop("stage3")
                        this.scene.stop("lifeSystem")
                    }
                    else{
                        this.scene.resume(Phaser.Utils.String.Format('%1', [this.stageName]));
                    }
                    this.scene.stop("pause")
                    this.scene.stop('discText')
                })
                
            }
        });
    }
}
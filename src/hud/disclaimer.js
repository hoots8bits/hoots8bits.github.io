export class Disclaimer extends Phaser.Scene{
    constructor(){
        super({key: "disclaimer"})
    }
    init(){
        this.doublePreventer = false
    }
    create(){

        this.sound.add("select")
        const playButton = this.add.image(128, 112, 'disclaimer').setInteractive();

        playButton.on('pointerdown', () => {
            if(!this.doublePreventer){
                this.doublePreventer = true
                this.sound.play("select")
                this.time.delayedCall(500, ()=>{
                    this.cameras.main.fadeOut(0, 0, 0, 0x000)
                    this.time.delayedCall(500, ()=>{
                        this.scene.launch("title")
                        this.scene.stop("disclaimer")
                    })
                        
                })
            }
                
            
        });
        
    }
}
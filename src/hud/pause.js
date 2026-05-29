export class Pause extends Phaser.Scene{
    constructor(){
        super({key: "pause"})
    }
    init(data){
        this.stageName = data.stageName
    }
    create(){
        this.add.image(128, 112, "pauseText")

        this.input.keyboard.on('keydown-ENTER', () =>
        {

            this.scene.resume(Phaser.Utils.String.Format('%1', [this.stageName]));
            this.registry.set("pauseMusic", false)
            this.scene.stop('pause')
            
        });
    }
}
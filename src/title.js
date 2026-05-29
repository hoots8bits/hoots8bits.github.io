export class Title extends Phaser.Scene{
    constructor(){
        super({key:"title"})
    }
    init(){
        this.option1 = true
        this.usableKeys = true
        this.stageName = "stage1"
    }
    create(){

        //this is to prevent doubled items, etc.
        this.registry.get('discsCollected');
        this.registry.set('discsCollected', 0);

        this.registry.get('disc1Collected');
        this.registry.set('disc1Collected', false);
        this.registry.get('disc2Collected');
        this.registry.set('disc2Collected', false);
        this.registry.get('disc3Collected');
        this.registry.set('disc3Collected', false);
        this.registry.get('disc4Collected');
        this.registry.set('disc4Collected', false);


        this.sound.add("pullOut")
        this.sound.add("select")
        this.cursors = this.input.keyboard.createCursorKeys();

        this.loopTitleMusic = this.sound.add('title')

        this.loopTitleMusic.addMarker({
            name: 'loopPoint',
            start: 3.994, // Start playing from 5 seconds
            config: {
                loop: true // Automatically loop within the marker
            }
        });

        this.loopTitleMusic.play()
        
        this.loopTitleMusic.on('complete', () => {
            this.loopTitleMusic.play('loopPoint'); // Play again
        });


        this.add.image(128, 114, 'title')
        this.controlsIMG = this.add.image(128, 114, 'controls').setVisible(false)

        this.arrowMove = this.physics.add.group()
        this.arrow = this.arrowMove.create(64, 155, 'arrow')


        this.input.keyboard.on('keydown-ENTER', () =>
            {

                if(this.usableKeys){
                    this.sound.play("select")
                    this.usableKeys = false
                    if(!this.option1 && !this.controlsIMG.visible){
                        this.arrow.setAlpha(0)
                        this.controlsIMG.setVisible(true)
                        //console.log("visible")
                    }
                    
                    else if(this.option1){
                        this.loopTitleMusic.stop()
                        this.time.delayedCall(200, ()=>{
                            this.cameras.main.fadeOut(0, 0, 0, 0x000)
                            this.time.delayedCall(1000, ()=>{
                                this.scene.start("stageIntro", {
                                    stageName: this.stageName
                                })
                                this.scene.stop("title")
                            })
                        })
                    }
                }
                else if(this.controlsIMG.visible){
                        this.arrow.setAlpha(1)
                        this.controlsIMG.setVisible(false)
                        //console.log("not visible")
                        this.usableKeys = true
                    }
            })
     
    }
    update(){
        
        if(this.option1){
            this.arrow.y = 155
        }
        else if(!this.option1){
            this.arrow.y = 185
        }

        if(this.arrow.visible && !this.arrowFlashing){
            this.arrowFlashing = true
            this.time.delayedCall(200, ()=>{

                this.arrow.setVisible(false)
                this.time.delayedCall(200, ()=>{
                    this.arrow.setVisible(true)
                    this.arrowFlashing = false
                });
            })
        }

        if((this.cursors.down.isDown || this.cursors.up.isDown) && this.usableKeys){
            this.usableKeys = false
            this.sound.play("pullOut")
            if(this.option1){
                this.option1 = false
            }
            else if(!this.option1){
                this.option1 = true
            }
            this.time.delayedCall(200, ()=>{
                this.usableKeys = true
            })
        }
    }
}
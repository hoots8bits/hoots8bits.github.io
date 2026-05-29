export class Preloader extends Phaser.Scene{
    constructor(){
        super({key: "preloader"})
    }
    preload(){

        //disclaimer
        this.load.image('disclaimer', 'assets/disclaimer.png')


        //title
        this.load.image('title', 'assets/title/title.png')
        this.load.image('controls', 'assets/title/controls.png')
        this.load.image('arrow', 'assets/title/arrow.png')
        //intro screen

        this.load.image('stage:', 'assets/startScreen/stage.png')
        this.load.image('start', 'assets/startScreen/start.png')
        this.load.spritesheet('names', 'assets/startScreen/names.png', {frameWidth: 96, frameHeight: 16});
        
        this.load.animation("namesHandler", "assets/startScreen/names.json")

        //stage1
        this.load.pack("stage1Tiles", "assets/stage1/tiles.json")
        this.load.tilemapTiledJSON("stage1Tilemap", "leveldata/stage1.json");
        this.load.spritesheet('tumor', 'assets/stage1/tumor.png', {frameWidth: 64, frameHeight: 32});

        this.load.animation("tumorBoss", "assets/stage1/boss.json")

        //stage2

        this.load.pack("stage2Tiles", "assets/stage2/tiles.json")
        this.load.tilemapTiledJSON("stage2Tilemap", "leveldata/stage2.json");

        this.load.spritesheet('bossStage2', 'assets/stage2/null.png', {frameWidth: 32, frameHeight: 48});
        this.load.animation("bossStage2Anims", "assets/stage2/boss.json")

        //stage3
        this.load.pack("stage3Tiles", "assets/stage3/tiles.json")
        this.load.tilemapTiledJSON("stage3Tilemap", "leveldata/stage3.json");

        //stage4
        this.load.pack("stage4Tiles", "assets/stage4/tiles.json")
        this.load.tilemapTiledJSON("stage4Tilemap", "leveldata/stage4.json");
        
        this.load.spritesheet('bossStage4', 'assets/stage4/null.png', {frameWidth: 32, frameHeight: 48});
        this.load.animation("bossStage4Anims", "assets/stage4/boss.json")

        this.load.image('flood', 'assets/stage4/flood.png')
        //stage5
        this.load.pack("stage5Tiles", "assets/stage5/tiles.json")
        this.load.tilemapTiledJSON("stage5Tilemap", "leveldata/stage5g.json");

        
        //misc
        this.load.pack("sfx", "audio/sfx/sfx.json")
        this.load.pack("music", "audio/music/music.json")
        this.load.spritesheet('bomb_hoots', 'assets/player/bomb.png', {frameWidth: 16, frameHeight: 16})
        this.load.spritesheet('effects_hoots', 'assets/player/dusts.png', {frameWidth: 16, frameHeight: 16})


        this.load.spritesheet("heartHud", "assets/global/hearts.png", {frameWidth: 16, frameHeight: 16})
        this.load.spritesheet('objectHearts', 'assets/global/objects.png', {frameWidth: 16, frameHeight: 16})

        this.load.animation("globalObj", "assets/global/global.json")
        //this.load.font('pixelFont', 'assets/font/Pixeled.ttf')
        
        this.load.spritesheet('hoots', 'assets/player/hoots.png', {frameWidth: 16, frameHeight: 16});
        this.load.animation('hootsAnims', 'assets/player/player.json')
    
        this.load.image('pauseText', 'assets/global/pauseText.png')
    
        this.load.image('disc_stage1', 'assets/discTextWalls/disc1.png')
        this.load.image('disc_stage2', 'assets/discTextWalls/disc2.png')
        this.load.image('disc_stage3', 'assets/discTextWalls/disc3.png')
        this.load.image('disc_stage4', 'assets/discTextWalls/disc4.png')
        this.load.image('thing1', 'assets/discTextWalls/thing1.png')
        this.load.image('thing2', 'assets/discTextWalls/thing2.png')

        this.load.image('endWall', 'assets/discTextWalls/end.png')
        this.load.image('endWallB', 'assets/discTextWalls/endB.png')

    }
    create(){
        this.scene.launch("disclaimer")
    }
}
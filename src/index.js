import { Apparition } from './hud/apparition.js';
import { Disclaimer } from './hud/disclaimer.js';
import { discText } from './hud/discText.js';
import { End } from './hud/end.js';
import { LifeSystem } from './hud/lifeSystem.js';
import { Pause } from './hud/pause.js';
import { Preloader } from './preloader.js'
import { Stage1 } from './stages/stage1.js';
import { Stage2 } from './stages/stage2.js';
import { Stage3 } from './stages/stage3.js';
import { Stage4 } from './stages/stage4.js';
import { Stage5 } from './stages/stage5.js';
import { StageIntro } from './stages/stageIntro.js';
import { Title } from './title.js';



const config = {
    type: Phaser.AUTO,
    scale: {
		mode: Phaser.Scale.FIT,
		parent: 'game_container',
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 256,
        height: 224,
	},
    audio: {
        pauseOnBlur: false // Prevents audio from pausing when an alert pops up
    },
    pixelArt: true,
    scene: [Preloader, Disclaimer, Title, Stage1, Stage2, Stage3, Stage4, Stage5, End, Apparition, LifeSystem, StageIntro, /*unmovable*/ Pause, discText],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
};

var game = new Phaser.Game(config);
game.canvas.style.cursor = 'default';
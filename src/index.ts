import { Game, AUTO, Scene } from 'phaser';
import * as imageAssets from './assets/*.png';
import * as jsonAssets from './assets/*.json';
import { MenuScene } from './menuScene';
import { GameScene } from './gameScene';

class InitScene extends Scene {
  preload() {
    for (const [name, path] of Object.entries(imageAssets)) {
      this.load.image(name, path as string);
      console.log(path, '->', name);
    }
    for (const [name, path] of Object.entries(jsonAssets)) {
      this.load.tilemapTiledJSON(name, path as string);
      console.log('loaded', path, '->', name);
    }
  }

  create() {
    this.scene.start('GameScene');
  }
}

const config = {
  type: AUTO,
  width: 800,
  height: 400,
  parent: 'game-container',
  physics: {
    default: 'impact',
    impact: {
      gravity: 400
    }
    
  },
  scene: [InitScene, MenuScene, GameScene]
};

const gameContainer = document.getElementById(config.parent)!;
const game = new Game(config);

declare const module: any;

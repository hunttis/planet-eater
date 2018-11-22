import { Game, AUTO, Scene } from 'phaser';
import * as imageAssets from './assets/*.png';
import * as spriteSheetAssets from './assets/spritesheets/*.png';
import * as jsonAssets from './assets/*.json';
import { MenuScene } from './menuScene';
import { GameScene } from './gameScene';
import GameScalePlugin from 'phaser-plugin-game-scale';

class InitScene extends Scene {
  preload() {
    for (const [name, path] of Object.entries(imageAssets)) {
      this.load.image(name, path as string);
      console.log(path, '->', name);
    }
    for (const [name, path] of Object.entries(spriteSheetAssets)) {
      this.load.spritesheet(name, path as string, { frameWidth: 16, frameHeight: 16 });
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

const gameScalePgin: PluginObject = {
  global: [{
    key: 'GameScalePlugin',
    plugin: GameScalePlugin,
    mapping: 'gameScale',
    data: {/* See 'Configuration'*/ }
  }]
}

const config: GameConfig = {
  type: AUTO,
  width: 800,
  height: 400,
  parent: 'game-container',
  render: {
    antialias: false
  },
  physics: {
    default: 'impact',
    impact: {
      gravity: 400
    }

  },
  scene: [InitScene, MenuScene, GameScene],
  plugins: gameScalePgin,
};

if (module.hot) {
  module.hot.dispose(function () {
    window.location.reload();
  });
}

const gameContainer = document.getElementById(config.parent as string)!;
const game = new Game(config);

declare const module: any;

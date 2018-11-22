import { Enemy } from './enemy';
import { Scene } from 'phaser';
import { GameScene } from '~/gameScene';

export class Fighter extends Enemy {

  ySpeed: number;
  bufferSize: number = 20;
  health: number = 100;

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y);
    this.ySpeed = 2 + Math.random() * 2 - 4;
  }

  update() {
    super.update();

    if (!this.active) {
      return;
    }

    this.x -= 2;
    this.y += this.ySpeed;

    if (this.y > (this.scene.game.config.height as number - this.bufferSize) || this.y < this.bufferSize) {
      this.ySpeed = -this.ySpeed;
    }

    if (this.x < -10) {
      this.destroy();
    }

    const center = this.getCenter();
    if (center.x > 0) {
      const currentTile = this.scene.getTileAtXY(center.x, center.y);
      if (currentTile != null) {
        this.scene.destroyTileAtXY(center.x, center.y);
        this.destroy();
      }
    }


  }

}
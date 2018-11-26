import { Enemy } from './enemy';
import { GameObjects, Scene } from 'phaser';
import { GameScene } from '~/gameScene';
import { FighterAmmo } from '~/ammo/fighterammo';

export class Scout extends Enemy {

  ammo: GameObjects.Group;
  ySpeed: number;
  bufferSize: number = 20;
  health: number = 30;

  constructor(scene: GameScene, x: number, y: number, ammo: GameObjects.Group) {
    super(scene, x, y, 'fighter');
    this.scaleX = 1;
    this.scaleY = 0.5;
    this.ySpeed = 2 + Math.random() * 2 - 4;
    this.ammo = ammo;
  }

  update() {
    super.update();

    if (!this.active) {
      return;
    }

    this.x -= 3;
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
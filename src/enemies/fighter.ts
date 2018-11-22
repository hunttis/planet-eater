import { Enemy } from './enemy';
import { GameObjects, Scene } from 'phaser';
import { GameScene } from '~/gameScene';
import { FighterAmmo } from '~/ammo/fighterammo';

export class Fighter extends Enemy {

  ammo: GameObjects.Group;
  ySpeed: number;
  bufferSize: number = 20;
  health: number = 100;
  originalCooldownValue: number = 5000;
  cooldown: number = this.originalCooldownValue;

  constructor(scene: GameScene, x: number, y: number, ammo: GameObjects.Group) {
    super(scene, x, y);
    this.ySpeed = 2 + Math.random() * 2 - 4;
    this.ammo = ammo;
  }

  update() {
    super.update();

    if (!this.active) {
      return;
    }

    this.cooldown -= this.scene.sys.game.loop.delta;
    if (this.cooldown < 0) {
      this.fire();
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

  fire(): void {
    this.cooldown = this.originalCooldownValue;
    const direction = new Phaser.Math.Vector2(-1, 0);
    const shot = new FighterAmmo(this.scene, this.x - 10, this.y - 10, direction);
    this.ammo.add(shot, true);
  }

}
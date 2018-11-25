import { Ammo } from './ammo';
import { Enemy } from "~/enemies/enemy";
import { GameScene } from "~/gameScene";

export class BlobAmmo extends Ammo {
  speed: number = 4;
  damage: number = 40;

  constructor(scene: GameScene, x: number, y: number, target: Enemy, texture: string = 'cannons', frame: number = 0) {
    super(scene, x, y, target, 'blobshot');
  }

  update() {
    super.update()
    this.anims.play('blobby', true);
    const myCenter = this.getCenter();
    const targetCenter = this.target.getCenter();

    if (targetCenter.x < myCenter.x) {
      this.x -= Math.min(this.speed, Math.abs(targetCenter.x - myCenter.x));
    }
    else {
      this.x += Math.min(this.speed, Math.abs(targetCenter.x - myCenter.x));
    }
    if (targetCenter.y < myCenter.y) {
      this.y -= Math.min(this.speed, Math.abs(targetCenter.y - myCenter.y));
    }
    else {
      this.y += Math.min(this.speed, Math.abs(targetCenter.y - myCenter.y));
    }

    const distanceToTarget = Phaser.Math.Distance.Between(
      myCenter.x,
      myCenter.y,
      targetCenter.x,
      targetCenter.y)

    if (distanceToTarget < 5) {
      this.target.damage(this.damage);
      this.scene.sparkEffect(myCenter.x, myCenter.y);
      this.destroy();
    }
  }
}
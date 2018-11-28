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
    
    const vectorToEnemy: Phaser.Math.Vector2 = new Phaser.Math.Vector2(myCenter.x - targetCenter.x, myCenter.y - targetCenter.y).normalize();

    this.x -= vectorToEnemy.x * this.speed;
    this.y -= vectorToEnemy.y * this.speed;

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

    if (this.active && (!this.target || !this.target.active)) {
      this.scene.effects.bubbleEffect(myCenter.x, myCenter.y);
      this.destroy();
    }
  }
}
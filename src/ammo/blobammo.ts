import { Ammo } from './Ammo';

export class BlobAmmo extends Ammo {
  speed: number = 5;
  damage: number = 40;

  update() {
    super.update()
    const myCenter = this.getCenter();
    const targetCenter = this.target.getCenter();

    if (targetCenter.x < myCenter.x) {
      this.x -= this.speed;
    }
    else {
      this.x += this.speed;
    }
    if (targetCenter.y < myCenter.y) {
      this.y -= this.speed;
    }
    else {
      this.y += this.speed;
    }

    const distanceToTarget = Phaser.Math.Distance.Between(
      myCenter.x,
      myCenter.y,
      targetCenter.x,
      targetCenter.y)

    if (distanceToTarget < 5) {
      this.target.damage(this.damage);
      this.scene.explodeEffect(myCenter.x, myCenter.y);
      this.destroy();
    }
  }
}
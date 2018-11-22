import { EnemyAmmo } from './enemyammo'

export class FighterAmmo extends EnemyAmmo {
  speed: number = 5;

  update() {
    super.update();
    this.direction = this.direction.normalize();
    this.x += this.direction.x * this.speed
    this.y += this.direction.y * this.speed
    const tile = this.scene.getTileAtXY(this.getCenter().x, this.getCenter().y);

    if (tile) {
      const cannon = this.scene.getCannonOnTile(tile);
      if (cannon) {
        this.scene.explodeEffect(this.getCenter().x, this.getCenter().y);
        cannon.destroy();
        this.destroy();
      }
    }
  }
}
import { EnemyAmmo } from './enemyammo'

export class FighterAmmo extends EnemyAmmo {
  speed: number = 5;

  update() {
    super.update();
    this.direction = this.direction.normalize();
    this.x += this.direction.x * this.speed
    this.y += this.direction.y * this.speed
  }
}
import { EnemyAmmo } from './enemyammo'
import { GameScene } from '~/gameScene';
import { GameObjects } from 'phaser';

export class FighterAmmo extends EnemyAmmo {
  speed: number = 5;
  particles!: GameObjects.Particles.ParticleEmitterManager;

  update() {
    super.update();
    this.direction = this.direction.normalize();
    this.x += this.direction.x * this.speed
    this.y += this.direction.y * this.speed
    const tile = this.scene.getTileAtXY(this.getCenter().x, this.getCenter().y);

    if (tile) {
      const cannon = this.scene.getCannonOnTile(tile);
      if (cannon) {
        if (Math.random() < 0.05) { 
          this.scene.explodeEffect(this.getCenter().x, this.getCenter().y);
        }
        cannon.destroy();
        this.destroy();
      }
    }

    if (this.x < this.width) {
      this.destroy();
    }
  }
}
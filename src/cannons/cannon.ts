import { GameObjects } from "phaser";
import { Ammo } from '../ammo/ammo';

export class Cannon extends GameObjects.Sprite {

  target: GameObjects.Sprite | null = null;
  ammo!: GameObjects.Group;

  targetEnemy(closestEnemy: GameObjects.Sprite, distance: number): any {
    if (this.target === null || !this.target.active) {
      this.target = closestEnemy;
      console.log('Took target!');
    } else if (closestEnemy !== null && this.target !== closestEnemy && distance < this.distanceToTarget()) {
      this.target = closestEnemy;
      console.log('Changed target!');
    }
  }

  distanceToTarget(): number {
    return this.target === null ? 100000 : Phaser.Math.Distance.Between(this.target.x, this.target.y, this.x, this.y);
  }

}



import { GameObjects } from "phaser";
import { Ammo } from '../ammo/ammo';
import { Enemy } from "~/enemies/enemy";

export class Cannon extends GameObjects.Sprite {

  target: Enemy | null = null;
  ammo!: GameObjects.Group;

  targetEnemy(closestEnemy: Enemy, distance: number): any {
    if (this.target === null || !this.target.active) {
      this.target = closestEnemy;
    } else if (closestEnemy !== null && this.target !== closestEnemy && distance < this.distanceToTarget()) {
      this.target = closestEnemy;
    }
  }

  distanceToTarget(): number {
    return this.target === null ? 100000 : Phaser.Math.Distance.Between(this.target.x, this.target.y, this.x, this.y);
  }

}



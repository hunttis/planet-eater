import { GameObjects, Scene } from "phaser";

export class Ammo extends GameObjects.Sprite {

  target: GameObjects.Sprite | null = null;

  constructor(scene: Scene, x: number, y: number, target: GameObjects.Sprite) {
    super(scene, x, y, 'cannons', 0);
    this.target = target;
  }

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



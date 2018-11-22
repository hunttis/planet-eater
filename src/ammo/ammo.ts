import { GameObjects, Scene } from "phaser";
import { Enemy } from "~/enemies/enemy";
import { GameScene } from "~/gameScene";

export class Ammo extends GameObjects.Sprite {

  target: Enemy;
  scene: GameScene;

  constructor(scene: GameScene, x: number, y: number, target: Enemy) {
    super(scene, x, y, 'cannons', 0);
    this.scene = scene;
    this.target = target;
  }

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



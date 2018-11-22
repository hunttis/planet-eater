import { GameObjects, Scene } from "phaser";

export class EnemyAmmo extends GameObjects.Sprite {

  direction: Phaser.Math.Vector2;
  
  constructor(scene: Scene, x: number, y: number, direction: Phaser.Math.Vector2) {
    super(scene, x, y, 'cannons', 0);
    this.direction = direction;
  }
}
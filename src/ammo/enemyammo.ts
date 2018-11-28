import { GameObjects } from "phaser";
import { GameScene } from "~/gameScene";

export class EnemyAmmo extends GameObjects.Sprite {

  direction: Phaser.Math.Vector2;
  scene: GameScene;

  constructor(scene: GameScene, x: number, y: number, direction: Phaser.Math.Vector2, texture: string = 'cannons', frame: number = 0) {
    super(scene, x, y, 'missile', 0);
    this.scene = scene;
    this.direction = direction;
    this.depth = 12;
  }
}
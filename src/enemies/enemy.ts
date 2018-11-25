import { GameObjects, Scene } from "phaser";
import { GameScene } from "~/gameScene";

export class Enemy extends GameObjects.Sprite {

  health: number = 100;
  scene: GameScene;

  constructor(scene: GameScene, x: number, y: number, texture: string = 'cannons', frame: number = 1) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    console.log('created');
  }

  damage(amount: number) {
    this.health -= amount;
  }

  update() {
    super.update();
    if (this.health <= 0) {
      this.scene.explodeEffect(this.getCenter().x, this.getCenter().y);
      this.destroy();
    }
  }

}
import { GameObjects, Scene } from "phaser";

export class Enemy extends GameObjects.Sprite {

  health: number = 100;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'cannons', 1);
    console.log('created');
  }

  damage(amount: number) {
    this.health -= amount;
  }

  update() {
    super.update();
    if (this.health <= 0) {
      this.destroy();
    }
  }

}
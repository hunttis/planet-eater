import { GameObjects, Scene } from "phaser";

export class Enemy extends GameObjects.Sprite {

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'cannons', 1);
    console.log('created');
  }

}
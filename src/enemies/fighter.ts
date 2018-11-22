import { Enemy } from './enemy';
import { Scene } from 'phaser';

export class Fighter extends Enemy {

  ySpeed: number;
  bufferSize: number = 20;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    this.ySpeed = 2 + Math.random() * 2 - 4;
  }

  update() {
    this.x -= 2;
    this.y += this.ySpeed;

    if (this.y > (this.scene.game.config.height as number - this.bufferSize) || this.y < this.bufferSize) {
      this.ySpeed = -this.ySpeed;
    }


    if (this.x < -10) {
      this.destroy();
    }
    
    super.update();
  }

}
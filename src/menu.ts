import { Scene } from 'phaser';

export class MenuScene extends Scene {
  constructor() {
    super('Menu');
  }

  create() {
    this.add.sprite(100, 100, 'bear');
    this.add.sprite(300, 200, 'buffalo');
  }

  update() {}
}

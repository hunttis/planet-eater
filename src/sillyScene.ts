import { Game, AUTO, Scene, GameObjects, Geom, Physics } from 'phaser';

export class SillyScene extends Scene {
  bearSprite!: GameObjects.Sprite;
  buffaloSprite!: GameObjects.Sprite;
  physicalBear!: Physics.Impact.ImpactSprite;
  buffaloContainer!: GameObjects.Container;

  constructor() {
    super('SillyScene');
  }

  create() {
    this.add.text(50, 50, 'Ololoo bear bufalo');
    this.impact.world.setBounds(0, 0, 800, 600);

    this.bearSprite = this.add.sprite(100, 200, 'bear');
    
    this.buffaloSprite = this.add.sprite(0, 0, 'buffalo');
    this.buffaloContainer = this.add.container(400, 300);
    this.buffaloContainer.add(this.buffaloSprite);
    this.buffaloContainer.add(this.add.text(50, 20, 'Ammuuu'));

    this.tweens.add({
      targets: this.buffaloContainer,
      scaleX: 0.1,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    this.physicalBear = this.impact.add.sprite(100, 200, 'bear');
    this.physicalBear.setVelocity(100, 200);
    this.physicalBear.setBounce(1);
    this.physicalBear.setGravity(0);
    this.physicalBear.setActiveCollision();


  }

  i = 0;
  update() {
    this.bearSprite.setRotation(this.bearSprite.rotation + 0.1);
    this.buffaloContainer.setRotation(this.buffaloContainer.rotation - 0.05);

    this.i++;
    if (this.i % 10 === 0) {
      this.buffaloSprite.setTint(
        Math.random() * 0xff0011,
        Math.random() * 0xff0011,
        Math.random() * 0xff0011,
        Math.random() * 0xff0011
      );
    }

    if (this.bearSprite.x + this.bearSprite.width > this.cameras.main.width) {
      this.bearSprite.x -= 1;
    } else {
      this.bearSprite.x += 1;
    }
  }
}

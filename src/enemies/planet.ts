import { GameObjects, Scene } from "phaser";
import { GameScene } from "~/gameScene";

export class Planet extends GameObjects.Sprite {

  scene: GameScene;

  PLANET_SPEED: number = 0.5;
  planetState: string = 'traveling';

  constructor(scene: GameScene, x: number, y: number, ) {
    super(scene, x, y, 'planet');
    this.scene = scene;
    this.tint = new Phaser.Display.Color().random(50).color;
    this.scaleX = 2.0;
    this.scaleY = 2.0;
    this.depth = 10;
    this.planetState = 'traveling';
  }

  update() {
    super.update();

    if (this.planetState === 'traveling') {
      this.x -= this.PLANET_SPEED;
      if (this.x < 340) {
        this.planetState = 'starting consumption';
        this.scene.splashEffect(340 - 64, 160, 340 - 64, Number(this.scene.game.config.height) - 132);
      }

    } else if (this.planetState === 'starting consumption') {
      this.scene.getMeltEmitter().start();
      this.scene.getMeltEmitter().startFollow(this);

      this.scene.getMeltEmitter().setEmitZone({
        source: new Phaser.Geom.Circle(0, 0, 64),
        type: 'random',
        quantity: 100})
      this.x -= this.PLANET_SPEED / 4;
      this.planetState = 'getting consumed';

    } else if (this.planetState === 'getting consumed') {
      this.x -= this.PLANET_SPEED / 4;
      if (this.x < 200) {
        this.planetState = 'start melting';
      }

    } else if (this.planetState === 'start melting') {
      this.scene.tweens.add({
        targets: this,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 2000,
      });
      this.planetState = 'melting';

    } else if (this.planetState = 'melting') {
      this.scene.getMeltEmitter().setEmitZone({
        source: new Phaser.Geom.Circle(0, 0, 64 * this.scaleX),
        type: 'random',
        quantity: 100
      });
      if (this.scaleX === 0) {
        this.scene.getMeltEmitter().stop();
        this.planetState = 'done';
      }
    }
  }

  getState() {
    return this.planetState;
  }

}
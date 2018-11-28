import { GameScene } from "./gameScene";
import { Scene, GameObjects, Input, Tilemaps } from 'phaser';

export class Effects {

  scene: GameScene;

  particles!: GameObjects.Particles.ParticleEmitterManager;
  bubbleparticles!: GameObjects.Particles.ParticleEmitterManager;

  bubbleEmitter!: GameObjects.Particles.ParticleEmitter;
  blueAfterBurnerEmitter!: GameObjects.Particles.ParticleEmitter;
  redAfterBurnerEmitter!: GameObjects.Particles.ParticleEmitter;
  cannonBuildEmitter!: GameObjects.Particles.ParticleEmitter;
  explosionEmitter!: GameObjects.Particles.ParticleEmitter;
  sparkEmitter!: GameObjects.Particles.ParticleEmitter;
  splashEmitter!: GameObjects.Particles.ParticleEmitter;
  planetMeltEmitter!: GameObjects.Particles.ParticleEmitter;

  constructor(scene: GameScene) {
    this.scene = scene;
    this.particles = this.scene.add.particles('star');
    this.bubbleparticles = this.scene.add.particles('bubbles');
    this.initEmitters();

  }

  initEmitters() {

    this.bubbleEmitter = this.bubbleparticles.createEmitter({
      lifespan: 2000,
      gravityX: -300, tint: 0x00aa00,
      scale: { start: 3, end: 0 },
      frame: {frames: [0, 1, 2, 3, 4, 5, 6]},
      speedX: {min: -100, max: 100},
      speedY: {min: -100, max: 100},
    });
    this.bubbleEmitter.stop();

    this.blueAfterBurnerEmitter = this.particles.createEmitter({
      lifespan: 200, scale: { start: 1, end: 0 },
      tint: [0x3333ff, 0x0033ff],
      gravityX: 300,
      speedX: {min: 100, max: 300},
      speedY: {min: -100, max: 100},
    });
    this.blueAfterBurnerEmitter.stop();

    this.redAfterBurnerEmitter = this.particles.createEmitter({
      lifespan: 200, scale: { start: 1, end: 0 },
      tint: [0xdd5500, 0xff3300],
      gravityX: -100,
      speedX: {min: 100, max: 300},
      speedY: {min: -100, max: 100},
    });
    this.redAfterBurnerEmitter.stop();

    this.cannonBuildEmitter = this.particles.createEmitter({
      lifespan: 200, speed: 200, scale: { start: 1, end: 0 }, quantity: 100,
      tint: 0x00dd00
    });
    this.cannonBuildEmitter.stop();

    this.explosionEmitter = this.particles.createEmitter({
      lifespan: {min: 300, max: 750},
      speed: {min: 100, max: 200},
      scale: { start: 1, end: 0 },
      tint: {min: 0xdd0000, max: 0xff0000}
    });
    this.explosionEmitter.stop();

    this.sparkEmitter = this.particles.createEmitter({
      lifespan: {min: 100, max: 300},
      speed: {min: 100, max: 200},
      scale: { start: 1, end: 0 },
      tint: {min: 0xffff00, max: 0xffff55}
    });
    this.sparkEmitter.stop();

    this.planetMeltEmitter = this.bubbleparticles.createEmitter({
      speed: 100,
      scale: { start: 3, end: 0 },
    });
    this.bubbleparticles.depth = 101;
    this.planetMeltEmitter.stop();

    this.splashEmitter = this.bubbleparticles.createEmitter({
      lifespan: 2000,
      gravityX: 50, tint: 0x00aa00,
      scale: { start: 3, end: 0 },
      frame: {frames: [0, 1, 2, 3, 4, 5, 6]},
      speedX: {min: 0, max: 50},
      speedY: {min: -100, max: 100},
    });
    this.splashEmitter.stop();
  }

  explodeBubbles(x: number, y: number) {
    this.bubbleEmitter.explode(50, x, y);
  }

  redAfterBurner(x: number, y: number) {
    this.redAfterBurnerEmitter.explode(1, x, y);

  }

  blueAfterBurner(x: number, y: number) {
    this.blueAfterBurnerEmitter.explode(1, x, y)
  }

}
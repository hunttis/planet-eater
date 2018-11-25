import { Scene, GameObjects, Input, Tilemaps } from 'phaser';
import { Cannon } from './cannons/cannon';
import { BlobCannon } from './cannons/blobcannon';
import { Ammo } from './ammo/ammo'
import { Fighter } from './enemies/fighter';
import buildMP3 from  './assets/audio/buildcannon.mp3';
import buildOGG from './assets/audio/buildcannon.ogg';
import buildWAV from './assets/audio/buildcannon.wav';
import { EnemyAmmo } from './ammo/enemyammo';
import { Enemy } from './enemies/enemy';
import musicMP3 from  './assets/audio/planeteater.mp3';
import musicOGG from './assets/audio/planeteater.ogg';

export class GameScene extends Scene {
  cursors!: Input.Keyboard.CursorKeys;
  playerLocText!: GameObjects.Text;
  starfield!: GameObjects.Group;
  bgBox!: Phaser.Geom.Rectangle;
  enemySpawnBox!: Phaser.Geom.Rectangle;
  blobMap!: Phaser.Tilemaps.Tilemap;
  tileCursor!: GameObjects.Sprite;
  cannons: Array<Cannon> = [];
  ammo!: GameObjects.Group;
  enemyAmmo!: GameObjects.Group;
  enemies!: GameObjects.Group;

  enemyCooldown: number = 1000;

  starCount: number = 10;
  particles!: GameObjects.Particles.ParticleEmitterManager;
  bubbleparticles!: GameObjects.Particles.ParticleEmitterManager;
  
  buildCannonSound!: Phaser.Sound.BaseSound;
  bubbleEmitter!: GameObjects.Particles.ParticleEmitter;
  blueAfterBurnerEmitter!: GameObjects.Particles.ParticleEmitter;
  redAfterBurnerEmitter!: GameObjects.Particles.ParticleEmitter;
  music!: Phaser.Sound.BaseSound;
  cannonBuildEmitter!: GameObjects.Particles.ParticleEmitter;
  explosionEmitter!: GameObjects.Particles.ParticleEmitter;
  sparkEmitter!: GameObjects.Particles.ParticleEmitter;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.bgBox = new Phaser.Geom.Rectangle(0, 0, Number(this.game.config.width), Number(this.game.config.height));
    this.enemySpawnBox = new Phaser.Geom.Rectangle(Number(this.game.config.width) + 8, 100, Number(this.game.config.width) + 16, Number(this.game.config.height)- 100);
    const result = this.load.audio('buildcannon', [buildMP3, buildOGG, buildWAV]);
    console.log('AUDIO', result);
    this.load.audio('planeteater', [musicMP3, musicOGG]);
  }

  create() {
    this.impact.world.setBounds();

    this.starfield = this.add.group({ key: 'star', frameQuantity: this.starCount });
    Phaser.Actions.RandomRectangle(this.starfield.getChildren(), this.bgBox);

    this.blobMap = this.loadAndCreateMap();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.tileCursor = this.add.sprite(0, 0, 'cursor', 0);
    this.tileCursor.setOrigin(0, 0);
    this.ammo = this.add.group();
    this.enemies = this.add.group();
    this.particles = this.add.particles('star');
    this.bubbleparticles = this.add.particles('bubbles');
    
    this.enemyAmmo = this.add.group();

    this.buildCannonSound = this.sound.add('buildcannon');
    this.music = this.sound.add('planeteater');
    this.music.play('', {loop: true});

    const blobbyConfig = {
      key: 'blobby',
      frames: this.anims.generateFrameNumbers('blobshot', {frames: [0, 1, 2, 3, 4, 5, 6]}),
      frameRate: 10,
      repeat: -1
    }
    this.anims.create(blobbyConfig);

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
      gravityX: 300,
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
  }

  loadAndCreateMap(): Phaser.Tilemaps.Tilemap {
    const map = this.make.tilemap({ key: 'blob' });
    const tileset = map.addTilesetImage(
      'blobtexture',
      'blobtexture',
      map.tileWidth,
      map.tileHeight
    );

    const layer = map.createDynamicLayer('foreground', tileset, 0, 0);
    return map;
  }

  updateTileCursorPosition() {
    const cursorX = this.input.activePointer.x;
    const cursorY = this.input.activePointer.y;
    const tileX = Math.floor(cursorX / 16) * 16;
    const tileY = Math.floor(cursorY / 16) * 16;
    this.tileCursor.x = tileX;
    this.tileCursor.y = tileY;
  }

  createCannon(xLoc: number, yLoc: number) {

    if (this.blobMap.getTileAtWorldXY(this.input.activePointer.x, this.input.activePointer.y) === null) {
      console.log('invalid location');
      return;
    }
    const cursorX = xLoc;
    const cursorY = yLoc;
    const tileX = Math.floor(cursorX / 16) * 16 + 8;
    const tileY = Math.floor(cursorY / 16) * 16 + 8;
    const alreadyBuilt = this.cannons.filter(cannon => {
      return cannon.x === tileX && cannon.y === tileY
    }).length > 0

    if (!alreadyBuilt) {
      this.buildCannonSound.play();
      const cannon = new BlobCannon(this, tileX, tileY, this.ammo);
      this.add.existing(cannon);
      this.cannons.push(cannon);
      this.cannonBuildEmitter.explode(100, tileX, tileY)
    }
  }

  createEnemy() {
    const enemy: Fighter = new Fighter(this, 0, 0, this.enemyAmmo);
    Phaser.Actions.RandomRectangle([enemy], this.enemySpawnBox);
    this.enemies.add(enemy, true);
  }

  checkCannons() {

    this.cannons.forEach(cannon => {
      cannon.update();
      let closestEnemy: GameObjects.Sprite | null = null;
      let closestDistance: number = 100000;
      this.enemies.getChildren().forEach(enemy => {
        const distance = Phaser.Math.Distance.Between(cannon.x, cannon.y, enemy.x as number, enemy.y as number)
        if (closestDistance > distance) {
          closestDistance = distance;
          closestEnemy = enemy as GameObjects.Sprite;
        }
      })
      if (closestEnemy !== null) {
        cannon.targetEnemy(closestEnemy, closestDistance);
      }
    })
  }

  afterBurner(x: number, y: number, color: string) {
    if (color === 'blue') {
      this.blueAfterBurnerEmitter.explode(1, x, y)
    } else {
      this.redAfterBurnerEmitter.explode(1, x, y);
    }
  }

  updateAmmos() {
    this.ammo.getChildren().forEach(shot => {
      shot.update()
    })
    this.enemyAmmo.getChildren().forEach(shot=> {
      const enemyShot = <EnemyAmmo> shot;
      this.afterBurner(enemyShot.x + enemyShot.width / 2, enemyShot.y, 'red');
      shot.update()
    })
  }

  getTileAtXY(x: number, y: number) {
    return this.blobMap.getTileAtWorldXY(x, y)
  }

  destroyTileAtXY(x: number, y: number) {
    const tile = this.blobMap.getTileAtWorldXY(x, y)

    this.cannons.forEach(cannon => {
      if (cannon.x === tile.pixelX + 8 && cannon.y === tile.pixelY + 8) {
        cannon.destroy()
      }
    })

    this.blobMap.removeTileAtWorldXY(x, y);
    this.bubbleEmitter.explode(50, x + 8, y + 8);
  }

  getCannonOnTile(tile: Tilemaps.Tile) {
    for (const cannon of this.cannons) {
      if (cannon.x === tile.pixelX + 8 && cannon.y === tile.pixelY + 8) {
        return cannon;
      }
    }
  }

  explodeEffect(x: number, y: number) {
    this.explosionEmitter.explode(100, x, y)
  }

  sparkEffect(x: number, y: number) {
    this.sparkEmitter.explode(50, x, y)
  }

  update() {

    for (let i = 0; i < 10; i++) {
      const startIndex = this.starCount / 10 * i;
      Phaser.Actions.IncXY(this.starfield.getChildren().slice(startIndex, this.starCount / 10 * (i + 1)), -i - 1, 0);
    }

    Phaser.Actions.WrapInRectangle(this.starfield.getChildren(), this.bgBox);
    this.updateTileCursorPosition();

    if (this.input.activePointer.justDown) {
      this.createCannon(this.input.activePointer.x, this.input.activePointer.y);
      console.log('Tile: ', this.getTileAtXY(this.input.activePointer.x, this.input.activePointer.y));
    }

    this.cannons.forEach(cannon => {
      cannon.setRotation(cannon.rotation + 0.01);
    })

    this.enemyCooldown -= this.sys.game.loop.delta;

    if (this.enemyCooldown < 0) {
      this.enemyCooldown = 2000;
      this.createEnemy();
    }
    this.enemies.getChildren().forEach(enemy => {
      const enemyShip = <Enemy> enemy;
      this.afterBurner(enemyShip.x, enemyShip.y, 'blue');
      enemy.update();
    })

    this.checkCannons();
    this.updateAmmos();

    this.cannons = this.cannons.filter(cannon => cannon.active);
  }
}

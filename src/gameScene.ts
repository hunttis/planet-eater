import { Scene, GameObjects, Input, Tilemaps } from 'phaser';
import { Cannon } from './cannons/cannon';
import { BlobCannon } from './cannons/blobcannon';
import { Fighter } from './enemies/fighter';
import buildMP3 from  './assets/audio/buildcannon.mp3';
import buildOGG from './assets/audio/buildcannon.ogg';
import buildWAV from './assets/audio/buildcannon.wav';
import { EnemyAmmo } from './ammo/enemyammo';
import { Enemy } from './enemies/enemy';
import musicMP3 from  './assets/audio/planeteater.mp3';
import musicOGG from './assets/audio/planeteater.ogg';
import blobCannonFireMP3 from  './assets/audio/blobammo.mp3';
import blobCannonFireOGG from './assets/audio/blobammo.ogg';
import blobCannonFireWAV from './assets/audio/blobammo.wav';
import { Scout } from './enemies/scout';
import { Planet } from './enemies/planet';
import { Effects } from './effects';

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
  planet!: Planet;

  enemyCooldown: number = 1000;
  elapsed: number = 0;

  starCount: number = 10;
  particles!: GameObjects.Particles.ParticleEmitterManager;
  bubbleparticles!: GameObjects.Particles.ParticleEmitterManager;
  
  buildCannonSound!: Phaser.Sound.BaseSound;
  music!: Phaser.Sound.BaseSound;

  bubbleEmitter!: GameObjects.Particles.ParticleEmitter;
  blueAfterBurnerEmitter!: GameObjects.Particles.ParticleEmitter;
  redAfterBurnerEmitter!: GameObjects.Particles.ParticleEmitter;
  cannonBuildEmitter!: GameObjects.Particles.ParticleEmitter;
  explosionEmitter!: GameObjects.Particles.ParticleEmitter;
  sparkEmitter!: GameObjects.Particles.ParticleEmitter;
  splashEmitter!: GameObjects.Particles.ParticleEmitter;
  planetMeltEmitter!: GameObjects.Particles.ParticleEmitter;

  STATE_SCOUTS: string = 'SCOUTS';
  STATE_FIGHTERS: string = 'FIGHTERS';
  STATE_PLANET: string = 'PLANET';

  STATE_SCOUT_LENGTH: number = 30000;
  STATE_FIGHTER_LENGTH: number = 60000;

  currentState: string = this.STATE_SCOUTS;
  stateText!: Phaser.GameObjects.Text;
  effects!: Effects;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.bgBox = new Phaser.Geom.Rectangle(0, 0, Number(this.game.config.width), Number(this.game.config.height));
    this.enemySpawnBox = new Phaser.Geom.Rectangle(Number(this.game.config.width) + 8, 100, Number(this.game.config.width) + 9, Number(this.game.config.height)- 100);
    const result = this.load.audio('buildcannon', [buildMP3, buildOGG, buildWAV]);
    console.log('AUDIO', result);
    this.load.audio('planeteater', [musicMP3, musicOGG]);
    this.load.audio('blobammo', [blobCannonFireMP3, blobCannonFireOGG, blobCannonFireWAV]);
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
    this.effects = new Effects(this);

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

    this.stateText = this.add.text(10, 10, this.currentState + ' incoming');
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
    layer.depth = 100;
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
      cannon.depth = 101;
      this.add.existing(cannon);
      this.cannons.push(cannon);
      this.cannonBuildEmitter.explode(100, tileX, tileY)
    }
  }

  createEnemy(type: string) {
    if (type === 'fighter') {
      const enemy: Fighter = new Fighter(this, 0, 0, this.enemyAmmo);
      Phaser.Actions.RandomRectangle([enemy], this.enemySpawnBox);
      this.enemies.add(enemy, true);
    } else if (type === 'scout') {
      const enemy: Scout = new Scout(this, 0, 0, this.enemyAmmo);
      Phaser.Actions.RandomRectangle([enemy], this.enemySpawnBox);
      this.enemies.add(enemy, true);
    }
  }

  createPlanet() {
    this.planet = new Planet(this, Number(this.game.config.width) + 100, Number(this.game.config.height) / 2 + 20)
    this.add.existing(this.planet);
  }

  checkCannons() {

    this.cannons.forEach(cannon => {
      cannon.update();
      let closestEnemy: GameObjects.Sprite | null = null;
      let closestDistance: number = 100000;
      this.enemies.getChildren().forEach(enemy => {
        const enemyShip = <Enemy> enemy;
        const distance = Phaser.Math.Distance.Between(cannon.x, cannon.y, enemyShip.x, enemyShip.y)
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

  updateAmmos() {
    this.ammo.getChildren().forEach(shot => {
      shot.update()
    })
    this.enemyAmmo.getChildren().forEach(shot=> {
      const enemyShot = <EnemyAmmo> shot;
      this.effects.redAfterBurner(enemyShot.x + enemyShot.width / 2, enemyShot.y);
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
    this.effects.explodeBubbles(x + 8, y + 8);
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

  splashEffect(x1: number, y1: number, x2: number, y2: number) {
    this.splashEmitter.setEmitZone({
      source: new Phaser.Geom.Line(x1, y1, x2, y2),
      type: 'random',
      quantity: 100
    }).explode(100, 0, 0);
  }

  getMeltEmitter() {
    return this.planetMeltEmitter;
  }

  getEffects() {
    return this.effects;
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

    if (this.currentState !== this.STATE_PLANET) {
      this.enemyCooldown -= this.sys.game.loop.delta;
      this.elapsed += this.sys.game.loop.delta;
      if (this.enemyCooldown < 0) {
        if (this.currentState === this.STATE_SCOUTS) {
          this.enemyCooldown = Math.random() * 500 + 500;
          this.createEnemy('scout');
          if (this.elapsed > this.STATE_SCOUT_LENGTH) {
            this.currentState = this.STATE_FIGHTERS;
          }
        } else if (this.currentState === this.STATE_FIGHTERS) {
          this.enemyCooldown = 1000;
          this.createEnemy('scout');
          this.createEnemy('fighter');
          if (this.elapsed > this.STATE_FIGHTER_LENGTH) {
            this.currentState = this.STATE_PLANET;
            this.createPlanet();
            this.enemyCooldown = 100;
          }
        }
      }
    }

    if (this.currentState === this.STATE_PLANET && this.planet) {
      this.planet.update();
      this.enemyCooldown -= this.sys.game.loop.delta;
      if (this.enemyCooldown < 0 ){
        this.enemyCooldown = 500;
        this.createEnemy('fighter');
        this.createEnemy('scout');
      }
      if (this.planet.getState() === 'done') {
        this.elapsed = 0;
        this.currentState = this.STATE_SCOUTS;
        this.planet.destroy();
      }
    }

    const textShouldBe = this.currentState + ' incoming';

    if (this.stateText.text !== textShouldBe) {
      this.stateText.text = textShouldBe;
    }

    this.enemies.getChildren().forEach(enemy => {
      const enemyShip = <Enemy> enemy;
      this.effects.blueAfterBurner(enemyShip.x, enemyShip.y);
      enemy.update();
    })

    this.checkCannons();
    this.updateAmmos();

    

    this.cannons = this.cannons.filter(cannon => cannon.active);
  }
}

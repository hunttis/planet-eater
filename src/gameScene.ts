import { Scene, GameObjects, Input } from 'phaser';
import { Cannon } from './cannons/cannon';
import { BlobCannon } from './cannons/blobcannon';
import { Ammo } from './ammo/ammo'
import { Fighter } from './enemies/fighter';

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
  enemies!: GameObjects.Group;

  enemyCooldown: number = 1000;

  starCount: number = 10;
  particles!: GameObjects.Particles.ParticleEmitterManager;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.bgBox = new Phaser.Geom.Rectangle(0, 0, Number(this.game.config.width), Number(this.game.config.height));
    this.enemySpawnBox = new Phaser.Geom.Rectangle(Number(this.game.config.width) + 8, 0, Number(this.game.config.width) + 16, Number(this.game.config.height));
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
      const cannon = new BlobCannon(this, tileX, tileY, this.ammo);
      this.add.existing(cannon);
      this.cannons.push(cannon);
      this.particles.createEmitter({
        x: tileX, y: tileY, lifespan: 200, speed: 200, scale: { start: 1, end: 0 }, quantity: 100,
        tint: 0x00dd00
      }).explode(100, tileX, tileY)
    }
  }

  createEnemy() {
    const enemy: Fighter = new Fighter(this, 0, 0);
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

  updateAmmos() {
    this.ammo.getChildren().forEach(shot => {
      shot.update()
    })
  }

  getTileAtXY(x: number, y: number) {
    return this.blobMap.getTileAtWorldXY(x, y)
  }

  destroyTileAtXY(x: number, y: number) {
    const tile = this.blobMap.getTileAtWorldXY(x, y)

    console.log(x, y, tile.x, tile.y, tile.pixelX, tile.pixelY);
    this.cannons.forEach(cannon => {
      console.log(cannon.x, cannon.y);
      if (cannon.x === tile.pixelX + 8 && cannon.y === tile.pixelY + 8) {
        cannon.destroy()
      }
    })

    this.blobMap.removeTileAtWorldXY(x, y);
    this.particles.createEmitter({
      x: tile.pixelX + 8, y: tile.pixelY + 8,
      lifespan: 2000, speed: 100,
      gravityX: -300, tint: 0x00aa00,
      scale: { start: 2, end: 0 },
      frequency: 100
    })
  }

  explodeEffect(x: number, y: number, quantity: number = 100, lifespan: number = 200, tint: number = 0xdddd00) {
    this.particles.createEmitter({
      x, y,
      lifespan: Math.random() * lifespan / 2 + lifespan / 2,
      speed: Math.random() * 100 + 100,
      scale: { start: 1, end: 0 },
      quantity,
      tint
    }).explode(100, x, y)
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
      enemy.update();
    })

    this.checkCannons();
    this.updateAmmos();
  }
}

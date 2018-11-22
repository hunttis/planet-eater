import { Scene, GameObjects, Input } from 'phaser';
import { Cannon } from './cannons/cannon';
import { BlobCannon } from './cannons/blobcannon';
import { Ammo } from './ammo/ammo'

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
  enemies: Array<GameObjects.Sprite> = [];
  builtSpots: Array<Phaser.Geom.Point> = [];

  enemyCooldown: number = 1000;

  starCount: number = 10;

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
  }

  loadAndCreateMap(): Phaser.Tilemaps.Tilemap {
    const map = this.make.tilemap({ key: 'blob' });
    const tileset = map.addTilesetImage(
      'blobtexture',
      'blobtexture',
      map.tileWidth,
      map.tileHeight
    );

    const layer = map.createStaticLayer('foreground', tileset, 0, 0);
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
    this.add.sprite(tileX, tileY, 'cannons', 0); // cannon base
    const cannon = new BlobCannon(this, tileX, tileY, this.ammo);
    this.add.existing(cannon);
    this.cannons.push(cannon);
  }

  createEnemy() {
    const enemy: GameObjects.Sprite = this.add.sprite(0, 0, 'cannons', 1);
    Phaser.Actions.RandomRectangle([enemy], this.enemySpawnBox);
    this.enemies.push(enemy);
  }

  checkCannons() {

    this.cannons.forEach(cannon => {
      cannon.update();
      let closestEnemy: GameObjects.Sprite | null = null;
      let closestDistance: number = 100000;
      this.enemies.forEach(enemy => {
        const distance = Phaser.Math.Distance.Between(cannon.x, cannon.y, enemy.x, enemy.y)
        if (closestDistance > distance) {
          closestDistance = distance;
          closestEnemy = enemy;
        }
      })
      if (closestEnemy !== null) {
        cannon.targetEnemy(closestEnemy, closestDistance);
      }
    })
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
      console.log('Tile: ', this.blobMap.getTileAtWorldXY(this.input.activePointer.x, this.input.activePointer.y));
    }

    this.cannons.forEach(cannon => {
      cannon.setRotation(cannon.rotation + 0.01);
    })

    this.enemyCooldown -= this.sys.game.loop.delta;

    if (this.enemyCooldown < 0) {
      this.enemyCooldown = 2000;
      this.createEnemy();
      console.log('Enemy! Total enemies: ', this.enemies.filter(enemy => enemy.active).length);
    }
    this.enemies.forEach(enemy => {
      enemy.x -= 2;

      if (enemy.x < -10) {
        enemy.destroy();
      }
    })

    this.checkCannons();

    console.log('ammo', this.ammo.getLength())

  }
}

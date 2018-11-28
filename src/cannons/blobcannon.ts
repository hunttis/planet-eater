import { Cannon } from "./cannon";
import { GameObjects } from "phaser";
import { BlobAmmo } from "~/ammo/blobammo";
import { GameScene } from "~/gameScene";

export class BlobCannon extends Cannon {

  cooldown: number = 1000;
  range: number = 200;
  fireSound: Phaser.Sound.BaseSound;

  constructor(scene: GameScene, xLoc: number, yLoc: number, ammo: GameObjects.Group) {
    super(scene, xLoc, yLoc, 'cannons', 1);
    this.ammo = ammo;
    this.fireSound = this.scene.sound.add('blobammo');
  }

  update() {
    super.update()
    if (!this.active) {
      return;
    }
    this.cooldown -= this.scene.sys.game.loop.delta;
    if (this.target !== null && this.cooldown < 0) {
      this.fire()
    }
  }

  fire(): void {
    if (this.target != null && this.distanceToTarget() < this.range) {
      this.cooldown = 1000;
      const shot = new BlobAmmo(this.scene, this.x, this.y, this.target);
      this.ammo.add(shot, true);
      this.fireSound.play();
    }
  }


}


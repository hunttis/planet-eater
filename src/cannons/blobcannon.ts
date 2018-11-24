import { Cannon } from "./cannon";
import { GameObjects } from "phaser";
import { BlobAmmo } from "~/ammo/blobammo";
import { GameScene } from "~/gameScene";

export class BlobCannon extends Cannon {

  cooldown: number = 1000;
  range: number = 200;

  constructor(scene: GameScene, xLoc: number, yLoc: number, ammo: GameObjects.Group) {
    super(scene, xLoc, yLoc, 'cannons', 1);
    this.ammo = ammo;
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
      console.log('close enough!');
      this.cooldown = 1000;

      const shot = new BlobAmmo(this.scene, this.x, this.y, this.target);
      this.ammo.add(shot, true);
    }
  }


}


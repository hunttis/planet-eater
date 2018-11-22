import { Cannon } from "./cannon";
import { Scene, GameObjects } from "phaser";
import { BlobAmmo } from "~/ammo/blobammo";

export class BlobCannon extends Cannon {

  cooldown: number = 1000;
  range: number = 200;

  constructor(scene: Scene, xLoc: number, yLoc: number, ammo: GameObjects.Group) {
    super(scene, xLoc, yLoc, 'cannons', 1);
    this.ammo = ammo;
  }

  update() {
    super.update()
    this.cooldown -= this.scene.sys.game.loop.delta;
    if (this.target !== null && this.cooldown < 0) {
      this.fire()
    }
  }

  fire(): void {
    if (this.target != null && this.distanceToTarget() < this.range) {
      console.log('close enough!');
      this.cooldown = 1000;

      const shot = new BlobAmmo(this.scene, this.x + 10, this.y + 10, this.target);
      this.ammo.add(shot, true);
    }
  }


}


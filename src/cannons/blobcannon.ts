import { Cannon } from "./cannon";
import { Scene } from "phaser";

export class BlobCannon extends Cannon {

  cooldown: number = 1000;
  range: number = 200;

  constructor(scene: Scene, xLoc: number, yLoc: number) {
    super(scene, xLoc, yLoc, 'cannons', 1);
  }

  update() {
    super.update()
    this.cooldown -= this.scene.sys.game.loop.delta;
    if (this.target !== null && this.cooldown < 0) {
      this.fire()
    }
  }

  fire(): void {
    if (this.distanceToTarget() < this.range) {
      console.log('close enough!');
      this.cooldown = 1000;
    }
  }


}


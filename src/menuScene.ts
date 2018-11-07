import { Scene, Input, GameObjects } from 'phaser';

export class MenuScene extends Scene {
  keys!: Record<string, Input.Keyboard.Key>;

  constructor() {
    super('MenuScene');
  }

  create() {
    this.add.text(100, 50, 'Phaser 3 Typescript template');
    this.add.text(100, 100, 'Click a button to start a scene');
    
    this.createButton(100, 200, 'Start', 'GameScene');
    
  }

  update() {
  }

  createButton(x: number, y: number, text: string, targetScene: string): GameObjects.Sprite {
    const button = this.add.sprite(x, y, 'round_metalDark').setInteractive();
    button.setOrigin(0.5)

    const textObject = this.add.text(0, 0, text, { fontSize: 20, color: '#ffffff', align: 'center' });
    textObject.setOrigin(0, 0.5);
    textObject.setPosition(x + button.width, y);
    
    button.on('pointerdown', () => {
      this.scene.start(targetScene);
    });

    return button;
  }


}

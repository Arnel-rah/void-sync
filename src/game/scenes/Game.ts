import { Scene } from "phaser";

export class Game extends Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly SPEED = 300;

  constructor() {
    super("Game");
  }

  create() {
    this.add
      .text(512, 384, "VOID-SYNC : STANDBY", {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "monospace",
      })
      .setOrigin(0.5)
      .setAlpha(0.5);

    if (!this.textures.exists("temp-player")) {
      const graphics = this.make.graphics({ x: 0, y: 0 }, false);
      graphics.fillStyle(0xffffff);
      graphics.fillRect(0, 0, 32, 32);
      graphics.generateTexture("temp-player", 32, 32);
      graphics.destroy();
    }

    if (!this.textures.exists("wall")) {
      const wallGraphics = this.make.graphics({ x: 0, y: 0 }, false);
      wallGraphics.fillStyle(0xff0000);
      wallGraphics.fillRect(0, 0, 32, 32);
      wallGraphics.generateTexture("wall", 32, 32);
      wallGraphics.destroy();
    }

    const platforms = this.physics.add.staticGroup();
    platforms.create(200, 200, "wall");
    platforms.create(232, 200, "wall");
    platforms.create(264, 200, "wall");

    this.player = this.physics.add.sprite(512, 384, "temp-player");
    this.player.setCollideWorldBounds(true);
    this.player.setDamping(true);
    this.player.setDrag(0.1);

    this.physics.add.collider(this.player, platforms);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
  }

  update() {
    if (!this.cursors) return;
    const movement = new Phaser.Math.Vector2(0, 0);

    if (this.cursors.left.isDown) movement.x = -1;
    else if (this.cursors.right.isDown) movement.x = 1;

    if (this.cursors.up.isDown) movement.y = -1;
    else if (this.cursors.down.isDown) movement.y = 1;

    if (movement.length() > 0) {
      movement.normalize().scale(this.SPEED);
      this.player.setVelocity(movement.x, movement.y);
    } else {
      this.player.setVelocity(0, 0);
    }
  }
}

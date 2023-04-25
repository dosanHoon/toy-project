import { Scene } from "phaser";
export class LoadingScene extends Scene {
  constructor() {
    super("loading-scene");
  }
  create(): void {
    this.scene.start("level-1-scene");
  }
  preload(): void {
    this.load.baseURL = "assets/";
    this.load.image("king", "sprites/king.png");
  }
}

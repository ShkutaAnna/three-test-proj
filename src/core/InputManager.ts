// import * as THREE from 'three';

export class InputManager {
    private clickCallbacks: ((event: PointerEvent) => void)[] = [];
    private keyPressCallbacks: ((event: KeyboardEvent) => void)[] = [];
    private keyUpCallbacks: ((event: KeyboardEvent) => void)[] = [];

    constructor() {
        window.addEventListener('pointerdown', this.onPoinerDown);

        window.addEventListener('keypress', this.onKeyDown);
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    public onClick(callback: (event: PointerEvent) => void) {
        this.clickCallbacks.push(callback);
    }

    public onKeyPressed(callback: (event: KeyboardEvent) => void) {
        this.keyPressCallbacks.push(callback);
    }

    public onKeyRelease(callback: (event: KeyboardEvent) => void) {
        this.keyUpCallbacks.push(callback);
    }

    private onPoinerDown = (event: PointerEvent) => {
        this.clickCallbacks.forEach((callback) => callback(event));
    }

    private onKeyDown = (event: KeyboardEvent) => {
        this.keyPressCallbacks.forEach((callback) => callback(event));
    }

    private onKeyUp = (event: KeyboardEvent) => {
        this.keyUpCallbacks.forEach((callback) => callback(event));
    }
}
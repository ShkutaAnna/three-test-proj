import * as THREE from 'three';

export class SceneManager {
    public scene: THREE.Scene;

    constructor () {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x202020)
    }
}
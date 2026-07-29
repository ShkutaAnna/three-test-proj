import * as THREE from 'three';

export class LightManager {
    public directionalLight: THREE.DirectionalLight;

    constructor() {
        this.directionalLight = new THREE.DirectionalLight();
        this.directionalLight.position.set(1, 1, 0);
    }
}
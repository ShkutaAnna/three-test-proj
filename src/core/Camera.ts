import * as THREE from 'three';

export class CameraManager {
    public camera: THREE.PerspectiveCamera;

    constructor() {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.y = 5;
        this.camera.position.z = -5;
        this.camera.rotation.y = Math.PI;
        this.camera.rotation.x = Math.PI / 6;
        // this.camera.lookAt(0, 0, 0);
    }
}
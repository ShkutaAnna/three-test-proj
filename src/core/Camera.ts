import * as THREE from 'three';

export class CameraManager {
    public camera: THREE.PerspectiveCamera;

    constructor() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.y = 10;
        this.camera.position.z = 10;
        this.camera.lookAt(0, 0, 0);

        // this.camera.rotateX(30);
    }
}
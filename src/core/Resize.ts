import * as THREE from 'three';

export class ResizeManager {
    constructor(
        private camera: THREE.PerspectiveCamera,
        private renderer: THREE.WebGLRenderer,
    ) {
        window.addEventListener('resize', this.onResize)
    }

    private onResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
}
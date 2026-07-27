import * as THREE from 'three';
import gsap from 'gsap';
import type { MeteoManager } from '../core/MeteoManager';
import { getRandomInt } from '../utils/NumbersUtils';

export class Meteo {
    public type: 'red' | 'green';
    public mesh: THREE.Mesh;

    public isCollected = false;
    private tween: GSAPTween;
    private size = 0.5;

    constructor(
        public meteoManager: MeteoManager,
        public scene: THREE.Scene,
    ) {
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(this.size),
            new THREE.MeshMatcapMaterial(),
        );

        this.reset();

        this.scene.add(this.mesh);
    }

    public start() {
        const start = this.meteoManager.generateRandomPosition();
        this.mesh.position.set(start.x, start.y, start.z);

        this.tween = gsap.to(this.mesh.position, {
            x: start.x,
            y: this.size,
            z: start.z,
            duration: getRandomInt(3, 7),
            ease: 'bounce.out',
            onComplete: () => {
                this.reset();
            }
        })
    }

    public reset() {
        this.tween?.kill();
        this.type = Math.random() > 0.5 ? 'red' : 'green';
        this.isCollected = false;
        this.updateMaterial();
        this.start();
    }

    private updateMaterial() {
        // this.mesh.material.setColors(new THREE.Color())
        let color = '#ffffff';
        if (this.type === 'red') {
            color = '#ff0000';
        } else if (this.type === 'green') {
            color = '#3cff00';
        }

        const material = this.mesh.material as THREE.MeshMatcapMaterial;
        material.color.set(color);
    }
}
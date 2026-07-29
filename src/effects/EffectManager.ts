import * as THREE from 'three';
import { ParticleExplosion } from './ParticleExplosion';
import type { TextureLoaderManager } from '../core/TextureLoaderManager';

export class EffectManager {
    constructor(
        private textureLoaderManager: TextureLoaderManager,
        private scene: THREE.Scene,
    ) { }

    public spawnParticleExplosion(position: THREE.Vector3) {
        const explosion = new ParticleExplosion(this.textureLoaderManager, this.scene);
        explosion.play(position);
    }

    // public shootLaser(origin: THREE.Vector3, direction: THREE.Vector3, walls: THREE.Mesh[]) {
    //     const laserShoot = new LaserShoot(this.scene);
    //     laserShoot.play(origin, direction, walls);
    // }
}
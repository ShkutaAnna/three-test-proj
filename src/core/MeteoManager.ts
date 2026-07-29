import * as THREE from 'three';
import { Meteo } from '../objects/Meteo';
import type { Player } from '../objects/Player';
import type { TextureLoaderManager } from './TextureLoaderManager';

export class MeteoManager {
    public count = 5;
    public meteos: Meteo[] = [];

    constructor(
        public width: number,
        public length: number,
        public height: number,
        public center: THREE.Vector3,
        public scene: THREE.Scene,
        public textureLoaderManager: TextureLoaderManager,
    ) {
        for (let index = 0; index < this.count; index++) {
            const meteo = new Meteo(this, scene, textureLoaderManager);
            this.meteos.push(meteo);
            meteo.start();
        }
    }

    checkForHits(player: Player) {
        const playerBox = new THREE.Box3().setFromObject(player.player);
        this.meteos.forEach((meteo) => {
            const itemBox = new THREE.Box3().setFromObject(meteo.mesh);
            if (playerBox.intersectsBox(itemBox)) {
                if (meteo.isCollected) return;

                if (meteo.type === 'red') {
                    player.applyDamage(5);
                } else {
                    // add points
                }
                meteo.reset();
                meteo.isCollected = true;
            }
        })
    }

    public generateRandomPosition(): THREE.Vector3 {
        return new THREE.Vector3(
            this.center.x + THREE.MathUtils.randFloat(
                -this.width / 2,
                this.width / 2
            ),
            this.center.y + this.height * 2,
            this.center.z + THREE.MathUtils.randFloat(
                -this.length / 2,
                this.length / 2
            )
        )
    }
}
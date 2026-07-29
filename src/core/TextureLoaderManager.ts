import * as THREE from 'three';
import circleTexture from '../assets/textures/particles/circle_01.png';
import gradient3Texture from '../assets/textures/gradients/3.jpg';
import gradient5Texture from '../assets/textures/gradients/5.jpg';

export class TextureLoaderManager {
    private textureLoader: THREE.TextureLoader;
    private loadedTextures: Map<Textures, THREE.Texture> = new Map();

    constructor() {
        this.textureLoader = new THREE.TextureLoader();
    }

    public getTexture(key: Textures): THREE.Texture {
        let texture = this.loadedTextures[key];
        if (!texture) {
            texture = this.textureLoader.load(this.getUrl(key));
            this.loadedTextures[key] = texture;
        }

        return texture;
    }

    private getUrl(key: Textures): string {
        switch (key) {
            case Textures.circle:
                return circleTexture;
            case Textures.gradient3:
                return gradient3Texture;
            case Textures.gradient5:
                return gradient5Texture;
            default:
                return '';
        }
    }
}

export enum Textures {
    gradient3 = 'gradient3',
    gradient5 = 'gradient5',
    circle = 'circle',
}
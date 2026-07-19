import gsap from 'gsap';
import * as THREE from 'three';

export class AnimationManager {
    rotate(object: THREE.Object3D) {
        gsap.to(object.rotation, {
            y: Math.PI * 2,
            duration: 3,
            repeat: -1,
            ease: 'none',
        });
    }
}
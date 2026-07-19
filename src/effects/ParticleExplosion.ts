import * as THREE from 'three';
import { gsap } from "gsap";

export class ParticleExplosion {
    private textureLoader = new THREE.TextureLoader();

    constructor(
        private scene: THREE.Scene,
    ) { }

    play(point: THREE.Vector3) {
        const particlesGeometry = new THREE.BufferGeometry();
        
        const count = 10;
        
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < positions.length; i += 3) {
            point.toArray(positions, i);
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particlesMaterial = new THREE.PointsMaterial();
        particlesMaterial.size = 0.2;
        particlesMaterial.sizeAttenuation = true;
        particlesMaterial.color = new THREE.Color(this.getRandomColor());
        particlesMaterial.transparent = true;
        particlesMaterial.alphaMap = this.textureLoader.load('src/assets/particles/circle_01.png');
        // do not render black pixels
        // particlesMaterial.alphaTest = 0.001;
        // particles hidden by objects will still be visible
        // particlesMaterial.depthTest = false;
        particlesMaterial.depthWrite = false;

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        particles.raycast = () => {};
        this.scene.add(particles);

        const velocities: Velocity[] = [];

        for (let i = 0; i < count; i++) {
            point.toArray(positions, i * 3);

            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random();

            velocities.push({
                dx: Math.cos(angle) * speed,
                dz: Math.sin(angle) * speed,
                dy: 1 + Math.random()
            });
        }

        const state = { t: 0 };

        gsap.to(state, {
            t: 1,
            duration: 1,
            ease: "none",
            onUpdate: () => {
                for (let i = 0; i < count; i++) {
                    const v = velocities[i];
                    const j = i * 3;

                    positions[j]     = point.x + v.dx * state.t;
                    positions[j + 2] = point.z + v.dz * state.t;
                    positions[j + 1] = point.y + v.dy * state.t - 2 * state.t * state.t;
                }

                particlesGeometry.attributes.position.needsUpdate = true;
            },
            onComplete: () => {
                this.scene.remove(particles);

                particlesGeometry.dispose();
                particlesMaterial.dispose();
            }
        });
    }

    private getRandomColor(): string {
        const colors = [
            '#047cf3',
            '#07f5f5',
            '#f305d3',
            '#ee2f0d',
            '#32f10b',
            '#5c1858',
            '#f1720a',
        ];
        const index = Math.round(Math.random() * colors.length);
        return colors[index];
    }
}

export type Velocity = {
    dx: number;
    dy: number;
    dz: number;
}
import * as THREE from 'three';

export class Bullet extends THREE.Mesh {
    public isFinished = false;

    private velocity: THREE.Vector3;

    private bounceCount = 0;

    private maxBounces = 3;

    private arenaWidth: number;
    private arenaLength: number;


    constructor(
        position: THREE.Vector3,
        direction: THREE.Vector3,
        speed: number,
        arenaWidth: number,
        arenaLength: number,
    ) {
        super(
            new THREE.SphereGeometry(0.1, 16, 16),
            new THREE.MeshStandardMaterial({
                color: 0xffff00
            })
        );

        this.position.copy(position);

        this.velocity = direction.normalize().multiplyScalar(speed);

        this.arenaWidth = arenaWidth;
        this.arenaLength = arenaLength;
    }

    update(delta: number) {
        this.position.add(this.velocity.clone().multiplyScalar(delta));

        this.checkWalls();
    }

    private checkWalls() {

        const halfWidth = this.arenaWidth / 2;
        const halfLength = this.arenaLength / 2;


        // ліва / права стіна
        if (
            this.position.x < -halfWidth ||
            this.position.x > halfWidth
        ) {

            this.velocity.x *= -1;

            this.bounce();
        }


        // передня / задня стіна
        if (
            this.position.z < -halfLength ||
            this.position.z > halfLength
        ) {

            this.velocity.z *= -1;

            this.bounce();
        }
    }

    private bounce() {
        this.bounceCount++;

        if(this.bounceCount >= this.maxBounces) {
            this.destroy();
        }
    }

    private destroy() {
        this.isFinished = true;
        this.parent?.remove(this);

        this.geometry.dispose();
        (this.material as THREE.Material).dispose();
    }
}
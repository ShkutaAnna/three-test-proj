import * as THREE from 'three';

export class Enemy {
    public mesh: THREE.Mesh;

    constructor() {
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(),
            new THREE.MeshNormalMaterial(),
        );

        this.mesh.position.x = 2;
    }
}
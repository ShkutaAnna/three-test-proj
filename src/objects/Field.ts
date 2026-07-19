import * as THREE from 'three';

export class Field {
    public mesh: THREE.Mesh;

    constructor() {
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20),
            new THREE.MeshNormalMaterial(),
        );

        this.mesh.rotation.x = -Math.PI / 2;
    }
}
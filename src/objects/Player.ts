import * as THREE from 'three';

export class Player {
    public mesh: THREE.Mesh;

    private speed = 0.06;
    private turnSpeed = Math.PI / 48;

    private playerSize = 2;

    private colors = ['#ffffff', '#33ff00'];
    private materials = [
        new THREE.MeshMatcapMaterial({ color: this.colors[0] }), // right
        new THREE.MeshMatcapMaterial({ color: this.colors[0] }), // left
        new THREE.MeshMatcapMaterial({ color: this.colors[0] }), // top
        new THREE.MeshMatcapMaterial({ color: this.colors[0] }), // bottom
        new THREE.MeshMatcapMaterial({ color: this.colors[1] }), // front
        new THREE.MeshMatcapMaterial({ color: this.colors[0] }), // back
    ];

    constructor() {
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(this.playerSize, this.playerSize, this.playerSize),
            this.materials,
        );

        this.mesh.position.y = this.playerSize / 2;
    }

    public movePlayer(params: ActiveMovementDirection) {
        const { Up, Down, Left, Right } = params;
        if (Up || Down) {
            const forward = new THREE.Vector3(0, 0, (Down ? -1 : 1));
            forward.applyQuaternion(this.mesh.quaternion);
            this.mesh.position.addScaledVector(forward, this.speed);
        }

        if (Left || Right) {
            this.mesh.rotateY(this.turnSpeed * (Left ? 1 : -1));
        }
    }

    public getFootCoords(): THREE.Vector3[] {
        const forward = new THREE.Vector3();
        this.mesh.getWorldDirection(forward);

        const up = new THREE.Vector3(0, 1, 0);

        const right = new THREE.Vector3().crossVectors(forward, up).normalize();

        const leftOrigin = this.mesh.position.clone().addScaledVector(right, -1);
        const rightOrigin = this.mesh.position.clone().addScaledVector(right, 1);

        return [
            leftOrigin.clone().addScaledVector(forward, -this.playerSize/2),
            rightOrigin.clone().addScaledVector(forward, -this.playerSize/2),
            leftOrigin.clone().addScaledVector(forward, this.playerSize/2),
            rightOrigin.clone().addScaledVector(forward, this.playerSize/2),
        ];
    }
}

export enum MovementDirection {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right'
}

export type ActiveMovementDirection = Record<MovementDirection, boolean>;
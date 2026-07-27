import * as THREE from 'three';
import { HpBar } from './HpBar';

export class Player {
    public group: THREE.Group;

    public player: THREE.Mesh;
    private hpBar: HpBar;

    private healthPerc = 100;

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

    constructor(public camera: THREE.Camera) {
        this.group = new THREE.Group();
        this.player = new THREE.Mesh(
            new THREE.BoxGeometry(this.playerSize, this.playerSize, this.playerSize),
            this.materials,
        );
        this.player.name = 'player';
        this.hpBar = new HpBar();

        this.group.add(this.player);
        this.group.add(this.hpBar.group);

        this.group.position.y = this.playerSize / 2;
    }

    public movePlayer(params: ActiveMovementDirection) {
        const { Up, Down, Left, Right } = params;
        if (Up || Down) {
            const forward = new THREE.Vector3(0, 0, (Down ? -1 : 1));
            forward.applyQuaternion(this.group.quaternion);
            this.group.position.addScaledVector(forward, this.speed);
        }

        if (Left || Right) {
            this.group.rotateY(this.turnSpeed * (Left ? 1 : -1));
        }

        this.hpBar.updateRotation(this.camera, this.group);
    }

    public getFootCoords(): THREE.Vector3[] {
        const forward = new THREE.Vector3();
        this.group.getWorldDirection(forward);

        const up = new THREE.Vector3(0, 1, 0);

        const right = new THREE.Vector3().crossVectors(forward, up).normalize();

        const leftOrigin = this.group.position.clone().addScaledVector(right, -1);
        const rightOrigin = this.group.position.clone().addScaledVector(right, 1);

        return [
            leftOrigin.clone().addScaledVector(forward, -this.playerSize/2),
            rightOrigin.clone().addScaledVector(forward, -this.playerSize/2),
            leftOrigin.clone().addScaledVector(forward, this.playerSize/2),
            rightOrigin.clone().addScaledVector(forward, this.playerSize/2),
        ];
    }

    public applyDamage(damagePerc?: number) {
        this.healthPerc -= damagePerc ?? 20;
        if (this.healthPerc < 0)
            this.healthPerc = 0;

        this.hpBar.setHp(this.healthPerc / 100);
    }
}

export enum MovementDirection {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right'
}

export type ActiveMovementDirection = Record<MovementDirection, boolean>;
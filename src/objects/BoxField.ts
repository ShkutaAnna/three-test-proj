import * as THREE from 'three';

export class BoxField {
    public floor: THREE.Mesh;
    public walls: THREE.Mesh[] = [];

    public boxGroup: THREE.Group;


    private width = 20;
    private height = 5;
    // private depth = 1;

    constructor() {
        this.boxGroup = new THREE.Group();

        this.floor = new THREE.Mesh(
            new THREE.PlaneGeometry(this.width, this.width),
            new THREE.MeshNormalMaterial({
                side: THREE.DoubleSide,
            }),
        );

        const colors = [
            '#e47d41',
            '#65b835',
            '#8f35b8',
            '#b83535'
        ]

        for (let i = 0; i < 4; i++) {
            this.walls.push(new THREE.Mesh(
                new THREE.PlaneGeometry(this.width, this.height),
                new THREE.MeshBasicMaterial({
                    color: colors[i],
                    side: THREE.DoubleSide,
                }),
            ));
        }

        this.walls[0].rotation.z = Math.PI;
        this.walls[0].rotation.y = Math.PI/2;
        this.walls[0].position.x = -this.width/2;
        this.walls[0].position.y = this.height/2;

        this.walls[1].rotation.z = Math.PI;
        this.walls[1].position.y = this.height/2;
        this.walls[1].position.z = -this.width/2;

        this.walls[2].rotation.z = Math.PI;
        this.walls[2].rotation.y = Math.PI/2;
        this.walls[2].position.x = this.width/2;
        this.walls[2].position.y = this.height/2;

        this.walls[3].rotation.z = Math.PI;
        this.walls[3].position.z = this.width/2;
        this.walls[3].position.y = this.height/2;

        this.floor.rotation.x = -Math.PI / 2;

        this.boxGroup.add(this.floor);
        this.boxGroup.add(...this.walls);
    }

    public getGroundHit(fromPoint: THREE.Vector3): THREE.Vector3 | null {
        const raycaster = new THREE.Raycaster();
        const direction = new THREE.Vector3(0, -1, 0);
        raycaster.set(fromPoint, direction);
        const hits = raycaster.intersectObjects([this.floor]);
        return hits[0] ? hits[0].point : null;
    }
}
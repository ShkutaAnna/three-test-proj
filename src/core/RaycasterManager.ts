import * as THREE from 'three';

export class RaycasterManager {
    private raycaster = new THREE.Raycaster();
    private mouse = new THREE.Vector2();

    // private rayLine: THREE.Line;

    constructor(
        private camera: THREE.Camera,
        private scene: THREE.Scene,
    ) {}

    public getIntersection(event: PointerEvent, object?: THREE.Mesh) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // this.drawRay();

        const intersects = object
            ? this.raycaster.intersectObject(object, true)
            : this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length === 0)
            return null;

        return intersects[0];
    }

    // private drawRay() {
    //     const origin = this.raycaster.ray.origin.clone();
    //     const direction = this.raycaster.ray.direction.clone();

    //     const length = 100;

    //     const points = [
    //         origin,
    //         origin.clone().add(direction.multiplyScalar(length))
    //     ];

    //     if (this.rayLine) {
    //         this.rayLine.geometry.setFromPoints(points);
    //     } else {
    //         const geometry = new THREE.BufferGeometry().setFromPoints(points);

    //         const material = new THREE.LineBasicMaterial({
    //             color: 0xff0000
    //         });

    //         this.rayLine = new THREE.Line(geometry, material);
    //         this.scene.add(this.rayLine);
    //     }
    // }
}
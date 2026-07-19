import * as THREE from 'three';

export class Laser {
    private start = new THREE.Vector3();
    private direction = new THREE.Vector3();

    public isFinished = false;

    public headLength = 0;
    public tailLength = 0;

    public beamStart = 0;
    public beamEnd = 0;

    public maxLength = 10;
    
    public currentLength = 0;

    // public totalLength = 0;

    public speed = 5;

    public points: THREE.Vector3[] = [];
    public segments: LaserSegment[] = [];

    private geometry = new THREE.BufferGeometry();

    private material = new THREE.LineBasicMaterial({
        color: 0xff0000
    });

    private line = new THREE.Line(
        this.geometry,
        this.material
    );

    private maxHits = 10;

    constructor(
        private scene: THREE.Scene,
    ) {
        this.scene.add(this.line);
    }

    // Raycaster + reflect
    shoot(origin: THREE.Vector3, direction: THREE.Vector3, walls: THREE.Mesh[]) {
        this.isFinished = false;

        this.start.copy(origin);
        this.direction.copy(direction).normalize();

        this.beamStart = 0;
        this.beamEnd = 0;

        const raycaster = new THREE.Raycaster();

        this.points = [origin.clone()];

        for (let i = 0; i < this.maxHits; i++) {

            raycaster.set(origin, direction);

            const hits = raycaster.intersectObjects(walls);

            if (!hits.length) {
                this.points.push(origin.clone().add(direction.clone().multiplyScalar(100)));
                break;
            }

            const hit = hits[0];

            this.points.push(hit.point.clone());

            const normal = hit.face.normal.clone();
            normal.transformDirection(hit.object.matrixWorld);

            direction.reflect(normal);

            origin = hit.point.clone().add(direction.clone().multiplyScalar(0.001));
        }

        this.segments = this.calculateSegments(this.points);
    }

    dispose() {
        this.scene.remove(this.line);

        this.geometry.dispose();
        this.material.dispose();

    }

    update(dt: number) {
        this.beamEnd += this.speed * dt;

        if (this.beamEnd >= this.maxLength) {
            this.beamEnd = this.maxLength;
            this.beamStart += this.speed * dt;
        }

        if (this.beamStart >= this.maxLength) {
            this.isFinished = true;
            return;
        }


        // this.currentLength += this.speed * dt;

        // if (this.currentLength > this.maxLength) {
        //     this.currentLength = this.maxLength;
        // }

        this.render();
    }

    private render() {
        const renderPoints = this.getRenderPoints(this.beamStart, this.beamEnd);

        this.geometry.dispose();

        this.geometry = new THREE.BufferGeometry()
            .setFromPoints(renderPoints);

        this.line.geometry = this.geometry;
        

        this.geometry.setFromPoints(renderPoints);
    }

    private getRenderPoints(beamStart: number, beamEnd: number) {
        const renderPoints: THREE.Vector3[] = [];

        for (let seg of this.segments) {
            if (beamStart < seg.endDistance && beamEnd > seg.startDistance) {
                // start in seg
                if (beamStart > seg.startDistance && beamStart < seg.endDistance) {
                    const dir = seg.end.clone().sub(seg.start).normalize();

                    const point = seg.start.clone().add(dir.multiplyScalar(beamStart - seg.startDistance));
                    renderPoints.push(point);
                } else {
                    renderPoints.push(seg.start);
                }

                // end in seg
                if (beamEnd > seg.startDistance && beamEnd < seg.endDistance) {
                    const dir = seg.end.clone().sub(seg.start).normalize();

                    const point = seg.start.clone().add(dir.multiplyScalar(beamEnd - seg.startDistance));
                    renderPoints.push(point);
                    break;
                } else {
                    renderPoints.push(seg.end);
                }
            }
        }

        return renderPoints;
    }

    private getRenderPoints1() {
        const renderPoints: THREE.Vector3[] = [];

        let remaining = this.currentLength;

        for (let i = 0; i < this.points.length - 1; i++) {

            const start = this.points[i];
            const end = this.points[i + 1];

            const segmentLength = start.distanceTo(end);

            // if (segmentLength > this.beamStart) {
            //     const dir = end.clone().sub(start).normalize();
            //     const point = start.clone().add(dir.multiplyScalar(remaining));
            // }

            // весь сегмент вже пройдений
            if (remaining >= segmentLength) {

                renderPoints.push(start);
                renderPoints.push(end);

                remaining -= segmentLength;
            } else {
                // тільки частина сегмента
                const dir = end.clone()
                    .sub(start)
                    .normalize();

                const point = start.clone().add(dir.multiplyScalar(remaining));

                renderPoints.push(start);
                renderPoints.push(point);

                break;
            }
        }

        return renderPoints;
    }

    // private calculateLength() {
    //     this.totalLength = 0;

    //     for (let i = 0; i < this.points.length - 1; i++) {
    //         this.totalLength += this.points[i].distanceTo(this.points[i + 1]);
    //     }
    // }

    private calculateSegments(points: THREE.Vector3[]): LaserSegment[] {
        const segments = [];
        for (let i = 0; i < points.length - 1; i++) {
            const start = points[i];
            const end = points[i+1];

            segments.push({
                start,
                end,
                startDistance: start.distanceTo(points[0]),
                endDistance: end.distanceTo(points[0]),
            });
        }
        return segments;
    }
}

export interface LaserSegment {
    start: THREE.Vector3;
    end: THREE.Vector3;
    // s .----.|----|-----> e
    startDistance: number;
    // s .----|----|.-----> e
    endDistance: number;
}
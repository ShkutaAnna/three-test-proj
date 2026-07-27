import * as THREE from 'three';
import { gsap } from "gsap";

export class HpBar {
    private readonly width = 1.2;
    private readonly height = 0.12;

    public group: THREE.Group;

    private bg: THREE.Mesh;
    private hp: THREE.Mesh;
    private flash: THREE.Mesh;

    private parentQuat = new THREE.Quaternion();

    constructor() {
        this.init();
    }

    private init() {
        this.group = new THREE.Group();

        this.bg = new THREE.Mesh(
            new THREE.PlaneGeometry(this.width, this.height),
            new THREE.MeshBasicMaterial({
                color: 0x555555,
                transparent: true
            })
        );

        this.hp = new THREE.Mesh(
            new THREE.PlaneGeometry(this.width, this.height),
            new THREE.MeshBasicMaterial({
                color: 0xff3333,
                transparent: true
            })
        );

        this.flash = new THREE.Mesh(
            new THREE.PlaneGeometry(this.width, this.height),
            new THREE.MeshBasicMaterial({
                color: 0x33bbff,
                transparent: true,
                opacity: 0
            })
        );

        this.hp.position.z = 0.002;
        this.flash.position.z = 0.001;

        this.hp.position.x = -this.width / 2;
        this.flash.position.x = -this.width / 2;

        this.hp.geometry.translate(this.width / 2, 0, 0);
        this.flash.geometry.translate(this.width / 2, 0, 0);

        this.group.add(this.bg, this.flash, this.hp);

        this.group.position.set(0, 2.2, 0);
    }

    public updateRotation(camera: THREE.Camera, parent: THREE.Object3D) {
        parent.getWorldQuaternion(this.parentQuat);

        this.group.quaternion.copy(camera.quaternion);

        this.parentQuat.invert();
        this.group.quaternion.premultiply(this.parentQuat);
    }

    public setHp(percent: number) {
        if (percent < 0) return;

        const tl = gsap.timeline();

        tl.to(this.flash.material, {
            opacity: 1,
            duration: 0.08,
            repeat: 3,
            yoyo: true,
        });

        tl.to(this.hp.scale, {
            x: percent,
            duration: 0.35,
            ease: "power2.out"
        });
    }
}

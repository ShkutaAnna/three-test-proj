import * as THREE from 'three';

import { SceneManager } from "./Scene";
import { CameraManager } from "./Camera";
import { RendererManager } from "./Renderer";

import { Player, type ActiveMovementDirection } from "../objects/Player";

// import { AnimationManager } from "../animations/AnimationManager";
import { ResizeManager } from "./Resize";
import { InputManager } from "./InputManager";
import { RaycasterManager } from "./RaycasterManager";
import { EffectManager } from "../effects/EffectManager";
import { UIManager } from "../ui/UIManager";
import { BoxField } from "../objects/BoxField";
import { Laser } from "../effects/Laser";
import { OrbitControlManager } from "./OrbitControlManager";
import { GuiManager } from "./GuiManager";
import { Bullet } from '../effects/Bullet';
import { MeteoManager } from './MeteoManager';

export class Game {
    private sceneManager = new SceneManager();
    private camaraManager = new CameraManager();
    private rendererManager = new RendererManager();
    private effectManager: EffectManager;
    private inputManager = new InputManager();
    private raycaster: RaycasterManager;
    private guiManager: GuiManager;

    private player = new Player(this.camaraManager.camera);
    // private field = new Field();
    private boxField = new BoxField();

    private meteoManager: MeteoManager;

    private orbitControlManager: OrbitControlManager;

    // private animations = new AnimationManager();
    private isLasersActive = false;
    private lasers: Laser[] = [];
    private isBulletsActive = true;
    private bullets: Bullet[] = [];
    
    private splashDistance = 0;
    private lastPlayerPos = new THREE.Vector3();

    private clock = new THREE.Clock();

    private playerMovementState: ActiveMovementDirection = {
        Up: false,
        Down: false,
        Left: false,
        Right: false,
    }

    constructor() {
        new UIManager();
        new ResizeManager(this.camaraManager.camera, this.rendererManager.renderer);
        this.raycaster = new RaycasterManager(this.camaraManager.camera, this.sceneManager.scene);
        this.effectManager = new EffectManager(this.sceneManager.scene);
        this.guiManager = new GuiManager();
        this.guiManager.gui.hide();
        this.guiManager.addDefaultControls('camera', this.camaraManager.camera);
        this.sceneManager.scene.add(this.player.group);
        this.sceneManager.scene.add(this.boxField.boxGroup);

        this.meteoManager = new MeteoManager(this.boxField.width, this.boxField.width, this.boxField.height, this.boxField.boxGroup.position, this.sceneManager.scene);

        this.inputManager.onClick(this.handleClick);
        this.inputManager.onKeyPressed(this.handleKeyPress);
        this.inputManager.onKeyRelease(this.handleKeyUp);

        // FLY CAMERA
        this.orbitControlManager = new OrbitControlManager(this.camaraManager.camera, this.rendererManager.renderer);
        this.orbitControlManager.isEnabled = true;

        const axesHelper = new THREE.AxesHelper(5);
        this.sceneManager.scene.add(axesHelper);
        axesHelper.setColors('#ffffff', '#000000', '#ff0000');

        this.animate();
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        this.executeMoves();

        // FLY CAMERA
        if (this.orbitControlManager.isEnabled)
            this.orbitControlManager.update();

        const dt = this.clock.getDelta();

        this.meteoManager.checkForHits(this.player);

        for (let i = 0; i < this.lasers.length; i++) {
            const laser = this.lasers[i];
            laser.update(dt);
            if (laser.isFinished) {
                laser.dispose();
                this.lasers.splice(i, 1);
            }
        }

        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            bullet.update(dt);
            if (bullet.isFinished) {
                this.sceneManager.scene.remove(bullet);
                this.bullets.splice(i, 1);
            }
        }

        this.rendererManager.renderer.render(
            this.sceneManager.scene,
            this.camaraManager.camera,
        )
    }

    private executeMoves() {
        if (!Object.values(this.playerMovementState).some(Boolean)) return;

        this.player.movePlayer(this.playerMovementState);
        this.camaraManager.camera.lookAt(this.player.group.position);

        const distance = this.player.group.position.distanceTo(this.lastPlayerPos);
        this.splashDistance += distance;

        if (this.splashDistance > 0.5) { // every 0.5 units
            this.splashWaterFromPlayer();
            this.splashDistance = 0;
        }

        this.lastPlayerPos.copy(this.player.group.position);
    }

    private splashWaterFromPlayer() {
        const playerFootCoords = this.player.getFootCoords();
        playerFootCoords.forEach((point) => {
            const splashPoint = this.boxField.getGroundHit(point);
            if (!splashPoint) return;

            this.effectManager.spawnParticleExplosion(splashPoint);
        })
    }

    private handleClick = (event: PointerEvent) => {
        const hit = this.raycaster.getIntersection(event);
        if (!hit) return;

        // if (hit.object.id === this.field.mesh.id) {
        //     this.effectManager.spawnParticleExplosion(hit.point);
        // }

        if (hit.object.id === this.boxField.floor.id) {
            this.effectManager.spawnParticleExplosion(hit.point);
        }
    }

    private handleKeyPress = (event: KeyboardEvent) => {
        const { key } = event;
        if (key === ActionKeyboardKeys.Space) {
            if (this.isLasersActive) {
                this.shootLaserFromPlayer();
            }

            if (this.isBulletsActive) {
                this.shootBulletFromPlayer();
            }
        }
        
        if (Object.values(MovementDirectionKeyboardKeys).includes(key as KeyboardKeys)) {
            this.updateCurrentMovementState(event.key as MovementDirectionKeyboardKeys, true);
        }
    }

    private handleKeyUp = (event: KeyboardEvent) => {
        this.updateCurrentMovementState(event.key as MovementDirectionKeyboardKeys, false);
    }

    private updateCurrentMovementState(key: MovementDirectionKeyboardKeys, value: boolean) {
        switch (key) {
            case MovementDirectionKeyboardKeys.ArrowUp:
            case MovementDirectionKeyboardKeys.KeyUp:
                this.playerMovementState.Up = value;
                break;
            case MovementDirectionKeyboardKeys.ArrowDown:
            case MovementDirectionKeyboardKeys.KeyDown:
                this.playerMovementState.Down = value;
                break;
            case MovementDirectionKeyboardKeys.ArrowLeft:
            case MovementDirectionKeyboardKeys.KeyLeft:
                this.playerMovementState.Left = value;
                break;
            case MovementDirectionKeyboardKeys.ArrowRight:
            case MovementDirectionKeyboardKeys.KeyRight:
                this.playerMovementState.Right = value;
                break;
        
            default:
                break;
        }
    }

    private shootBulletFromPlayer() {
        const origin = this.player.group.position.clone();
        console.log(origin);
        const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(this.player.group.quaternion).normalize();

        const bullet = new Bullet(origin, direction, 5, this.boxField.width, this.boxField.width);
        this.sceneManager.scene.add(bullet);
        this.bullets.push(bullet);
    }

    private shootLaserFromPlayer() {
        const origin = this.player.group.position.clone();
        const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(this.player.group.quaternion).normalize();
        // this.effectManager.shootLaser(origin, direction, this.boxField.walls);

        const laser = new Laser(this.sceneManager.scene);
        laser.shoot(origin, direction, this.boxField.walls);
        this.lasers.push(laser);
    }
}

export enum MovementDirectionKeyboardKeys {
    ArrowUp = 'ArrowUp',
    ArrowDown = 'ArrowDown',
    ArrowLeft = 'ArrowLeft',
    ArrowRight = 'ArrowRight',
    KeyUp = 'w',
    KeyDown = 's',
    KeyLeft = 'a',
    KeyRight = 'd',
}

export enum ActionKeyboardKeys {
    Space = ' ',
}

export type KeyboardKeys = MovementDirectionKeyboardKeys & ActionKeyboardKeys;
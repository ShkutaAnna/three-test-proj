import * as THREE from 'three';

import { SceneManager } from "./Scene";
import { CameraManager } from "./Camera";
import { RendererManager } from "./Renderer";

import { Player, type ActiveMovementDirection } from "../objects/Player";
import { Enemy } from "../objects/Enemy";

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

export class Game {
    private sceneManager = new SceneManager();
    private camaraManager = new CameraManager();
    private rendererManager = new RendererManager();
    private effectManager: EffectManager;
    private inputManager = new InputManager();
    private raycaster: RaycasterManager;
    private guiManager: GuiManager;

    private player = new Player();
    private enemy = new Enemy();
    // private field = new Field();
    private boxField = new BoxField();

    private orbitControlManager: OrbitControlManager;

    // private animations = new AnimationManager();
    private lasers: Laser[] = [];
    
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
        this.guiManager.addDefaultControls('ball', this.enemy.mesh);
        this.guiManager.addDefaultControls('camera', this.camaraManager.camera);
        
        this.sceneManager.scene.add(this.player.mesh);
        this.sceneManager.scene.add(this.enemy.mesh);
        this.sceneManager.scene.add(this.boxField.boxGroup);

        // this.animations.rotate(this.player.mesh);
        this.inputManager.onClick(this.handleClick);
        this.inputManager.onKeyPressed(this.handleKeyPress);
        this.inputManager.onKeyRelease(this.handleKeyUp);

        // FLY CAMERA
        this.orbitControlManager = new OrbitControlManager(this.camaraManager.camera, this.rendererManager.renderer);
        this.orbitControlManager.isEnabled = false;

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

        for (let i = 0; i < this.lasers.length; i++) {
            const laser = this.lasers[i];
            laser.update(dt);
            if (laser.isFinished) {
                laser.dispose();
                this.lasers.splice(i, 1);
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
        this.camaraManager.camera.lookAt(this.player.mesh.position);

        const distance = this.player.mesh.position.distanceTo(this.lastPlayerPos);
        this.splashDistance += distance;

        if (this.splashDistance > 0.5) { // every 0.5 units
            this.splashWaterFromPlayer();
            this.splashDistance = 0;
        }

        this.lastPlayerPos.copy(this.player.mesh.position);
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
            this.shootLaserFromPlayer();
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

    private shootLaserFromPlayer() {
        const origin = this.player.mesh.position.clone();
        const direction = new THREE.Vector3(1, 0, 0).applyQuaternion(this.player.mesh.quaternion).normalize();
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
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class OrbitControlManager {
    
    public get isEnabled(): boolean {
        return this._isEnabled;
    }

    
    public set isEnabled(val: boolean) {
        this._isEnabled = val;
        if (val)
            this.init();
        else if (this._controls)
            this._controls.enabled = false;
    }
    
    
    private _controls: OrbitControls;
    private _isEnabled = false;

    constructor(
        private _camera: THREE.Camera,
        private _renderer: THREE.WebGLRenderer,
    ) { }

    public update() {
        if (!this._controls) return;

        this._controls.update();
    }

    private init() {
        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._camera.position.set(0, 5, 5);
        this._controls.update();
    }
}
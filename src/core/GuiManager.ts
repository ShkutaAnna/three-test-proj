import GUI from 'lil-gui';
import * as THREE from 'three';

export class GuiManager {
    public gui: GUI;

    constructor() {
        this.gui = new GUI();

        const params = {
            speed: 5,
            showParticles: true,
        };

        this.gui.add(params, 'speed', 0, 20, 0.1);
        this.gui.add(params, 'showParticles');
    }

    public addDefaultControls(folderName: string, obj: THREE.Object3D) {
        const _dmin = -10;
        const _dmax = 10;
        const _dstep = 0.0001;

        const folder = this.gui.addFolder(folderName);

        const position = folder.addFolder('rotation');
        position.add(obj.position, 'x', _dmin, _dmax, _dstep);
        position.add(obj.position, 'y', _dmin, _dmax, _dstep);
        position.add(obj.position, 'z', _dmin, _dmax, _dstep);


        const rotation = folder.addFolder('rotation');
        rotation.add(obj.rotation, 'x', -4, 4, _dstep);
        rotation.add(obj.rotation, 'y', -4, 4, _dstep);
        rotation.add(obj.rotation, 'z', -4, 4, _dstep);
    }
}
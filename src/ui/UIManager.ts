import { Header } from "./Header";

export class UIManager {
    private header = new Header();

    constructor() {
        document.body.appendChild(this.header.element);
    }
}
export class Score {
    public element: HTMLElement;
    private score = 0;

    setScore(value: number) {
        this.score = value;
    }

    add(points: number) {
        this.score += points;
    }
}
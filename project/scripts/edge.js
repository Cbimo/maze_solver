
// Edge class representing a connection between two points in a maze
export class Edge {
    // Constructor initialize the edge
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }

    // Get the middle point between 'from' and 'to'
    get_middle() {
        return [Math.floor((this.from[0] + this.to[0]) / 2), Math.floor((this.from[1] + this.to[1]) / 2)];
    }
}
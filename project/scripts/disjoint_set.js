
// DisjointSet class for implementing the disjoint-set data structure
export class DisjointSet {
    // Constructor to create a new data structure
    constructor(N) {
        this.rep = [];
        this.size = [N];
        for (let i = 0; i < N; ++i) {
            this.rep.push(i);
        }
    }

    //Merge two sets by rank to maintain balance
    merge(i, j) {
        let a = this.find(i);
        let b = this.find(j);
        if (a == b)
            return;
        if (this.size[a] < this.size[b]) {
            this.rep[a] = b;
            this.size[b] += this.size[a];
        }
        else {
            this.rep[b] = a;
            this.size[a] += this.size[b];
        }
    }

    // Find the representative root of the set containing the given element
    find(a) {
        if (a != this.rep[a]) {
            this.rep[a] = this.find(this.rep[a]);
            return this.rep[a];
        }
        return a;
    }
};
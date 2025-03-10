import {Edge} from './edge.js';
import {DisjointSet} from './disjoint_set.js';

const EMPTY_COLOR = "#FFF";
const WALL_COLOR = "#000";
const VISITED_COLOR = "#ADADAD";
const PATH_COLOR = "#FF5E00";
const START_COLOR = "#0F0";
const END_COLOR = "#F00";

export class Maze {

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    // Set initial properties
    set_properties(grid, start, end) {
        this.grid = grid;
        this.size = this.grid.length;
        this.start = start;
        this.end = end;
        this.width = this.canvas.width / this.grid.length;
        this.visited = Array(this.size).fill().map(() => Array(this.size).fill(false));
        this.timeoutID = undefined;
    }

    async clear_timeout() {
        clearTimeout(this.timeoutID);
    }

    // Clear visited state of the maze
    clear_visited() {
        this.visited = Array(this.size).fill().map(() => Array(this.size).fill(false));
    }

    // Draw all tiles of the maze
    draw_all() {
        for (let r = 0; r < this.size; ++r) {
            for (let c = 0; c < this.size; ++c) {
                this.draw_tile([r, c]);
            }
        }
    }

    // function to draw start and end point circles
    draw_circle(tile, color) {
        this.ctx.beginPath();
        this.ctx.arc(tile[1] * this.width + this.width / 2, tile[0] * this.width + this.width / 2, this.width / 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    // function to call to draw tiles of the maze
    draw_tile(tile) {
        let [r, c] = tile;
        this.ctx.fillStyle = EMPTY_COLOR;
        this.ctx.strokeStyle = WALL_COLOR;
        this.ctx.lineWidth = .5;
        if (this.grid[r][c] == 1)
            this.ctx.fillStyle = WALL_COLOR;
        else if (this.visited[r][c])
            this.ctx.fillStyle = VISITED_COLOR;
        this.ctx.fillRect(c * this.width, r * this.width, this.width, this.width);
        this.ctx.strokeRect(c * this.width, r * this.width, this.width, this.width);
        if (array_equals(tile, this.start))
            this.draw_circle(this.start, START_COLOR);
        if (array_equals(tile, this.end))
            this.draw_circle(this.end, END_COLOR);
    }

    // Draw path on the canvas
    draw_path(path) {
        let middle = .35;
        let edge = (1 - middle) / 2;
        let w = this.width;
        this.ctx.fillStyle = PATH_COLOR;
        for (let i = 0; i < path.length - 1; i++) {
            let curr = path[i];
            let next = path[i + 1];
            let [r, c] = curr;
            let direction = [next[0] - curr[0], next[1] - curr[1]];

            if (direction[0] === 0)
                this.ctx.fillRect((c + direction[1] * edge) * w, (r + edge) * w, (2 * edge + middle) * w + 1, middle * w + 1);
            if (direction[1] == 0)
                this.ctx.fillRect((c + edge) * w, (r + direction[0] * edge) * w, middle * w + 1, (2 * edge + middle) * w + 1);
        }
        this.draw_circle(this.start, START_COLOR);
        this.draw_circle(this.end, END_COLOR);
    }

    // Check if a tile is movable
    check_movable(curr) {
        let [r, c] = curr;
        return 0 <= r && r < this.size &&
            0 <= c && c < this.size &&
            this.grid[r][c] == 0;
    }


    // ----- SEARCHING METHOD -----

    // Get adjacent tiles of a given tile
    get_adjs(tile) {
        let [r, c] = tile;
        let poss_adjs = [[r - 1, c], [r, c + 1], [r + 1, c], [r, c - 1]];
        return poss_adjs.filter((poss_adj) => this.check_movable(poss_adj));
    }

    // Perform breadth-first or depth-first
    async simple_search(type, delay) {
        console.assert(type === "depth" || type === "breadth");
        const startTime = performance.now();
        this.clear_timeout();
        this.visited = square_array(this.size, false);
        this.draw_all();
        let deque = [[this.start]];
        const step = () => {
            if (deque.length == 0){
                window.alert("Maze cleared without finding the endpoint.");
                return;
            }

            let path;
            if (type === "depth")
                path = deque.pop();
            else
                path = deque.shift();
            let curr = path[path.length - 1];
            let [r, c] = curr;
            if (this.visited[r][c])
                return step();
            this.visited[r][c] = true;
            this.draw_tile(curr);
            if (array_equals(curr, this.end)) {
                this.draw_path(path);

                const endTime = performance.now();
                const solvingTime = endTime - startTime;
                window.alert(`Time taken to solve using ${type} search: ${solvingTime.toFixed(2)} ms`);
                return path;
            }
            for (const adj of this.get_adjs(curr)) {
                deque.push([...path, adj]);
            }
            return new Promise((resolve) => this.timeoutID = setTimeout(() => resolve(step()), delay));
        };
        return await step();
    }

    // ----- MAZE GENERATION -----

    // Get adjacent tiles for maze generation
    get_generation_adjs(curr) {
        let [r, c] = curr;
        let edges = [
            new Edge(curr, [r - 2, c]),
            new Edge(curr, [r, c + 2]),
            new Edge(curr, [r + 2, c]),
            new Edge(curr, [r, c - 2]),
        ];
        edges = edges.filter((edge) => this.check_movable(edge.to));
        return edges;
    }

    // Generate maze using depth-first algo
    async depth(size, delay) {
        this.clear_timeout();
        this.set_properties(...prepare_maze(size));
        this.draw_all();
        let gen_start = random_even_coord(size);
        let stack = [new Edge(gen_start, gen_start)];
        let added = square_array(this.size, false);
        const shuffle = (arr) => {
            return arr
                .map(val => ({val, sort: Math.random()}))
                .sort((a, b) => a.sort - b.sort)
                .map(({val}) => val);
        };
        const step = () => {
            if(stack.length === 0)
                return;
            let edge = stack.pop();
            if (added[edge.to[0]][edge.to[1]])
                return step();
            added[edge.to[0]][edge.to[1]] = true;
            let wall = edge.get_middle();
            this.grid[wall[0]][wall[1]] = 0;
            stack.push(...shuffle(this.get_generation_adjs(edge.to)));
            this.draw_tile(wall);
            return new Promise((resolve) => this.timeoutID = setTimeout(() => resolve(step()), delay));
        };
        return await step();
    }

    // Generate maze using Prim's algo
    async prims(size, delay) {
        this.clear_timeout();
        this.set_properties(...prepare_maze(size));
        this.draw_all();
        let gen_start = random_even_coord(size);
        let edges = [new Edge(gen_start, gen_start)];
        let added = square_array(this.size, false);
        const step = () => {
            if (edges.length === 0)
                return
            let ind = Math.floor(Math.random() * edges.length);
            let edge = edges[ind];
            edges.splice(ind, 1);
            if (added[edge.to[0]][edge.to[1]])
                return step(edges, added, delay);
            added[edge.to[0]][edge.to[1]] = true;
            let wall = edge.get_middle();
            this.grid[wall[0]][wall[1]] = 0;
            edges.push(...this.get_generation_adjs(edge.to));
            this.draw_tile(wall);
            return new Promise((resolve) => this.timeoutID = setTimeout(() => resolve(step(edges, added, delay)), delay));
        };
        return await step(edges, added, delay);
    }

    // Generate maze using Kruskal's algo
    async kruskals(size, delay) {
        this.clear_timeout();
        this.set_properties(...prepare_maze(size));
        this.draw_all();
        const tile_to_int = (tile) => tile[0] * size + tile[1];
        const all_edges = (size) => {
            let edges = [];
            for (let r = 0; r < size; r += 2) {
                for (let c = 0; c < size; c += 2) {
                    if (r + 2 < size) {
                        edges.push(new Edge([r, c], [r + 2, c]));
                    }
                    if (c + 2 < size) {
                        edges.push(new Edge([r, c], [r, c + 2]));
                    }
                }
            }
            return edges;
        }
        let edges = all_edges(size);
        let ds = new DisjointSet(size * size);
        const step = () => {
            if (edges.length === 0)
                return;
            let ind = Math.floor(Math.random() * edges.length);
            let edge = edges[ind];
            edges.splice(ind, 1);
            if (ds.find(tile_to_int(edge.from)) === ds.find(tile_to_int(edge.to))) {
                return step();
            }
            ds.merge(tile_to_int(edge.from), tile_to_int(edge.to));
            let wall = edge.get_middle();
            this.grid[wall[0]][wall[1]] = 0;
            this.draw_tile(wall);
            return new Promise((resolve) => this.timeoutID = setTimeout(() => resolve(step()), delay));
        };
        return await step();
    }

    // Handle editing of maze tiles
    edit(x, y, mode, edit_tab_button) {
        if(!edit_tab_button.className.includes("clicked"))
            return;
        let r = Math.floor(y / parseFloat(getComputedStyle(this.canvas).height) * this.size);
        let c = Math.floor(x / parseFloat(getComputedStyle(this.canvas).width) * this.size);
        const clear_visited = () => {
            if (this.visited.some((row) => row.includes(true))) {
                this.visited = square_array(this.size, false);
                this.draw_all();
            }
        }
        const update_tiles = (tiles) => {
            this.clear_timeout();
            clear_visited();
            for (const tile of tiles) {
                this.draw_tile(tile);
            }
        }
        if (mode === 0 && this.grid[r][c] != 1) {
            this.grid[r][c] = 1;
            update_tiles([[r, c]]);
        }
        else if (mode === 1 && this.grid[r][c] != 0) {
            this.grid[r][c] = 0;
            update_tiles([[r, c]]);
        }
        else if (mode === 2 && this.grid[r][c] == 0) {
            const old_start = this.start;
            this.start = [r, c];
            update_tiles([[r, c], old_start]);
        }
        else if (mode === 3 && this.grid[r][c] == 0) {
            let old_end = this.end;
            this.end = [r, c];
            update_tiles([[r, c], old_end]);
        }
    }
}

// Generate a random coordinate within the maze size for generation
function random_even_coord(size) {
    const random_even_number = () => Math.floor(Math.random() * Math.floor((size + 1) / 2)) * 2;
    let r = random_even_number();
    let c = random_even_number();
    return [r, c];
}

function prepare_maze(size) {
    if (size % 2 != 1)
        size -= 1;
    let grid = Array(size).fill().map(() => Array(size).fill(1));
    for (let r = 0; r < size; r += 2) {
        for (let c = 0; c < size; c += 2) {
            grid[r][c] = 0;
        }
    }
    let start = random_even_coord(size);
    let end = random_even_coord(size);
    while (array_equals(start, end)) {
        end = random_even_coord(size);
    }
    return [grid, start, end];
}

function array_equals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, ind) => val === b[ind]);
}

export function square_array(size, val) {
    return Array(size).fill().map(() => Array(size).fill(val));
}
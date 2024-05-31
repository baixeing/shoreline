const WOBBLE = 1.5;
const STRETCH = 50;
const POINTS = 16;
const BASE_RADIUS = 300;
const RADIUS_RND_FACTOR = 0.2;
const BLOBS = 10;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGH = 950;
const GRADIENT_COLOR_STEPS = 6;

const Blob = class {
    constructor(generation) {
        this.generation = generation
        this.blob = this.#build_blob();
    }

    #build_blob = () => {
        let blob = [];

        for (let i = 0; i < POINTS; i++) {
            let a = (i + 1) * TWO_PI / POINTS;
            let r = BASE_RADIUS + random(-RADIUS_RND_FACTOR * BASE_RADIUS, RADIUS_RND_FACTOR * BASE_RADIUS);

            let x = cos(a) * r * 3;
            let y = sin(a) * r;

            let rand_angle = random(-WOBBLE, WOBBLE);

            let p = {
                x: x,
                y: y,
                control_points: [
                    {
                        x: x + (cos(a - (HALF_PI + rand_angle)) * STRETCH),
                        y: y + (sin(a - (HALF_PI + rand_angle)) * STRETCH),
                    },
                    {
                        x: x + (cos(a + (HALF_PI - rand_angle)) * STRETCH),
                        y: y + (sin(a + (HALF_PI - rand_angle)) * STRETCH),
                    },
                ],
            }

            blob.push(p);
        }

        return blob;
    }

    draw = () => {
        translate(0, random(0, CANVAS_HEIGH / 3));

        stroke(0);
        strokeWeight(0);

        beginShape();

        vertex(this.blob[0].x, this.blob[0].y);

        for (let i = 1; i < this.blob.length; i++) {
            bezierVertex(
                this.blob[i - 1].control_points[1].x,
                this.blob[i - 1].control_points[1].y,
                this.blob[i].control_points[0].x,
                this.blob[i].control_points[0].y,
                this.blob[i].x,
                this.blob[i].y,
            );
        }

        bezierVertex(
            this.blob[this.blob.length - 1].control_points[1].x,
            this.blob[this.blob.length - 1].control_points[1].y,
            this.blob[0].control_points[0].x,
            this.blob[0].control_points[0].y,
            this.blob[0].x,
            this.blob[0].y,
        );

        let steps = []
        Array.apply(null, { length: GRADIENT_COLOR_STEPS }).forEach(() => steps.push(color(palette[floor(random(palette.length + 1))])));
        let transparency = random(10, 200 - this.generation);

        steps.forEach((c) => c.setAlpha(transparency));

        let mradius = max(this.blob.map((b) => b.x))
        let p = this.blob[floor(random(0, this.blob.length))]

        fillGradient('radial', {
            from: [p.x, p.y, 50],
            to: [p.x + 10, p.y + 10, mradius],
            steps: steps,
        });

        endShape();
    }
}

let blobs = [];

function setup() {
    noLoop();
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGH);

    for (let i = 0; i < BLOBS; i++) {
        blobs.push(new Blob(i));
    }
}

function draw() {
    translate(CANVAS_WIDTH / 2, CANVAS_HEIGH / 2);
    blobs.forEach((blob) => { blob.draw(); });
}
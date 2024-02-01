class Vertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    rotateX(angle) {
        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const y = this.y * cos - this.z * sin;
        const z = this.y * sin + this.z * cos;
        return new Vertex(this.x, y, z);
    }

    rotateY(angle) {
        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const x = this.z * sin + this.x * cos;
        const z = this.z * cos - this.x * sin;
        return new Vertex(x, this.y, z);
    }

    rotateZ(angle) {
        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        return new Vertex(x, y, this.z);
    }
}

class Cube {
    constructor(length, center) {
        const distance = length / 2
        // x = right/left y = forwards/backwards z = up/down
        this.vertices = [
            new Vertex(center.x - distance, center.y - distance, center.z - distance), // -x, -y, -z
            new Vertex(center.x - distance, center.y - distance, center.z + distance), // -x, -y, +z
            new Vertex(center.x - distance, center.y + distance, center.z - distance), // -x, +y, -z
            new Vertex(center.x - distance, center.y + distance, center.z + distance), // -x, +y, +z
            new Vertex(center.x + distance, center.y - distance, center.z - distance), // +x, -y, -z
            new Vertex(center.x + distance, center.y - distance, center.z + distance), // +x, -y, +z
            new Vertex(center.x + distance, center.y + distance, center.z - distance), // +x, +y, -z
            new Vertex(center.x + distance, center.y + distance, center.z + distance), // +x, +y, +z
        ]

        this.faces = [
            new Face([this.vertices[4], this.vertices[5], this.vertices[7], this.vertices[6]]), // +x
            new Face([this.vertices[2], this.vertices[3], this.vertices[7], this.vertices[6]]), // +y
            new Face([this.vertices[1], this.vertices[3], this.vertices[7], this.vertices[5]]), // +z
            new Face([this.vertices[0], this.vertices[1], this.vertices[3], this.vertices[2]]), // -x
            new Face([this.vertices[0], this.vertices[1], this.vertices[5], this.vertices[4]]), // -y
            new Face([this.vertices[0], this.vertices[2], this.vertices[6], this.vertices[4]]), // -z
        ]
    }
}

class Vertex2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Face {
    constructor(vertices) {
        this.vertices = vertices;
    }
}

function render(objects, context, angleX, angleY, angleZ) {
    for (let i = 0; i < objects.length; i++) {
        for (let j = 0; j < objects[i].faces.length; j++) {
            const rotatedVertices = objects[i].faces[j].vertices.map(vertex => 
                vertex.rotateX(angleX).rotateY(angleY).rotateZ(angleZ)
            );

            context.beginPath();

            const initialPoint = project(rotatedVertices[0]);
            context.moveTo(initialPoint.x, initialPoint.y);
            for (let x = 1; x < rotatedVertices.length; x++) {
                const actualVertex = project(rotatedVertices[x]);
                context.lineTo(actualVertex.x, actualVertex.y);
            }
            context.lineTo(initialPoint.x, initialPoint.y)
            context.stroke();
        }
    }
}

function project(vertex) {
    // We do -z because html canvas element has positive y values that go down instead of up
    return new Vertex2D(vertex.y, -vertex.z); // orthographic view
}


const myCube = new Cube(50, new Vertex(0, 0, 0));
    

// Initialize and render the cube
window.onload = function() {
    const canvas = document.getElementById("cubeCanvas");
    const context = canvas.getContext("2d");

    context.translate(canvas.width / 2, canvas.height / 2);

    const angleX = 0; // Rotation around X-axis in degrees
    const angleY = 0; // Rotation around Y-axis in degrees
    const angleZ = 0; // Rotation around Z-axis in degrees

    render([myCube], context, angleX, angleY, angleZ);
};

const increaseXButton = document.getElementById("increaseX");
const increaseYButton = document.getElementById("increaseY");
const increaseZButton = document.getElementById("increaseZ");

let globalAngleX = 0;
let globalAngleY = 0;
let globalAngleZ = 0;

increaseXButton.addEventListener("click", function() { increaseAngle(10, 0, 0) });
increaseYButton.addEventListener("click", function() { increaseAngle(0, 10, 0) });
increaseZButton.addEventListener("click", function() { increaseAngle(0, 0, 10) });

function increaseAngle(x, y, z) {
    const canvas = document.getElementById("cubeCanvas");
    const context = canvas.getContext("2d");

    context.save();
    // This clears the whole canvas after transforming coordinates see this: https://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
 
    globalAngleX += x; // Rotation around X-axis in degrees
    globalAngleY += y; // Rotation around Y-axis in degrees
    globalAngleZ += z; // Rotation around Z-axis in degrees
    
    render([myCube], context, globalAngleX, globalAngleY, globalAngleZ);
}

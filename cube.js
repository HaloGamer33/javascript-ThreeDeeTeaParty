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
    // fov is the "field of view" controlling how wide the perspective field is
    // viewerDistance is how far the viewer is from the viewing plane
    const fov = 100
    const viewerDistance = 100

    // Adjust the field of view based on the z-coordinate and the viewer distance
    const factor = fov / (viewerDistance + vertex.x);

    // Apply the perspective divide to project the 3D coordinates into 2D
    const x = vertex.y * factor;
    const y = -vertex.z * factor;

    return new Vertex2D(x, y);
}

function project(vertex) {
    // fov is the "field of view" controlling how wide the perspective field is
    // viewerDistance is how far the viewer is from the viewing plane
    const fov = 100
    const viewerDistance = 100

    // Adjust the field of view based on the z-coordinate and the viewer distance
    const factor = fov / (viewerDistance + vertex.y);

    // Apply the perspective divide to project the 3D coordinates into 2D
    const x = vertex.x * factor;
    const y = -vertex.z * factor;

    return new Vertex2D(x, y);
}

// function project(vertex) {
//     // We do -z because html canvas element has positive y values that go down instead of up
//     return new Vertex2D(vertex.y, -vertex.z); // orthographic view
// }

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

console.log(increaseXButton);

const decreaseXButton = document.getElementById("decreaseX");
const decreaseYButton = document.getElementById("decreaseY");
const decreaseZButton = document.getElementById("decreaseZ");

let offset = (Number(getComputedStyle(decreaseXButton).paddingRight.match(/[0-9]*\.?[0-9]+/)[0]) * 2 ) + Number(getComputedStyle(decreaseXButton).width.match(/[0-9]*\.?[0-9]+/)[0]) - Number(getComputedStyle(increaseXButton).width.match(/[0-9]*\.?[0-9]+/)[0]);
increaseXButton.style.paddingRight = `${offset/2}px`;
increaseXButton.style.paddingLeft = `${offset/2}px`;

offset = (Number(getComputedStyle(decreaseYButton).paddingRight.match(/[0-9]*\.?[0-9]+/)[0]) * 2 ) + Number(getComputedStyle(decreaseYButton).width.match(/[0-9]*\.?[0-9]+/)[0]) - Number(getComputedStyle(increaseYButton).width.match(/[0-9]*\.?[0-9]+/)[0]);
increaseYButton.style.paddingRight = `${offset/2}px`;
increaseYButton.style.paddingLeft = `${offset/2}px`;

offset = (Number(getComputedStyle(decreaseZButton).paddingRight.match(/[0-9]*\.?[0-9]+/)[0]) * 2 ) + Number(getComputedStyle(decreaseZButton).width.match(/[0-9]*\.?[0-9]+/)[0]) - Number(getComputedStyle(increaseZButton).width.match(/[0-9]*\.?[0-9]+/)[0]);
increaseZButton.style.paddingRight = `${offset/2}px`;
increaseZButton.style.paddingLeft = `${offset/2}px`;

let globalAngleX = 0;
let globalAngleY = 0;
let globalAngleZ = 0;

increaseXButton.addEventListener("click", function() { increaseAngle(10, 0, 0) });
increaseYButton.addEventListener("click", function() { increaseAngle(0, 10, 0) });
increaseZButton.addEventListener("click", function() { increaseAngle(0, 0, 10) });

decreaseXButton.addEventListener("click", function() { decreaseAngle(10, 0, 0) });
decreaseYButton.addEventListener("click", function() { decreaseAngle(0, 10, 0) });
decreaseZButton.addEventListener("click", function() { decreaseAngle(0, 0, 10) });

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

function decreaseAngle(x, y, z) {
    const canvas = document.getElementById("cubeCanvas");
    const context = canvas.getContext("2d");

    context.save();
    // This clears the whole canvas after transforming coordinates see this: https://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
 
    globalAngleX -= x; // Rotation around X-axis in degrees
    globalAngleY -= y; // Rotation around Y-axis in degrees
    globalAngleZ -= z; // Rotation around Z-axis in degrees
    
    render([myCube], context, globalAngleX, globalAngleY, globalAngleZ);
}

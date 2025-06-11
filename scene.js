const vsSource = `
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat4 uModelViewMatrix, uProjectionMatrix;
varying highp vec2 vTextureCoord;
void main() { gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition; vTextureCoord = aTextureCoord; }
`;

const fsSource = `
precision mediump float;
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;
void main() { gl_FragColor = texture2D(uSampler, vTextureCoord); }
`;

// Define cube geometry
const verticesWithTextureCoords =
    // Positions            Texture coordinates
    [ -1.0, -1.0,  1.0,     0.0, 0.0    // Front face
    ,  1.0, -1.0,  1.0,     1.0, 0.0
    ,  1.0,  1.0,  1.0,     1.0, 1.0
    , -1.0,  1.0,  1.0,     0.0, 1.0
    , -1.0, -1.0, -1.0,     1.0, 0.0    // Back face
    ,  1.0, -1.0, -1.0,     0.0, 0.0
    ,  1.0,  1.0, -1.0,     0.0, 1.0
    , -1.0,  1.0, -1.0,     1.0, 1.0
    ,  1.0,  1.0,  1.0,     0.0, 0.0    // Top face
    , -1.0,  1.0,  1.0,     1.0, 0.0
    , -1.0,  1.0, -1.0,     1.0, 1.0
    ,  1.0,  1.0, -1.0,     0.0, 1.0
    , -1.0, -1.0,  1.0,     0.0, 0.0    // Bottom face
    ,  1.0, -1.0,  1.0,     1.0, 0.0
    ,  1.0, -1.0, -1.0,     1.0, 1.0
    , -1.0, -1.0, -1.0,     0.0, 1.0
    ,  1.0, -1.0,  1.0,     0.0, 0.0    // Right face
    ,  1.0, -1.0, -1.0,     1.0, 0.0
    ,  1.0,  1.0, -1.0,     1.0, 1.0
    ,  1.0,  1.0,  1.0,     0.0, 1.0
    , -1.0, -1.0, -1.0,     0.0, 0.0    // Left face
    , -1.0, -1.0,  1.0,     1.0, 0.0
    , -1.0,  1.0,  1.0,     1.0, 1.0
    , -1.0,  1.0, -1.0,     0.0, 1.0
    ];

const indices =
    [ 0, 1, 2, 0, 2, 3 // Front face
    , 4, 5, 6, 4, 6, 7 // Back face
    , 0, 4, 7, 0, 7, 3 // Left face
    , 1, 5, 6, 1, 6, 2 // Right face
    , 3, 2, 6, 3, 6, 7 // Top face
    , 0, 1, 5, 0, 5, 4 // Bottom face
    ];

// 'textureLocation' is your texture uniform location in the shader
function handleTexture(gl, imageToSet, textureLocation) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageToSet);
    gl.uniform1i(textureLocation, 0);
}

const { mat4, } = glMatrix;

const projectionMatrix = mat4.create();

let previousSize = {width:1, height:1};

function checkCanvasSize(canvas_node) {
    const {clientWidth, clientHeight} = canvas_node;
    if (clientWidth === previousSize.width && clientHeight === previousSize.height)
        return;

    mat4.perspective(projectionMatrix, Math.PI / 4, clientWidth / clientHeight, 0.1, 100.0);

    previousSize.width = clientWidth;
    previousSize.height = clientHeight;
}

// Main render loop
let totalTime   = 0;
let then        = 0;

function handleWithWebGL(gl, canvas_node) {
    const textureFilename   = 'osn_small_sq.png';
    const vertexShader      = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);

    const fragmentShader    = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesWithTextureCoords), gl.STATIC_DRAW);

    const uSampler          = gl.getUniformLocation(shaderProgram, 'uSampler');

    const jsImage = new Image();
    jsImage.src = textureFilename;
    jsImage.onload = function() { handleTexture(gl, jsImage, uSampler); };

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 20, 0); // Assumes 20 bytes per vertex (5 floats)

    const textureCoordAttributeLocation = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
    gl.enableVertexAttribArray(textureCoordAttributeLocation);
    gl.vertexAttribPointer(textureCoordAttributeLocation, 2, gl.FLOAT, false, 20, 12); // Assumes 20 bytes per vertex (5 floats)

    const uModelViewMatrix  = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    const uProjectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');

    const modelViewMatrix = mat4.create();

    checkCanvasSize(canvas_node);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS); // Reverse depth test

    function render(now) {
        checkCanvasSize(canvas_node);

        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        totalTime += deltaTime; // Accumulate total time
        const rotationSpeed = 0.5;
        const angle = totalTime * rotationSpeed; // Calculate rotation angle based on total time

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.identity(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, angle, [1.0, 1.0, 1.0]);

        gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
        gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    return 1;
}

function initLogo() {
    const canvas_element_id = 'webgl-canvas';
    const canvas_node   = document.getElementById(canvas_element_id);
    const gl            = canvas_node.getContext('webgl');
    document.getElementById(canvas_element_id).hidden = !(document.getElementById("no-webgl-canvas").hidden = !!gl);
    return gl ? handleWithWebGL(gl, canvas_node) : 0;
}
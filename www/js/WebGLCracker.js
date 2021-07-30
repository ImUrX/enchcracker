// webglfundamentals best page
/**
 * @param {WebGL2RenderingContext} gl 
 * @param {number} type 
 * @param {string} src
 */
function createShader(gl, type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
    }
    return shader;
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {WebGLShader} vertexShader 
 * @param {WebGLShader} fragmentShader 
 * @returns 
 */
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
  
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return undefined;
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {ArrayBufferView} sizeOrData 
 */
function makeBuffer(gl, sizeOrData) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, gl.STATIC_DRAW);
    return buf;
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {ArrayBufferView} data 
 * @param {number} loc 
 */
function makeBufferAndSetAttribute(gl, data, loc) {
    const buf = makeBuffer(gl, data);
    // setup our attributes to tell WebGL how to pull
    // the data from the buffer above to the attribute
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribIPointer(
        loc,
        1,         // size (num components)
        gl.UNSIGNED_INT,  // type of data in buffer
        0,         // stride (0 = auto)
        0,         // offset
    );
}

export class WebGLCracker {
    constructor(canvas) {
        /**
         * @type {HTMLCanvasElement}
         */
        this.canvas = canvas;
    }

    crack(first, second) {
        const gl = this.canvas.getContext("webgl2");
        const vShader = createShader(gl, gl.VERTEX_SHADER, document.getElementById("squareshader").text);
        const fShader = createShader(gl, gl.FRAGMENT_SHADER, document.getElementById("crackshader").text);

        const program = createProgram(gl, vShader, fShader);
        const posLoc = gl.getAttribLocation(program, "pos");
        const firstLoc = gl.getUniformLocation(program, "first");
        const secondLoc = gl.getUniformLocation(program, "second");

        // setup a full canvas clip space quad
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
            1, -1,
            -1,  1,
            -1,  1,
            1, -1,
            1,  1,
        ]), gl.STATIC_DRAW);
 
        // Create a vertex array object (attribute state)
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        
        // setup our attributes to tell WebGL how to pull
        // the data from the buffer above to the position attribute
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(
            posLoc,
            2,         // size (num components)
            gl.FLOAT,  // type of data in buffer
            false,     // normalize
            0,         // stride (0 = auto)
            0,         // offset
        );

        gl.useProgram(program);
        gl.uniform4uiv(firstLoc, new Uint32Array(first));
        gl.uniform4uiv(secondLoc, new Uint32Array(second));

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}
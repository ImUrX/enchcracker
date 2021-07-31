import canvasSize from "../libs/canvas-size.esm.min.js";
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

    async prepare() {
        const res = await canvasSize.maxArea({
            usePromise: true,
            useWorker: true
        });
        this.canvas.height = 5590;
        this.canvas.width = 5590;
        this.amountOfTimes = Math.ceil(this.canvas.height * this.canvas.width);
        this.shaders = await shaderPromise;
        this.results = new Uint32Array(this.canvas.height * this.canvas.width * 4);
    }

    crack(first, second) {
        const gl = this.canvas.getContext("webgl2");
        console.log(gl.getParameter(gl.MAX_TEXTURE_SIZE));
        const vShader = createShader(gl, gl.VERTEX_SHADER, this.shaders[0]);
        const fShader = createShader(gl, gl.FRAGMENT_SHADER, this.shaders[1]);

        const program = createProgram(gl, vShader, fShader);
        const posLoc = gl.getAttribLocation(program, "pos");
        const firstLoc = gl.getUniformLocation(program, "first");
        const secondLoc = gl.getUniformLocation(program, "second");
        const offsetLoc = gl.getUniformLocation(program, "offset");

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
        
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        const rbo = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA32UI, this.canvas.width, this.canvas.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, rbo);
        console.log(gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE);

        gl.useProgram(program);
        gl.uniform4uiv(firstLoc, new Uint32Array(first));
        gl.uniform4uiv(secondLoc, new Uint32Array(second));
        gl.uniform1ui(offsetLoc, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.readPixels(0, 0, this.canvas.width, this.canvas.height, gl.RGBA_INTEGER, gl.UNSIGNED_INT, this.results);
        const results = [];
        /*for(let i = 0; i < this.results.length; i+=4) {
            const info = this.results[i+3];
            for(let j = 0; j < 3; j++) {
                const val = this.results[i+j];
                const mask = 1 << j;
                if((mask & info) !== 0) results.push(val);
            }
        }*/
        console.log(this.results.slice(0, 4));
        //console.log(results);
    }
}

const pixelAmount = (Math.pow(2, 32)-1)/3;
const shaderPromise = Promise.all([
    fetch("../gl/square.vert").then(res => res.text()),
    fetch("../gl/crack.frag").then(res => res.text())
]);

window.onload =  async () => {
    const cracker = new WebGLCracker(document.getElementById("main"));
    await cracker.prepare();
    cracker.crack([15, 5, 20, 30], [12, 5, 10, 24]);
};
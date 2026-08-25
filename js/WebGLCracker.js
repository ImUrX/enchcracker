const getvs = (shelves, slot1, slot2, slot3) => `#version 300 es
#define SHELVES ${shelves}
#define SLOT1 ${slot1}
#define SLOT2 ${slot2}
#define SLOT3 ${slot3}

#define MSK32 0xffffffff
#define MSK16 0xffff

struct ulong {
	uint low;
	uint high;
};

const ulong MULT = {3740067437u, 5};
const ulong MASK = {0xffffffffu, 0xffff};

ulong addu64(ulong a, ulong b) {
	return ulong(
		(a.low + b.low) & MSK32,
		(a.high + b.high + (c.low < a.low)) & MSK32
	);
}

ulong multu64(ulong x, ulong y) {
	ulong z = ulong(0, 0);
	uint a,b,c,d,min,max;
    a = x.low >> 16;
    b = x.low & MSK16;
    c = y.low >> 16;
    d = y.low & MSK16;
    z.low = x.low * y.low;
    if(x.low > y.low) {
        min = y.low;
        max = x.low;
    } else {
        max = y.low;
        min = x.low;
    }
    z.high = (x.high * y.low) + (x.low * y.high) + a*c + ((a*d + b*c) >> 16) + (z.low < max && min >= MSK16);
	return z;
}

ulong xoru64(ulong a, ulong b) {
    return ulong(a.low ^ b.low, a.high ^ b.high);
}

ulong andu64(ulong a, ulong b) {
	return ulong(a.low & b.low, a.high & b.high);
}

ulong rshiftu64(ulong a, uint b, uint twopowb, uint bpowinv) { //max amount of shifting is 31 i think xd
	ulong c = a;
	c.low = (a.low >> b) + ((a.high % twopowb) * bpowinv);
	c.high = a.high >> b;
	return c;
}

struct SimpleRandom {
    ulong seed;
};

void set_seed(inout SimpleRandom self, ulong seed) {
    self->seed = andu64(xoru64(seed, MULT), MASK);
}

uint next_int(inout SimpleRandom self) {
    self->seed = andu64(addu64(multu64(self->seed, MULT), ulong(0xB, 0)), MASK);
    return rshiftu64(self->seed, 17, 131072, 32768).low;
}

uint next_int_bound(inout SimpleRandom self, uint bound) {
    uint r = next_int(self);
    uint m = bound - 1;
    if((bound & m) == 0) {
        r = rshiftu64(multu64(ulong(bound, 0), ulong(r, 0)), 31, 2147483648u, 2).low;
    } else {
        uint u = r;
        while(u - (r = u % bound) + m < 0) u = next_int(self);
    }
    return r;
}

uint generic_enchantability(inout SimpleRandom self, uint shelves) {
    uint first = next_int_bound(self, 8);
    uint second = next_int_bound(self, shelves + 1);
    return first + 1 + (shelves >> 1) + second;
}

in uint high;
in uint low;

out bool exists;

void main() {
    exists = false;
    SimpleRandom r = SimpleRandom(0);
    set_seed(r, ulong(low, high));
    uint slot1gen = generic_enchantability(r, SHELVES) / 3;
    if(slot1gen < 1) slot1gen = 1;
    if(SLOT1 != slot1gen) return;
    uint slot2gen = (generic_enchantability(r, SHELVES) * 2 / 3) + 1;
    if(SLOT2 != slot2gen) return;
    uint slot3gen = max(generic_enchantability(r, SHELVES), SHELVES * 2);
    if(SLOT3 == slot3gen) exists = true;
}
`;
const fs = `#version 300 es
precision highp float;
void main() {}`;

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
    constructor() {
        this.canvas = document.createElement("canvas");
    }

    crack(...info) {
        const gl = this.canvas.getContext("webgl2");
        const vShader = createShader(gl, gl.VERTEX_SHADER, getvs(...info));
        const fShader = createShader(gl, gl.FRAGMENT_SHADER, fs);

        const program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.transformFeedbackVaryings(program, ["exists"], gl.INTERLEAVED_ATTRIBS);
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramParameter(program));

        const lowLoc = gl.getAttribLocation(program, "low");
        const highLoc = gl.getAttribLocation(program, "high");

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        
        for(const num of []) {} //51
    }
}
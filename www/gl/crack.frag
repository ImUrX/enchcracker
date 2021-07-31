#version 300 es
#pragma vscode_glsllint_stage: frag
#define MSK32 0xffffffffu
#define MSK16 0xffffu

precision highp int;

const uvec2 MULT = uvec2(3740067437u, 5u);
const uvec2 MASK = uvec2(0xffffffffu, 0xffffu);

uvec2 addu64(uvec2 a, uvec2 b) {
    uvec2 x = a + b;
    x.y += uint(x.x < a.x);
    return x;
}

uvec2 multhelper(uint x, uint y) {
    uint a,b,c,d;
    a = x >> 16u;
    b = x & MSK16;
    c = y >> 16u;
    d = y & MSK16;
    uint bc = b*c;
    uint bd = b*d;
    uint ac = c*a;
    uint ad = d*a;
    uvec2 res = uvec2(bd + (((bc & MSK16) + (ad & MSK16)) << 16), 0u);
    res.y += ac + (bc >> 16) + (ad >> 16) + (((bd >> 16) + (bc & MSK16) + (ad & MSK16)) >> 16);
    return res;
}

uvec2 multu64(uvec2 x, uvec2 y) {
    uvec2 z = multhelper(x.x, y.x);
    //uvec2 high = multhelper(x.y, y.y);
    //z.y += high.x;
	return z;
}

uvec2 rshiftu64(uvec2 a, uint b) { //max amount of shifting is 31 i think xd
	uvec2 c = uvec2(0u, 0u);
	c.x = (a.x >> b) + (a.y << (32u - b));
	c.y = a.y >> b;
	return c;
}

struct SimpleRandom {
    uvec2 seed;
};

void set_seed(inout SimpleRandom self, uvec2 seed) {
    self.seed = (seed ^ MULT) & MASK;
}

uint next_int(inout SimpleRandom self) {
    self.seed = addu64(multu64(self.seed, MULT), uvec2(0xBu, 0u)) & MASK;
    return rshiftu64(self.seed, 17u).x;
}

uint next_int_bound(inout SimpleRandom self, uint bound) {
    uint r = next_int(self);
    uint m = bound - 1u;
    if((bound & m) == 0u) {
        r = rshiftu64(multu64(uvec2(bound, 0u), uvec2(r, 0u)), 31u).x;
    } else {
        uint u = r;
        while(u - (r = u % bound) + m < 0u) u = next_int(self);
    }
    return r;
}

uint generic_enchantability(inout SimpleRandom self, uint shelves) {
    uint first = next_int_bound(self, 8u);
    uint second = next_int_bound(self, shelves + 1u);
    return first + 1u + (shelves >> 1u) + second;
}

bool verify_seed(inout SimpleRandom self, uint seed, uvec4 info) {
    set_seed(self, uvec2(seed, 0u));
    uint slot1gen = generic_enchantability(self, info.x) / 3u;
    if(slot1gen < 1u) slot1gen = 1u;
    if(info.y != slot1gen) return false;
    uint slot2gen = (generic_enchantability(self, info.x) * 2u / 3u) + 1u;
    if(info.z != slot2gen) return false;
    uint slot3gen = max(generic_enchantability(self, info.x), info.x * 2u);
    if(info.w == slot3gen) return true;
    return false;
}

uniform uvec4 first;
uniform uvec4 second;
uniform uint offset;

out uvec4 fragColor;

void main() {
    SimpleRandom r = SimpleRandom(uvec2(0u, 0u));
    uint seed = (uint(gl_FragCoord.x) + uint(gl_FragCoord.y) + offset) * 3u;
    uint res = 0u;
    set_seed(r, uvec2(0u, 0u));
    /*for(uint i = 0u; i < 3u; i++) {
        res = res << 1u;
        if(verify_seed(r, seed + i, first) && verify_seed(r, seed + i, second)) {
            res++;
        }
    }
    fragColor = uvec4(seed, seed+1u, seed+2u, res);
    */
    uvec2 mul = multu64(r.seed, MULT);
    fragColor = uvec4(r.seed.x, r.seed.y, mul.x, mul.y);
}

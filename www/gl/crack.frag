#version 300 es
#pragma vscode_glsllint_stage: frag
#define MSK32 0xffffffffu
#define MSK16 0xffffu

precision highp int;

struct ulong {
	uint low;
	uint high;
};

const ulong MULT = ulong(3740067437u, 5u);
const ulong MASK = ulong(0xffffffffu, 0xffffu);

ulong addu64(ulong a, ulong b) {
	return ulong(
		(a.low + b.low) & MSK32,
		(a.high + b.high + uint(b.low < a.low)) & MSK32
	);
}

ulong multu64(ulong x, ulong y) {
	ulong z = ulong(0u, 0u);
	uint a,b,c,d,min,max;
    a = x.low >> 16u;
    b = x.low & MSK16;
    c = y.low >> 16u;
    d = y.low & MSK16;
    z.low = x.low * y.low;
    if(x.low > y.low) {
        min = y.low;
        max = x.low;
    } else {
        max = y.low;
        min = x.low;
    }
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
    self.seed = andu64(xoru64(seed, MULT), MASK);
}

uint next_int(inout SimpleRandom self) {
    self.seed = andu64(addu64(multu64(self.seed, MULT), ulong(0xBu, 0u)), MASK);
    return rshiftu64(self.seed, 17u, 131072u, 32768u).low;
}

uint next_int_bound(inout SimpleRandom self, uint bound) {
    uint r = next_int(self);
    uint m = bound - 1u;
    if((bound & m) == 0u) {
        r = rshiftu64(multu64(ulong(bound, 0u), ulong(r, 0u)), 31u, 2147483648u, 2u).low;
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
    set_seed(self, ulong(seed, 0u));
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

out uvec4 res;

void main() {
    res = uvec4(0u,0u,0u,0u);
    SimpleRandom r = SimpleRandom(ulong(0u, 0u));
    uint seed = uint(gl_FragCoord.x) + uint(gl_FragCoord.y) + offset;
}

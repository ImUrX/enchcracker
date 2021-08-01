#version 300 es
#pragma vscode_glsllint_stage: frag
#define MSK32 0xffffffffu
#define MSK16 0xffffu

precision highp int;
precision highp usampler2D;

const uvec2 MULT = uvec2(3740067437u, 5u);
const uvec2 MASK = uvec2(0xffffffffu, 0xffffu);

uvec2 addu64(uvec2 a, uvec2 b) {
    uvec2 x = a + b;
    x.y += uint(x.x < a.x);
    return x;
}

uint multu16(uint x, uint y, uint carry, out uint overflow) {
    uint a = (x*y) + carry;
    overflow = a >> 16;
    return a & MSK16;
}

uvec2 split32by16(uint x) {
    return uvec2(x & MSK16, x >> 16);
}

uint addu16(uvec4 vec, uint carry, out uint overflow) {
    uint a = vec.x+vec.y+vec.z+vec.w+carry;
    overflow = a >> 16;
    return a & MSK16;
}

uvec2 multu64(uvec2 x, uvec2 y) {
    uvec4 mul = uvec4(split32by16(y.x), split32by16(y.y));
    uvec4 num = uvec4(split32by16(x.x), split32by16(x.y));
    uint overflow = 0u;
    uvec4 first = uvec4(0u);
    for(int i = 0; i < 4; i++) { 
        first[i] = multu16(mul.x, num[i], overflow, overflow);
    }

    overflow = 0u;
    uvec4 second = uvec4(0u);
    for(int i = 1; i < 4; i++) { 
        second[i] = multu16(mul.y, num[i-1], overflow, overflow);
    }  

    overflow = 0u;
    uvec4 third = uvec4(0u);
    third.z = multu16(mul.z, num.x, overflow, overflow);
    third.w = multu16(mul.z, num.y, overflow, overflow);

    overflow = 0u;
    uvec4 fourth = uvec4(0u);
    third.w = multu16(mul.w, num.x, overflow, overflow);
    
    overflow = 0u;
    uvec4 result = uvec4(0u);
    result.x = first.x;
    result.y = addu16(uvec4(first.y, second.y, 0u, 0u), overflow, overflow);
    result.z = addu16(uvec4(first.z, second.z, third.z, 0u), overflow, overflow);
    result.w = addu16(uvec4(first.w, second.w, third.w, fourth.w), overflow, overflow);
    return uvec2((result.y << 16) | result.x, (result.w << 16) | result.z );
}

uvec2 rshiftu64(uvec2 a, uint b) { //max amount of shifting is 31 i think xd
	uvec2 c = uvec2(0u, 0u);
	c.x = (a.x >> b) + (a.y << (32u - b));
	c.y = a.y >> b;
	return c;
}

void set_seed(out uvec2 self, uvec2 seed) {
    self = (seed ^ MULT) & MASK;
}

uint next_int(inout uvec2 self) {
    self = addu64(multu64(self, MULT), uvec2(0xBu, 0u)) & MASK;
    return rshiftu64(self, 17u).x;
}

uint next_int_bound(inout uvec2 self, uint bound) {
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

uint generic_enchantability(inout uvec2 self, uint shelves) {
    uint first = next_int_bound(self, 8u);
    uint second = next_int_bound(self, shelves + 1u);
    return first + 1u + (shelves >> 1u) + second;
}

bool verify_seed(inout uvec2 self, uint seed, uvec4 info) {
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

uvec4 getValue(usampler2D tex, ivec2 dimensions, int index) {
    int y = index / dimensions.x;
    int x = index % dimensions.x;
    return texelFetch(tex, ivec2(x, y), 0);
}

uniform usampler2D srcRes;
uniform uvec4 shelves;
uniform int amount;

out uvec4 fragColor;

void main() {
    uvec2 r = uvec2(0u);
    uvec4 res = uvec4(0u);
    ivec2 srcDimensions = textureSize(srcRes, 0);
    int totalSize = srcDimensions.x + srcDimensions.y;
    int size = 0;
    int realAmount = (int(gl_FragCoord.x + gl_FragCoord.y) * amount) + amount;
    for(int i = realAmount - amount; i < realAmount; i++) {
        if(realAmount >= totalSize) break;
        uvec4 seeds = getValue(srcRes, srcDimensions, i);
        for(int j = 0; j < 4; j++) {
            if(seeds[j] != 0u && verify_seed(r, seeds[j], shelves)) {
                res[size++] = seeds[j];
            }
        }
    }
    
    fragColor = res;
    //fragColor = uvec4(next_int(r), next_int(r), 0u, 0u);
}

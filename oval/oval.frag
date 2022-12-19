#version 330 compatibility

in float vLightIntensity;

in vec2  vST; 
float s= vST.s;
float t= vST.t;

uniform float uAd;
uniform float uBd;
uniform float uTol;

const vec3 vColor = vec3(1, 0.5, 0.1);

vec3 WHITE = vec3( 1., 1., 1. );

void
main( )
{

    float Ar = uAd/2.;
    float Br = uBd/2.;
    int numins = int( s / uAd );
    int numint = int( t / uBd );
    float sc = numins *uAd + Ar;
    float tc = numint *uBd + Br;

    vec3 rgb = vLightIntensity * mix(vColor, WHITE, smoothstep(1 - uTol, 1 + uTol, pow(((s - sc)/Ar), 2) + pow(((t - tc)/Br), 2)));
        
    gl_FragColor = vec4(rgb, 1.);

}
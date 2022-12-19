#version 330 compatibility

#define pi 3.1415926

uniform float Timer;
uniform sampler2D TexUnitA;
uniform sampler2D TexUnitB;

in vec2 vST;


void main ( ) {
    float x, y, u, v, w, a, r;

    x = vST.s - 0.5;
    y = vST.t - 0.5;
    
    r = sqrt( x * x + y * y );
    a = atan( y, x );
    

    u = a / pi + 0.0623 * r;
    v = 40 * pow( r, 0.01 );
    float v_new = v + Timer;

    float basc1 = texture(TexUnitB, vST).r;
	float basc2 = texture(TexUnitB, vST).g;

    if(texture(TexUnitA, vST).r * basc1 > texture(TexUnitB, vST).r * basc2) {
		//gl frag our first mat
		gl_FragColor = vec4(texture2D(TexUnitA, vec2(u, v)).rgb, 1.);
	} 
	else {
		//glfrag our second mat
		gl_FragColor = vec4(texture2D(TexUnitB, vec2(u, v_new)).rgb, 1.);
	}
}
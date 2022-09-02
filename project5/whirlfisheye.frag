#version 330 compatibility

uniform float uPower;
uniform float uRtheta;
uniform float uBlend;
uniform float uContrast;
uniform sampler2D TexUnitA;
uniform sampler2D TexUnitB;

in vec2 vST;

const float PI = 3.14159265;
const vec4 BLACK = vec4( 0., 0., 0., 1. );

float
atan2( float y, float x )
{
        if( x == 0. )
        {
            if( y >= 0. )
                return  PI/2.;
            else
                return -PI/2.;
        }

        return atan(y,x);

}

void
main()
{

    // Fisheye
    vec2 st = vST - vec2(0.5,0.5);  // put (0,0) in the middle so that the range is -0.5 to +0.5
    float r = length(st);
    float r_new = pow(abs(2 * r), uPower);
   


    // Whirl
    float theta  = atan2( st.t, st.s );
    float theta_new = theta - (uRtheta * r);

    // Restoring (s,t)
    // here still have some problems
    st = r_new * vec2( cos(theta_new), sin(theta_new) );  		// now in the range -1. to +1.
    st += 1;                        		// change the range to 0. to +2.
    st *= 0.5; 		       			// change the range to 0. to +1.

    // Finishing Up
    // if s or t wander outside the range [0.,1.], paint the pixel black
    // if s < 0 black || >1 than black
    // if t < 0 black || >1 than black

    if( any( lessThan(st, vec2(0., 0.)) ) )
        gl_FragColor = BLACK;
    else
        if( any( greaterThan(st, vec2(1, 1)) ) )
            gl_FragColor = BLACK;
        else
        {
            //sample both textures at (s,t)
            vec3 rgbA = texture2D( TexUnitA, st ).rgb; 
            vec3 rgbB = texture2D( TexUnitB, st ).rgb;

            //mix the two samples using uBlend
            vec3 rgb = mix( rgbA, rgbB, uBlend ); 

            //do the contrasting according to our Image notes
            
            vec3 rgb_c = mix(vec3(0.5, 0.5, 0.5), rgb, uContrast);

            gl_FragColor= vec4( rgb_c, 1. );

        }
}
#version 330 compatibility

uniform float uAd;
uniform float uBd;
uniform float uTol;

uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uAlpha;

uniform bool uUseChromaDepth;
uniform float uChromaRed;
uniform float uChromaBlue;
uniform vec4 uThecolor;


in vec2  vST;
in vec4  vColor; 
in float vLightIntensity;
in vec3 vMCposition;
in vec3 vECposition;

float s= vST.s;
float t= vST.t;
float Z= vECposition.z;

uniform sampler3D Noise3;


vec3
Rainbow( float d )
{
	d = clamp( d, 0., 1. );

	float r = 1.;
	float g = 0.0;
	float b = 1.  -  6. * ( d - (5./6.) );

        if( d <= (5./6.) )
        {
                r = 6. * ( d - (4./6.) );
                g = 0.;
                b = 1.;
        }

        if( d <= (4./6.) )
        {
                r = 0.;
                g = 1.  -  6. * ( d - (3./6.) );
                b = 1.;
        }

        if( d <= (3./6.) )
        {
                r = 0.;
                g = 1.;
                b = 6. * ( d - (2./6.) );
        }

        if( d <= (2./6.) )
        {
                r = 1.  -  6. * ( d - (1./6.) );
                g = 1.;
                b = 0.;
        }

        if( d <= (1./6.) )
        {
                r = 1.;
                g = 6. * d;
        }

	return vec3( r, g, b );
}

void
main( )
{

    // read the glman 2D noise texture (if using s,t or the 3D noise texture if using x,y,z:

    vec3 stp = uNoiseFreq * vMCposition; 
    vec4 nv  = texture3D( Noise3, uNoiseFreq*vMCposition );


    // give the noise a range of [-1.,+1.]:

    float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
    n = n - 2.;                             // -1. -> 1.

    n = n *uNoiseAmp;
    float Ar = uAd/2.;
    float Br = uBd/2.;
    int numins = int( s / uAd );
    int numint = int( t / uBd );

    // determine the color based on the noise-modified (s,t):

    float sc = float(numins) * uAd  +  Ar;
    float ds = s - sc;                   // wrt ellipse center
    float tc = float(numint) * uBd  +  Br;
    float dt = t - tc;                   // wrt ellipse center

    float oldDist = sqrt( ds*ds + dt*dt );
    float newDist = sqrt( ds*ds + dt*dt + n);
    float scale = newDist / oldDist;        // this could be < 1., = 1., or > 1.

    ds *= scale;                            // scale by noise factor
    ds /= Ar;                               // ellipse equation

    dt *= scale;                            // scale by noise factor
    dt /= Br;                               // ellipse equation

    float maxd = ds*ds + dt*dt;
    float d = smoothstep( 1. - uTol, 1. + uTol, maxd );
    
    vec4 Thecolor = uThecolor;

    if( uUseChromaDepth )
    {
        float t = (2./3.) * ( Z - uChromaRed ) / ( uChromaBlue - uChromaRed );
        t = clamp( t, 0., 2./3. );
        Thecolor.rgb = Rainbow( t );
    }
        
    gl_FragColor = mix( Thecolor, vec4(vColor.rgb, uAlpha), d );
    gl_FragColor.rgb *= vLightIntensity;

    if(gl_FragColor.a == 0.) 
    {
		discard;
    
    }

}
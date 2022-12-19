#version 330 compatibility

out vec4  vColor;
out vec3  vMCposition;
out vec3  vECposition;
out vec2  vST; 
out float vLightIntensity;

vec3 LIGHTPOS = vec3( -2., 0., 10. );

void main( )
{
    vST = gl_MultiTexCoord0.st;
    vColor = gl_Color;
 
    vec3 tnorm      = normalize( gl_NormalMatrix * gl_Normal );	// transformed normal
    vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
    vLightIntensity  = abs(  dot( normalize(LIGHTPOS - ECposition), tnorm )  );
 
    vMCposition = gl_Vertex.xyz;
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
    vECposition = ECposition;

}
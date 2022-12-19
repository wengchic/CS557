#version 330 compatibility

uniform sampler2D uTexUnit;

in vec2 vST;

void main( )
{
	vec3 newcolor = texture( uTexUnit, vST ).rgb;
	gl_FragColor = vec4( newcolor, 1. );
}
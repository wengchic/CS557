#version 330 compatibility

#define pi 3.1415926
uniform float uA, uB, uC;
uniform float uNoiseAmp, uNoiseFreq;
uniform float uLightX, uLightY, uLightZ;
uniform float Timer;
uniform sampler3D Noise3;

flat out vec3 vNf;
	 out vec3 vNs;
flat out vec3 vLf;
	 out vec3 vLs;
flat out vec3 vEf;
	 out vec3 vEs;
	 out vec3 vMCposition;
	 out vec2 vST;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

void main( ){ 
	
	vST = gl_MultiTexCoord0.st;
	
	float t = sin(pi*Timer) - cos(pi*Timer);
	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex; 
	vec4 noise_vector = texture(Noise3, vec3(ECposition)*uNoiseFreq*t);
	
	// animate with noisefreq
	vec4 new_vertex = vec4(gl_Vertex.x, gl_Vertex.y, gl_Vertex.z, 1.);
	new_vertex.x *= 1.63;
	bool animate = true;
	if(animate == true) {
		if(t > 0) {
			new_vertex.z += noise_vector.z + (t * ((0-uA) * (cos(2*pi*uB*new_vertex.x+uC))));}
		else {
			new_vertex.z += noise_vector.x + (t * ((0-uA) * (cos(2*pi*uB*new_vertex.x+uC))));}
		if(t == 1 || t == -1)
			animate = !animate;
	}
	else if (animate == false) {
		if(t > 0) {
			new_vertex.z += noise_vector.x + (t * ((0-uA) * (cos(2*pi*uB*new_vertex.x+uC))));}
		else {
			new_vertex.z += noise_vector.z + (t * ((0-uA) * (cos(2*pi*uB*new_vertex.x+uC))));}
		if(t == 1 || t == -1)
			animate = !animate;
	}
	
	// water waving
	float dzdx = (0-uA)*uB*sin(uB*new_vertex.x)*cos(uC*new_vertex.y);
	float dzdy = (0-uA)*uC*cos(uB*new_vertex.x)*sin(uC*new_vertex.y);
	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );
	vec3 normal = normalize(cross(Tx, Ty));
	
	vNf = normalize(gl_NormalMatrix * normal);	
	vLf = eyeLightPosition - ECposition.xyz;
	vEf = vec3(0., 0., 0.) - ECposition.xyz;
	vNs = vNf; 
	vLs = vLf; 
	vEs = vEf;

	vMCposition  = new_vertex.xyz;
	
	
	gl_Position = gl_ModelViewProjectionMatrix * new_vertex;
}
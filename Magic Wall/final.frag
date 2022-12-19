#version 330 compatibility

flat in vec3 vNf;
     in vec3 vNs;
flat in vec3 vLf;
     in vec3 vLs;
flat in vec3 vEf;
     in vec3 vEs;
	 in vec3 vMCposition;
	 in vec2 vST;

uniform vec3 LightColor;
uniform vec4 AmbientColor;
uniform float uShininess;

uniform sampler2D splatmap;

uniform sampler2D BrickHeight;
uniform sampler2D BrickHeight2;

uniform sampler2D BrickOrignal;
uniform sampler2D BrickOrignal2;

uniform sampler2D BrickNormal;
uniform sampler2D BrickNormal2;

uniform sampler2D BrickRoughness;
uniform sampler2D BrickRoughness2;

vec4 Lighting(vec3 diffuseColor, vec3 specularIntensity, vec3 normal) {

	//normalize light
	vec3 light = normalize(vLs);
	vec3 eye = normalize(vEs);
	
	vec3 ambient = AmbientColor.rgb * (1 - max( dot(normal, light), 0. )) * diffuseColor;

	vec3 diffuse = diffuseColor.rgb * max( dot(normal, light), 0. ) * LightColor;
	
	vec3 specular = vec3(0.);
	
	if( dot(normal, light) > 0. ) {
		vec3 ref = normalize( 2. * normal * dot(normal, light) - light );
		specular = pow(max(dot(eye, ref), 0.), uShininess) * (vec3(1.) - specularIntensity);
	}
	
	
	//return all function
	return vec4(ambient + diffuse + specular * 0.2, 1.);
}

vec4 BaseTexture() {
	
	vec3 diffuseColor = texture(BrickOrignal, vST).rgb;
	vec3 normal = vNf * texture(BrickNormal, vST).rgb;
	vec3 specular = texture(BrickRoughness, vST).rgb;
	
	return Lighting(diffuseColor, specular, normal);
}

vec4 CoverTexture() {
	
	vec3 diffuseColor = texture(BrickOrignal2, vST).rgb;
	vec3 normal = vNf * texture(BrickNormal2, vST).rgb;
	vec3 specular = texture(BrickRoughness2, vST).rgb;
	
	
	return Lighting(diffuseColor, specular, normal);
}


void main() {
	// use splatmap to make different height
	float mat1Bias = texture(splatmap, vST).r;
	float mat2Bias = texture(splatmap, vST).g;
	
	if(texture(BrickHeight, vST).r * mat1Bias > texture(BrickHeight2, vST).r * mat2Bias) {
		//first texture
		gl_FragColor = BaseTexture();
	} 
	else {
		//second texture
		gl_FragColor = CoverTexture();
	}
}
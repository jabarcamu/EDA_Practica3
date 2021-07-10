#version 120

uniform sampler2D texture;

varying vec3 vertPos; // passed from the vertex shader
varying vec3 normal;  // passed from the vertex shader
varying vec2 vTex;

void main()
{
    vec3 n = normalize(normal);
    vec3 e = normalize(vec3(0.0f, 0.0f, 0.0f) - vertPos); // camera position - vertex position
    
    if(dot(e, n) <= 0.3)
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    else
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0 - texture2D(texture, vTex).r);
}

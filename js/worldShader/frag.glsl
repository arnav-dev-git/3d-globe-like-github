uniform float time;
uniform sampler2D u_texture;

varying vec3 pos;
varying vec2 vUv;
varying vec3 vNormal;

void main(){
    float intensity=1.05-(dot(vNormal,vec3(0.,0.,1.)));
    vec3 atmosphere=vec3(.3,.6,1.)*pow(intensity,1.5);
    gl_FragColor=vec4(atmosphere+texture2D(u_texture,vUv).rgb,1.);
    
}
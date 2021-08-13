uniform float time;

varying vec3 pos;
varying vec2 vUv;

void main(){
    pos=position;
    vUv=uv;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}
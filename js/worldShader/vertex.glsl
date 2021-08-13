uniform float time;

varying vec3 pos;
varying vec2 vUv;
varying vec3 vNormal;

void main(){
    pos=position;
    vUv=uv;
    vNormal=normalize(normalMatrix*normal);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}
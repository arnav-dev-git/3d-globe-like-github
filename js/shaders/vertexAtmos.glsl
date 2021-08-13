uniform float time;

varying vec3 pos;
varying vec2 vUv;
varying vec3 vNormal;

void main(){
    pos=position;
    vUv=uv;
    vNormal=normalize(normalMatrix*normal);
    vec3 p=position;
    p.y+=.003*(sin(p.y*5.+time)*.5+.5);
    p.z+=.003*(sin(p.y*10.+time)*.5+.5);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}
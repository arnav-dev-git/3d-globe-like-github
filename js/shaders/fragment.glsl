uniform float time;

varying vec3 pos;
varying vec2 vUv;

void main(){
    // float dash=sin(vUv.x*50.-time*5.);
    // float dash=sin(pos.x*pos.y*10.-time);
    float dash=sin(vUv.x*5.-time*1.);
    
    // if(dash<0.)discard;
    if(dash<0.)discard;
    
    // gl_FragColor=vec4(vUv.x,0.,0.,1.);
    // gl_FragColor=vec4(pos*2.5,1.);
    gl_FragColor=vec4(pos.x*4.5,pos.y*4.5,sin(time),1.);
}
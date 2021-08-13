uniform sampler2D u_cloud;

varying vec3 pos;
varying vec2 vUv;
varying vec3 vNormal;

void main(){
    float intensity=pow(.6-dot(vNormal,vec3(0.,0.,1.)),2.);
    // gl_FragColor=vec4(.3,.6,1.,1.)*intensity*1.;
    // gl_FragColor=vec4(texture2D(u_cloud,vUv).rgb,.6)+vec4(.3,.6,1.,1.)*intensity;
    gl_FragColor=vec4(texture2D(u_cloud,vUv).rgb,.5);
}
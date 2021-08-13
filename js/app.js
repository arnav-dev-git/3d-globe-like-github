//////////////////////////////////////////////////////////

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import * as dat from "dat.gui";
// import gsap from "gsap";

import worldVertex from "./worldShader/vertex.glsl";
import worldFragment from "./worldShader/frag.glsl";
import fragmentAtmos from "./shaders/fragmentAtmos.glsl";
import vertexAtmos from "./shaders/vertexAtmos.glsl";

//textures
import earth from "../images/earthReal.jpg";
import earth_night from "../images/earthNight.jpg";
import clouds from "../images/clouds.jpg";

//data
// import { cities } from "./data.js";

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    // var frustumSize = 10;
    // var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotateSpeed = 0.2;
    this.controls.autoRotate = true;

    this.time = 0;

    this.isPlaying = true;

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    // this.settings();
  }

  settings() {
    // let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    // let that = this;
    this.shaderMaterial = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.worldShaderMaterial = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
        u_texture: {
          value: new THREE.TextureLoader().load(earth),
        },
      },
      // wireframe: true,
      transparent: true,
      vertexShader: worldVertex,
      fragmentShader: worldFragment,
    });

    this.geometry = new THREE.SphereBufferGeometry(1, 100, 100);
    const material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(earth),
    });

    this.planet = new THREE.Mesh(this.geometry, this.worldShaderMaterial);
    // this.planet = new THREE.Mesh(this.geometry, material);
    this.scene.add(this.planet);

    //atmos glow
    this.atmosMat = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      uniforms: {
        time: { value: 0 },
        u_cloud: { value: new THREE.TextureLoader().load(clouds) },
      },
      vertexShader: vertexAtmos,
      fragmentShader: fragmentAtmos,
      transparent: true,
      blending: THREE.AdditiveBlending,
      // side: THREE.BackSide,
    });
    this.atmos = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1.02, 50, 50),
      this.atmosMat
    );

    this.scene.add(this.atmos);

    function calcPosFromLatLonRad({ lat, lon }) {
      let phi = (90 - lat) * (Math.PI / 180);
      let theta = (lon + 180) * (Math.PI / 180);

      let x = -(Math.sin(phi) * Math.cos(theta));
      let z = Math.sin(phi) * Math.sin(theta);
      let y = Math.cos(phi);

      return { x, y, z };
    }

    this.point1 = {
      lat: 51.5074,
      lon: -0.1278,
    };

    this.point2 = {
      lat: 40.7128,
      lon: -74.006,
    };

    this.point3 = {
      lat: 22.5726,
      lon: 88.3639,
    };

    this.point4 = {
      lat: -23.5558,
      lon: -46.6396,
    };

    this.point5 = {
      lat: -33.8688,
      lon: 151.2093,
    };

    this.point6 = {
      lat: 35.6762,
      lon: 139.6503,
    };

    this.point7 = {
      lat: 31.7683,
      lon: 35.2137,
    };

    const flights = [
      this.point1,
      this.point2,
      this.point3,
      this.point4,
      this.point5,
      this.point6,
      this.point7,
    ];

    const arrLen = flights.length;
    for (let i = 0; i < arrLen; i++) {
      let pos = calcPosFromLatLonRad(flights[i]);
      this.pin = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.01, 30, 30),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff0000) })
      );
      this.pin.position.set(pos.x, pos.y, pos.z);
      this.scene.add(this.pin);

      if (i < arrLen - 1) {
        let pos1 = calcPosFromLatLonRad(flights[i + 1]);
        this.getCurve(pos, pos1);
      }
    }

    // this.getCurve(pos, pos1);
  }

  getCurve(p1, p2) {
    let v1 = new THREE.Vector3(p1.x, p1.y, p1.z);
    let v2 = new THREE.Vector3(p2.x, p2.y, p2.z);
    const points = [];

    for (let i = 0; i <= 20; i++) {
      let p = new THREE.Vector3().lerpVectors(v1, v2, i / 20);
      p.normalize();
      p.multiplyScalar(1 + 0.1 * Math.sin((Math.PI * i) / 20));
      points.push(p);
    }

    let path = new THREE.CatmullRomCurve3(points);

    const geometry = new THREE.TubeGeometry(path, 40, 0.006, 28, false);
    // const material = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   side: THREE.DoubleSide,
    // });
    const mesh = new THREE.Mesh(geometry, this.shaderMaterial);
    this.scene.add(mesh);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    this.shaderMaterial.uniforms.time.value = this.time;
    this.worldShaderMaterial.uniforms.time.value = this.time;
    this.atmosMat.uniforms.time.value = this.time;
    this.atmos.rotation.y += 0.0001;
    // this.camera.rotation.y -= 0.05;
    this.controls.update();

    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById("container"),
});

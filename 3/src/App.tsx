import { useRef, useEffect } from 'react'

import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const url = new URL("./assets/cool_man.glb", import.meta.url);

function App() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current){
      const renderer = new THREE.WebGLRenderer();
      (ref.current as HTMLCanvasElement).appendChild(renderer.domElement);
      renderer.setSize(window.innerWidth, window.innerHeight);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      camera.position.set(0, 2, 5);

      const ambientlight = new THREE.AmbientLight(0x333333);
      scene.add(ambientlight);

      const plight = new THREE.PointLight(0xffffff, 1, 100, 0);
      plight.position.y = 15;
      plight.position.z = 20;
      plight.power = 70;
      scene.add(plight);

      // // tmp
      // const plightHelper = new THREE.PointLightHelper(plight);
      // scene.add(plightHelper);
      // //


      // //tmp
      // const axesHelper = new THREE.AxesHelper(2000);
      // scene.add(axesHelper);
      // //


      let mixer : THREE.AnimationMixer;

      const orbit = new OrbitControls(camera, renderer.domElement);
      orbit.update();

      const grid = new THREE.GridHelper(100, 100);
      scene.add(grid);

      const assetLoader = new GLTFLoader();

      assetLoader.load(url.href, (gltf : any) => {
        const model = gltf.scene;
        scene.add(model);
        mixer = new THREE.AnimationMixer(model);
        const clips = gltf.animations;
        // const clip = THREE.AnimationClip.findByName(clips, "salute");
        // const action = mixer.clipAction(clip);
        // console.log(clips);
        // action.play();
        if (clips.length > 0) {
          const action = mixer.clipAction(clips[2]);
          action.play();
        }
      },
      undefined,
      (error : any) =>
      {
        console.log("Error: " + error);
      });

      const clock = new THREE.Clock();
      const animate = () => {
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };

      renderer.setAnimationLoop(animate);
      return () => {
        if (ref.current)
          (ref.current as HTMLCanvasElement).removeChild(renderer.domElement);
      };
    }
  }, []);
  
  return (
    <>
      <div ref={ref}></div>
    </>
  );
}

export default App

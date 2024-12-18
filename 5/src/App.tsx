import { useRef, useEffect } from 'react'
import { OrbitControls } from 'three/examples/jsm/Controls/OrbitControls.js';
import * as THREE from 'three'
import * as CANNON from 'cannon-es'

function App() {
  let ref = useRef(null);

  useEffect(() => {
    if (ref.current)
    {
      let renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      renderer.shadowMap.enabled = true;
      renderer.setSize(window.innerWidth, window.innerHeight);
      (ref.current as HTMLDivElement)?.appendChild(renderer.domElement);
      
      let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight);
      let scene = new THREE.Scene();

      let orbit = new OrbitControls(camera, renderer.domElement);
      camera.position.set(10, 10, 10);
      orbit.update();

      let ambient = new THREE.AmbientLight(0x333333);
      scene.add(ambient);

      let axes = new THREE.AxesHelper(30);
      scene.add(axes);

      let light = new THREE.PointLight(0xffffff, 1, 10, 0);
      light.castShadow = true;
      // light.shadow.mapSize = 1024;
      light.position.set(0, 10, 0);
      scene.add(light);

      let lightHelper = new THREE.PointLightHelper(light);
      scene.add(lightHelper);

      let mouse = new THREE.Vector2();
      let mouseIntersect = new THREE.Vector3();
      let planNormal = new THREE.Vector3();

      let plane = new THREE.Plane();
      let rayCaster = new THREE.Raycaster();

      window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
        planNormal.copy(camera.position).normalize();
        plane.setFromNormalAndCoplanarPoint(planNormal, scene.position);
        rayCaster.setFromCamera(mouse, camera);
        rayCaster.ray.intersectPlane(plane, mouseIntersect)
      });

      let world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.81, 0),
      })

      let groundPhysMat = new CANNON.Material();
      let groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        material: groundPhysMat,
        shape: new CANNON.Box(new CANNON.Vec3(5, 5, 0.001)),
      });
      world.addBody(groundBody);
      groundBody.quaternion.setFromEuler(-Math.PI/2, 0, 0);
      let groundGeo = new THREE.PlaneGeometry(10, 10);
      let groundMat = new THREE.MeshBasicMaterial({
        color : 0xffffff,
        side: THREE.DoubleSide,
      });
      let ground = new THREE.Mesh(groundGeo, groundMat);
      ground.receiveShadow = true;
      scene.add(ground);
      
      let spheres:{ sphere: any; body: any, physMat: any}[] = [];
      window.addEventListener('click', () => {
        let spherePhysMat = new CANNON.Material();
        let sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
        let sphereMat = new THREE.MeshStandardMaterial({
          color : Math.random() * 0xffffff,
          metalness: 0,
          roughness: 0,
        });
        let sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.castShadow = true;
        scene.add(sphere);

        let sphereBody = new CANNON.Body({
          mass: 0.5,
          material: spherePhysMat,
          shape: new CANNON.Sphere(0.125),
          position: new CANNON.Vec3(mouseIntersect.x , mouseIntersect.y, mouseIntersect.z),
        });
        world.addBody(sphereBody);

        let groundXsphereContact = new CANNON.ContactMaterial(
          groundPhysMat,
          spherePhysMat, {
            restitution: 0.4,
          }
        );
        world.addContactMaterial(groundXsphereContact);

        spheres.push({sphere:sphere, body: sphereBody, physMat: spherePhysMat});
      });
      
      renderer.setAnimationLoop(() => {
        world.step(1/60);
        ground.position.copy(groundBody.position);
        ground.quaternion.copy(groundBody.quaternion);
        
        for (let i = 0; i < spheres.length; i++) {
          spheres[i].sphere.position.copy(spheres[i].body.position);
          spheres[i].sphere.quaternion.copy(spheres[i].body.quaternion);
        }
        renderer.render(scene, camera);
      });

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
      return (() => {
        if (ref.current)
          (ref.current as HTMLDivElement)?.removeChild(renderer.domElement);
      });
    }

  }, []);

  return (
    <>
      <div ref={ref}></div>
    </>
  )
}

export default App

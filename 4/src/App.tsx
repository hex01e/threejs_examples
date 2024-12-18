import { useRef, useEffect } from 'react'

import { OrbitControls } from 'three/examples/jsm/Controls/OrbitControls.js';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

function App() {
  const ref = useRef(null);


  useEffect(() => {
    if (ref.current)
    {
      let renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      (ref.current as HTMLDivElement)?.appendChild(renderer.domElement);

      let scene = new THREE.Scene();
      let camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight);

      // let grid = new THREE.GridHelper(50, 50);
      // scene.add(grid);
      
      // tmp =>
      let axes = new THREE.AxesHelper(100);
      scene.add(axes);
      
      //  <= tmp
      
      let orbit = new OrbitControls(camera ,renderer.domElement);
      camera.position.set(0, 20, -30);
      orbit.update();

      let boxGeo = new THREE.BoxGeometry(2, 2, 2);
      let boxMat = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
      });
      let box = new THREE.Mesh(boxGeo, boxMat);
      scene.add(box);

      let sphereGeo = new THREE.SphereGeometry(2);
      let sphereMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
      });
      let sphere = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(sphere);

      let groundGeo = new THREE.PlaneGeometry(30, 30);
      let groundMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        wireframe: true,
      });
      let ground = new THREE.Mesh(groundGeo, groundMat);
      scene.add(ground);


      // adding physics
      let world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.81, 0),
      });
      let timeStep = 1 / 60; // one second


      // bodys
      let groundPhysMat = new CANNON.Material();
      let groundBody = new CANNON.Body({
        // mass: 10,
        shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
        type : CANNON.Body.STATIC,
        material: groundPhysMat,
      });
      groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
      world.addBody(groundBody);

      let boxPhysMat = new CANNON.Material();
      let boxBody = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
        position: new CANNON.Vec3(5, 20, 0),
        material: boxPhysMat,
      });
      boxBody.angularVelocity.set(0, 10, 0);
      boxBody.angularDamping = 0.5;
      world.addBody(boxBody);

      let spherePhysMat = new CANNON.Material();
      let sphereBody = new CANNON.Body({
        mass: 10,
        shape: new CANNON.Sphere(2),
        position: new CANNON.Vec3(0, 15, 0),
        material: spherePhysMat,
      });
      sphereBody.linearDamping = 0.31;
      world.addBody(sphereBody);

      let groundBoxContact = new CANNON.ContactMaterial(
        groundPhysMat,
        boxPhysMat,
        {
          friction : 0.44,
        }
      );
      world.addContactMaterial(groundBoxContact);
      let groundSphereContact = new CANNON.ContactMaterial(
        groundPhysMat,
        spherePhysMat,
        {
          restitution: 0.9,
        }
      );
      world.addContactMaterial(groundSphereContact);
      let animate = () => {
        world.step(timeStep);

        ground.position.copy(groundBody.position);
        ground.quaternion.copy(groundBody.quaternion);

        box.position.copy(boxBody.position);
        box.quaternion.copy(boxBody.quaternion);

        sphere.position.copy(sphereBody.position);
        sphere.quaternion.copy(sphereBody.quaternion);

        renderer.render(scene, camera);
      };

      renderer.setAnimationLoop(animate);

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
    <div ref={ref} ></div>
    </>
  )
}

export default App

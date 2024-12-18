// import { useRef, useEffect, useState } from 'react'
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// function App() {
//   let ref = useRef(null);
//   let [obj, setObj] = useState<number>(0);

//   useEffect(() => {
//     if (ref.current)
//     {
//       let renderer = new THREE.WebGLRenderer();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//       (ref.current as HTMLElement)?.appendChild(renderer.domElement);

//       let scene = new THREE.Scene();
//       let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight);

//       let orbit = new OrbitControls(camera, renderer.domElement);
//       camera.position.set(0, 30, 35);
//       orbit.update();

//       // temp start

//       let grid = new THREE.GridHelper(30, 30);
//       scene.add(grid);

//       // let axes = new THREE.AxesHelper(15);
//       // scene.add(axes);

//       // temp end


//       // meshs start
//       let plane = new THREE.Mesh(
//         new THREE.PlaneGeometry(30, 30),
//         new THREE.MeshBasicMaterial({
//           visible: false,
//           color : 0xffffff,
//           side: THREE.DoubleSide,
//         })
//       );
//       plane.name = "plane";
//       plane.rotateX(Math.PI / 2);
//       scene.add(plane);

//       let hoverChip = new THREE.Mesh(
//         new THREE.PlaneGeometry(1, 1),
//         new THREE.MeshBasicMaterial({
//           side: THREE.DoubleSide
//         })
//       );
//       hoverChip.rotateX(Math.PI / 2);
//       hoverChip.position.set(0.5, 0, 0.5);
//       scene.add(hoverChip);
//       // meshs end

//       let mousePosition = new THREE.Vector2();
//       let rayCaster = new THREE.Raycaster();
//       let intersetcs : THREE.Intersection[];

//       window.addEventListener("mousemove", (e) => {
//         mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
//         mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
//         rayCaster.setFromCamera(mousePosition, camera);
//         intersetcs = rayCaster.intersectObjects(scene.children);
//         for (let i = 0; i < intersetcs.length; i++) {
//           if (intersetcs[i].object.name === "plane")
//           {
//             const hoveredPos = new THREE.Vector3().copy(intersetcs[i].point).floor().addScalar(0.5);
//             hoverChip.position.set(hoveredPos.x, 0, hoveredPos.z);
//             break;
//           }
//         }
//       });
      
//       let sphere = new THREE.Mesh(
//         new THREE.SphereGeometry(0.4),
//         new THREE.MeshBasicMaterial({
//           color: 0xff0000
//         }),
//       );
      
//       (ref.current as HTMLDivElement)?.addEventListener("mousedown", () => {
//         // for (let i = 0; i < intersetcs.length; i++) {
//         //   if (intersetcs[i].object.name === "plane")
//         //     {
//         //       let newSphere = sphere.clone();
//         //       newSphere.position.copy(hoverChip.position);
//         //       newSphere.position.y = 0.5;
//         //       scene.add(newSphere);
//         //     }
//         //   }
//           setObj((prev) => (prev + 1));
//           console.log(obj);
          
//         });
        
//       function animate() {
//         renderer.render(scene, camera);
//       }

//       renderer.setAnimationLoop(animate);
//       return (() => {
//         if (ref.current){
//           (ref.current as HTMLElement)?.removeChild(renderer.domElement);
//           (ref.current as HTMLDivElement)?.addEventListener("mousedown", () => {});



//         }
//       });
//     }
//   }, [obj]);
  
//   return (
//     <>
//       <div ref={ref}></div>
//     </>
//   )
// }



// export default App;




import React, { useRef, useEffect, useState, useCallback } from 'react'

function App() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      node.addEventListener('mousedown', handleClick);
    }
  }, [handleClick]);

  useEffect(() => {
    console.log(count);
  }, [count]);

  return (
    <div ref={ref}>
      Click count: {count}
    </div>
  )
}

export default App;
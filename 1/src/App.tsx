
import './App.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import React, { useRef, useEffect } from 'react';
import { greaterThan, mod } from 'three/webgpu';
import { Wireframe } from 'three/examples/jsm/Addons.js';
import bg from './assets/back.jpg';
import bg2 from './assets/back2.jpg';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const monkeypath =  new URL('./assets/moncky.glb', import.meta.url);

function App() {
    const ref = useRef(null);

    useEffect(() =>
    {
        const HEIGHT = window.innerHeight;
        const WIDTH = window.innerWidth;

        const renderer = new THREE.WebGLRenderer();
        renderer.shadowMap.enabled = true;
        renderer.setSize(WIDTH, HEIGHT);
        ref.current.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            60,WIDTH / window.innerHeight, 0.1 , 1000
        );
        const orbit = new OrbitControls(camera, renderer.domElement);
        
        const helper = new THREE.AxesHelper(3);
        scene.add(helper);

        camera.position.set(0, 2, 25);
        orbit.update();

        const box = new THREE.BoxGeometry();
        const materlial = new THREE.MeshBasicMaterial({color:0x00ff00});
        const mesh = new THREE.Mesh(box, materlial);
        scene.add(mesh);
        
        const plangeom = new THREE.PlaneGeometry(30, 30);
        const plane_matrial = new THREE.MeshStandardMaterial({color:0xffffff, side : THREE.DoubleSide})
        const plan_mesh = new THREE.Mesh(plangeom, plane_matrial);
        plan_mesh.rotation.x = -0.5 * Math.PI;
        plan_mesh.receiveShadow = true;
        scene.add(plan_mesh);
        
        const grid_helper = new THREE.GridHelper(30);
        scene.add(grid_helper)

        const sphere_geom = new THREE.SphereGeometry(4, 50, 50);
        const sphere_material = new THREE.MeshStandardMaterial({color : 0xff0000, wireframe: false})
        const sphere_mesh = new THREE.Mesh(sphere_geom, sphere_material);
        sphere_mesh.position.set(-10,10,0);
        sphere_mesh.castShadow = true;
        scene.add(sphere_mesh);
        
        const sphereId = sphere_mesh.id;
        
        const ambient = new THREE.AmbientLight(0x333333);
        scene.add(ambient);
        

        // directional shadow;
        // const dlight = new THREE.DirectionalLight(0xffffff, 0.8);
        // dlight.position.set(-30, 50, 0);
        // dlight.castShadow = true;
        // dlight.shadow.camera.bottom = -12;
        // scene.add(dlight);
        
        
        // const dlightHelper = new THREE.DirectionalLightHelper(dlight, 5);
        // scene.add(dlightHelper);
        
        // const dlightShdowHelper = new THREE.CameraHelper(dlight.shadow.camera);
        // scene.add(dlightShdowHelper);
        
        // spot light;
        const slight = new THREE.SpotLight(0x00ffffff);
        slight.position.set(-100,100,0);
        slight.power = 100000;
        slight.castShadow = true;
        slight.angle = 0.2;
        scene.add(slight);
        
        const slightHelper = new THREE.SpotLightHelper(slight);
        scene.add(slightHelper);
        
        // scene.fog = new THREE.Fog(0xffffff, 0, 200);
        // scene.fog = new THREE.FogExp2(0xffffff, 0.01);
        // renderer.setClearColor(0xffea00);
        // const textureLoader = new THREE.TextureLoader();
        // scene.background = textureLoader.load(bg);
        // const cubeTextureLoader = new THREE.CubeTextureLoader();
        // scene.background = cubeTextureLoader.load([
            //     bg,
            //     bg,
            //     bg,
            //     bg,
            //     bg,
            //     bg
            // ]);
            
            
        const box2geom = new THREE.BoxGeometry(4, 4, 4);
        const box2material = new THREE.MeshBasicMaterial({
            color:0x00ff00,
            // map: textureLoader.load(bg2)
        });
        // const box2multiMaterial = [
            //     new THREE.MeshBasicMaterial({map: textureLoader.load(bg2)}),
            //     new THREE.MeshBasicMaterial({map: textureLoader.load(bg2)}),
            //     new THREE.MeshBasicMaterial({map: textureLoader.load(bg)}),
            //     new THREE.MeshBasicMaterial({map: textureLoader.load(bg2)}),
            //     new THREE.MeshBasicMaterial({map: textureLoader.load(bg)}),
            //     new THREE.MeshBasicMaterial({map: textureLoader.load(bg)}),
            // ]
        const box2mesh = new THREE.Mesh(box2geom, box2material);
        box2mesh.position.set(0, 5, 1);
        box2mesh.name = "box";
        // // box2mesh.material.map = textureLoader.load(bg2);
        scene.add(box2mesh);

        const mousePosition = new THREE.Vector2();
        window.addEventListener('mousemove', function(e: any) {
            mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
            mousePosition.y = -((e.clientY / window.innerHeight) * 2 - 1);
        });

        const raycaster = new THREE.Raycaster();

        const plan2geom = new THREE.PlaneGeometry(10, 10, 10, 10);
        const plan2material = new THREE.MeshBasicMaterial({
            color : 0xffffff,
            wireframe: true,
        });
        const plan2mesh = new THREE.Mesh(plan2geom, plan2material);
        plan2mesh.position.set(10,10, 15);
        scene.add(plan2mesh);

        plan2mesh.geometry.attributes.position.array[0] -= 10 * Math.random();
        plan2mesh.geometry.attributes.position.array[1] -= 10 * Math.random();
        plan2mesh.geometry.attributes.position.array[2] -= 10 * Math.random();
        let last = plan2mesh.geometry.attributes.position.array.length - 1;
        plan2mesh.geometry.attributes.position.array[last] -= 10 * Math.random();



        let vshader = document.getElementById('vertex')?.textContent;
        vshader = vshader ? vshader : "";
        let fshader = document.getElementById('fragment')?.textContent;
        fshader = fshader ? fshader : "";
        const shpher2geometry = new THREE.SphereGeometry(4);
        const sphere2material = new THREE.ShaderMaterial({
            vertexShader: vshader,
            fragmentShader: fshader,
        });
        const sphere2mesh = new THREE.Mesh(shpher2geometry, sphere2material);
        sphere2mesh.position.set(-5, 10, 10);
        scene.add(sphere2mesh);


        const assetLoader = new GLTFLoader();

        assetLoader.load(monkeypath.href, function(gltf:any){
            const model = gltf.scene;
            scene.add(model);
            model.position.set(-12, 4, 10);
        }, undefined, function(error){
            console.log("error" + error);
        });

        const gui = new dat.GUI();

        const options = {
            sphereColor: "#ffea00",
            Wireframe: false,
            speed: 0.01,
            angle:0.2,
            intensity:1,
            penumbera:0,
        }

        gui.addColor(options, 'sphereColor').onChange(function(e : any) {
            sphere_mesh.material.color.set(e);
        });

        gui.add(options, 'Wireframe').onChange(function(e : any){
            sphere_mesh.material.wireframe = e;
        });

        gui.add(options, 'speed', 0, 0.1);
        gui.add(options, 'angle', 0, 1);
        gui.add(options, 'penumbera', 0, 1);
        gui.add(options, 'intensity', 0, 1);

        let step = 0;

        function animate(time : any){
            mesh.rotation.y = time / 1000;
            mesh.rotation.x = time / 1000;

            step += options.speed;
            sphere_mesh.position.y = 10 * Math.abs(Math.sin(step));

            slight.angle = options.angle;
            slight.penumbra = options.penumbera;
            // slight.intensity = options.intensity;

            raycaster.setFromCamera(mousePosition, camera);
            const intersects = raycaster.intersectObjects(scene.children);
            // console.log(intersects);

            for (let i = 0; i < intersects.length; i++)
            {
                // if (intersects[i].object.id === sphereId)
                //     sphere_mesh.material.color.set(0x00ff00);
                if (intersects[i].object.name === "box")
                {
                    box2mesh.rotation.x = time / 1000;
                    box2mesh.rotation.y = time / 1000;
                }
            }

            plan2mesh.geometry.attributes.position.array[0] = 10 * Math.random();
            plan2mesh.geometry.attributes.position.array[1] = 10 * Math.random();
            plan2mesh.geometry.attributes.position.array[2] = 10 * Math.random();
            plan2mesh.geometry.attributes.position.array[last] = 10 * Math.random();

            plan2mesh.geometry.attributes.position.needsUpdate = true;
            slightHelper.update();
            renderer.render(scene, camera);
        }

        renderer.setAnimationLoop(animate);
        window.addEventListener('resize', function(){
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        return () => {
            renderer.dispose();
            gui.destroy();
            ref.current.removeChild(renderer.domElement);
        }
    }, []);

    return (
        <>
            <div ref={ref}/>
        </>
    )
}

export default App



import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const WebGLScene = ({ vertShader, fragShader }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, mesh;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.ShaderMaterial({
        vertexShader: vertShader,
        fragmentShader: fragShader,
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    };

    const animate = () => {
      requestAnimationFrame(animate);

      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    init();
    animate();

    // Cleanup function
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [vertShader, fragShader]);

  return <div ref={mountRef} />;
};

export default WebGLScene;

import { useRef, useEffect } from "react";
import * as THREE from "three";
import PropTypes from "prop-types";

const WebGLScene = ({ vertShader, fragShader }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, mesh;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, 800 / 200, 0.1, 1000);
      camera.position.z = 1;
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(800, 200);
      mountRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        -1.0,
        -1.0,
        0.0, // bottom left
        1.0,
        -1.0,
        0.0, // bottom right
        1.0,
        1.0,
        0.0, // top right
        -1.0,
        -1.0,
        0.0, // bottom left
        1.0,
        1.0,
        0.0, // top right
        -1.0,
        1.0,
        0.0, // top left
      ]);
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

      const material = new THREE.ShaderMaterial({
        vertexShader: vertShader,
        fragmentShader: fragShader,
        side: THREE.DoubleSide,
        uniforms: {
          iTime: { value: 0.0 },
          iResolution: {
            value: new THREE.Vector2(800, 200),
          },
        },
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    };

    const animate = () => {
      requestAnimationFrame(animate);

      // Update time uniform for animations
      if (mesh) {
        mesh.material.uniforms.iTime.value += 0.01;
      }

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

WebGLScene.propTypes = {
  vertShader: PropTypes.string.isRequired,
  fragShader: PropTypes.string.isRequired,
};

export default WebGLScene;

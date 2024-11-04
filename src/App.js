import React, { useEffect, useRef } from "react";
import "./index.css";
import { PeraWalletProvider } from "./components/PeraWalletProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar";
import Game from "./components/Game";
import HomePage from "./components/HomePage";
import Leaderboard from "./components/Leaderboard";
import GameDescription from "./components/GameDescription";
import TriviaContainer from "./components/TriviaContainer";
import PeraWalletTutorial from "./components/PeraWalletTutorial";
import WhitePaper from "./components/WhitePaper";
import * as THREE from "three";

const App = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    const particleGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x8844ee });
    const particles = Array.from({ length: 200 }, () => {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        (Math.random() - 0.5) * 16,
        -4 + Math.random() * 4,
        (Math.random() - 0.5) * 16
      );
      scene.add(particle);
      return particle;
    });

    const animate = () => {
      requestAnimationFrame(animate);
      particles.forEach((p) => {
        p.position.y += 0.002;
        p.rotation.x += 0.005;
        p.rotation.y += 0.005;
        if (p.position.y > 4) p.position.y = -4;
      });
      renderer.render(scene, camera);
    };
    animate();

    // Parallax effect based on mouse movement
    const handleMouseMove = (event) => {
      const { innerWidth, innerHeight } = window;
      const xOffset = ((event.clientX / innerWidth) - 0.5) * 10; // adjust sensitivity
      const yOffset = ((event.clientY / innerHeight) - 0.5) * 10; // adjust sensitivity
      document.body.style.setProperty("--xOffset", `${xOffset}px`);
      document.body.style.setProperty("--yOffset", `${yOffset}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      mountRef?.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <Router>
      <NavBar />
      <PeraWalletProvider>
        <div className="canvasContainer" ref={mountRef}></div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/match-3-mania" element={<Game />} />
          <Route path="/trivia-takedown" element={<TriviaContainer />} />
          <Route path="/rewards-game-guide" element={<GameDescription />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/learn-pera-wallet" element={<PeraWalletTutorial />} />
        </Routes>
      </PeraWalletProvider>
    </Router>
  );
};

export default App;

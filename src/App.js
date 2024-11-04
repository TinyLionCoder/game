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
import HomePageStyles from "./components/css_modules/HomePageStyles.module.css";

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
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Responsive resize handling
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Create floating particles (or crystals)
    const particleGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x8844ee });
    const particles = Array.from({ length: 60 }, () => {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );
      scene.add(particle);
      return particle;
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      particles.forEach((p) => {
        p.position.y += 0.002; // Upward drift effect
        p.rotation.x += 0.005;
        p.rotation.y += 0.005;
        if (p.position.y > 4) p.position.y = -4;
      });
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef?.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <Router>
      <PeraWalletProvider>
        <NavBar />
        <div className={HomePageStyles.canvasContainer} ref={mountRef}></div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/match-3-mania" element={<Game />} />
          <Route path="/trivia-takedown" element={<TriviaContainer />} />
          <Route path="/rewards-game-guide" element={<GameDescription />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          {/* <Route path="/white-paper" element={<WhitePaper />} /> */}
          <Route path="/learn-pera-wallet" element={<PeraWalletTutorial />} />
        </Routes>
      </PeraWalletProvider>
    </Router>
  );
};

export default App;

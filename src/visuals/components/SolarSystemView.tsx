import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Box, Eye, Info } from 'lucide-react';

interface SolarSystemViewProps {
  onSelectComponent: (id: string) => void;
  selectedComponentId?: string;
  speedMultiplier?: number;
  isPlaying?: boolean;
}

const PLANETS = [
  { id: 'mercury', name: 'Mercury', color: '#9ca3af', threeColor: 0x9ca3af, radius: 4, dist2D: 42, dist3D: 18, period: 88, speed: 4.15, size3D: 0.6 },
  { id: 'venus', name: 'Venus', color: '#eab308', threeColor: 0xeab308, radius: 7, dist2D: 62, dist3D: 26, period: 225, speed: 1.62, size3D: 1.1 },
  { id: 'earth', name: 'Earth', color: '#3b82f6', threeColor: 0x3b82f6, radius: 8, dist2D: 86, dist3D: 35, period: 365, speed: 1.0, size3D: 1.2 },
  { id: 'mars', name: 'Mars', color: '#ef4444', threeColor: 0xef4444, radius: 6, dist2D: 110, dist3D: 44, period: 687, speed: 0.53, size3D: 0.8 },
  { id: 'jupiter', name: 'Jupiter', color: '#d97706', threeColor: 0xd97706, radius: 15, dist2D: 145, dist3D: 58, period: 4333, speed: 0.25, size3D: 2.4 },
  { id: 'saturn', name: 'Saturn', color: '#fbbf24', threeColor: 0xfbbf24, radius: 12, dist2D: 180, dist3D: 72, period: 10759, speed: 0.18, hasRing: true, size3D: 2.0 },
  { id: 'uranus', name: 'Uranus', color: '#06b6d4', threeColor: 0x06b6d4, radius: 9, dist2D: 215, dist3D: 85, period: 30685, speed: 0.12, size3D: 1.5 },
  { id: 'neptune', name: 'Neptune', color: '#2563eb', threeColor: 0x2563eb, radius: 9, dist2D: 245, dist3D: 98, period: 60190, speed: 0.08, size3D: 1.5 }
];

export default function SolarSystemView({ onSelectComponent, selectedComponentId }: SolarSystemViewProps) {
  const [mode3D, setMode3D] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [zoomInner, setZoomInner] = useState(false);
  const [time, setTime] = useState(0);
  const [threeError, setThreeError] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // 2D animation loop
  useEffect(() => {
    if (!playing || mode3D) return;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      setTime(t => t + delta * speed * 0.8);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [playing, speed, mode3D]);

  // 3D Three.js implementation
  useEffect(() => {
    if (!mode3D || !mountRef.current) return;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animId: number;

    try {
      const container = mountRef.current;
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 450;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a1014);

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 75, 120);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const sunLight = new THREE.PointLight(0xfff3d6, 2.5, 300);
      scene.add(sunLight);

      // Sun
      const sunGeo = new THREE.SphereGeometry(6, 32, 32);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const sunMesh = new THREE.Mesh(sunGeo, sunMat);
      scene.add(sunMesh);

      // Orbit lines & Planet Meshes
      const planetMeshes: { mesh: THREE.Mesh; dist: number; speed: number; id: string; angle: number }[] = [];

      PLANETS.forEach(p => {
        // Orbit ring
        const orbitCurve = new THREE.EllipseCurve(0, 0, p.dist3D, p.dist3D, 0, 2 * Math.PI, false, 0);
        const points = orbitCurve.getPoints(64);
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(points.map(pt => new THREE.Vector3(pt.x, 0, pt.y)));
        const orbitMat = new THREE.LineBasicMaterial({ color: 0x244438, transparent: true, opacity: 0.5 });
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        scene?.add(orbitLine);

        // Planet
        const pGeo = new THREE.SphereGeometry(p.size3D, 24, 24);
        const pMat = new THREE.MeshStandardMaterial({ color: p.threeColor, roughness: 0.6, metalness: 0.1 });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        scene?.add(pMesh);

        // Saturn ring
        if (p.hasRing) {
          const ringGeo = new THREE.RingGeometry(p.size3D * 1.4, p.size3D * 2.3, 32);
          const ringMat = new THREE.MeshBasicMaterial({ color: 0xd9b36c, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 2.5;
          pMesh.add(ringMesh);
        }

        planetMeshes.push({ mesh: pMesh, dist: p.dist3D, speed: p.speed, id: p.id, angle: Math.random() * Math.PI * 2 });
      });

      // Mouse drag controls for rotation
      let isDragging = false;
      let prevMousePos = { x: 0, y: 0 };
      let camTheta = Math.PI / 2;
      let camPhi = 0.5;
      let camRadius = 130;

      const updateCamera = () => {
        if (!camera) return;
        camera.position.x = camRadius * Math.sin(camPhi) * Math.cos(camTheta);
        camera.position.y = camRadius * Math.cos(camPhi);
        camera.position.z = camRadius * Math.sin(camPhi) * Math.sin(camTheta);
        camera.lookAt(0, 0, 0);
      };

      const handleMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevMousePos = { x: e.clientX, y: e.clientY };
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - prevMousePos.x;
        const dy = e.clientY - prevMousePos.y;
        prevMousePos = { x: e.clientX, y: e.clientY };
        camTheta -= dx * 0.008;
        camPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, camPhi - dy * 0.008));
        updateCamera();
      };

      const handleMouseUp = () => { isDragging = false; };
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        camRadius = Math.max(40, Math.min(220, camRadius + e.deltaY * 0.1));
        updateCamera();
      };

      const domElem = renderer.domElement;
      domElem.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      domElem.addEventListener('wheel', handleWheel, { passive: false });

      let last3DTime = performance.now();
      const renderLoop = (now: number) => {
        const dt = (now - last3DTime) / 1000;
        last3DTime = now;

        if (playing) {
          planetMeshes.forEach(pm => {
            pm.angle += dt * speed * 0.5 * (pm.speed * 0.8);
            pm.mesh.position.x = Math.cos(pm.angle) * pm.dist;
            pm.mesh.position.z = Math.sin(pm.angle) * pm.dist;
            pm.mesh.rotation.y += 0.02;
          });
          sunMesh.rotation.y += 0.005;
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
        animId = requestAnimationFrame(renderLoop);
      };
      animId = requestAnimationFrame(renderLoop);

      return () => {
        cancelAnimationFrame(animId);
        domElem.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        domElem.removeEventListener('wheel', handleWheel);
        renderer?.dispose();
        if (container) container.innerHTML = '';
      };
    } catch (err) {
      console.error('Three.js failed to initialize, falling back to 2D:', err);
      setThreeError(true);
      setMode3D(false);
    }
  }, [mode3D, playing, speed]);

  const centerX = 300;
  const centerY = 300;
  const scale = zoomInner ? 1.6 : 1.0;
  const effectiveCenter = 300;

  return (
    <div className="visual-experience-canvas-wrap">
      <div className="canvas-toolbar">
        <div className="toolbar-left">
          <button
            className="btn btn-soft btn-sm"
            onClick={() => setPlaying(p => !p)}
            title={playing ? 'Pause orbits' : 'Play orbits'}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? 'Pause' : 'Play'}
          </button>
          <button
            className="btn btn-quiet btn-sm"
            onClick={() => { setTime(0); }}
            title="Reset planetary positions"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <div className="segmented segmented-sm">
            {[0.5, 1, 2, 4].map(s => (
              <button
                key={s}
                className={speed === s ? 'chosen' : ''}
                onClick={() => setSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-right">
          <button
            className={`btn btn-sm ${zoomInner ? 'btn-soft' : 'btn-quiet'}`}
            onClick={() => setZoomInner(z => !z)}
          >
            <Eye size={14} /> {zoomInner ? 'Show All Planets' : 'Zoom Inner Planets'}
          </button>
          {!threeError && (
            <button
              className={`btn btn-sm ${mode3D ? 'btn-primary' : 'btn-soft'}`}
              onClick={() => setMode3D(m => !m)}
            >
              <Box size={14} /> {mode3D ? '2D View' : '3D Celestial View'}
            </button>
          )}
        </div>
      </div>

      {mode3D ? (
        <div className="three-viewport-wrap">
          <div ref={mountRef} className="three-canvas" />
          <div className="three-hint">
            <span>Drag to rotate camera · Scroll to zoom</span>
          </div>
        </div>
      ) : (
        <div className="svg-stage-container">
          <svg
            viewBox="0 0 600 600"
            className="interactive-svg solar-system-svg"
            role="img"
            aria-label="Interactive 2D Solar System Map"
          >
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffedd5" />
                <stop offset="35%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#d97706" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background space elements */}
            <rect width="600" height="600" fill="#080e12" rx="16" />

            {/* Orbit lines */}
            <g transform={`translate(${effectiveCenter}, ${effectiveCenter}) scale(${scale})`}>
              {PLANETS.map(p => (
                <circle
                  key={`orbit-${p.id}`}
                  cx="0"
                  cy="0"
                  r={p.dist2D}
                  fill="none"
                  stroke={selectedComponentId === p.id ? '#2dd4bf' : '#1e382f'}
                  strokeWidth={selectedComponentId === p.id ? 2 : 1}
                  strokeDasharray={selectedComponentId === p.id ? '4 2' : '3 3'}
                  opacity={selectedComponentId === p.id ? 0.9 : 0.45}
                />
              ))}

              {/* Central Sun */}
              <g
                className="clickable-component"
                onClick={() => onSelectComponent('sun')}
                style={{ cursor: 'pointer' }}
              >
                <circle cx="0" cy="0" r={zoomInner ? 36 : 28} fill="url(#sunGlow)" filter="url(#glow)" />
                <circle
                  cx="0"
                  cy="0"
                  r={zoomInner ? 18 : 14}
                  fill="#fbbf24"
                  stroke={selectedComponentId === 'sun' ? '#fff' : '#f59e0b'}
                  strokeWidth={selectedComponentId === 'sun' ? 3 : 1}
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#78350f"
                  fontSize={zoomInner ? 9 : 8}
                  fontWeight="800"
                >
                  SUN
                </text>
              </g>

              {/* Planets */}
              {PLANETS.map(p => {
                const angle = time * p.speed;
                const px = Math.cos(angle) * p.dist2D;
                const py = Math.sin(angle) * p.dist2D;
                const isSelected = selectedComponentId === p.id;

                return (
                  <g
                    key={p.id}
                    className="clickable-component"
                    onClick={() => onSelectComponent(p.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isSelected && (
                      <circle
                        cx={px}
                        cy={py}
                        r={p.radius + 6}
                        fill="none"
                        stroke="#2dd4bf"
                        strokeWidth="2"
                        strokeDasharray="3 2"
                      />
                    )}

                    {p.hasRing && (
                      <ellipse
                        cx={px}
                        cy={py}
                        rx={p.radius * 2}
                        ry={p.radius * 0.7}
                        fill="none"
                        stroke="#fef08a"
                        strokeWidth="2.5"
                        transform={`rotate(-25 ${px} ${py})`}
                        opacity="0.85"
                      />
                    )}

                    <circle
                      cx={px}
                      cy={py}
                      r={p.radius}
                      fill={p.color}
                      stroke={isSelected ? '#fff' : '#1e293b'}
                      strokeWidth={isSelected ? 2 : 1}
                    />

                    <text
                      x={px}
                      y={py - p.radius - 5}
                      textAnchor="middle"
                      fill={isSelected ? '#2dd4bf' : '#94a3b8'}
                      fontSize={zoomInner ? 9 : 8}
                      fontWeight={isSelected ? 700 : 500}
                    >
                      {p.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      )}

      <div className="canvas-disclaimer">
        <Info size={13} />
        <span>Educational simplified orbital model. Orbital periods are scaled for interactive visualization.</span>
      </div>
    </div>
  );
}

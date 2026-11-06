import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TOTAL_TILES } from '../data/gameData';
import type { Player, Tile } from '../types';

interface Board3DProps {
  tiles: Tile[];
  players: Player[];
  activePlayerIndex: number;
  diceValue: number;
  isRolling: boolean;
  drawingDeck: 'drink' | 'truth_dare' | null;
}

const STEP = 1.65;
const HALF = 5 * STEP; // 11x11 grid: 10 intervals per side (-5*STEP to +5*STEP)

export function getTilePosition(index: number): { x: number; z: number } {
  const i = ((index % TOTAL_TILES) + TOTAL_TILES) % TOTAL_TILES;
  if (i <= 10) {
    return { x: -HALF + i * STEP, z: HALF };
  }
  if (i <= 20) {
    return { x: HALF, z: HALF - (i - 10) * STEP };
  }
  if (i <= 30) {
    return { x: HALF - (i - 20) * STEP, z: -HALF };
  }
  return { x: -HALF, z: -HALF + (i - 30) * STEP };
}

function createTileTopTexture(tile: Tile, ownerColor: string | null): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = ownerColor ? ownerColor : '#1e293b';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(14, 14, 228, 228);

  ctx.fillStyle = ownerColor || tile.color;
  ctx.fillRect(14, 14, 228, 56);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let badge = '';
  if (tile.type === 'start') badge = 'START';
  else if (tile.type === 'drink') badge = '🍺 JOOK';
  else if (tile.type === 'truth_dare') badge = '🎭 ÜLESANNE';
  else if (tile.type === 'all_drink') badge = '🍻 KÕIK!';
  else if (tile.price) badge = `${tile.price} 💰`;

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(badge, 128, 43);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 25px sans-serif';
  const words = tile.name.split(' ');
  if (words.length === 1) {
    ctx.fillText(tile.name, 128, 138);
  } else {
    const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
    const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
    ctx.fillText(line1, 128, 122);
    ctx.fillText(line2, 128, 156);
  }

  if (ownerColor) {
    ctx.fillStyle = ownerColor;
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('OMANDATUD', 128, 212);
  } else if (tile.type === 'property') {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px sans-serif';
    ctx.fillText('VABA MAA', 128, 212);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createDeckCardTexture(deckType: 'drink' | 'truth_dare'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  const isDrink = deckType === 'drink';

  // Rich gradient background
  const grad = ctx.createLinearGradient(0, 0, 512, 768);
  if (isDrink) {
    grad.addColorStop(0, '#7c2d12');
    grad.addColorStop(0.5, '#ea580c');
    grad.addColorStop(1, '#f59e0b');
  } else {
    grad.addColorStop(0, '#4c1d95');
    grad.addColorStop(0.5, '#be185d');
    grad.addColorStop(1, '#ec4899');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 768);

  // Dark inner card panel
  ctx.fillStyle = '#090d16';
  ctx.fillRect(28, 28, 456, 712);

  // Ornate glowing border
  ctx.strokeStyle = isDrink ? '#fbbf24' : '#f472b6';
  ctx.lineWidth = 8;
  ctx.strokeRect(46, 46, 420, 676);

  ctx.strokeStyle = isDrink ? 'rgba(251, 191, 36, 0.35)' : 'rgba(244, 114, 182, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(62, 62, 388, 644);

  // Corner diamonds
  const corners = [
    [76, 76],
    [436, 76],
    [76, 692],
    [436, 692],
  ];
  ctx.fillStyle = isDrink ? '#fbbf24' : '#f472b6';
  for (const [cx, cy] of corners) {
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // Center glowing medallion
  const radGrad = ctx.createRadialGradient(256, 320, 20, 256, 320, 145);
  if (isDrink) {
    radGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
    radGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
  } else {
    radGrad.addColorStop(0, 'rgba(236, 72, 153, 0.45)');
    radGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');
  }
  ctx.fillStyle = radGrad;
  ctx.beginPath();
  ctx.arc(256, 320, 145, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = isDrink ? '#f59e0b' : '#ec4899';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(256, 320, 105, 0, Math.PI * 2);
  ctx.stroke();

  // Central Icon
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '115px sans-serif';
  ctx.fillText(isDrink ? '🍺' : '🎭', 256, 325);

  // Title banner
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 42px sans-serif';
  ctx.fillText(isDrink ? 'JOOMIS-' : 'TÕDE VÕI', 256, 515);
  ctx.fillStyle = isDrink ? '#fbbf24' : '#f472b6';
  ctx.font = '900 44px sans-serif';
  ctx.fillText(isDrink ? 'CHALLENGE' : 'TEGU', 256, 568);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('PEOMONOPOL', 256, 645);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createDiceFaceTexture(dots: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 246, 246);

  ctx.fillStyle = dots === 1 || dots === 6 ? '#e11d48' : '#0f172a';

  const positions: Record<number, [number, number][]> = {
    1: [[128, 128]],
    2: [
      [70, 70],
      [186, 186],
    ],
    3: [
      [64, 64],
      [128, 128],
      [192, 192],
    ],
    4: [
      [70, 70],
      [186, 70],
      [70, 186],
      [186, 186],
    ],
    5: [
      [64, 64],
      [192, 64],
      [128, 128],
      [64, 192],
      [192, 192],
    ],
    6: [
      [70, 60],
      [186, 60],
      [70, 128],
      [186, 128],
      [70, 196],
      [186, 196],
    ],
  };

  for (const [x, y] of positions[dots] || positions[1]) {
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const DICE_TOP_ROTATIONS: Record<number, [number, number, number]> = {
  1: [0, 0, Math.PI / 2],
  6: [0, 0, -Math.PI / 2],
  2: [0, 0, 0],
  5: [Math.PI, 0, 0],
  3: [-Math.PI / 2, 0, 0],
  4: [Math.PI / 2, 0, 0],
};

export function Board3D({
  tiles,
  players,
  activePlayerIndex,
  diceValue,
  isRolling,
  drawingDeck,
}: Board3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const tileMeshesRef = useRef<THREE.Mesh[]>([]);
  const pawnMeshesRef = useRef<Map<number, THREE.Mesh>>(new Map());
  const pawnTargetsRef = useRef<Map<number, THREE.Vector3>>(new Map());
  const diceMeshRef = useRef<THREE.Mesh | null>(null);
  const drinkFlyCardRef = useRef<THREE.Mesh | null>(null);
  const truthFlyCardRef = useRef<THREE.Mesh | null>(null);
  const drawAnimStartRef = useRef<number | null>(null);

  const isRollingRef = useRef(isRolling);
  const diceValueRef = useRef(diceValue);
  const drawingDeckRef = useRef(drawingDeck);
  const activePlayerIdRef = useRef<number | null>(players[activePlayerIndex]?.id ?? null);

  isRollingRef.current = isRolling;
  diceValueRef.current = diceValue;
  activePlayerIdRef.current = players[activePlayerIndex]?.id ?? null;

  useEffect(() => {
    drawingDeckRef.current = drawingDeck;
    if (drawingDeck) {
      drawAnimStartRef.current = performance.now();
    } else {
      drawAnimStartRef.current = null;
    }
  }, [drawingDeck]);

  // Initialize Three.js scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');
    scene.fog = new THREE.FogExp2('#090d16', 0.015);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    camera.position.set(0, 21.5, 20.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 13;
    controls.maxDistance = 34;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI / 2.35;
    controls.target.set(0, 0, 0.8);

    // Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#fff7ed', 1.4);
    dirLight.position.set(12, 24, 14);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 2;
    dirLight.shadow.camera.far = 55;
    const d = 14;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    // Center court platform for 11x11 board
    const innerSize = STEP * 9.05;
    const centerGeo = new THREE.BoxGeometry(innerSize, 0.3, innerSize);
    const centerMat = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.75,
      metalness: 0.15,
    });
    const centerFloor = new THREE.Mesh(centerGeo, centerMat);
    centerFloor.position.set(0, -0.1, 0);
    centerFloor.receiveShadow = true;
    scene.add(centerFloor);

    // Subtle neon ring around center
    const borderGeo = new THREE.RingGeometry(STEP * 4.3, STEP * 4.42, 4);
    borderGeo.rotateX(-Math.PI / 2);
    borderGeo.rotateY(Math.PI / 4);
    const borderMat = new THREE.MeshBasicMaterial({ color: '#38bdf8' });
    const borderMesh = new THREE.Mesh(borderGeo, borderMat);
    borderMesh.position.set(0, 0.06, 0);
    scene.add(borderMesh);

    // Helper to build a 3D card deck in the middle of the board
    const createCardDeck = (
      deckType: 'drink' | 'truth_dare',
      posX: number,
      posZ: number,
      rotY: number
    ): THREE.Mesh => {
      const cardWidth = 2.6;
      const cardLength = 3.8;
      const deckHeight = 0.48;

      // Glowing pedestal frame under deck
      const baseGeo = new THREE.BoxGeometry(cardWidth + 0.35, 0.08, cardLength + 0.35);
      const baseMat = new THREE.MeshBasicMaterial({
        color: deckType === 'drink' ? '#f97316' : '#ec4899',
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.set(posX, 0.09, posZ);
      baseMesh.rotation.y = rotY;
      scene.add(baseMesh);

      const topTex = createDeckCardTexture(deckType);
      const sideMat = new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.5,
      });
      const topMat = new THREE.MeshStandardMaterial({
        map: topTex,
        roughness: 0.25,
        metalness: 0.1,
      });

      // Deck stack body
      const stackGeo = new THREE.BoxGeometry(cardWidth, deckHeight, cardLength);
      const stackMaterials = [sideMat, sideMat, topMat, sideMat, sideMat, sideMat];
      const stackMesh = new THREE.Mesh(stackGeo, stackMaterials);
      stackMesh.position.set(posX, 0.12 + deckHeight / 2, posZ);
      stackMesh.rotation.y = rotY;
      stackMesh.castShadow = true;
      stackMesh.receiveShadow = true;
      scene.add(stackMesh);

      // Animated top flying card that lifts & flips when drawn
      const flyGeo = new THREE.BoxGeometry(cardWidth, 0.05, cardLength);
      const flyMaterials = [sideMat, sideMat, topMat, topMat, sideMat, sideMat];
      const flyCard = new THREE.Mesh(flyGeo, flyMaterials);
      flyCard.position.set(posX, 0.15 + deckHeight, posZ);
      flyCard.rotation.y = rotY;
      flyCard.castShadow = true;
      scene.add(flyCard);

      return flyCard;
    };

    // Place Drinking Challenge deck (left-diagonal) and Truth or Dare deck (right-diagonal)
    drinkFlyCardRef.current = createCardDeck('drink', -3.6, -1.2, 0.35);
    truthFlyCardRef.current = createCardDeck('truth_dare', 3.6, -1.2, -0.35);

    // Create 40 perimeter tiles (11x11 square)
    const tileMeshes: THREE.Mesh[] = [];
    const tileGeo = new THREE.BoxGeometry(1.52, 0.42, 1.52);

    for (let i = 0; i < TOTAL_TILES; i++) {
      const tile = tiles[i];
      const { x, z } = getTilePosition(i);
      const topTex = createTileTopTexture(tile, null);
      const sideMat = new THREE.MeshStandardMaterial({
        color: tile.color,
        roughness: 0.45,
        metalness: 0.2,
      });
      const topMat = new THREE.MeshStandardMaterial({
        map: topTex,
        roughness: 0.4,
      });
      const materials = [sideMat, sideMat, topMat, sideMat, sideMat, sideMat];

      const mesh = new THREE.Mesh(tileGeo, materials);
      mesh.position.set(x, 0, z);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      scene.add(mesh);
      tileMeshes.push(mesh);
    }
    tileMeshesRef.current = tileMeshes;

    // Create 3D Dice in front-center of the board
    const diceGeo = new THREE.BoxGeometry(1.45, 1.45, 1.45);
    const faceOrder = [1, 6, 2, 5, 3, 4];
    const diceMaterials = faceOrder.map(
      (n) =>
        new THREE.MeshStandardMaterial({
          map: createDiceFaceTexture(n),
          roughness: 0.25,
          metalness: 0.05,
        })
    );
    const diceMesh = new THREE.Mesh(diceGeo, diceMaterials);
    diceMesh.position.set(0, 0.9, 1.8);
    diceMesh.castShadow = true;
    scene.add(diceMesh);
    diceMeshRef.current = diceMesh;

    // Animation loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Animate player cones smoothly towards their target positions
      pawnMeshesRef.current.forEach((mesh, playerId) => {
        const target = pawnTargetsRef.current.get(playerId);
        if (target) {
          mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, target.x, 0.2);
          mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, target.z, 0.2);
          const dist = Math.hypot(mesh.position.x - target.x, mesh.position.z - target.z);
          const hopHeight = Math.min(dist * 0.45, 0.8);
          const isCurrent = activePlayerIdRef.current === playerId;
          const idleBob = isCurrent ? Math.sin(elapsed * 4.5) * 0.1 + 0.1 : 0;
          mesh.position.y = target.y + hopHeight + idleBob;
        }
      });

      // Animate 3D dice
      if (diceMeshRef.current) {
        if (isRollingRef.current) {
          diceMeshRef.current.rotation.x += 0.28;
          diceMeshRef.current.rotation.y += 0.34;
          diceMeshRef.current.rotation.z += 0.22;
          diceMeshRef.current.position.y = 1.7 + Math.abs(Math.sin(elapsed * 14)) * 1.0;
        } else {
          const [rx, ry, rz] = DICE_TOP_ROTATIONS[diceValueRef.current] || [0, 0, 0];
          diceMeshRef.current.rotation.x = THREE.MathUtils.lerp(
            diceMeshRef.current.rotation.x,
            rx,
            0.18
          );
          diceMeshRef.current.rotation.y = THREE.MathUtils.lerp(
            diceMeshRef.current.rotation.y,
            ry,
            0.18
          );
          diceMeshRef.current.rotation.z = THREE.MathUtils.lerp(
            diceMeshRef.current.rotation.z,
            rz,
            0.18
          );
          diceMeshRef.current.position.y = THREE.MathUtils.lerp(
            diceMeshRef.current.position.y,
            0.9,
            0.2
          );
        }
      }

      // Animate 3D Card Draw from center decks
      const now = performance.now();
      const activeDeck = drawingDeckRef.current;
      const startMs = drawAnimStartRef.current;

      const updateDeckFlyCard = (
        cardMesh: THREE.Mesh | null,
        baseX: number,
        baseZ: number,
        baseRotY: number,
        isDrawingThis: boolean
      ) => {
        if (!cardMesh) return;
        if (isDrawingThis && startMs !== null) {
          const t = Math.min((now - startMs) / 900, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          cardMesh.position.x = THREE.MathUtils.lerp(baseX, 0, ease);
          cardMesh.position.y = THREE.MathUtils.lerp(0.63, 6.2, ease);
          cardMesh.position.z = THREE.MathUtils.lerp(baseZ, 4.5, ease);
          cardMesh.rotation.x = ease * Math.PI * 0.42;
          cardMesh.rotation.y = THREE.MathUtils.lerp(baseRotY, Math.PI * 2, ease);
          cardMesh.rotation.z = Math.sin(ease * Math.PI) * 0.2;
        } else {
          cardMesh.position.x = THREE.MathUtils.lerp(cardMesh.position.x, baseX, 0.18);
          cardMesh.position.y = THREE.MathUtils.lerp(cardMesh.position.y, 0.63, 0.18);
          cardMesh.position.z = THREE.MathUtils.lerp(cardMesh.position.z, baseZ, 0.18);
          cardMesh.rotation.x = THREE.MathUtils.lerp(cardMesh.rotation.x, 0, 0.18);
          cardMesh.rotation.y = THREE.MathUtils.lerp(cardMesh.rotation.y, baseRotY, 0.18);
          cardMesh.rotation.z = THREE.MathUtils.lerp(cardMesh.rotation.z, 0, 0.18);
        }
      };

      updateDeckFlyCard(
        drinkFlyCardRef.current,
        -3.6,
        -1.2,
        0.35,
        activeDeck === 'drink'
      );
      updateDeckFlyCard(
        truthFlyCardRef.current,
        3.6,
        -1.2,
        -0.35,
        activeDeck === 'truth_dare'
      );

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  // Sync tile colors & textures when ownership updates
  useEffect(() => {
    tiles.forEach((tile, idx) => {
      const mesh = tileMeshesRef.current[idx];
      if (!mesh) return;
      const owner =
        tile.owner !== null ? players.find((p) => p.id === tile.owner) ?? null : null;
      const ownerColor = owner ? owner.color : null;

      const materials = mesh.material as THREE.MeshStandardMaterial[];
      if (Array.isArray(materials) && materials.length === 6) {
        const sideColor = ownerColor || tile.color;
        materials.forEach((mat, mIdx) => {
          if (mIdx === 2) {
            mat.map?.dispose();
            mat.map = createTileTopTexture(tile, ownerColor);
            mat.needsUpdate = true;
          } else {
            mat.color.set(sideColor);
          }
        });
      }
    });
  }, [tiles, players]);

  // Sync player cones & target coordinates
  useEffect(() => {
    const firstTileMesh = tileMeshesRef.current[0];
    if (!firstTileMesh || !firstTileMesh.parent) return;
    const scene = firstTileMesh.parent;

    const activeIds = new Set(players.map((p) => p.id));
    pawnMeshesRef.current.forEach((mesh, id) => {
      if (!activeIds.has(id)) {
        scene.remove(mesh);
        pawnMeshesRef.current.delete(id);
        pawnTargetsRef.current.delete(id);
      }
    });

    const tileGroups = new Map<number, Player[]>();
    players.forEach((p) => {
      const group = tileGroups.get(p.pos) || [];
      group.push(p);
      tileGroups.set(p.pos, group);
    });

    players.forEach((player) => {
      const group = tileGroups.get(player.pos) || [player];
      const idxInGroup = group.findIndex((p) => p.id === player.id);
      const count = group.length;

      const base = getTilePosition(player.pos);
      let offsetX = 0;
      let offsetZ = 0;
      if (count > 1) {
        const angle = (idxInGroup / count) * Math.PI * 2;
        const radius = count > 4 ? 0.45 : 0.38;
        offsetX = Math.cos(angle) * radius;
        offsetZ = Math.sin(angle) * radius;
      }

      const targetVec = new THREE.Vector3(base.x + offsetX, 0.72, base.z + offsetZ);
      pawnTargetsRef.current.set(player.id, targetVec);

      let cone = pawnMeshesRef.current.get(player.id);
      if (!cone) {
        const coneGeo = new THREE.ConeGeometry(0.24, 0.95, 24);
        const coneMat = new THREE.MeshStandardMaterial({
          color: player.color,
          roughness: 0.25,
          metalness: 0.2,
          emissive: player.color,
          emissiveIntensity: 0.18,
        });
        cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.copy(targetVec);
        cone.castShadow = true;
        scene.add(cone);
        pawnMeshesRef.current.set(player.id, cone);
      } else {
        const mat = cone.material as THREE.MeshStandardMaterial;
        mat.color.set(player.color);
        mat.emissive.set(player.color);
      }
    });
  }, [players]);

  return <div ref={mountRef} className="fixed inset-0 w-full h-full z-0" />;
}

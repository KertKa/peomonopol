import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TOTAL_TILES } from '../data/gameData';
import type { Player, Tile } from '../types';

export type CameraMode = 'overview' | 'follow' | 'focus';

interface Board3DProps {
  tiles: Tile[];
  players: Player[];
  activePlayerIndex: number;
  diceValue: number;
  isRolling: boolean;
  drawingDeck: 'drink' | 'truth_dare' | null;
  cameraMode: CameraMode;
  focusedTileId: number | null;
}

const STEP = 1.65;
const HALF = 5 * STEP; // 11x11 grid: 10 intervals per side (-5*STEP to +5*STEP)

const OVERVIEW_POS = new THREE.Vector3(0, 21.5, 20.5);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, 0.8);

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

// Returns the outward normal, forward movement tangent, and Y rotation for a tile index (0..39)
function getTileSideVectors(index: number): {
  outX: number;
  outZ: number;
  fwdX: number;
  fwdZ: number;
  rotY: number;
} {
  const i = ((index % TOTAL_TILES) + TOTAL_TILES) % TOTAL_TILES;
  if (i < 10) {
    // Bottom edge: moving left -> right (+X), outside is +Z
    return { outX: 0, outZ: 1, fwdX: 1, fwdZ: 0, rotY: 0 };
  }
  if (i < 20) {
    // Right edge: moving bottom -> top (-Z), outside is +X
    return { outX: 1, outZ: 0, fwdX: 0, fwdZ: -1, rotY: Math.PI / 2 };
  }
  if (i < 30) {
    // Top edge: moving right -> left (-X), outside is -Z
    return { outX: 0, outZ: -1, fwdX: -1, fwdZ: 0, rotY: Math.PI };
  }
  // Left edge: moving top -> bottom (+Z), outside is -X
  return { outX: -1, outZ: 0, fwdX: 0, fwdZ: 1, rotY: -Math.PI / 2 };
}

function createTileTopTexture(tile: Tile, ownerColor: string | null): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (tile.type === 'start') {
    // Red START tile
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, 512, 512);

    // Inner glowing field
    const rad = ctx.createRadialGradient(256, 256, 40, 256, 256, 260);
    rad.addColorStop(0, '#ef4444');
    rad.addColorStop(1, '#991b1b');
    ctx.fillStyle = rad;
    ctx.fillRect(20, 20, 472, 472);

    // Gold borders
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 14;
    ctx.strokeRect(26, 26, 460, 460);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, 416, 416);

    // Start Emoji
    ctx.font = '110px sans-serif';
    ctx.fillText('🏁', 256, 140);

    // Huge START text
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 88px sans-serif';
    ctx.fillText('START', 256, 275);

    // +10 Coins Bonus
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 58px sans-serif';
    ctx.fillText('+10 💰', 256, 385);

    // Bottom banner
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('RING TÄIS!', 256, 455);
  } else if (tile.type === 'all_drink') {
    // Orange Kõik Joovad tile
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, 0, 512, 512);

    // Inner glowing field
    const rad = ctx.createRadialGradient(256, 256, 40, 256, 256, 260);
    rad.addColorStop(0, '#f97316');
    rad.addColorStop(1, '#c2410c');
    ctx.fillStyle = rad;
    ctx.fillRect(20, 20, 472, 472);

    // Gold borders
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 14;
    ctx.strokeRect(26, 26, 460, 460);

    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, 416, 416);

    // Glass clinking emoji
    ctx.font = '110px sans-serif';
    ctx.fillText('🍻', 256, 140);

    // Huge KÕIK JOOVAD text
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 62px sans-serif';
    ctx.fillText('KÕIK JOOVAD!', 256, 275);

    // +1 Coin Bonus
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 52px sans-serif';
    ctx.fillText('+1 💰', 256, 385);

    // Bottom banner
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('TERVISEKS!', 256, 455);
  } else {
    // Standard tiles: Property, Drink challenge, Truth/Dare
    ctx.fillStyle = ownerColor ? ownerColor : '#1e293b';
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(24, 24, 464, 464);

    // Top color stripe
    ctx.fillStyle = ownerColor || tile.color;
    ctx.fillRect(24, 24, 464, 115);

    let badge = '';
    if (tile.type === 'drink') badge = '🍺 JOOK';
    else if (tile.type === 'truth_dare') badge = '🎭 ÜLESANNE';
    else if (tile.price) badge = `${tile.price} 💰`;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText(badge, 256, 82);

    // Tile Name with larger font
    ctx.fillStyle = '#f8fafc';
    const words = tile.name.split(' ');
    if (words.length === 1) {
      ctx.font = 'bold 52px sans-serif';
      ctx.fillText(tile.name, 256, 275);
    } else {
      ctx.font = 'bold 46px sans-serif';
      const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
      const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
      ctx.fillText(line1, 256, 245);
      ctx.fillText(line2, 256, 305);
    }

    if (ownerColor) {
      ctx.fillStyle = ownerColor;
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText('OMANDATUD', 256, 425);
    } else if (tile.type === 'property') {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '38px sans-serif';
      ctx.fillText('VABA MAA', 256, 425);
    } else {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '36px sans-serif';
      ctx.fillText('VÕTA KAART', 256, 425);
    }
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

  ctx.fillStyle = '#090d16';
  ctx.fillRect(28, 28, 456, 712);

  ctx.strokeStyle = isDrink ? '#fbbf24' : '#f472b6';
  ctx.lineWidth = 8;
  ctx.strokeRect(46, 46, 420, 676);

  ctx.strokeStyle = isDrink ? 'rgba(251, 191, 36, 0.35)' : 'rgba(244, 114, 182, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(62, 62, 388, 644);

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

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '115px sans-serif';
  ctx.fillText(isDrink ? '🍺' : '🎭', 256, 325);

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
  cameraMode,
  focusedTileId,
}: Board3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const tileMeshesRef = useRef<THREE.Mesh[]>([]);
  const pawnMeshesRef = useRef<Map<number, THREE.Mesh>>(new Map());
  const pawnTargetsRef = useRef<Map<number, THREE.Vector3>>(new Map());
  const diceMeshRef = useRef<THREE.Mesh | null>(null);
  const drinkFlyCardRef = useRef<THREE.Mesh | null>(null);
  const truthFlyCardRef = useRef<THREE.Mesh | null>(null);
  const drawAnimStartRef = useRef<number | null>(null);
  const pulseStartRef = useRef<number | null>(null);

  const isRollingRef = useRef(isRolling);
  const diceValueRef = useRef(diceValue);
  const drawingDeckRef = useRef(drawingDeck);
  const cameraModeRef = useRef<CameraMode>(cameraMode);
  const focusedTileIdRef = useRef<number | null>(focusedTileId);
  const activePlayerRef = useRef<Player | null>(players[activePlayerIndex] ?? null);

  isRollingRef.current = isRolling;
  diceValueRef.current = diceValue;
  activePlayerRef.current = players[activePlayerIndex] ?? null;

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    focusedTileIdRef.current = focusedTileId;
    if (focusedTileId !== null) {
      pulseStartRef.current = performance.now();
    } else {
      pulseStartRef.current = null;
    }
  }, [focusedTileId]);

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
    scene.fog = new THREE.FogExp2('#090d16', 0.014);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    camera.position.copy(OVERVIEW_POS);

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
    controls.minDistance = 4;
    controls.maxDistance = 36;
    controls.minPolarAngle = Math.PI / 8;
    controls.maxPolarAngle = Math.PI / 2.25;
    controls.target.copy(OVERVIEW_TARGET);

    // Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.92);
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

      const stackGeo = new THREE.BoxGeometry(cardWidth, deckHeight, cardLength);
      const stackMaterials = [sideMat, sideMat, topMat, sideMat, sideMat, sideMat];
      const stackMesh = new THREE.Mesh(stackGeo, stackMaterials);
      stackMesh.position.set(posX, 0.12 + deckHeight / 2, posZ);
      stackMesh.rotation.y = rotY;
      stackMesh.castShadow = true;
      stackMesh.receiveShadow = true;
      scene.add(stackMesh);

      const flyGeo = new THREE.BoxGeometry(cardWidth, 0.05, cardLength);
      const flyMaterials = [sideMat, sideMat, topMat, topMat, sideMat, sideMat];
      const flyCard = new THREE.Mesh(flyGeo, flyMaterials);
      flyCard.position.set(posX, 0.15 + deckHeight, posZ);
      flyCard.rotation.y = rotY;
      flyCard.castShadow = true;
      scene.add(flyCard);

      return flyCard;
    };

    drinkFlyCardRef.current = createCardDeck('drink', -3.6, -1.2, 0.35);
    truthFlyCardRef.current = createCardDeck('truth_dare', 3.6, -1.2, -0.35);

    // Create 40 perimeter tiles (11x11 square) oriented outward so text is always upright when viewed from outside
    const tileMeshes: THREE.Mesh[] = [];
    const standardTileGeo = new THREE.BoxGeometry(1.52, 0.42, 1.52);
    const cornerTileGeo = new THREE.BoxGeometry(2.15, 0.52, 2.15);

    for (let i = 0; i < TOTAL_TILES; i++) {
      const tile = tiles[i];
      const isCorner = i === 0 || i === 10 || i === 20 || i === 30;
      const { x, z } = getTilePosition(i);
      const { rotY } = getTileSideVectors(i);
      const topTex = createTileTopTexture(tile, null);
      const sideColor =
        tile.type === 'start'
          ? '#dc2626'
          : tile.type === 'all_drink'
          ? '#ea580c'
          : tile.color;
      const sideMat = new THREE.MeshStandardMaterial({
        color: sideColor,
        roughness: 0.45,
        metalness: 0.2,
      });
      const topMat = new THREE.MeshStandardMaterial({
        map: topTex,
        roughness: 0.35,
      });
      const materials = [sideMat, sideMat, topMat, sideMat, sideMat, sideMat];

      const mesh = new THREE.Mesh(isCorner ? cornerTileGeo : standardTileGeo, materials);
      mesh.position.set(x, isCorner ? 0.05 : 0, z);
      mesh.rotation.y = rotY;
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

    // Smoothed camera state vectors
    const desiredCamPos = OVERVIEW_POS.clone();
    const desiredCamTarget = OVERVIEW_TARGET.clone();
    let returningToOverview = false;
    let prevMode: CameraMode = 'overview';

    // Animation loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const now = performance.now();

      const activePlayer = activePlayerRef.current;
      const activePlayerId = activePlayer?.id ?? null;

      // 1. Animate player cones smoothly towards their target positions
      pawnMeshesRef.current.forEach((mesh, playerId) => {
        const target = pawnTargetsRef.current.get(playerId);
        if (target) {
          const stepLerp = 1 - Math.exp(-14 * dt);
          mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, target.x, stepLerp);
          mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, target.z, stepLerp);
          const dist = Math.hypot(mesh.position.x - target.x, mesh.position.z - target.z);
          const hopHeight = Math.min(dist * 0.48, 0.85);
          const isCurrent = activePlayerId === playerId;
          const idleBob = isCurrent ? Math.sin(elapsed * 4.5) * 0.08 + 0.08 : 0;
          mesh.position.y = target.y + hopHeight + idleBob;
        }
      });

      // 2. Pulse landed tile for ~400ms on focus
      const pulseStart = pulseStartRef.current;
      const focusedId = focusedTileIdRef.current;
      tileMeshesRef.current.forEach((mesh, idx) => {
        if (idx === focusedId && pulseStart !== null) {
          const pulseElapsed = now - pulseStart;
          if (pulseElapsed <= 450) {
            const p = pulseElapsed / 450;
            const wave = Math.sin(p * Math.PI);
            mesh.position.y = wave * 0.36;
            mesh.scale.setScalar(1 + wave * 0.12);
          } else {
            mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, 0, 0.2);
            mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, 1, 0.2));
          }
        } else {
          if (mesh.position.y !== 0) {
            mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, 0, 0.2);
          }
          if (mesh.scale.x !== 1) {
            mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, 1, 0.2));
          }
        }
      });

      // 3. Camera tracking & zooming (followPiece, focusTile, resetCamera)
      const mode = cameraModeRef.current;
      if (mode !== prevMode) {
        if (mode === 'overview') {
          returningToOverview = true;
        }
        prevMode = mode;
      }

      if (mode === 'follow' && activePlayer) {
        controls.enabled = false;
        returningToOverview = false;

        const pawnMesh = pawnMeshesRef.current.get(activePlayer.id);
        const basePos = pawnMesh
          ? pawnMesh.position
          : new THREE.Vector3(
              getTilePosition(activePlayer.pos).x,
              0.72,
              getTilePosition(activePlayer.pos).z
            );
        const { outX, outZ, fwdX, fwdZ } = getTileSideVectors(activePlayer.pos);

        // Camera ~2x closer than overview, outside the board edge looking inward and slightly ahead of the pawn
        desiredCamTarget.set(
          basePos.x + fwdX * 2.1,
          0.35,
          basePos.z + fwdZ * 2.1
        );
        desiredCamPos.set(
          basePos.x + outX * 7.8 - fwdX * 3.4,
          7.6,
          basePos.z + outZ * 7.8 - fwdZ * 3.4
        );

        const camLerp = 1 - Math.exp(-5.2 * dt);
        camera.position.lerp(desiredCamPos, camLerp);
        controls.target.lerp(desiredCamTarget, camLerp);
      } else if (mode === 'focus' && focusedId !== null) {
        controls.enabled = false;
        returningToOverview = false;

        const tileCoords = getTilePosition(focusedId);
        const { outX, outZ } = getTileSideVectors(focusedId);

        // Camera ~3x closer than overview and lower so landed tile's name & price are crystal clear
        desiredCamTarget.set(tileCoords.x, 0.25, tileCoords.z);
        desiredCamPos.set(
          tileCoords.x + outX * 4.5,
          4.6,
          tileCoords.z + outZ * 4.5
        );

        const focusLerp = 1 - Math.exp(-6.5 * dt);
        camera.position.lerp(desiredCamPos, focusLerp);
        controls.target.lerp(desiredCamTarget, focusLerp);
      } else {
        // Overview mode
        if (returningToOverview || isRollingRef.current) {
          controls.enabled = false;
          const resetLerp = 1 - Math.exp(-4.8 * dt);
          camera.position.lerp(OVERVIEW_POS, resetLerp);
          controls.target.lerp(OVERVIEW_TARGET, resetLerp);

          if (
            !isRollingRef.current &&
            camera.position.distanceTo(OVERVIEW_POS) < 0.25 &&
            controls.target.distanceTo(OVERVIEW_TARGET) < 0.15
          ) {
            returningToOverview = false;
            controls.enabled = true;
          }
        } else {
          controls.enabled = true;
        }
      }

      // Guard: never allow camera below the board
      if (camera.position.y < 2.2) {
        camera.position.y = 2.2;
      }

      // 4. Animate 3D dice
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

      // 5. Animate 3D Card Draw from center decks toward camera view
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
          const t = Math.min((now - startMs) / 850, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          // Fly towards midpoint between board center and current camera position
          const targetFlyX = camera.position.x * 0.35;
          const targetFlyY = Math.max(4.8, camera.position.y * 0.42);
          const targetFlyZ = camera.position.z * 0.35;

          cardMesh.position.x = THREE.MathUtils.lerp(baseX, targetFlyX, ease);
          cardMesh.position.y = THREE.MathUtils.lerp(0.63, targetFlyY, ease);
          cardMesh.position.z = THREE.MathUtils.lerp(baseZ, targetFlyZ, ease);
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
        const sideColor =
          tile.type === 'start'
            ? '#dc2626'
            : tile.type === 'all_drink'
            ? '#ea580c'
            : ownerColor || tile.color;
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

      const isCorner =
        player.pos === 0 ||
        player.pos === 10 ||
        player.pos === 20 ||
        player.pos === 30;
      const targetVec = new THREE.Vector3(
        base.x + offsetX,
        isCorner ? 0.85 : 0.72,
        base.z + offsetZ
      );
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

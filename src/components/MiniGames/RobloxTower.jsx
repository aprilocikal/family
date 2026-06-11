/* ============================================================
   🧱 Tower of Seasons — Multiplayer Lego-style Tower Climb
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Peer } from 'peerjs';
import { Users, Play, ArrowLeft, RefreshCw, Trophy, Crown, ArrowUp, ArrowLeft as LeftIcon, ArrowRight } from 'lucide-react';
import './RobloxTower.css';

const TOWER_HEIGHT = 4500;
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 600;

// Character styles definition
const LEGO_STYLES = [
  { id: 'skater', emoji: '🛹', name: 'Lego Skater', shirtColor: '#FFCC00', pantsColor: '#333333', accessory: 'cap' },
  { id: 'astronaut', emoji: '🚀', name: 'Lego Astronaut', shirtColor: '#0066FF', pantsColor: '#0066FF', accessory: 'helmet' },
  { id: 'explorer', emoji: '🤠', name: 'Lego Explorer', shirtColor: '#228B22', pantsColor: '#8B4513', accessory: 'fedora' },
  { id: 'chef', emoji: '🍳', name: 'Lego Chef', shirtColor: '#FFFFFF', pantsColor: '#111111', accessory: 'chefhat' }
];

// Checkpoints definitions
const CHECKPOINTS = [
  { id: 1, y: TOWER_HEIGHT - 350, label: 'Warm Meadows' },
  { id: 2, y: TOWER_HEIGHT - 850, label: 'Sunbeam Ledge' },
  { id: 3, y: TOWER_HEIGHT - 1350, label: 'Lava Peak' },
  { id: 4, y: TOWER_HEIGHT - 1850, label: 'Drizzle Slope' },
  { id: 5, y: TOWER_HEIGHT - 2350, label: 'Stormy Ledge' },
  { id: 6, y: TOWER_HEIGHT - 2850, label: 'Nimbus Rise' },
  { id: 7, y: TOWER_HEIGHT - 3350, label: 'Frosty Slope' },
  { id: 8, y: TOWER_HEIGHT - 3850, label: 'Glacier Pass' },
  { id: 9, y: TOWER_HEIGHT - 4300, label: 'Summit Gate' }
];

// Trampolines
const TRAMPOLINES = [
  { x: 100, y: TOWER_HEIGHT - 50 },
  { x: 380, y: TOWER_HEIGHT - 400 },
  { x: 200, y: TOWER_HEIGHT - 1100 },
  { x: 300, y: TOWER_HEIGHT - 1600 },
  { x: 120, y: TOWER_HEIGHT - 2500 },
  { x: 350, y: TOWER_HEIGHT - 3100 },
  { x: 220, y: TOWER_HEIGHT - 3650 }
];

// Spikes & Obstacles
const OBSTACLES = [
  // Summer fireballs
  { type: 'fire', x: 200, y: TOWER_HEIGHT - 200, r: 12, vx: 2, rangeMin: 50, rangeMax: 430 },
  { type: 'fire', x: 100, y: TOWER_HEIGHT - 650, r: 12, vx: 3, rangeMin: 50, rangeMax: 430 },
  { type: 'fire', x: 300, y: TOWER_HEIGHT - 1000, r: 12, vx: -2.5, rangeMin: 50, rangeMax: 430 },
  // Rain lightning bolts (horizontal moving sparks)
  { type: 'lightning', x: 240, y: TOWER_HEIGHT - 1650, r: 10, vx: 4, rangeMin: 50, rangeMax: 430 },
  { type: 'lightning', x: 80, y: TOWER_HEIGHT - 2150, r: 10, vx: 5, rangeMin: 50, rangeMax: 430 },
  { type: 'lightning', x: 400, y: TOWER_HEIGHT - 2650, r: 10, vx: -4.5, rangeMin: 50, rangeMax: 430 },
  // Snow icicles (vertical falling objects)
  { type: 'icicle', x: 150, y: TOWER_HEIGHT - 3250, width: 10, height: 25, vy: 4, yMin: TOWER_HEIGHT - 3450, yMax: TOWER_HEIGHT - 3100 },
  { type: 'icicle', x: 300, y: TOWER_HEIGHT - 3750, width: 10, height: 25, vy: 5, yMin: TOWER_HEIGHT - 3950, yMax: TOWER_HEIGHT - 3600 },
  { type: 'icicle', x: 220, y: TOWER_HEIGHT - 4150, width: 10, height: 25, vy: 6, yMin: TOWER_HEIGHT - 4350, yMax: TOWER_HEIGHT - 4000 }
];

// Platform layouts
const PLATFORMS = [
  // Summer Zone (Sunny Meadows & Grass Ledges)
  { x: 0, y: TOWER_HEIGHT - 10, w: CANVAS_WIDTH, h: 20, type: 'grass' },
  { x: 60, y: TOWER_HEIGHT - 90, w: 120, h: 12, type: 'grass' },
  { x: 300, y: TOWER_HEIGHT - 150, w: 120, h: 12, type: 'grass' },
  { x: 180, y: TOWER_HEIGHT - 220, w: 120, h: 12, type: 'grass' },
  { x: 40, y: TOWER_HEIGHT - 290, w: 120, h: 12, type: 'grass' },
  { x: 200, y: TOWER_HEIGHT - 350, w: 160, h: 15, type: 'grass', checkpoint: 1 }, // Checkpoint 1
  { x: 300, y: TOWER_HEIGHT - 430, w: 120, h: 12, type: 'grass' },
  { x: 80, y: TOWER_HEIGHT - 500, w: 120, h: 12, type: 'grass' },
  { x: 200, y: TOWER_HEIGHT - 580, w: 120, h: 12, type: 'grass' },
  { x: 320, y: TOWER_HEIGHT - 660, w: 120, h: 12, type: 'grass' },
  { x: 100, y: TOWER_HEIGHT - 730, w: 120, h: 12, type: 'grass' },
  { x: 60, y: TOWER_HEIGHT - 800, w: 140, h: 12, type: 'grass' },
  { x: 160, y: TOWER_HEIGHT - 850, w: 180, h: 15, type: 'grass', checkpoint: 2 }, // Checkpoint 2
  { x: 340, y: TOWER_HEIGHT - 930, w: 100, h: 12, type: 'grass' },
  { x: 80, y: TOWER_HEIGHT - 1010, w: 120, h: 12, type: 'grass' },
  { x: 220, y: TOWER_HEIGHT - 1090, w: 120, h: 12, type: 'grass' },
  { x: 340, y: TOWER_HEIGHT - 1170, w: 100, h: 12, type: 'grass' },
  { x: 120, y: TOWER_HEIGHT - 1250, w: 120, h: 12, type: 'grass' },
  { x: 40, y: TOWER_HEIGHT - 1320, w: 100, h: 12, type: 'grass' },
  { x: 180, y: TOWER_HEIGHT - 1350, w: 160, h: 15, type: 'grass', checkpoint: 3 }, // Checkpoint 3

  // Rain Zone (Cloud & Wet Stone Ledges)
  { x: 300, y: TOWER_HEIGHT - 1430, w: 120, h: 12, type: 'wet' },
  { x: 100, y: TOWER_HEIGHT - 1510, w: 120, h: 12, type: 'wet' },
  { x: 220, y: TOWER_HEIGHT - 1590, w: 120, h: 12, type: 'wet' },
  { x: 60, y: TOWER_HEIGHT - 1670, w: 120, h: 12, type: 'wet' },
  { x: 320, y: TOWER_HEIGHT - 1750, w: 120, h: 12, type: 'wet' },
  { x: 150, y: TOWER_HEIGHT - 1820, w: 120, h: 12, type: 'wet' },
  { x: 80, y: TOWER_HEIGHT - 1850, w: 160, h: 15, type: 'wet', checkpoint: 4 }, // Checkpoint 4
  { x: 260, y: TOWER_HEIGHT - 1930, w: 120, h: 12, type: 'wet' },
  { x: 80, y: TOWER_HEIGHT - 2010, w: 100, h: 12, type: 'wet' },
  { x: 200, y: TOWER_HEIGHT - 2090, w: 120, h: 12, type: 'wet' },
  { x: 340, y: TOWER_HEIGHT - 2170, w: 100, h: 12, type: 'wet' },
  { x: 120, y: TOWER_HEIGHT - 2250, w: 120, h: 12, type: 'wet' },
  { x: 260, y: TOWER_HEIGHT - 2320, w: 120, h: 12, type: 'wet' },
  { x: 160, y: TOWER_HEIGHT - 2350, w: 160, h: 15, type: 'wet', checkpoint: 5 }, // Checkpoint 5
  { x: 40, y: TOWER_HEIGHT - 2430, w: 120, h: 12, type: 'wet' },
  { x: 300, y: TOWER_HEIGHT - 2510, w: 120, h: 12, type: 'wet' },
  { x: 180, y: TOWER_HEIGHT - 2590, w: 120, h: 12, type: 'wet' },
  { x: 60, y: TOWER_HEIGHT - 2670, w: 120, h: 12, type: 'wet' },
  { x: 320, y: TOWER_HEIGHT - 2750, w: 120, h: 12, type: 'wet' },
  { x: 100, y: TOWER_HEIGHT - 2820, w: 120, h: 12, type: 'wet' },
  { x: 180, y: TOWER_HEIGHT - 2850, w: 160, h: 15, type: 'wet', checkpoint: 6 }, // Checkpoint 6

  // Snow Zone (Slippery Ice & Frozen Ledges)
  { x: 340, y: TOWER_HEIGHT - 2930, w: 100, h: 12, type: 'ice' },
  { x: 80, y: TOWER_HEIGHT - 3010, w: 120, h: 12, type: 'ice' },
  { x: 200, y: TOWER_HEIGHT - 3090, w: 120, h: 12, type: 'ice' },
  { x: 320, y: TOWER_HEIGHT - 3170, w: 120, h: 12, type: 'ice' },
  { x: 140, y: TOWER_HEIGHT - 3250, w: 120, h: 12, type: 'ice' },
  { x: 40, y: TOWER_HEIGHT - 3320, w: 120, h: 12, type: 'ice' },
  { x: 150, y: TOWER_HEIGHT - 3350, w: 160, h: 15, type: 'ice', checkpoint: 7 }, // Checkpoint 7
  { x: 320, y: TOWER_HEIGHT - 3430, w: 100, h: 12, type: 'ice' },
  { x: 100, y: TOWER_HEIGHT - 3510, w: 120, h: 12, type: 'ice' },
  { x: 240, y: TOWER_HEIGHT - 3590, w: 120, h: 12, type: 'ice' },
  { x: 80, y: TOWER_HEIGHT - 3670, w: 120, h: 12, type: 'ice' },
  { x: 300, y: TOWER_HEIGHT - 3750, w: 120, h: 12, type: 'ice' },
  { x: 160, y: TOWER_HEIGHT - 3820, w: 120, h: 12, type: 'ice' },
  { x: 180, y: TOWER_HEIGHT - 3850, w: 160, h: 15, type: 'ice', checkpoint: 8 }, // Checkpoint 8
  { x: 40, y: TOWER_HEIGHT - 3930, w: 120, h: 12, type: 'ice' },
  { x: 300, y: TOWER_HEIGHT - 4010, w: 120, h: 12, type: 'ice' },
  { x: 180, y: TOWER_HEIGHT - 4090, w: 120, h: 12, type: 'ice' },
  { x: 80, y: TOWER_HEIGHT - 4170, w: 120, h: 12, type: 'ice' },
  { x: 280, y: TOWER_HEIGHT - 4250, w: 120, h: 12, type: 'ice' },
  { x: 160, y: TOWER_HEIGHT - 4300, w: 160, h: 15, type: 'ice', checkpoint: 9 }, // Checkpoint 9

  // Finish Ledge
  { x: 140, y: TOWER_HEIGHT - 4450, w: 200, h: 20, type: 'finish' }
];

export default function RobloxTower() {
  // Lobby State
  const [inLobby, setInLobby] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('skater');
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [netError, setNetError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // PeerJS / Multiplayer Refs
  const peerRef = useRef(null);
  const connectionsRef = useRef([]);
  const guestsStateRef = useRef({}); // { peerId: { x, y, name, charType, height, checkpoint } }
  const myIdRef = useRef(null);
  const connToHostRef = useRef(null);

  // Game Engine State/Refs
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const localPlayerRef = useRef({
    x: 240,
    y: TOWER_HEIGHT - 50,
    vx: 0,
    vy: 0,
    width: 20,
    height: 30,
    grounded: false,
    checkpointId: 0,
    checkpointX: 240,
    checkpointY: TOWER_HEIGHT - 50,
    isIceZone: false,
    walkTimer: 0
  });

  // Keep track of keys pressed
  const keysPressed = useRef({
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    KeyA: false,
    KeyD: false,
    KeyW: false,
    Space: false
  });

  // Weather particles
  const particlesRef = useRef([]);

  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState([]);
  const [victoryState, setVictoryState] = useState(false);

  // Toast status notification
  const [toast, setToast] = useState({ show: false, message: '' });
  const showToast = useCallback((msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2000);
  }, []);

  // Setup PeerJS connection logic
  const cleanupNetworking = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    connectionsRef.current.forEach((conn) => conn.close());
    connectionsRef.current = [];
    connToHostRef.current = null;
    guestsStateRef.current = {};
    setIsConnecting(false);
  }, []);

  const handleCreateRoom = useCallback(() => {
    if (!playerName.trim()) {
      setNetError('Please enter your name first');
      return;
    }
    setNetError('');
    setIsConnecting(true);
    cleanupNetworking();

    // Generate room code
    const randCode = Math.floor(1000 + Math.random() * 9000).toString();
    const peerId = `naylin-tower-${randCode}`;

    const peer = new Peer(peerId);
    peerRef.current = peer;
    myIdRef.current = peerId;

    peer.on('open', () => {
      setRoomCode(randCode);
      setIsHost(true);
      setIsConnecting(false);
      setInLobby(false);
    });

    peer.on('error', (err) => {
      console.error(err);
      setIsConnecting(false);
      if (err.type === 'unavailable-id') {
        setNetError('Room code already exists. Please try again.');
      } else {
        setNetError('Failed to connect to matchmaking server.');
      }
      cleanupNetworking();
    });

    peer.on('connection', (conn) => {
      connectionsRef.current.push(conn);

      conn.on('data', (data) => {
        if (data.type === 'stateUpdate') {
          guestsStateRef.current[conn.peer] = {
            x: data.x,
            y: data.y,
            name: data.name,
            charType: data.charType,
            height: data.height,
            checkpoint: data.checkpoint
          };
        }
      });

      conn.on('close', () => {
        delete guestsStateRef.current[conn.peer];
        connectionsRef.current = connectionsRef.current.filter((c) => c !== conn);
      });
    });
  }, [playerName, cleanupNetworking]);

  const handleJoinRoom = useCallback(() => {
    if (!playerName.trim()) {
      setNetError('Please enter your name first');
      return;
    }
    if (!inputCode.trim()) {
      setNetError('Please enter a room code');
      return;
    }
    setNetError('');
    setIsConnecting(true);
    cleanupNetworking();

    const targetHostId = `naylin-tower-${inputCode}`;
    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', () => {
      myIdRef.current = peer.id;
      const conn = peer.connect(targetHostId);
      connToHostRef.current = conn;

      conn.on('open', () => {
        setRoomCode(inputCode);
        setIsHost(false);
        setIsConnecting(false);
        setInLobby(false);
      });

      conn.on('data', (data) => {
        if (data.type === 'lobbySync') {
          guestsStateRef.current = data.players;
        }
      });

      conn.on('close', () => {
        setNetError('Disconnected from host.');
        setInLobby(true);
        cleanupNetworking();
      });
    });

    peer.on('error', (err) => {
      console.error(err);
      setIsConnecting(false);
      setNetError('Room not found or host unavailable.');
      cleanupNetworking();
    });
  }, [playerName, inputCode, cleanupNetworking]);

  // Clean exit
  const handleExitGame = useCallback(() => {
    setVictoryState(false);
    setInLobby(true);
    setRoomCode('');
    cleanupNetworking();
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  }, [cleanupNetworking]);

  // Setup Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyD', 'KeyW', 'Space'].includes(e.code)) {
        keysPressed.current[e.code] = true;
      }
    };
    const handleKeyUp = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyD', 'KeyW', 'Space'].includes(e.code)) {
        keysPressed.current[e.code] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Cleanup networking on unmount
  useEffect(() => {
    return () => {
      cleanupNetworking();
    };
  }, [cleanupNetworking]);

  // Main game loop logic
  useEffect(() => {
    if (inLobby) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Create weather particles
    const initParticles = () => {
      const arr = [];
      // Rain streaks
      for (let i = 0; i < 40; i++) {
        arr.push({
          type: 'rain',
          x: Math.random() * CANVAS_WIDTH,
          y: Math.random() * CANVAS_HEIGHT,
          vy: 6 + Math.random() * 4,
          length: 12 + Math.random() * 8
        });
      }
      // Snow flakes
      for (let i = 0; i < 30; i++) {
        arr.push({
          type: 'snow',
          x: Math.random() * CANVAS_WIDTH,
          y: Math.random() * CANVAS_HEIGHT,
          vy: 1.2 + Math.random() * 1.5,
          vx: -0.5 + Math.random() * 1,
          size: 2 + Math.random() * 3
        });
      }
      particlesRef.current = arr;
    };
    initParticles();

    // Helper to draw Lego figure
    const drawLegoFigure = (c, x, y, name, styleId, isLocal) => {
      const style = LEGO_STYLES.find((s) => s.id === styleId) || LEGO_STYLES[0];
      const pState = localPlayerRef.current;
      const walkCycle = isLocal ? pState.walkTimer : Date.now() * 0.015;

      c.save();

      // Render name tag above head
      c.font = 'bold 12px sans-serif';
      c.textAlign = 'center';
      c.fillStyle = isLocal ? '#FFCC00' : '#FFFFFF';
      c.shadowColor = 'rgba(0,0,0,0.8)';
      c.shadowBlur = 4;
      c.fillText(name, x, y - 24);
      c.shadowBlur = 0;

      // 1. Lego Head (Yellow Circle)
      c.fillStyle = '#FFCC00';
      c.beginPath();
      c.arc(x, y - 10, 6, 0, Math.PI * 2);
      c.fill();

      // Eyes & Smile
      c.fillStyle = '#000000';
      c.fillRect(x - 3, y - 12, 1.5, 2);
      c.fillRect(x + 1.5, y - 12, 1.5, 2);
      c.beginPath();
      c.arc(x, y - 9, 2.5, 0, Math.PI);
      c.stroke();

      // 2. Hats & Accessories
      if (style.accessory === 'cap') {
        c.fillStyle = '#FF3333';
        c.beginPath();
        c.arc(x, y - 14, 5.5, Math.PI, 0);
        c.fill();
        c.fillRect(x - 8, y - 14, 16, 2.5); // Cap brim
      } else if (style.accessory === 'helmet') {
        c.strokeStyle = '#FFFFFF';
        c.lineWidth = 1.5;
        c.beginPath();
        c.arc(x, y - 10, 9, 0, Math.PI * 2);
        c.stroke();
        c.fillStyle = 'rgba(0, 200, 255, 0.4)';
        c.beginPath();
        c.arc(x, y - 10, 9, -Math.PI/3, Math.PI/3);
        c.stroke();
      } else if (style.accessory === 'fedora') {
        c.fillStyle = '#8B5A2B';
        c.fillRect(x - 9, y - 14, 18, 2); // Brim
        c.beginPath();
        c.moveTo(x - 6, y - 14);
        c.lineTo(x - 4, y - 22);
        c.lineTo(x + 4, y - 22);
        c.lineTo(x + 6, y - 14);
        c.closePath();
        c.fill();
      } else if (style.accessory === 'chefhat') {
        c.fillStyle = '#F0F0F0';
        c.beginPath();
        c.arc(x - 3, y - 17, 4.5, 0, Math.PI * 2);
        c.arc(x + 3, y - 17, 4.5, 0, Math.PI * 2);
        c.arc(x, y - 20, 5, 0, Math.PI * 2);
        c.fill();
        c.fillRect(x - 5, y - 15, 10, 4);
      }

      // 3. Torso / Shirt (Rectangular Block)
      c.fillStyle = style.shirtColor;
      c.fillRect(x - 7, y - 4, 14, 16);

      // 4. Arms & Hands (Swinging)
      const armSwing = Math.sin(walkCycle) * 8;
      c.strokeStyle = style.shirtColor;
      c.lineWidth = 3.5;
      c.lineCap = 'round';
      // Left Arm
      c.beginPath();
      c.moveTo(x - 7, y - 3);
      c.lineTo(x - 11, y + 4 + armSwing);
      c.stroke();
      // Right Arm
      c.beginPath();
      c.moveTo(x + 7, y - 3);
      c.lineTo(x + 11, y + 4 - armSwing);
      c.stroke();

      // Yellow hands
      c.fillStyle = '#FFCC00';
      c.beginPath();
      c.arc(x - 11, y + 5 + armSwing, 2, 0, Math.PI*2);
      c.arc(x + 11, y + 5 - armSwing, 2, 0, Math.PI*2);
      c.fill();

      // 5. Pants & Legs (Swinging)
      const legSwing = Math.sin(walkCycle) * 6;
      c.fillStyle = style.pantsColor;
      // Left leg
      c.fillRect(x - 6, y + 12, 5, 8 + legSwing);
      // Right leg
      c.fillRect(x + 1, y + 12, 5, 8 - legSwing);

      c.restore();
    };

    const updatePhysics = () => {
      const p = localPlayerRef.current;

      // Determine climate zone based on height
      const localHeight = TOWER_HEIGHT - p.y;
      p.isIceZone = localHeight > 3000;

      // Physics variables based on zone
      const acc = p.isIceZone ? 0.25 : 0.65;
      const fric = p.isIceZone ? 0.985 : 0.82;
      const jumpStr = 10.5;

      // Horizontal controls
      if (keysPressed.current.ArrowLeft || keysPressed.current.KeyA) {
        p.vx -= acc;
        p.walkTimer += 0.2;
      } else if (keysPressed.current.ArrowRight || keysPressed.current.KeyD) {
        p.vx += acc;
        p.walkTimer += 0.2;
      } else {
        p.vx *= fric;
      }

      // Jump control
      if ((keysPressed.current.ArrowUp || keysPressed.current.KeyW || keysPressed.current.Space) && p.grounded) {
        p.vy = -jumpStr;
        p.grounded = false;
      }

      // Apply Gravity
      p.vy += 0.35; // gravity force

      // Speed limits
      p.vx = Math.max(-6, Math.min(6, p.vx));
      p.vy = Math.max(-15, Math.min(15, p.vy));

      // Move player coordinates
      p.x += p.vx;
      p.y += p.vy;

      // Screen boundaries
      if (p.x < 12) {
        p.x = 12;
        p.vx = 0;
      }
      if (p.x > CANVAS_WIDTH - 12) {
        p.x = CANVAS_WIDTH - 12;
        p.vx = 0;
      }

      // Checkpoint bounds/fall check
      if (p.y > TOWER_HEIGHT) {
        // Respawn at last checkpoint
        p.x = p.checkpointX;
        p.y = p.checkpointY;
        p.vx = 0;
        p.vy = 0;
      }

      // Platform collisions
      p.grounded = false;
      PLATFORMS.forEach((platform) => {
        // AABB Collision check
        const overlapX = p.x + 8 > platform.x && p.x - 8 < platform.x + platform.w;
        const overlapY = p.y + 20 >= platform.y && p.y - 4 <= platform.y + platform.h;

        if (overlapX && overlapY) {
          // Verify landing (falling down)
          if (p.vy > 0 && p.y + 12 < platform.y + 8) {
            p.y = platform.y - 20;
            p.vy = 0;
            p.grounded = true;

            // Check if it's a checkpoint flag pad
            if (platform.checkpoint && platform.checkpoint > p.checkpointId) {
              p.checkpointId = platform.checkpoint;
              p.checkpointX = platform.x + platform.w / 2;
              p.checkpointY = platform.y - 20;
              showToast(`Checkpoint: ${CHECKPOINTS.find(c => c.id === platform.checkpoint).label}! 🚩`);
            }

            // Finish check
            if (platform.type === 'finish' && !victoryState) {
              setVictoryState(true);
              showToast('VICTORY! You climbed the Tower of Seasons! 🏆');
            }
          }
        }
      });

      // Trampoline collisions
      TRAMPOLINES.forEach((t) => {
        const dist = Math.sqrt((p.x - t.x) ** 2 + (p.y + 10 - t.y) ** 2);
        if (dist < 18) {
          p.vy = -16.5; // Super bounce!
          p.grounded = false;
          showToast('BOOST! 🚀');
        }
      });

      // Obstacle hazard collisions
      OBSTACLES.forEach((obs) => {
        const hit = obs.type === 'icicle'
          ? (p.x + 8 > obs.x && p.x - 8 < obs.x + obs.width && p.y + 20 > obs.y && p.y - 4 < obs.y + obs.height)
          : (Math.sqrt((p.x - obs.x) ** 2 + (p.y + 10 - obs.y) ** 2) < obs.r + 10);

        if (hit) {
          // Ouch! Respawn at last checkpoint
          p.x = p.checkpointX;
          p.y = p.checkpointY;
          p.vx = 0;
          p.vy = 0;
          showToast('Ouch! 💥');
        }
      });
    };

    const updateObstacles = () => {
      OBSTACLES.forEach((obs) => {
        if (obs.type === 'icicle') {
          obs.y += obs.vy;
          if (obs.y > obs.yMax) {
            obs.y = obs.yMin; // reset to top
          }
        } else {
          obs.x += obs.vx;
          if (obs.x < obs.rangeMin || obs.x > obs.rangeMax) {
            obs.vx = -obs.vx; // bounce movement
          }
        }
      });
    };

    const drawGame = () => {
      const p = localPlayerRef.current;
      const camY = Math.max(0, Math.min(TOWER_HEIGHT - CANVAS_HEIGHT, p.y - CANVAS_HEIGHT / 2));

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 1. Draw Season Climatic backgrounds
      const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      const skyHeight = TOWER_HEIGHT - p.y;

      if (skyHeight < 1500) {
        // Summer
        skyGrad.addColorStop(0, '#ff70a6'); // warm pink
        skyGrad.addColorStop(1, '#ff9f1c'); // sunset orange
      } else if (skyHeight < 3000) {
        // Rain
        skyGrad.addColorStop(0, '#2b3a4a'); // dark stormy blue
        skyGrad.addColorStop(1, '#1a2230'); // indigo cloud
      } else {
        // Snow
        skyGrad.addColorStop(0, '#0a0d1a'); // dark starry winter night
        skyGrad.addColorStop(1, '#1b1c3a'); // cold indigo
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Grid constellation faint details
      ctx.strokeStyle = 'rgba(255,255,255,0.025)';
      ctx.lineWidth = 1;
      for (let x = 40; x < CANVAS_WIDTH; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }

      // 2. Draw Weather Particles
      ctx.save();
      const currentZone = skyHeight < 1500 ? 'summer' : (skyHeight < 3000 ? 'rain' : 'snow');

      particlesRef.current.forEach((part) => {
        if (part.type === 'rain' && currentZone === 'rain') {
          // Draw Rain
          ctx.strokeStyle = 'rgba(150, 180, 255, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(part.x, part.y);
          ctx.lineTo(part.x - 2, part.y + part.length);
          ctx.stroke();

          part.y += part.vy;
          part.x -= 0.5;
          if (part.y > CANVAS_HEIGHT) {
            part.y = -part.length;
            part.x = Math.random() * CANVAS_WIDTH;
          }
        } else if (part.type === 'snow' && currentZone === 'snow') {
          // Draw Snow
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
          ctx.fill();

          part.y += part.vy;
          part.x += part.vx;
          if (part.y > CANVAS_HEIGHT) {
            part.y = -part.size;
            part.x = Math.random() * CANVAS_WIDTH;
          }
        }
      });
      ctx.restore();

      // 3. Draw Platforms & Checkpoint Flags
      PLATFORMS.forEach((platform) => {
        const platScreenY = platform.y - camY;
        if (platScreenY < -50 || platScreenY > CANVAS_HEIGHT + 50) return;

        // Platform base coloring
        if (platform.type === 'grass') {
          ctx.fillStyle = '#4CAF50';
          ctx.fillRect(platform.x, platScreenY, platform.w, 4); // Green grass cap
          ctx.fillStyle = '#8B5A2B';
          ctx.fillRect(platform.x, platScreenY + 4, platform.w, platform.h - 4); // Soil base
        } else if (platform.type === 'wet') {
          ctx.fillStyle = '#455A64';
          ctx.fillRect(platform.x, platScreenY, platform.w, platform.h); // Slippery wet stone
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fillRect(platform.x, platScreenY, platform.w, 2); // Water gleam
        } else if (platform.type === 'ice') {
          ctx.fillStyle = '#B3E5FC';
          ctx.fillRect(platform.x, platScreenY, platform.w, platform.h); // Slippery ice block
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(platform.x, platScreenY, platform.w, 3); // Snowy cap
        } else if (platform.type === 'finish') {
          // Glowing gold platform
          const pulse = Math.sin(Date.now() * 0.005) * 5;
          ctx.fillStyle = '#FFD700';
          ctx.fillRect(platform.x, platScreenY, platform.w, platform.h);
          ctx.shadowColor = '#FFD700';
          ctx.shadowBlur = 15 + pulse;
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.strokeRect(platform.x, platScreenY, platform.w, platform.h);
          ctx.shadowBlur = 0;
        }

        // Draw checkpoint flag pad if exists
        if (platform.checkpoint) {
          const fx = platform.x + 10;
          const fy = platScreenY;
          const active = p.checkpointId >= platform.checkpoint;

          // Draw flagpole
          ctx.strokeStyle = '#CCCCCC';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.lineTo(fx, fy - 20);
          ctx.stroke();

          // Draw flag banner
          ctx.fillStyle = active ? '#2ECC71' : '#E74C3C'; // green if active, else red
          ctx.beginPath();
          ctx.moveTo(fx, fy - 20);
          ctx.lineTo(fx + 14, fy - 15);
          ctx.lineTo(fx, fy - 10);
          ctx.closePath();
          ctx.fill();
        }
      });

      // 4. Draw Trampolines
      TRAMPOLINES.forEach((t) => {
        const tScreenY = t.y - camY;
        if (tScreenY < -50 || tScreenY > CANVAS_HEIGHT + 50) return;

        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(t.x - 12, tScreenY, 24, 6); // base
        ctx.fillStyle = '#3498DB';
        ctx.fillRect(t.x - 10, tScreenY - 3, 20, 3); // spring pad
      });

      // 5. Draw Spikes & Obstacles
      OBSTACLES.forEach((obs) => {
        const obsScreenY = obs.y - camY;
        if (obsScreenY < -50 || obsScreenY > CANVAS_HEIGHT + 50) return;

        ctx.save();
        if (obs.type === 'fire') {
          // Draw pulsing fire orb
          const pulse = Math.sin(Date.now() * 0.01) * 3;
          ctx.shadowColor = '#FF3300';
          ctx.shadowBlur = 10 + pulse;
          ctx.fillStyle = '#FF5722';
          ctx.beginPath();
          ctx.arc(obs.x, obsScreenY, obs.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFEB3B';
          ctx.beginPath();
          ctx.arc(obs.x, obsScreenY, obs.r * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (obs.type === 'lightning') {
          // Draw lightning spark orb
          ctx.shadowColor = '#00E5FF';
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#00E5FF';
          ctx.beginPath();
          ctx.arc(obs.x, obsScreenY, obs.r, 0, Math.PI * 2);
          ctx.fill();
          // Draw spark lines
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(obs.x - 5, obsScreenY);
          ctx.lineTo(obs.x + 5, obsScreenY);
          ctx.moveTo(obs.x, obsScreenY - 5);
          ctx.lineTo(obs.x, obsScreenY + 5);
          ctx.stroke();
        } else if (obs.type === 'icicle') {
          // Draw falling blue icicle triangle
          ctx.fillStyle = '#90CAF9';
          ctx.beginPath();
          ctx.moveTo(obs.x, obsScreenY);
          ctx.lineTo(obs.x + obs.width, obsScreenY);
          ctx.lineTo(obs.x + obs.width / 2, obsScreenY + obs.height);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      });

      // 6. Draw other connected players
      Object.keys(guestsStateRef.current).forEach((id) => {
        if (id === myIdRef.current) return; // skip local player
        const guest = guestsStateRef.current[id];
        const gScreenY = guest.y - camY;
        if (gScreenY < -50 || gScreenY > CANVAS_HEIGHT + 50) return;
        drawLegoFigure(ctx, guest.x, gScreenY, guest.name, guest.charType, false);
      });

      // 7. Draw local player
      const localScreenY = p.y - camY;
      drawLegoFigure(ctx, p.x, localScreenY, playerName, selectedStyle, true);
    };

    // Client/Host networking synchronizer
    const syncNetwork = () => {
      const p = localPlayerRef.current;
      const myHeight = Math.max(0, Math.floor(TOWER_HEIGHT - p.y));

      // Build data state payload
      const myState = {
        type: 'stateUpdate',
        x: p.x,
        y: p.y,
        name: playerName,
        charType: selectedStyle,
        height: myHeight,
        checkpoint: p.checkpointId
      };

      if (isHost) {
        // Host: broadcast sync to all clients
        connectionsRef.current.forEach((conn) => {
          if (conn.open) {
            conn.send({
              type: 'lobbySync',
              players: {
                ...guestsStateRef.current,
                [myIdRef.current]: myState
              }
            });
          }
        });

        // Set local leaderboard
        updateLeaderboardList({
          ...guestsStateRef.current,
          [myIdRef.current]: myState
        });
      } else if (connToHostRef.current && connToHostRef.current.open) {
        // Client: send my state to host
        connToHostRef.current.send(myState);

        // Set local leaderboard from host synced list
        updateLeaderboardList(guestsStateRef.current);
      } else {
        // Solo: set leaderboard
        updateLeaderboardList({
          'local-solo': myState
        });
      }
    };

    const updateLeaderboardList = (playersMap) => {
      const list = Object.keys(playersMap).map((id) => ({
        id,
        name: playersMap[id].name,
        charType: playersMap[id].charType,
        height: playersMap[id].height,
        checkpoint: playersMap[id].checkpoint
      }));

      // Sort by height descending
      list.sort((a, b) => b.height - a.height);
      setLeaderboard(list);
    };

    // Game loop tick
    let netTimer = 0;
    const tick = () => {
      updatePhysics();
      updateObstacles();
      drawGame();

      // Network updates sync at ~30Hz (every 2 frames)
      netTimer++;
      if (netTimer >= 2) {
        syncNetwork();
        netTimer = 0;
      }

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [inLobby, playerName, selectedStyle, isHost, victoryState, showToast]);

  // Keyboard simulator for mobile button clicks
  const handleMobileButtonDown = (key) => {
    keysPressed.current[key] = true;
  };

  const handleMobileButtonUp = (key) => {
    keysPressed.current[key] = false;
  };

  return (
    <div className="roblox-tower">
      {inLobby ? (
        /* ── LOBBY CARD INTERFACE ── */
        <div className="tower-lobby glass">
          <div className="lobby-header">
            <span className="lobby-icon">🗼</span>
            <h2>Tower of Seasons</h2>
            <p className="lobby-subtitle font-accent">climb through spring, rain, and snow together</p>
          </div>

          <div className="lobby-body">
            {/* Player Name Input */}
            <div className="input-group">
              <label>Choose Your Name</label>
              <input
                type="text"
                maxLength={12}
                placeholder="Enter nickname..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>

            {/* Character Selector (Lego style) */}
            <div className="character-picker-group">
              <label>Select Lego Character</label>
              <div className="character-picker-grid">
                {LEGO_STYLES.map((style) => (
                  <button
                    key={style.id}
                    className={`char-select-btn glass ${selectedStyle === style.id ? 'active' : ''}`}
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <span className="char-emoji">{style.emoji}</span>
                    <span className="char-name">{style.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="room-actions-split">
              {/* Host/Create Room Column */}
              <div className="action-box">
                <h4>Host a New Room</h4>
                <p>Create a Lobby code and invite your partner/friend.</p>
                <button
                  className="btn-rose lobby-btn"
                  onClick={handleCreateRoom}
                  disabled={isConnecting}
                >
                  {isConnecting ? <RefreshCw className="spinning" size={16} /> : <Users size={16} />}
                  Host Room
                </button>
              </div>

              {/* Join Room Column */}
              <div className="action-box">
                <h4>Join Existing Room</h4>
                <input
                  type="number"
                  pattern="\d*"
                  placeholder="Enter 4-digit code..."
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                />
                <button
                  className="btn-rose lobby-btn"
                  onClick={handleJoinRoom}
                  disabled={isConnecting}
                >
                  {isConnecting ? <RefreshCw className="spinning" size={16} /> : <Play size={16} />}
                  Join Game
                </button>
              </div>
            </div>

            {/* Error notifications */}
            {netError && <div className="lobby-error-msg">{netError}</div>}
          </div>
        </div>
      ) : (
        /* ── ACTIVE MULTIPLAYER GAME INTERFACE ── */
        <div className="tower-game-screen">
          <div className="game-top-bar">
            <button className="btn-exit" onClick={handleExitGame}>
              <ArrowLeft size={16} /> Leave Room
            </button>
            <div className="room-indicator glass">
              Room Code: <strong>{roomCode}</strong>
            </div>
          </div>

          <div className="game-layout-split">
            {/* 2D HTML5 Canvas Platformer */}
            <div className="canvas-wrapper">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="game-canvas"
              />

              {/* Mobile Controller Overlay */}
              <div className="mobile-controller">
                <div className="dir-controls">
                  <button
                    className="ctrl-btn btn-left"
                    onMouseDown={() => handleMobileButtonDown('ArrowLeft')}
                    onMouseUp={() => handleMobileButtonUp('ArrowLeft')}
                    onTouchStart={() => handleMobileButtonDown('ArrowLeft')}
                    onTouchEnd={() => handleMobileButtonUp('ArrowLeft')}
                  >
                    <LeftIcon size={24} />
                  </button>
                  <button
                    className="ctrl-btn btn-right"
                    onMouseDown={() => handleMobileButtonDown('ArrowRight')}
                    onMouseUp={() => handleMobileButtonUp('ArrowRight')}
                    onTouchStart={() => handleMobileButtonDown('ArrowRight')}
                    onTouchEnd={() => handleMobileButtonUp('ArrowRight')}
                  >
                    <ArrowRight size={24} />
                  </button>
                </div>
                <button
                  className="ctrl-btn btn-jump"
                  onMouseDown={() => handleMobileButtonDown('ArrowUp')}
                  onMouseUp={() => handleMobileButtonUp('ArrowUp')}
                  onTouchStart={() => handleMobileButtonDown('ArrowUp')}
                  onTouchEnd={() => handleMobileButtonUp('ArrowUp')}
                >
                  <ArrowUp size={28} />
                </button>
              </div>
            </div>

            {/* Leaderboard Panel */}
            <div className="leaderboard-panel glass">
              <div className="leaderboard-header">
                <Trophy size={18} style={{ color: '#FFD700' }} />
                <h3>Leaderboard</h3>
              </div>
              <div className="leaderboard-list">
                {leaderboard.map((player, idx) => {
                  const style = LEGO_STYLES.find((s) => s.id === player.charType);
                  return (
                    <div key={player.id} className="leaderboard-item">
                      <div className="player-rank">
                        {idx === 0 ? <Crown size={16} style={{ color: '#FFD700' }} /> : <span>{idx + 1}</span>}
                      </div>
                      <span className="player-avatar-emoji">{style?.emoji}</span>
                      <div className="player-meta">
                        <span className="player-name-lbl">{player.name}</span>
                        <span className="player-check-lbl">
                          {player.checkpoint > 0 ? `CP ${player.checkpoint}: ${CHECKPOINTS[player.checkpoint - 1].label}` : 'Start'}
                        </span>
                      </div>
                      <span className="player-height-val">{player.height}m</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Victory Overlay */}
      {victoryState && (
        <div className="victory-overlay">
          <div className="victory-card glass">
            <span className="victory-crown">👑</span>
            <h2>CONGRATULATIONS!</h2>
            <p>You conquered all 3 Seasons of the Tower!</p>
            <button className="btn-rose" onClick={handleExitGame}>
              Back to Lobby
            </button>
          </div>
        </div>
      )}

      {/* Toast popup */}
      <div className={`share-toast${toast.show ? ' show' : ''}`}>
        {toast.message}
      </div>
    </div>
  );
}

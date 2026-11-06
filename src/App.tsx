import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dices,
  ShoppingBag,
  Shield,
  Coins,
  Trophy,
  Plus,
  Trash2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { Board3D, type CameraMode } from './components/Board3D';
import {
  INITIAL_TILES,
  PLAYER_COLORS,
  TOTAL_TILES,
  MIN_ROUNDS,
  DEFAULT_ROUNDS,
  MAX_ROUNDS_LIMIT,
  drawPartyCard,
  getStageForRound,
  getStageName,
} from './data/gameData';
import type { Player, Tile } from './types';

type ActiveModal =
  | { type: 'buy_property'; tile: Tile }
  | { type: 'pay_rent'; tile: Tile; owner: Player }
  | { type: 'card'; tileType: 'drink' | 'truth_dare'; text: string }
  | { type: 'all_drink' }
  | { type: 'shop' }
  | { type: 'game_over' }
  | null;

export function App() {
  // Setup state
  const [gameStarted, setGameStarted] = useState(false);
  const [nonAlcoholic, setNonAlcoholic] = useState(false);
  const [selectedRounds, setSelectedRounds] = useState(DEFAULT_ROUNDS);
  const [maxRounds, setMaxRounds] = useState(DEFAULT_ROUNDS);
  const [setupPlayers, setSetupPlayers] = useState([
    { name: 'Rasmus', color: PLAYER_COLORS[0].hex },
    { name: 'Laura', color: PLAYER_COLORS[1].hex },
    { name: 'Karl', color: PLAYER_COLORS[2].hex },
  ]);

  // Game state
  const [players, setPlayers] = useState<Player[]>([]);
  const [tiles, setTiles] = useState<Tile[]>(INITIAL_TILES);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [round, setRound] = useState(1);
  const [usedCardIds, setUsedCardIds] = useState<number[]>([]);

  // Dice, movement, camera & card draw animation state
  const [diceValue, setDiceValue] = useState(6);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [drawingDeck, setDrawingDeck] = useState<'drink' | 'truth_dare' | null>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>('overview');
  const [focusedTileId, setFocusedTileId] = useState<number | null>(null);

  // Overlays
  const [toast, setToast] = useState<string | null>(null);
  const [modal, setModal] = useState<ActiveModal>(null);
  const [shopAction, setShopAction] = useState<'drink' | 'swap' | null>(null);

  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (msg: string, duration = 3400) => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToast(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const drinkWord = nonAlcoholic ? 'sõõm' : 'lonks';
  const drinkWordPart = nonAlcoholic ? 'sõõmu' : 'lonksu';
  const chugVerb = nonAlcoholic ? 'Joo sõõm!' : 'Võta lonks!';

  // Start Game from Setup
  const handleStartGame = () => {
    const validPlayers: Player[] = setupPlayers.map((p, idx) => ({
      id: idx + 1,
      name: p.name.trim() || `Mängija ${idx + 1}`,
      color: p.color,
      pos: 0,
      coins: 5,
      shield: false,
    }));
    setPlayers(validPlayers);
    setTiles(INITIAL_TILES.map((t) => ({ ...t, owner: null })));
    setCurrentIdx(0);
    setRound(1);
    setMaxRounds(selectedRounds);
    setUsedCardIds([]);
    setModal(null);
    setDrawingDeck(null);
    setCameraMode('overview');
    setFocusedTileId(null);
    setGameStarted(true);
    showToast('Pidu algab! Veereta täringut!');
  };

  const handleResetGame = () => {
    setModal(null);
    setDrawingDeck(null);
    setCameraMode('overview');
    setFocusedTileId(null);
    setUsedCardIds([]);
    setGameStarted(false);
  };

  // Advance to next player's turn or finish after selected maxRounds
  const endTurn = () => {
    setModal(null);
    setDrawingDeck(null);
    setShopAction(null);
    setCameraMode('overview');
    setFocusedTileId(null);

    if (currentIdx + 1 < players.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      if (round >= maxRounds) {
        setModal({ type: 'game_over' });
      } else {
        const nextRound = round + 1;
        setRound(nextRound);
        setCurrentIdx(0);
        const stageName = getStageName(getStageForRound(nextRound, maxRounds));
        showToast(`Algab ${nextRound}. ring (${stageName})!`);
      }
    }
  };

  // Trigger landing logic on a tile (called after the 0.8s landing focus & pulse)
  const resolveTileLanding = (
    landedPos: number,
    updatedPlayers: Player[],
    currentTiles: Tile[],
    activeIdx: number
  ) => {
    const tile = currentTiles[landedPos];
    const activePlayer = updatedPlayers[activeIdx];

    if (tile.type === 'start') {
      showToast(`${activePlayer.name} maandus START ruudul (+2 💰)!`);
      window.setTimeout(() => endTurn(), 1200);
      return;
    }

    if (tile.type === 'property') {
      if (tile.owner === null) {
        setModal({ type: 'buy_property', tile });
      } else if (tile.owner === activePlayer.id) {
        showToast(`${activePlayer.name} puhkab oma kinnisvaral: ${tile.name}`);
        window.setTimeout(() => endTurn(), 1200);
      } else {
        const owner = updatedPlayers.find((p) => p.id === tile.owner)!;
        setModal({ type: 'pay_rent', tile, owner });
      }
      return;
    }

    if (tile.type === 'drink' || tile.type === 'truth_dare') {
      const cardResult = drawPartyCard(
        tile.type,
        round,
        activePlayer.name,
        updatedPlayers.map((p) => p.name),
        nonAlcoholic,
        usedCardIds,
        maxRounds
      );
      setUsedCardIds(cardResult.newUsedIds);
      // Smoothly pull camera back toward overview so the 3D deck card flight is framed clearly
      setCameraMode('overview');
      setDrawingDeck(tile.type);
      window.setTimeout(() => {
        setModal({ type: 'card', tileType: tile.type as 'drink' | 'truth_dare', text: cardResult.text });
      }, 750);
      return;
    }

    if (tile.type === 'all_drink') {
      setModal({ type: 'all_drink' });
    }
  };

  // Roll Dice & Move Cone Step-by-Step with Camera Follow & Landing Zoom
  const handleRollDice = () => {
    if (isRolling || isMoving || drawingDeck !== null || modal !== null) return;

    // 1. Keep camera in overview while dice rolls
    setCameraMode('overview');
    setFocusedTileId(null);
    setIsRolling(true);
    const rolled = Math.floor(Math.random() * 6) + 1;

    window.setTimeout(() => {
      setDiceValue(rolled);
      setIsRolling(false);
      setIsMoving(true);

      // 2. Smoothly zoom camera in to follow active player's cone
      setCameraMode('follow');

      let workingPlayers = [...players];
      const activePlayer = { ...workingPlayers[currentIdx] };

      // Rule: Rolling 1 or 6 triggers instant alert + 1 coin for taking a sip
      if (rolled === 1 || rolled === 6) {
        activePlayer.coins += 1;
        workingPlayers[currentIdx] = activePlayer;
        setPlayers([...workingPlayers]);
        showToast(
          `Veeretasid 1 või 6! Võta ${drinkWord}! (+1 💰)`,
          4000
        );
      }

      // Brief lead-in (~450ms) as camera arrives at the pawn before stepping
      window.setTimeout(() => {
        let stepsMoved = 0;
        const stepInterval = window.setInterval(() => {
          stepsMoved += 1;
          const nextPos = (activePlayer.pos + 1) % TOTAL_TILES;
          activePlayer.pos = nextPos;

          // Passing or landing on START grants +2 coins
          if (nextPos === 0) {
            activePlayer.coins += 2;
            showToast(`${activePlayer.name} läbis START ruudu (+2 💰)!`);
          }

          workingPlayers = workingPlayers.map((p, idx) =>
            idx === currentIdx ? { ...activePlayer } : p
          );
          setPlayers([...workingPlayers]);

          if (stepsMoved >= rolled) {
            window.clearInterval(stepInterval);
            // 3. Final landing zoom (3x closer) + tile pulse for 0.8s before modal opens
            setCameraMode('focus');
            setFocusedTileId(activePlayer.pos);

            window.setTimeout(() => {
              setIsMoving(false);
              resolveTileLanding(
                activePlayer.pos,
                workingPlayers,
                tiles,
                currentIdx
              );
            }, 850);
          }
        }, 280);
      }, 450);
    }, 750);
  };

  // Property purchase handlers
  const handleBuyProperty = (tile: Tile) => {
    const price = tile.price || 2;
    const activePlayer = players[currentIdx];
    if (activePlayer.coins < price) return;

    const nextPlayers = players.map((p, idx) =>
      idx === currentIdx ? { ...p, coins: p.coins - price } : p
    );
    const nextTiles = tiles.map((t) =>
      t.id === tile.id ? { ...t, owner: activePlayer.id } : t
    );

    setPlayers(nextPlayers);
    setTiles(nextTiles);
    showToast(`${activePlayer.name} ostis koha "${tile.name}"!`);
    endTurn();
  };

  // Owned property penalty handler
  const handlePayRent = (owner: Player, useShield: boolean) => {
    const nextPlayers = players.map((p, idx) => {
      if (idx === currentIdx) {
        return useShield
          ? { ...p, shield: false }
          : { ...p, coins: p.coins + 1 };
      }
      if (p.id === owner.id) {
        return { ...p, coins: p.coins + 2 };
      }
      return p;
    });
    setPlayers(nextPlayers);
    if (useShield) {
      showToast(`${players[currentIdx].name} kasutas kilpi 🛡️! ${owner.name} sai +2 💰.`);
    } else {
      showToast(`${players[currentIdx].name} võttis ${drinkWordPart} (+1 💰) ja ${owner.name} sai +2 💰!`);
    }
    endTurn();
  };

  // Card action handlers
  const handleCompleteCard = () => {
    const nextPlayers = players.map((p, idx) =>
      idx === currentIdx ? { ...p, coins: p.coins + 1 } : p
    );
    setPlayers(nextPlayers);
    showToast(`${players[currentIdx].name} tegi ülesande ära (+1 💰)!`);
    endTurn();
  };

  const handleSkipCard = (useShield: boolean) => {
    const nextPlayers = players.map((p, idx) => {
      if (idx !== currentIdx) return p;
      if (useShield) {
        return { ...p, shield: false };
      }
      const afterPenalty = Math.max(0, p.coins - 2);
      return { ...p, coins: afterPenalty + 1 };
    });
    setPlayers(nextPlayers);
    if (useShield) {
      showToast(`${players[currentIdx].name} blokeeris kaardi kilbiga 🛡️!`);
    } else {
      showToast(`${players[currentIdx].name} maksis trahvi ja võttis ${drinkWordPart}!`);
    }
    endTurn();
  };

  // Everyone drinks handler
  const handleAllDrink = () => {
    const nextPlayers = players.map((p) => ({ ...p, coins: p.coins + 1 }));
    setPlayers(nextPlayers);
    showToast('Terviseks! Kõik said +1 💰!');
    endTurn();
  };

  // Shop actions
  const handleBuyShield = () => {
    const active = players[currentIdx];
    if (active.coins < 3 || active.shield) return;
    const nextPlayers = players.map((p, idx) =>
      idx === currentIdx ? { ...p, coins: p.coins - 3, shield: true } : p
    );
    setPlayers(nextPlayers);
    setModal(null);
    showToast(`${active.name} ostis Kilbi 🛡️!`);
  };

  const handleSendDrinkToPlayer = (targetId: number) => {
    const active = players[currentIdx];
    const target = players.find((p) => p.id === targetId);
    if (!target || active.coins < 2) return;

    const nextPlayers = players.map((p) => {
      if (p.id === active.id) return { ...p, coins: p.coins - 2 };
      if (p.id === targetId) return { ...p, coins: p.coins + 1 };
      return p;
    });
    setPlayers(nextPlayers);
    setShopAction(null);
    setModal(null);
    showToast(`${active.name} saatis mängijale ${target.name} 2 ${drinkWordPart}! (+1 💰)`);
  };

  const handleSwapWithPlayer = (targetId: number) => {
    const active = players[currentIdx];
    const target = players.find((p) => p.id === targetId);
    if (!target || active.coins < 4) return;

    const newActivePos = target.pos;
    const newTargetPos = active.pos;

    const nextPlayers = players.map((p) => {
      if (p.id === active.id) {
        return { ...p, coins: p.coins - 4, pos: newActivePos };
      }
      if (p.id === targetId) {
        return { ...p, pos: newTargetPos };
      }
      return p;
    });

    setPlayers(nextPlayers);
    setShopAction(null);
    setModal(null);
    setCameraMode('focus');
    setFocusedTileId(newActivePos);
    showToast(`${active.name} vahetas kohad mängijaga ${target.name}!`);

    window.setTimeout(() => {
      resolveTileLanding(newActivePos, nextPlayers, tiles, currentIdx);
    }, 850);
  };

  const activePlayer = players[currentIdx];

  const getNetWorth = (player: Player) => {
    const propertySum = tiles
      .filter((t) => t.owner === player.id)
      .reduce((sum, t) => sum + (t.price || 0), 0);
    return player.coins + propertySum;
  };

  const getOwnedCount = (playerId: number) =>
    tiles.filter((t) => t.owner === playerId).length;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      {/* Fullscreen 3D Board Canvas */}
      <Board3D
        tiles={tiles}
        players={players}
        activePlayerIndex={currentIdx}
        diceValue={diceValue}
        isRolling={isRolling}
        drawingDeck={drawingDeck}
        cameraMode={cameraMode}
        focusedTileId={focusedTileId}
      />

      {/* SETUP OVERLAY */}
      {!gameStarted && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900/95 border border-slate-800 p-6 md:p-7 shadow-2xl">
            <h1 className="text-3xl font-black tracking-tight text-center text-amber-400">
              PEOMONOPOL
            </h1>
            <p className="text-center text-slate-400 text-sm mt-1 mb-5">
              3D seltskonnamäng 2–8 mängijale
            </p>

            {/* Players list */}
            <div className="space-y-2.5 mb-4 max-h-[46vh] overflow-y-auto pr-1">
              {setupPlayers.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-800/40 p-2 rounded-2xl border border-slate-800/80">
                  <div className="flex flex-wrap gap-1 max-w-[120px] shrink-0">
                    {PLAYER_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => {
                          const copy = [...setupPlayers];
                          copy[idx].color = c.hex;
                          setSetupPlayers(copy);
                        }}
                        className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                          p.color === c.hex
                            ? 'scale-125 ring-2 ring-white'
                            : 'opacity-40 hover:opacity-90'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>

                  <input
                    type="text"
                    value={p.name}
                    maxLength={14}
                    onChange={(e) => {
                      const copy = [...setupPlayers];
                      copy[idx].name = e.target.value;
                      setSetupPlayers(copy);
                    }}
                    placeholder={`Mängija ${idx + 1}`}
                    className="flex-1 min-w-0 rounded-xl bg-slate-800 border border-slate-700 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />

                  {setupPlayers.length > 2 && (
                    <button
                      type="button"
                      onClick={() =>
                        setSetupPlayers(setupPlayers.filter((_, i) => i !== idx))
                      }
                      className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {setupPlayers.length < 8 && (
              <button
                type="button"
                onClick={() => {
                  const usedColors = new Set(setupPlayers.map((p) => p.color));
                  const nextColor =
                    PLAYER_COLORS.find((c) => !usedColors.has(c.hex))?.hex ||
                    PLAYER_COLORS[setupPlayers.length % PLAYER_COLORS.length].hex;
                  setSetupPlayers([
                    ...setupPlayers,
                    {
                      name: `Mängija ${setupPlayers.length + 1}`,
                      color: nextColor,
                    },
                  ]);
                }}
                className="w-full py-2 mb-4 rounded-xl border border-dashed border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white text-sm font-medium flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Lisa mängija ({setupPlayers.length}/8)
              </button>
            )}

            {/* Ringide valik */}
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-800/70 border border-slate-700/70 mb-3">
              <span className="text-sm font-medium text-slate-200">
                Ringe:
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={selectedRounds <= MIN_ROUNDS}
                  onClick={() => setSelectedRounds(Math.max(MIN_ROUNDS, selectedRounds - 1))}
                  className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 disabled:cursor-not-allowed text-white font-bold text-base flex items-center justify-center transition cursor-pointer"
                >
                  −
                </button>
                <span className="font-extrabold text-amber-400 text-base w-6 text-center">
                  {selectedRounds}
                </span>
                <button
                  type="button"
                  disabled={selectedRounds >= MAX_ROUNDS_LIMIT}
                  onClick={() => setSelectedRounds(Math.min(MAX_ROUNDS_LIMIT, selectedRounds + 1))}
                  className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 disabled:cursor-not-allowed text-white font-bold text-base flex items-center justify-center transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Alkovaba toggle */}
            <label className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-800/70 border border-slate-700/70 mb-4 cursor-pointer">
              <span className="text-sm font-medium text-slate-200">
                🥤 Alkovaba režiim
              </span>
              <input
                type="checkbox"
                checked={nonAlcoholic}
                onChange={(e) => setNonAlcoholic(e.target.checked)}
                className="w-5 h-5 accent-amber-400 rounded cursor-pointer"
              />
            </label>

            <p className="text-center text-slate-400 text-xs mb-4">
              {selectedRounds} ringi järel võidab kõige rikkam mängija!
            </p>

            <button
              type="button"
              onClick={handleStartGame}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-base shadow-lg shadow-amber-400/20 transition cursor-pointer"
            >
              Alusta pidu
            </button>
          </div>
        </div>
      )}

      {/* MAIN HUD */}
      {gameStarted && activePlayer && (
        <>
          {/* Top Bar: Round & Scoreboard */}
          <div className="fixed top-4 inset-x-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-4 py-2.5 rounded-2xl shadow-lg">
              <span className="font-black text-amber-400 tracking-wide">
                PEOMONOPOL
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-sm font-semibold text-slate-200">
                Ring {round}/{maxRounds} ({getStageName(getStageForRound(round, maxRounds))})
              </span>
            </div>

            {/* Players Scoreboard */}
            <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-1.5 max-w-[80vw]">
              {players.map((p, idx) => {
                const isCurrent = idx === currentIdx;
                const owned = getOwnedCount(p.id);
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-2xl border backdrop-blur-md transition ${
                      isCurrent
                        ? 'bg-slate-900/95 border-white shadow-lg scale-105 ring-1 ring-white/50'
                        : 'bg-slate-900/75 border-slate-800 opacity-85'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-bold text-xs md:text-sm text-white truncate max-w-[85px]">
                      {p.name}
                    </span>
                    <span className="text-xs font-semibold text-amber-400">
                      {p.coins} 💰
                    </span>
                    {owned > 0 && (
                      <span className="text-xs text-slate-400">
                        🏠 {owned}
                      </span>
                    )}
                    {p.shield && <span title="Kilp aktiivne">🛡️</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instant Alert Toast (1 or 6 roll, START bonus, etc.) */}
          {toast && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <div className="bg-amber-400 text-slate-950 font-extrabold text-sm md:text-base px-6 py-3 rounded-2xl shadow-2xl border-2 border-white animate-bounce">
                {toast}
              </div>
            </div>
          )}

          {/* Bottom Controls Bar */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-5 py-3.5 rounded-3xl shadow-2xl">
            <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: activePlayer.color }}
              />
              <span className="font-bold text-white text-base">
                {activePlayer.name}
              </span>
            </div>

            <button
              type="button"
              disabled={isRolling || isMoving || drawingDeck !== null || modal !== null}
              onClick={handleRollDice}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-extrabold text-base shadow-lg shadow-amber-400/20 transition cursor-pointer"
            >
              <Dices className="w-5 h-5" />
              {isRolling
                ? 'Veereb...'
                : isMoving
                ? 'Liigub...'
                : drawingDeck
                ? 'Võtab kaarti...'
                : 'Veereta täringut'}
            </button>

            <button
              type="button"
              disabled={isRolling || isMoving || drawingDeck !== null || modal !== null}
              onClick={() => {
                setShopAction(null);
                setModal({ type: 'shop' });
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-100 font-semibold text-sm transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              🛒 Pood
            </button>
          </div>
        </>
      )}

      {/* FOCUSED ACTION MODALS */}
      <AnimatePresence>
        {modal && activePlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
            style={{ perspective: '1200px' }}
          >
            {/* 1. FREE PROPERTY MODAL */}
            {modal.type === 'buy_property' && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-center shadow-2xl"
              >
                <div
                  className="w-12 h-2 rounded-full mx-auto mb-4"
                  style={{ backgroundColor: modal.tile.color }}
                />
                <h2 className="text-2xl font-black text-white mb-2">
                  {modal.tile.name}
                </h2>
                <p className="text-slate-300 text-base mb-6">
                  Vaba kinnisvara! Hind:{' '}
                  <strong className="text-amber-400">{modal.tile.price} 💰</strong>
                </p>

                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    disabled={activePlayer.coins < (modal.tile.price || 2)}
                    onClick={() => handleBuyProperty(modal.tile)}
                    className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-base transition cursor-pointer"
                  >
                    Osta ({modal.tile.price} 💰)
                  </button>
                  <button
                    type="button"
                    onClick={endTurn}
                    className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition cursor-pointer"
                  >
                    Jäta vahele
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. OWNED PROPERTY MODAL */}
            {modal.type === 'pay_rent' && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-center shadow-2xl"
              >
                <h2 className="text-2xl font-black text-white mb-2">
                  {modal.tile.name}
                </h2>
                <p className="text-slate-300 text-base mb-6">
                  See maa kuulub mängijale{' '}
                  <strong style={{ color: modal.owner.color }}>
                    {modal.owner.name}
                  </strong>
                  ! {chugVerb} Omanik saab +2 💰.
                </p>

                <div className="flex flex-col gap-2.5">
                  {activePlayer.shield && (
                    <button
                      type="button"
                      onClick={() => handlePayRent(modal.owner, true)}
                      className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Shield className="w-5 h-5" /> Kasuta kilpi 🛡️
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handlePayRent(modal.owner, false)}
                    className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-base transition cursor-pointer"
                  >
                    Joon ära! (+1 💰)
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. CARD MODAL WITH 3D DECK-DRAW FLIP ANIMATION */}
            {modal.type === 'card' && (
              <motion.div
                initial={{
                  scale: 0.35,
                  y: 120,
                  rotateY: 180,
                  rotateZ: modal.tileType === 'drink' ? -12 : 12,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  y: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  opacity: 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 180,
                  damping: 18,
                }}
                className={`w-full max-w-md rounded-3xl bg-slate-900 border-2 p-7 text-center shadow-2xl ${
                  modal.tileType === 'drink'
                    ? 'border-amber-400/80 shadow-amber-500/20'
                    : 'border-pink-500/80 shadow-pink-500/20'
                }`}
              >
                <div className="text-5xl mb-3">
                  {modal.tileType === 'drink' ? '🍺' : '🎭'}
                </div>
                <h2
                  className={`text-xl font-black mb-4 ${
                    modal.tileType === 'drink' ? 'text-amber-400' : 'text-pink-400'
                  }`}
                >
                  {modal.tileType === 'drink'
                    ? 'JOOMISCHALLENGE'
                    : 'TÕDE VÕI TEGU'}
                </h2>
                <p className="text-white text-lg font-medium leading-relaxed mb-7">
                  {modal.text}
                </p>

                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={handleCompleteCard}
                    className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base transition cursor-pointer"
                  >
                    🟢 TEEN ÄRA (+1 💰)
                  </button>

                  {activePlayer.shield ? (
                    <button
                      type="button"
                      onClick={() => handleSkipCard(true)}
                      className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition cursor-pointer"
                    >
                      🛡️ Kasuta kilpi (tühista trahv)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSkipCard(false)}
                      className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition cursor-pointer"
                    >
                      🔴 EI JULGE: MAKSA 2 💰 & JOO
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* 4. ALL DRINK MODAL */}
            {modal.type === 'all_drink' && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-center shadow-2xl"
              >
                <h2 className="text-2xl font-black text-amber-400 mb-3">
                  🍻 KÕIK JOOVAD!
                </h2>
                <p className="text-slate-200 text-base mb-6">
                  Kõik mängijad tõstavad klaasi ja võtavad {drinkWordPart}! Igaüks saab +1 💰.
                </p>
                <button
                  type="button"
                  onClick={handleAllDrink}
                  className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-base transition cursor-pointer"
                >
                  Terviseks! (+1 💰 kõigile)
                </button>
              </motion.div>
            )}

            {/* 5. SHOP MODAL */}
            {modal.type === 'shop' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-black text-white">🛒 Pood</h2>
                  <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
                    <Coins className="w-4 h-4" /> {activePlayer.coins} 💰
                  </span>
                </div>

                {!shopAction ? (
                  <div className="space-y-2.5 mb-5">
                    <button
                      type="button"
                      disabled={activePlayer.coins < 3 || activePlayer.shield}
                      onClick={handleBuyShield}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-left transition cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">
                          🛡️ Kilp
                        </div>
                        <div className="text-xs text-slate-400">
                          Tühistab järgmise joomise või kaarditrahvi
                        </div>
                      </div>
                      <span className="font-bold text-amber-400 text-sm shrink-0">
                        3 💰
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={activePlayer.coins < 2}
                      onClick={() => setShopAction('drink')}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-left transition cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">
                          🍺 Saada jook
                        </div>
                        <div className="text-xs text-slate-400">
                          Vali mängija, kes võtab 2 {drinkWordPart}
                        </div>
                      </div>
                      <span className="font-bold text-amber-400 text-sm shrink-0">
                        2 💰
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={activePlayer.coins < 4}
                      onClick={() => setShopAction('swap')}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-left transition cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">
                          🔄 Vahetus
                        </div>
                        <div className="text-xs text-slate-400">
                          Vaheta asukoht teise mängijaga laual
                        </div>
                      </div>
                      <span className="font-bold text-amber-400 text-sm shrink-0">
                        4 💰
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 mb-5">
                    <p className="text-sm text-slate-300 mb-2">
                      Vali mängija:
                    </p>
                    {players
                      .filter((p) => p.id !== activePlayer.id)
                      .map((target) => (
                        <button
                          key={target.id}
                          type="button"
                          onClick={() =>
                            shopAction === 'drink'
                              ? handleSendDrinkToPlayer(target.id)
                              : handleSwapWithPlayer(target.id)
                          }
                          className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: target.color }}
                            />
                            {target.name}
                          </span>
                          <Sparkles className="w-4 h-4 text-amber-400" />
                        </button>
                      ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShopAction(null);
                    setModal(null);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm cursor-pointer"
                >
                  Sulge
                </button>
              </motion.div>
            )}

            {/* 6. GAME OVER MODAL */}
            {modal.type === 'game_over' && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-7 text-center shadow-2xl"
              >
                <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                <h2 className="text-2xl font-black text-white mb-5">
                  MÄNG LÄBI!
                </h2>

                <div className="space-y-2.5 mb-6 text-left">
                  {[...players]
                    .sort((a, b) => getNetWorth(b) - getNetWorth(a))
                    .map((p, idx) => (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl ${
                          idx === 0
                            ? 'bg-amber-400/15 border border-amber-400/50'
                            : 'bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-slate-400 w-5">
                            #{idx + 1}
                          </span>
                          <span
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: p.color }}
                          />
                          <span className="font-bold text-white">{p.name}</span>
                        </div>
                        <span className="font-extrabold text-amber-400">
                          {getNetWorth(p)} 💰
                        </span>
                      </div>
                    ))}
                </div>

                <button
                  type="button"
                  onClick={handleResetGame}
                  className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-base flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" /> Uus mäng
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

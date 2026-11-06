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
  ArrowLeft,
  SkipForward,
  Building2,
  Users,
  Ban,
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
  getRandomHostLine,
} from './data/gameData';
import type { Player, Tile } from './types';

type ActiveModal =
  | { type: 'buy_property'; tile: Tile }
  | { type: 'pay_rent'; tile: Tile; owner: Player }
  | {
      type: 'card';
      tileType: 'drink' | 'truth_dare';
      category: 'drink' | 'truth' | 'dare';
      text: string;
    }
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
  const [usedCardIds, setUsedCardIds] = useState<string[]>([]);

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
  const [shopAction, setShopAction] = useState<
    'drink' | 'skip' | 'buddy' | 'expropriate' | null
  >(null);

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
      laps: 1,
      skipNextTurn: false,
      drinkingBuddyId: null,
      drinkingBuddyExpiresLap: null,
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
    const hostStart = getRandomHostLine('start');
    showToast(hostStart || 'Pidu algab! Veereta täringut!');
  };

  const handleResetGame = () => {
    setModal(null);
    setDrawingDeck(null);
    setCameraMode('overview');
    setFocusedTileId(null);
    setUsedCardIds([]);
    setGameStarted(false);
  };

  // Advance to next player's turn or finish after selected maxRounds laps
  const endTurn = () => {
    setModal(null);
    setDrawingDeck(null);
    setShopAction(null);
    setCameraMode('overview');
    setFocusedTileId(null);

    if (currentIdx + 1 < players.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Completed one turn rotation for all players
      // Check if any player has completed all maxRounds laps
      const anyPlayerFinished = players.some((p) => (p.laps || 1) > maxRounds);
      if (anyPlayerFinished) {
        setModal({ type: 'game_over' });
        const hostEnd = getRandomHostLine('end');
        if (hostEnd) showToast(hostEnd, 4500);
      } else {
        const highestLap = Math.max(...players.map((p) => p.laps || 1));
        if (highestLap > round) {
          setRound(highestLap);
          const stageName = getStageName(getStageForRound(highestLap, maxRounds));
          const prevStage = getStageForRound(round, maxRounds);
          const nextStage = getStageForRound(highestLap, maxRounds);
          const stageComment = prevStage !== nextStage ? ` ${getRandomHostLine('stage')}` : '';
          showToast(`Uus ring alanud: ${highestLap}/${maxRounds} (${stageName})!${stageComment}`);
        }
        setCurrentIdx(0);
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
      showToast(`${activePlayer.name} maandus START ruudul (+10 💰)!`);
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
        setModal({
          type: 'card',
          tileType: tile.type as 'drink' | 'truth_dare',
          category: cardResult.category,
          text: cardResult.text,
        });
      }, 750);
      return;
    }

    if (tile.type === 'all_drink') {
      setModal({ type: 'all_drink' });
    }
  };

  // Helper: Trigger drinking buddy reaction whenever a player drinks
  const applyDrinkingBuddyReaction = (
    drinker: Player,
    currentPlayers: Player[]
  ): Player[] => {
    if (
      drinker.drinkingBuddyId &&
      (drinker.drinkingBuddyExpiresLap == null ||
        (drinker.laps || 1) <= drinker.drinkingBuddyExpiresLap)
    ) {
      const buddy = currentPlayers.find((p) => p.id === drinker.drinkingBuddyId);
      if (buddy) {
        showToast(
          `🍻 Joomakaaslane ${buddy.name} peab koos mängijaga ${drinker.name} võtma ${drinkWordPart} (+1 💰)!`,
          3500
        );
        return currentPlayers.map((p) =>
          p.id === buddy.id ? { ...p, coins: p.coins + 1 } : p
        );
      }
    }
    return currentPlayers;
  };

  // Roll Dice & Move Cone Step-by-Step with Camera Follow & Landing Zoom
  const handleRollDice = () => {
    if (isRolling || isMoving || drawingDeck !== null || modal !== null) return;
    if (players[currentIdx]?.skipNextTurn) return;

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
        workingPlayers = applyDrinkingBuddyReaction(activePlayer, workingPlayers);
        setPlayers([...workingPlayers]);
        const hostSix = getRandomHostLine('six');
        showToast(
          `Veeretasid ${rolled}! ${hostSix} (Võta ${drinkWord}! +1 💰)`,
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

          // Passing or landing on START grants +10 coins and completes a full circuit
          if (nextPos === 0) {
            activePlayer.coins += 10;
            activePlayer.laps = (activePlayer.laps || 1) + 1;

            // Check if 1-round drinking buddy has expired
            if (
              activePlayer.drinkingBuddyId &&
              activePlayer.drinkingBuddyExpiresLap &&
              activePlayer.laps > activePlayer.drinkingBuddyExpiresLap
            ) {
              const buddy = workingPlayers.find(
                (p) => p.id === activePlayer.drinkingBuddyId
              );
              showToast(
                `${activePlayer.name} ja ${buddy?.name || 'kaaslase'} joomakaasluse leping lõppes (1 ring täis)! 🏁`
              );
              activePlayer.drinkingBuddyId = null;
              activePlayer.drinkingBuddyExpiresLap = null;
            }

            showToast(
              `${activePlayer.name} läbis START ruudu (+10 💰)! Ring ${activePlayer.laps}/${maxRounds}`
            );
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
    const hostBuy = getRandomHostLine('buy');
    showToast(`${activePlayer.name} ostis koha "${tile.name}"! ${hostBuy}`);
    endTurn();
  };

  // Owned property penalty handler
  const handlePayRent = (owner: Player, useShield: boolean) => {
    let nextPlayers = players.map((p, idx) => {
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

    if (!useShield) {
      nextPlayers = applyDrinkingBuddyReaction(players[currentIdx], nextPlayers);
    }

    setPlayers(nextPlayers);
    if (useShield) {
      showToast(`${players[currentIdx].name} kasutas kilpi 🛡️! ${owner.name} sai +2 💰.`);
    } else {
      const hostChug = getRandomHostLine('chug');
      showToast(`${players[currentIdx].name} võttis ${drinkWordPart} (+1 💰) ja ${owner.name} sai +2 💰! ${hostChug}`);
    }
    endTurn();
  };

  // Card action handlers
  const handleCompleteCard = () => {
    let nextPlayers = players.map((p, idx) =>
      idx === currentIdx ? { ...p, coins: p.coins + 1 } : p
    );
    if (modal?.type === 'card' && modal.tileType === 'drink') {
      nextPlayers = applyDrinkingBuddyReaction(players[currentIdx], nextPlayers);
    }
    setPlayers(nextPlayers);
    showToast(`${players[currentIdx].name} tegi ülesande ära (+1 💰)!`);
    endTurn();
  };

  const handleSkipCard = (useShield: boolean) => {
    let nextPlayers = players.map((p, idx) => {
      if (idx !== currentIdx) return p;
      if (useShield) {
        return { ...p, shield: false };
      }
      const afterPenalty = Math.max(0, p.coins - 2);
      return { ...p, coins: afterPenalty + 1 };
    });

    if (!useShield) {
      nextPlayers = applyDrinkingBuddyReaction(players[currentIdx], nextPlayers);
    }

    setPlayers(nextPlayers);
    if (useShield) {
      showToast(`${players[currentIdx].name} blokeeris kaardi kilbiga 🛡️!`);
    } else {
      const hostPass = getRandomHostLine('pass');
      showToast(`${players[currentIdx].name} loobus! ${hostPass}`);
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
    const hostShop = getRandomHostLine('shop');
    showToast(`${active.name} ostis Kilbi 🛡️! ${hostShop}`);
  };

  const handleSendDrinkToPlayer = (targetId: number) => {
    const active = players[currentIdx];
    const target = players.find((p) => p.id === targetId);
    if (!target || active.coins < 2) return;

    let nextPlayers = players.map((p) => {
      if (p.id === active.id) return { ...p, coins: p.coins - 2 };
      if (p.id === targetId) return { ...p, coins: p.coins + 1 };
      return p;
    });

    // Target drinks, so if target has a drinking buddy, their buddy also drinks
    nextPlayers = applyDrinkingBuddyReaction(target, nextPlayers);

    setPlayers(nextPlayers);
    setShopAction(null);
    setModal(null);
    showToast(`${active.name} saatis mängijale ${target.name} 2 ${drinkWordPart}! (+1 💰)`);
  };

  const handleSkipPlayerTurn = (targetId: number) => {
    const active = players[currentIdx];
    const target = players.find((p) => p.id === targetId);
    if (!target || active.coins < 3) return;

    const nextPlayers = players.map((p) => {
      if (p.id === active.id) return { ...p, coins: p.coins - 3 };
      if (p.id === targetId) return { ...p, skipNextTurn: true };
      return p;
    });

    setPlayers(nextPlayers);
    setShopAction(null);
    setModal(null);
    showToast(
      `${active.name} pani mängija ${target.name} järgmise käigu vahele jätma! 🛑`
    );
  };

  const handleSetDrinkingBuddy = (targetId: number) => {
    const active = players[currentIdx];
    const target = players.find((p) => p.id === targetId);
    if (!target || active.coins < 3) return;

    const nextPlayers = players.map((p) => {
      if (p.id === active.id) {
        return {
          ...p,
          coins: p.coins - 3,
          drinkingBuddyId: targetId,
          drinkingBuddyExpiresLap: (p.laps || 1) + 1,
        };
      }
      return p;
    });

    setPlayers(nextPlayers);
    setShopAction(null);
    setModal(null);
    showToast(
      `${active.name} valis joomakaaslaseks ${target.name}! Terve 1 ringi joote koos! 🍻`
    );
  };

  const handleExpropriateProperty = (tileId: number) => {
    const active = players[currentIdx];
    const tile = tiles.find((t) => t.id === tileId);
    if (!tile || !tile.owner || tile.owner === active.id) return;
    const cost = (tile.price || 2) * 3;
    if (active.coins < cost) return;

    const prevOwner = players.find((p) => p.id === tile.owner);

    const nextPlayers = players.map((p) => {
      if (p.id === active.id) return { ...p, coins: p.coins - cost };
      if (p.id === tile.owner) return { ...p, coins: p.coins + cost };
      return p;
    });

    const nextTiles = tiles.map((t) =>
      t.id === tileId ? { ...t, owner: active.id } : t
    );

    setPlayers(nextPlayers);
    setTiles(nextTiles);
    setShopAction(null);
    setModal(null);
    showToast(
      `${active.name} võõrandas koha "${tile.name}" mängijalt ${prevOwner?.name || 'omanik'} (${cost} 💰)! 🏛️`
    );
  };

  const handleAcknowledgeTurnSkip = () => {
    const active = players[currentIdx];
    const updatedPlayers = players.map((p, idx) =>
      idx === currentIdx ? { ...p, skipNextTurn: false } : p
    );
    setPlayers(updatedPlayers);
    showToast(`${active.name} käik jäi vahele! 🛑`);

    setModal(null);
    setDrawingDeck(null);
    setShopAction(null);
    setCameraMode('overview');
    setFocusedTileId(null);

    if (currentIdx + 1 < updatedPlayers.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      const anyPlayerFinished = updatedPlayers.some((p) => (p.laps || 1) > maxRounds);
      if (anyPlayerFinished) {
        setModal({ type: 'game_over' });
        const hostEnd = getRandomHostLine('end');
        if (hostEnd) showToast(hostEnd, 4500);
      } else {
        const highestLap = Math.max(...updatedPlayers.map((p) => p.laps || 1));
        if (highestLap > round) {
          setRound(highestLap);
          const stageName = getStageName(getStageForRound(highestLap, maxRounds));
          const prevStage = getStageForRound(round, maxRounds);
          const nextStage = getStageForRound(highestLap, maxRounds);
          const stageComment = prevStage !== nextStage ? ` ${getRandomHostLine('stage')}` : '';
          showToast(`Uus ring alanud: ${highestLap}/${maxRounds} (${stageName})!${stageComment}`);
        }
        setCurrentIdx(0);
      }
    }
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

  const opponentProperties = tiles.filter(
    (t) => t.type === 'property' && t.owner !== null && t.owner !== activePlayer?.id
  );
  const minExpropriateCost =
    opponentProperties.length > 0
      ? Math.min(...opponentProperties.map((t) => (t.price || 2) * 3))
      : 0;

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
                Ring {activePlayer.laps || 1}/{maxRounds} ({getStageName(getStageForRound(activePlayer.laps || 1, maxRounds))})
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
                    <span className="text-xs font-semibold text-slate-300">
                      🏁 {p.laps || 1}/{maxRounds}
                    </span>
                    {owned > 0 && (
                      <span className="text-xs text-slate-400">
                        🏠 {owned}
                      </span>
                    )}
                    {p.shield && <span title="Kilp aktiivne">🛡️</span>}
                    {p.skipNextTurn && <span title="Käik jääb vahele">🛑</span>}
                    {p.drinkingBuddyId && <span title="Joomakaaslane määratud">🍻</span>}
                    {players.some((o) => o.drinkingBuddyId === p.id) && (
                      <span title="On kellegi joomakaaslane">👥</span>
                    )}
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

            {activePlayer.skipNextTurn ? (
              <button
                type="button"
                disabled={isRolling || isMoving || drawingDeck !== null || modal !== null}
                onClick={handleAcknowledgeTurnSkip}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 transition cursor-pointer animate-pulse"
              >
                <SkipForward className="w-5 h-5" />
                Käik jääb vahele (Anna kord üle)
              </button>
            ) : (
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
            )}

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
                  modal.category === 'drink'
                    ? 'border-amber-400/80 shadow-amber-500/20'
                    : modal.category === 'truth'
                    ? 'border-pink-500/80 shadow-pink-500/20'
                    : 'border-orange-500/80 shadow-orange-500/20'
                }`}
              >
                <div className="text-5xl mb-3">
                  {modal.category === 'drink'
                    ? '🍺'
                    : modal.category === 'truth'
                    ? '🎭'
                    : '🔥'}
                </div>
                <h2
                  className={`text-xl font-black mb-4 ${
                    modal.category === 'drink'
                      ? 'text-amber-400'
                      : modal.category === 'truth'
                      ? 'text-pink-400'
                      : 'text-orange-400'
                  }`}
                >
                  {modal.category === 'drink'
                    ? 'JOOMISCHALLENGE'
                    : modal.category === 'truth'
                    ? 'TÕDE'
                    : 'TEGU'}
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-white">🛒 Pood</h2>
                  <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
                    <Coins className="w-4 h-4" /> {activePlayer.coins} 💰
                  </span>
                </div>

                {!shopAction ? (
                  <div className="space-y-2 mb-5">
                    {/* 1. Kilp */}
                    <button
                      type="button"
                      disabled={activePlayer.coins < 3 || activePlayer.shield}
                      onClick={handleBuyShield}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-left transition cursor-pointer"
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

                    {/* 2. Saada jook */}
                    <button
                      type="button"
                      disabled={activePlayer.coins < 2}
                      onClick={() => setShopAction('drink')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-left transition cursor-pointer"
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

                    {/* 3. Jäta käik vahele */}
                    <button
                      type="button"
                      disabled={activePlayer.coins < 3}
                      onClick={() => setShopAction('skip')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-left transition cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">
                          🛑 Jäta käik vahele
                        </div>
                        <div className="text-xs text-slate-400">
                          Vali vastane, kelle järgmine käik jääb vahele
                        </div>
                      </div>
                      <span className="font-bold text-amber-400 text-sm shrink-0">
                        3 💰
                      </span>
                    </button>

                    {/* 4. Joomakaaslane */}
                    <button
                      type="button"
                      disabled={activePlayer.coins < 3}
                      onClick={() => setShopAction('buddy')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-left transition cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">
                          🍻 Joomakaaslane (1 ring)
                        </div>
                        <div className="text-xs text-slate-400">
                          Vali kaaslane, kes joob sinuga koos iga kord
                        </div>
                      </div>
                      <span className="font-bold text-amber-400 text-sm shrink-0">
                        3 💰
                      </span>
                    </button>

                    {/* 5. Maa võõrandamine */}
                    <button
                      type="button"
                      disabled={
                        opponentProperties.length === 0 ||
                        activePlayer.coins < minExpropriateCost
                      }
                      onClick={() => setShopAction('expropriate')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-left transition cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-white text-sm">
                          🏛️ Maa võõrandamine
                        </div>
                        <div className="text-xs text-slate-400">
                          {opponentProperties.length === 0
                            ? 'Vastastel pole veel kinnisvara'
                            : 'Osta vastase maa välja (alghind × 3)'}
                        </div>
                      </div>
                      <span className="font-bold text-amber-400 text-xs shrink-0 text-right">
                        Alghind × 3
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="mb-5">
                    <button
                      type="button"
                      onClick={() => setShopAction(null)}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-3 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Tagasi valikusse
                    </button>

                    {/* Subview: Send Drink */}
                    {shopAction === 'drink' && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-200 mb-2">
                          Vali mängija, kellele saata 2 {drinkWordPart} (2 💰):
                        </p>
                        <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1">
                          {players
                            .filter((p) => p.id !== activePlayer.id)
                            .map((target) => (
                              <button
                                key={target.id}
                                type="button"
                                onClick={() => handleSendDrinkToPlayer(target.id)}
                                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm cursor-pointer transition"
                              >
                                <span className="flex items-center gap-2">
                                  <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: target.color }}
                                  />
                                  {target.name}
                                </span>
                                <span className="text-xs text-amber-400 font-bold">
                                  2 💰
                                </span>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Subview: Skip Turn */}
                    {shopAction === 'skip' && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-200 mb-2">
                          Vali vastane, kelle käik vahele jätta (3 💰):
                        </p>
                        <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1">
                          {players
                            .filter((p) => p.id !== activePlayer.id)
                            .map((target) => (
                              <button
                                key={target.id}
                                type="button"
                                disabled={!!target.skipNextTurn}
                                onClick={() => handleSkipPlayerTurn(target.id)}
                                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-semibold text-sm cursor-pointer transition"
                              >
                                <span className="flex items-center gap-2">
                                  <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: target.color }}
                                  />
                                  {target.name}
                                  {target.skipNextTurn && (
                                    <span className="text-xs text-rose-400 font-normal">
                                      (Juba vahele jäetud)
                                    </span>
                                  )}
                                </span>
                                <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                                  <Ban className="w-3.5 h-3.5" /> 3 💰
                                </span>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Subview: Drinking Buddy */}
                    {shopAction === 'buddy' && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-200 mb-2">
                          Vali joomakaaslane (3 💰, kestab 1 ringi):
                        </p>
                        <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1">
                          {players
                            .filter((p) => p.id !== activePlayer.id)
                            .map((target) => {
                              const isCurrentBuddy =
                                activePlayer.drinkingBuddyId === target.id;
                              return (
                                <button
                                  key={target.id}
                                  type="button"
                                  disabled={isCurrentBuddy}
                                  onClick={() =>
                                    handleSetDrinkingBuddy(target.id)
                                  }
                                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-semibold text-sm cursor-pointer transition"
                                >
                                  <span className="flex items-center gap-2">
                                    <span
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: target.color }}
                                    />
                                    {target.name}
                                    {isCurrentBuddy && (
                                      <span className="text-xs text-amber-400 font-normal">
                                        (Praegune kaaslane)
                                      </span>
                                    )}
                                  </span>
                                  <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5" /> 3 💰
                                  </span>
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* Subview: Expropriate Property */}
                    {shopAction === 'expropriate' && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-200 mb-2">
                          Vali võõrandatav kinnisvara (Alghind × 3):
                        </p>
                        <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1">
                          {opponentProperties.length === 0 ? (
                            <p className="text-center text-slate-400 text-sm py-4">
                              Ühelgi vastasel pole veel kinnisvara.
                            </p>
                          ) : (
                            opponentProperties.map((prop) => {
                              const cost = (prop.price || 2) * 3;
                              const owner = players.find(
                                (p) => p.id === prop.owner
                              );
                              const canAfford = activePlayer.coins >= cost;
                              return (
                                <button
                                  key={prop.id}
                                  type="button"
                                  disabled={!canAfford}
                                  onClick={() =>
                                    handleExpropriateProperty(prop.id)
                                  }
                                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-left transition cursor-pointer"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span
                                      className="w-3.5 h-3.5 rounded-full shrink-0"
                                      style={{ backgroundColor: prop.color }}
                                    />
                                    <div>
                                      <div className="font-bold text-white text-sm">
                                        {prop.name}
                                      </div>
                                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                                        <span>Omanik:</span>
                                        <span
                                          className="w-2 h-2 rounded-full inline-block"
                                          style={{
                                            backgroundColor: owner?.color,
                                          }}
                                        />
                                        <span className="text-slate-300 font-medium">
                                          {owner?.name || 'Vastane'}
                                        </span>
                                        <span>(alghind {prop.price || 2} 💰)</span>
                                      </div>
                                    </div>
                                  </div>
                                  <span className="font-extrabold text-amber-400 text-sm shrink-0">
                                    {cost} 💰
                                  </span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
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

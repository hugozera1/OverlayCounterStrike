import { useEffect, useState } from "react";

interface Player {
  name: string;
  team: string;
  state: {
    health: number;
    armor: number;
    money: number;
  };
  weapons: Record<
    string,
    {
      name: string;
      state: string;
      ammo_clip?: number;
      ammo_reserve?: number;
    }
  >;
}

interface GSIData {
  allplayers?: Record<string, Player>;
  player?: Player;
}

export default function App() {
  const [data, setData] = useState<GSIData>({});

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://192.168.15.64:3000/data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.log("Erro ao buscar dados:", err);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const observed = data.player;
  const players = Object.values(data.allplayers || {});
  const ctPlayers = players.filter((p) => p.team === "CT");
  const tPlayers = players.filter((p) => p.team === "T");

  // 🔹 BOX compacto
  const compactBoxStyle =
    "p-1.5 rounded-lg border mb-1 w-28 h-auto text-xs";

  const renderCharBox = (c: Player, index: number) => {
    const activeWeapon =
      Object.values(c.weapons).find((w) => w.state === "active")?.name || "none";
      const active = Object.values(c.weapons).find(w => w.state === "active");

const ammoClip = active?.ammo_clip ?? 0;
const ammoReserve = active?.ammo_reserve ?? 0;


    return (
      <div
        key={index}
        className={`${compactBoxStyle}
        ${
          c.state.health === 0
            ? "border-gray-700 bg-gray-900"
            : c.team === "CT"
            ? "border-blue-500 bg-blue-800"
            : "border-red-500 bg-red-800"
        }`}
      >
        <div className="flex justify-between mb-1">
          <h2 className="font-bold text-base">{c.name}</h2>
          <span
            className={`px-2 py-0.5 rounded text-xs ${
              c.team === "CT" ? "bg-blue-600" : "bg-red-600"
            }`}
          >
            {c.team}
          </span>
        </div>

        <p className="text-red-400">HP: <span className="text-white">{c.state.health}</span></p>
        <p className="text-blue-400">Armor: <span className="text-white">{c.state.armor}</span></p>
        <p className="text-yellow-300">Money: <span className="text-white">${c.state.money}</span></p>
        <p className="text-purple-300">Gun: <span className="text-white">{activeWeapon}</span></p>
        <p className="text-green-300">Ammo: <span className="text-white">{ammoClip}/{ammoReserve}</span></p>

        <div className="mt-1 h-1.5 w-full bg-gray-700 rounded">
          <div
            className="h-full rounded"
            style={{
              width: `${c.state.health}%`,
              backgroundColor: c.team === "CT" ? "#3b82f6" : "#ef4444",
            }}
          ></div>
        </div>
      </div>
    );
  };

  const renderPlayerBox = (p: Player, index: number) => {
    const activeWeapon =
      Object.values(p.weapons).find((w) => w.state === "active")?.name || "none";

    return (
      <div
        key={index}
        className={`${compactBoxStyle}
        ${
          p.state.health === 0
            ? "border-gray-700 bg-gray-900"
            : p.team === "CT"
            ? "border-blue-500 bg-blue-800"
            : "border-red-500 bg-red-800"
        }`}
      >
        <div className="flex justify-between mb-1">
          <h2 className="font-bold text-base">{p.name}</h2>
          <span
            className={`px-2 py-0.5 rounded text-xs ${
              p.team === "CT" ? "bg-blue-600" : "bg-red-600"
            }`}
          >
            {p.team}
          </span>
        </div>

        <p className="text-red-400">HP: <span className="text-white">{p.state.health}</span></p>
        <p className="text-blue-400">Armor: <span className="text-white">{p.state.armor}</span></p>
        <p className="text-yellow-300">Money: <span className="text-white">${p.state.money}</span></p>
        <p className="text-purple-300">Gun: <span className="text-white">{activeWeapon}</span></p>

        <div className="mt-1 h-1.5 w-full bg-gray-700 rounded">
          <div
            className="h-full rounded"
            style={{
              width: `${p.state.health}%`,
              backgroundColor: p.team === "CT" ? "#3b82f6" : "#ef4444",
            }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-screen h-screen bg-transparent text-white">

      {/* CT - esquerda */}
      <div className="absolute bottom-6 left-6 flex gap-1.5">
        <h1 className="text-xl font-bold text-blue-600 mb-2">CT</h1>
        {ctPlayers.map(renderPlayerBox)}
      </div>

      {/* PLAYER OBSERVADO — CENTRALIZADO */}
      {observed && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <h1 className="text-xl font-bold text-yellow-300 mb-1">Observando</h1>
          {renderCharBox(observed, 0)}
        </div>
      )}

      {/* T - direita */}
      <div className="absolute bottom-6 right-6 flex gap-1.5 items-end">
        <h1 className="text-xl font-bold text-red-400 mb-2">T</h1>
        {tPlayers.map(renderPlayerBox)}
      </div>
    </div>
  );
}

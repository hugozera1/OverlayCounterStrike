
import { CircleDollarSign, HeartCrack, Shield, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import Ctchar from './assets/CTchar.png';
import TRChar from './assets/TRChar.png'
interface Player {
  name: string;
  team: string;
  state: {
    health: number;
    helmet: boolean;
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
    "p-1.5  border mb-1 w-30  text-xs flex-col h-30";
     const compactBoxStyle2 =
    "p-1 border-0 m-0 w-60 text-xs flex-col h-50"; 

  const renderCharBox = (c: Player, index: number) => {
  console.log("ARMOR:", c.state.armor, "HELMET:", c.state.helmet, "PLAYER:", c.name);

  const activeWeapon =
    Object.values(c.weapons).find((w) => w.state === "active")?.name || "none";
  const active = Object.values(c.weapons).find(w => w.state === "active");

  const ammoClip = active?.ammo_clip ?? 0;
  const ammoReserve = active?.ammo_reserve ?? 0;

  return (
    <div
      key={index}
      className={`flex flex-col m-0 p-0 w-70 h-full ${
        c.state.health === 0
          ? "bg-gray-900"
          : c.team === "CT"
          ? "bg-blue-800"
          : "bg-orange-500"
      }`}
    >
      {/* Imagem do jogador com fade vertical */}
      <div className="relative w-full h-30 overflow-hidden m-0 p-0">
        <img
          src={c.team === "CT" ? Ctchar : TRChar}
          alt={c.team === "CT" ? "CT logo" : "T logo"}
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute inset-0 ${
            c.team === "CT"
              ? "bg-gradient-to-t from-blue-900/80 to-transparent"
              : "bg-gradient-to-t from-red-900/80 to-transparent"
          }`}
        />
      </div>
    

      {/* HUD com stats */}
      <div className="flex w-full justify-between items-center gap-0 p-0  bg-neutral-900">
        {/* HP */}
        <p className="text-red-400 flex items-center gap-1 m-0 p-0">
          <HeartCrack /> <span className="text-white">{c.state.health}</span>
        </p>

        {/* Armor / Capacete */}
        {c.state.armor > 0 && (
          <p className="text-blue-400 flex items-center gap-0 m-0 p-0">
            {c.state.helmet ? <ShieldCheck size={16} /> : <Shield size={16} />}
          </p>
        )}

        {/* Nome */}
        <h2 className="font-bold text-base text-white m-0 p-0">{c.name}</h2>

        {/* Ammo */}
        <p className="text-green-300 flex items-center gap-0 m-0 p-0">
          <span className="text-white">{ammoClip}/{ammoReserve}</span>
        </p>
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
      className={`relative w-30 h-40 border border-gray-700 bg-gray-900 overflow-hidden flex flex-col justify-end text-white text-xs`}
    >
      {/* Vida do jogador via altura do background */}
      <div
        className={`absolute bottom-0 w-full ${
          p.team === "CT" ? "bg-blue-500/50" : "bg-red-500/50"
        }`}
        style={{
          height: `${p.state.health}%`,
          transition: "height 0.2s ease-in-out",
        }}
      />

      {/* Conteúdo do jogador */}
      <div className="relative z-10 flex flex-col justify-between h-full p-1 gap-0">
        <h2 className="font-bold text-base">{p.name}</h2>

        <p className="text-red-400 flex items-center gap-1 m-0 p-0">
          <HeartCrack /> <span className="text-white">{p.state.health}</span>
        </p>

        <p className="text-blue-400 flex items-center gap-1 m-0 p-0">
          {p.state.armor > 0 && (p.state.helmet ? <ShieldCheck size={16} /> : <Shield size={16} />)}
        </p>

        <p className="text-yellow-300">Money: <span className="text-white">${p.state.money}</span></p>
        <p className="text-purple-300">Gun: <span className="text-white">{activeWeapon}</span></p>
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

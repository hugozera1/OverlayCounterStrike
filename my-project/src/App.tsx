import { useEffect, useState } from "react";

interface Player {
  name: string;
  team: string; // "CT" ou "T"
  state: {
    health: number;
    armor: number;
    money: number;
  };
  weapons: Record<string, { name: string; state: string }>;
}

interface GSIData {
  allplayers?: Record<string, Player>;
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

  const players = Object.values(data.allplayers || {});

  // Separar CT e T
  const ctPlayers = players.filter((p) => p.team === "CT");
  const tPlayers = players.filter((p) => p.team === "T");
  

  const renderPlayerBox = (p: Player, index: number) => {
    const activeWeapon =
      Object.values(p.weapons).find((w) => w.state === "active")?.name || "none";

    return (
      <div
  key={index}
  className={`p-2 rounded-lg border mb-1 w-30 h-55
  ${
    p.state.health === 0
      ? "border-gray-700 bg-gray-900"  // morto
      : p.team === "CT"
      ? "border-blue-500 bg-blue-800" // CT vivo
      : "border-red-500 bg-red-800"  // T vivo
  }
`}

>
  <div className="flex justify-between mb-2">
    <h2 className="font-bold text-lg">{p.name}</h2>
    <span
      className={`px-2 py-1 text-sm rounded ${
        p.team === "CT" ? "bg-blue-600" : "bg-red-600"
      }`}
    >
      {p.team}
    </span>
  </div>
  <p className="text-red-400">❤️ HP: <span className="text-white">{p.state.health}</span></p>
  <p className="text-blue-400">🛡 Armor: <span className="text-white">{p.state.armor}</span></p>
  <p className="text-yellow-300">💰 Money: <span className="text-white">${p.state.money}</span></p>
  <p className="text-purple-300">🔫 Weapon: <span className="text-white">{activeWeapon}</span></p>
  <div className="mt-2 h-2 w-full bg-gray-700 rounded">
    <div
      className="h-full rounded"
      style={{
        width: `${p.state.health}%`,
        backgroundColor: p.team === "CT" ? "#3b82f6" : "#ef4444", // azul para CT, vermelho para T
      }}
    ></div>
  </div>
</div>

    );
  };

return (
  <div className="relative w-screen h-screen bg-transparent justify-between text-white">

    {/* CT - canto esquerdo */}
    <div className="absolute bottom-6 left-6 flex  gap-2">
      <h1 className="text-2xl font-bold text-blue-600 mb-2">CT</h1>
      {ctPlayers.map(renderPlayerBox)}
    </div>

    {/* TR - canto direito */}
    <div className="absolute bottom-6 right-6 flex gap-2 items-end">
      <h1 className="text-2xl font-bold text-red-400 mb-2">T</h1>
      {tPlayers.map(renderPlayerBox)}
    </div>

  </div>
);

}
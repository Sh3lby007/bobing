import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Award, RotateCcw } from 'lucide-react';

const BobingTracker = () => {
  const [prizeConfig, setPrizeConfig] = useState({
    状元: { value: 520, limit: 1, count: 0 },
    对堂: { value: 100, limit: 2, count: 0 },
    三红: { value: 50, limit: 4, count: 0 },
    四进: { value: 20, limit: 8, count: 0 },
    二举: { value: 10, limit: 16, count: 0 },
    一秀: { value: 5, limit: 32, count: 0 }
  });
  
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPrizes, setEditingPrizes] = useState(false);
  const [tempPrizeConfig, setTempPrizeConfig] = useState({...prizeConfig});

  const prizeTypes = ['状元', '对堂', '三红', '四进', '二举', '一秀'];

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, {
        id: Date.now(),
        name: newPlayerName,
        rolls: []
      }]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id) => {
    const player = players.find(p => p.id === id);
    // Return prizes to pool
    const newConfig = {...prizeConfig};
    player.rolls.forEach(roll => {
      newConfig[roll.type].count -= 1;
    });
    setPrizeConfig(newConfig);
    setPlayers(players.filter(p => p.id !== id));
  };

  const addRoll = (playerId, prizeType) => {
    const config = prizeConfig[prizeType];
    if (config.count >= config.limit) {
      alert(`${prizeType} 已经被领完了！(${config.count}/${config.limit})`);
      return;
    }

    setPlayers(players.map(p => 
      p.id === playerId 
        ? {...p, rolls: [...p.rolls, { type: prizeType, value: config.value, id: Date.now() }]}
        : p
    ));

    setPrizeConfig({
      ...prizeConfig,
      [prizeType]: { ...config, count: config.count + 1 }
    });
  };

  const removeRoll = (playerId, rollId) => {
    const player = players.find(p => p.id === playerId);
    const roll = player.rolls.find(r => r.id === rollId);
    
    setPlayers(players.map(p => 
      p.id === playerId 
        ? {...p, rolls: p.rolls.filter(r => r.id !== rollId)}
        : p
    ));

    setPrizeConfig({
      ...prizeConfig,
      [roll.type]: { ...prizeConfig[roll.type], count: prizeConfig[roll.type].count - 1 }
    });
  };

  const getPlayerTotal = (player) => {
    return player.rolls.reduce((sum, roll) => sum + roll.value, 0);
  };

  const updatePrizes = () => {
    setPrizeConfig(tempPrizeConfig);
    setEditingPrizes(false);
  };

  const cancelEditPrizes = () => {
    setTempPrizeConfig({...prizeConfig});
    setEditingPrizes(false);
  };

  const updateTempValue = (type, field, value) => {
    setTempPrizeConfig({
      ...tempPrizeConfig,
      [type]: { ...tempPrizeConfig[type], [field]: parseFloat(value) || 0 }
    });
  };

  const resetGame = () => {
    if (window.confirm('确定要重置游戏吗？所有玩家的记录将被清空，但玩家列表会保留。')) {
      // Reset all player rolls
      setPlayers(players.map(p => ({ ...p, rolls: [] })));
      // Reset prize counts
      const resetConfig = {};
      Object.keys(prizeConfig).forEach(type => {
        resetConfig[type] = { ...prizeConfig[type], count: 0 };
      });
      setPrizeConfig(resetConfig);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-center text-red-600 mb-2">🎲 博饼游戏追踪</h1>
              <p className="text-center text-gray-600 mb-6">Mooncake Dice Game Tracker</p>
            </div>
            {players.length > 0 && (
              <button
                onClick={resetGame}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                title="重置游戏"
              >
                <RotateCcw size={18} /> 重置游戏
              </button>
            )}
          </div>

          {/* Prize Values */}
          <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-red-700">奖品设置</h2>
              {!editingPrizes ? (
                <button 
                  onClick={() => setEditingPrizes(true)}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  <Edit2 size={16} /> 修改
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={updatePrizes}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    保存
                  </button>
                  <button 
                    onClick={cancelEditPrizes}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>

            {editingPrizes ? (
              <div className="grid gap-3 mb-4">
                {prizeTypes.map(type => (
                  <div key={type} className="bg-white rounded-lg p-3 flex gap-4 items-center">
                    <div className="font-bold text-red-600 w-16">{type}</div>
                    <div className="flex gap-2 flex-1">
                      <input
                        type="number"
                        value={tempPrizeConfig[type].value}
                        onChange={(e) => updateTempValue(type, 'value', e.target.value)}
                        className="w-24 px-3 py-1 border-2 border-gray-300 rounded"
                        placeholder="金额"
                      />
                      <span className="py-1">元</span>
                      <input
                        type="number"
                        value={tempPrizeConfig[type].limit}
                        onChange={(e) => updateTempValue(type, 'limit', e.target.value)}
                        className="w-24 px-3 py-1 border-2 border-gray-300 rounded"
                        placeholder="数量"
                      />
                      <span className="py-1">个</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {prizeTypes.map(type => {
                  const config = prizeConfig[type];
                  const remaining = config.limit - config.count;
                  const isExhausted = remaining === 0;
                  return (
                    <div key={type} className={`bg-white rounded-lg p-3 text-center shadow ${isExhausted ? 'opacity-50' : ''}`}>
                      <div className="font-bold text-red-600 mb-1">{type}</div>
                      <div className="text-lg font-semibold">¥{config.value}</div>
                      <div className={`text-sm mt-1 ${isExhausted ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                        {remaining > 0 ? `剩余 ${remaining}` : '已领完'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Player */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="输入玩家名字..."
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 outline-none"
            />
            <button 
              onClick={addPlayer}
              className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              <Plus size={20} /> 添加玩家
            </button>
          </div>
        </div>

        {/* Players List */}
        {players.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center text-gray-400">
            <Award size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl">还没有玩家，请添加玩家开始游戏！</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {players.map(player => (
              <div key={player.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{player.name}</h3>
                    <p className="text-3xl font-bold text-red-600 mt-1">
                      总计: ¥{getPlayerTotal(player)}
                    </p>
                  </div>
                  <button 
                    onClick={() => removePlayer(player.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>

                {/* Add Roll Buttons */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                  {prizeTypes.map(type => {
                    const config = prizeConfig[type];
                    const isAvailable = config.count < config.limit;
                    return (
                      <button
                        key={type}
                        onClick={() => addRoll(player.id, type)}
                        disabled={!isAvailable}
                        className={`py-3 px-2 rounded-lg font-semibold text-sm ${
                          isAvailable 
                            ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>

                {/* Rolls History */}
                {player.rolls.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-3">掷骰记录:</h4>
                    <div className="space-y-2">
                      {player.rolls.map(roll => (
                        <div key={roll.id} className="flex justify-between items-center bg-white p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-red-600">{roll.type}</span>
                            <span className="text-lg font-semibold">¥{roll.value}</span>
                          </div>
                          <button 
                            onClick={() => removeRoll(player.id, roll.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard */}
        {players.length > 1 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-2xl font-bold text-center text-red-600 mb-4">🏆 排行榜</h2>
            <div className="space-y-2">
              {[...players].sort((a, b) => getPlayerTotal(b) - getPlayerTotal(a)).map((player, index) => (
                <div key={player.id} className="flex items-center justify-between bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : 'text-gray-600'}`}>
                      #{index + 1}
                    </div>
                    <div className="font-bold text-lg">{player.name}</div>
                  </div>
                  <div className="text-2xl font-bold text-red-600">¥{getPlayerTotal(player)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BobingTracker;
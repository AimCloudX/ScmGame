'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
)

// 製品ライフサイクル管理
const productLifecycle: Record<Lifecycle, { growth: number; decline: number }> = {
  introduction: { growth: 0.1, decline: 0.05 },
  growth: { growth: 0.2, decline: 0.1 },
  maturity: { growth: 0.05, decline: 0.05 },
  decline: { growth: 0, decline: 0.2 }
}

type Lifecycle = 'introduction' | 'growth' | 'maturity' | 'decline';
type Season = 'spring' | 'summer' | 'autumn' | 'winter';

type Country = 'USA' | 'Japan' | 'EU' | 'China';

// グローバル市場シミュレーション
const simulateGlobalMarket = (baselineDemand: number, country: Country) => {
  const exchangeRates: Record<Country, number> = {
    USA: 1,
    Japan: 110,
    EU: 0.9,
    China: 1.3,
  };
  const transportCosts: Record<Country, number> = {
    USA: 1,
    Japan: 1.2,
    EU: 1.1,
    China: 1.3,
  };
  return Math.round(baselineDemand * exchangeRates[country] * transportCosts[country])
}

// サプライヤー管理
interface Supplier {
  id: number;
  name: string;
  quality: number;
  cost: number;
  reliability: number;
}

const suppliers: Supplier[] = [
  { id: 1, name: 'サプライヤーA', quality: 0.9, cost: 1.1, reliability: 0.95 },
  { id: 2, name: 'サプライヤーB', quality: 0.8, cost: 0.9, reliability: 0.9 },
  { id: 3, name: 'サプライヤーC', quality: 1, cost: 1.2, reliability: 0.98 }
]

// 環境要因シミュレーション
interface EnvironmentalEvent {
  name: string;
  impact: number;
}

const simulateEnvironmentalEvent = (): EnvironmentalEvent | null => {
  const events: EnvironmentalEvent[] = [
    { name: '自然災害', impact: -0.3 },
    { name: '政治的混乱', impact: -0.2 },
    { name: '技術革新', impact: 0.2 },
    { name: '経済ブーム', impact: 0.3 }
  ]
  return Math.random() < 0.1 ? events[Math.floor(Math.random() * events.length)] : null
}

// AIプレイヤーの戦略
const aiStrategy = (gameState: GameState, productId: number, difficulty: number) => {
  const product = gameState.products.find(p => p.id === productId)
  if (!product) {
    throw new Error(`Product with id ${productId} not found`)
  }
  const lastDemand = product.demandHistory[product.demandHistory.length - 1] || 0
  const averageDemand = product.demandHistory.length > 0
    ? product.demandHistory.reduce((a, b) => a + b, 0) / product.demandHistory.length
    : lastDemand
  const seasonalFactor = gameState.seasonalFactors[gameState.currentSeason]
  const lifecycleFactor = productLifecycle[product.lifecycle].growth - productLifecycle[product.lifecycle].decline

  const forecastDemand = averageDemand * seasonalFactor * (1 + lifecycleFactor)
  const desiredInventory = forecastDemand * (1 + (0.2 * difficulty)) // 難易度に応じて安全在庫を増やす

  let order = Math.max(0, desiredInventory - product.inventory[0])

  // 生産能力と予算の制限を考慮
  order = Math.min(order, gameState.players[0].productionCapacity, Math.floor(gameState.players[0].budget / 10))

  return Math.round(order)
}

// チュートリアルコンポーネント
interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>SCMゲームチュートリアル</CardTitle>
    </CardHeader>
    <CardContent>
      <p>SCMゲームへようこそ！以下が基本ルールです：</p>
      <ul className="list-disc pl-5 mt-2">
        <li>複数の製品を異なる倉庫で管理します。</li>
        <li>各ターンで需要を予測し、発注を行います。</li>
        <li>在庫保持コストと欠品ペナルティのバランスを取ります。</li>
        <li>予算と生産能力の制限内で運営します。</li>
        <li>季節変動や競合他社の影響を考慮します。</li>
        <li>製品のライフサイクルを管理し、新製品の開発や既存製品の改良を行います。</li>
        <li>グローバル市場で事業を展開し、為替レートや輸送コストを考慮します。</li>
        <li>複数のサプライヤーから選択し、長期契約を締結します。</li>
        <li>自然災害や政治的イベントなどの環境要因に対応します。</li>
        <li>他のプレイヤーと取引や合併を行い、協力または競争します。</li>
      </ul>
      <Button onClick={onClose} className="mt-4">ゲーム開始</Button>
    </CardContent>
  </Card>
)

interface FinancialReportProps {
  gameState: GameState;
  playerId: number;
}

// 財務報告書コンポーネント
const FinancialReport: React.FC<FinancialReportProps> = ({ gameState, playerId }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>財務報告書 - プレイヤー {playerId + 1}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>総収益: ${gameState.players[playerId].revenue}</p>
      <p>総費用: ${gameState.players[playerId].expenses}</p>
      <p>純利益: ${gameState.players[playerId].revenue - gameState.players[playerId].expenses}</p>
      <p>在庫保持コスト: ${gameState.players[playerId].holdingCost}</p>
      <p>欠品ペナルティ: ${gameState.players[playerId].stockoutPenalty}</p>
      <p>注文コスト: ${gameState.players[playerId].orderCost}</p>
      <p>研究開発投資: ${gameState.players[playerId].rdInvestment}</p>
      <p>設備投資: ${gameState.players[playerId].facilityInvestment}</p>
      <p>国際取引損益: ${gameState.players[playerId].foreignExchangeGain}</p>
    </CardContent>
  </Card>
)

interface PlayerComponentProps {
  gameState: GameState;
  playerId: number;
  onOrderChange: (playerId: number, productId: number, value: number) => void;
  onInvestmentChange: (playerId: number, type: 'rd' | 'facility', value: number) => void;
  onSupplierChange: (playerId: number, productId: number, supplierId: number) => void;
  onTradeOffer: (from: number, to: number) => void;
}

// プレイヤーコンポーネント
const PlayerComponent: React.FC<PlayerComponentProps> = ({ gameState, playerId, onOrderChange, onInvestmentChange, onSupplierChange, onTradeOffer }) => (
  <Card className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
    <CardHeader>
      <CardTitle>プレイヤー {playerId + 1}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>予算: ${gameState.players[playerId].budget}</p>
      <p>スコア: {gameState.players[playerId].score}</p>
      <p>生産能力: {gameState.players[playerId].productionCapacity}</p>
      {gameState.products.map(product => (
        <div key={product.id} className="mt-4">
          <h3 className="font-bold">{product.name} ({product.lifecycle})</h3>
          <p>在庫: {product.inventory[playerId]}</p>
          <p>前回の需要: {product.demandHistory[product.demandHistory.length - 1] || 0}</p>
          <Input
            type="number"
            value={product.orders[playerId]}
            onChange={(e) => onOrderChange(playerId, product.id, Number(e.target.value))}
            placeholder="発注量を入力"
            className="w-40 mt-2"
          />
          <Select onValueChange={(value) => onSupplierChange(playerId, product.id, Number(value))}>
            <SelectTrigger className="w-40 mt-2">
              <SelectValue placeholder="サプライヤーを選択" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map(supplier => (
                <SelectItem key={supplier.id} value={supplier.id.toString()}>{supplier.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      <div className="mt-4">
        <h3 className="font-bold">投資</h3>
        <Input
          type="number"
          value={gameState.players[playerId].rdInvestment}
          onChange={(e) => onInvestmentChange(playerId, 'rd', Number(e.target.value))}
          placeholder="研究開発投資"
          className="w-40 mt-2"
        />
        <Input
          type="number"
          value={gameState.players[playerId].facilityInvestment}
          onChange={(e) => onInvestmentChange(playerId, 'facility', Number(e.target.value))}
          placeholder="設備投資"
          className="w-40 mt-2"
        />
      </div>
      <div className="mt-4">
        <h3 className="font-bold">プレイヤー間取引</h3>
        <Select onValueChange={(value) => onTradeOffer(playerId, Number(value))}>
          <SelectTrigger className="w-40 mt-2">
            <SelectValue placeholder="取引相手を選択" />
          </SelectTrigger>
          <SelectContent>
            {gameState.players.map((_, index) => (
              index !== playerId && <SelectItem key={index} value={index.toString()}>プレイヤー {index + 1}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  </Card>
)

interface Player {
  budget: number;
  score: number;
  productionCapacity: number;
  revenue: number;
  expenses: number;
  holdingCost: number;
  stockoutPenalty: number;
  orderCost: number;
  rdInvestment: number;
  facilityInvestment: number;
  foreignExchangeGain: number;
}

interface Product {
  id: number;
  name: string;
  inventory: number[];
  demandHistory: number[];
  orders: number[];
  lifecycle: Lifecycle;
  supplier: number;
}

interface TradeOffer {
  from: number;
  to: number;
  amount: number;
}

interface GameState {
  turn: number;
  currentSeason: Season;
  seasonalFactors: Record<Season, number>;
  products: Product[];
  players: Player[];
  aiScore: number;
  environmentalEvent: EnvironmentalEvent | null;
  tradeOffers: TradeOffer[];
}

// メインのゲームコンポーネント
export function AdvancedScmGame() {
  const [showTutorial, setShowTutorial] = useState<boolean>(true)
  const [gameMode, setGameMode] = useState<'easy' | 'normal' | 'hard'>('normal')
  const [playerCount, setPlayerCount] = useState<number>(1)
  const [gameState, setGameState] = useState<GameState>({
    turn: 1,
    currentSeason: 'spring',
    seasonalFactors: { spring: 1, summer: 1.2, autumn: 0.9, winter: 0.7 },
    products: [
      { id: 1, name: '製品A', inventory: [50], demandHistory: [], orders: [0], lifecycle: 'introduction', supplier: 1 },
      { id: 2, name: '製品B', inventory: [50], demandHistory: [], orders: [0], lifecycle: 'growth', supplier: 2 },
    ],
    players: [
      { budget: 1000, score: 0, productionCapacity: 100, revenue: 0, expenses: 0, holdingCost: 0, stockoutPenalty: 0, orderCost: 0, rdInvestment: 0, facilityInvestment: 0, foreignExchangeGain: 0 }
    ],
    aiScore: 0,
    environmentalEvent: null,
    tradeOffers: [],
  })

  const updateGameState = useCallback((updates: Partial<GameState> | ((prevState: GameState) => GameState)) => {
    setGameState(prevState => {
      const newState = typeof updates === 'function' ? updates(prevState) : { ...prevState, ...updates }
      return {
        ...newState,
        products: newState.products.map(product => ({
          ...product,
          inventory: [...product.inventory],
          orders: [...product.orders],
        })),
        players: newState.players.map(player => ({ ...player })),
      }
    })
  }, [])

  const nextTurn = useCallback(() => {
    setGameState(prevState => {
      const newState: GameState = { ...prevState }
      newState.turn += 1
      newState.currentSeason = ['spring', 'summer', 'autumn', 'winter'][newState.turn % 4] as Season
      newState.environmentalEvent = simulateEnvironmentalEvent()

      newState.products.forEach(product => {
        const baselineDemand = 20
        const seasonalFactor = newState.seasonalFactors[newState.currentSeason]
        const lifecycleFactor = productLifecycle[product.lifecycle].growth - productLifecycle[product.lifecycle].decline
        const environmentalFactor = newState.environmentalEvent ? 1 + newState.environmentalEvent.impact : 1

        newState.players.forEach((player, index) => {
          const country = ['USA', 'Japan', 'EU', 'China'][index % 4] as Country
          const globalDemand = simulateGlobalMarket(baselineDemand, country)
          const demand = Math.round(globalDemand * seasonalFactor * (1 + lifecycleFactor) * environmentalFactor)
          product.demandHistory.push(demand)

          const supplier = suppliers.find(s => s.id === product.supplier)!
          const newInventory = Math.max(0, product.inventory[index] + Number(product.orders[index]) * supplier.reliability - demand)
          const revenue = Math.min(demand, product.inventory[index]) * 20 * supplier.quality // 1単位あたり20の売上、品質による調整
          const holdingCost = newInventory * 0.5
          const stockoutPenalty = Math.max(0, demand - product.inventory[index]) * 2
          const orderCost = Number(product.orders[index]) * 10 * supplier.cost

          player.budget = Math.min(player.budget - orderCost + revenue, 2000) // 予算の上限
          player.revenue += revenue
          player.expenses += holdingCost + stockoutPenalty + orderCost
          player.holdingCost += holdingCost
          player.stockoutPenalty += stockoutPenalty
          player.orderCost += orderCost
          player.score += revenue - holdingCost - stockoutPenalty - orderCost
          player.foreignExchangeGain += revenue * (Math.random() * 0.1 - 0.05) // -5%から+5%の為替変動

          product.inventory[index] = newInventory
          product.orders[index] = 0
        })

        // 製品ライフサイクルの更新
        if (Math.random() < 0.1) {
          const lifecycles: Lifecycle[] = ['introduction', 'growth', 'maturity', 'decline']
          const currentIndex = lifecycles.indexOf(product.lifecycle)
          product.lifecycle = lifecycles[Math.min(currentIndex + 1, lifecycles.length - 1)]
        }

        // AI player
        const aiOrder = aiStrategy(newState, product.id, gameMode === 'hard' ? 2 : gameMode === 'normal' ? 1 : 0.5)
        const aiInventory = Math.max(0, product.inventory[0] + aiOrder - product.demandHistory[product.demandHistory.length - 1])
        const aiRevenue = Math.min(product.demandHistory[product.demandHistory.length - 1], product.inventory[0]) * 20
        const aiHoldingCost = aiInventory * 0.5
        const aiStockoutPenalty = Math.max(0, product.demandHistory[product.demandHistory.length - 1] - product.inventory[0]) * 2
        const aiOrderCost = aiOrder * 10

        newState.aiScore += aiRevenue - aiHoldingCost - aiStockoutPenalty - aiOrderCost
      })

      // 長期的な戦略要素の効果を適用
      newState.players.forEach(player => {
        player.productionCapacity += Math.floor(player.facilityInvestment / 100) // 100ごとに生産能力1増加
        player.budget -= player.rdInvestment + player.facilityInvestment
        player.expenses += player.rdInvestment + player.facilityInvestment
        player.rdInvestment = 0
        player.facilityInvestment = 0
      })

      // プレイヤー間取引の処理
      newState.tradeOffers.forEach(offer => {
        const { from, to, amount } = offer
        if (newState.players[from].budget >= amount) {
          newState.players[from].budget -= amount
          newState.players[to].budget += amount
        }
      })
      newState.tradeOffers = []

      return newState
    })
  }, [gameMode])

  const handleOrderChange = useCallback((playerId: number, productId: number, value: number) => {
    updateGameState(prevState => {
      const newProducts = prevState.products.map(product =>
        product.id === productId
          ? { ...product, orders: product.orders.map((order, index) => index === playerId ? Number(value) : order) }
          : product
      )
      return { ...prevState, products: newProducts }
    })
  }, [updateGameState])

  const handleInvestmentChange = useCallback((playerId: number, type: 'rd' | 'facility', value: number) => {
    updateGameState(prevState => {
      const newPlayers = prevState.players.map((player, index) =>
        index === playerId
          ? { ...player, [type === 'rd' ? 'rdInvestment' : 'facilityInvestment']: Number(value) }
          : player
      )
      return { ...prevState, players: newPlayers }
    })
  }, [updateGameState])

  const handleSupplierChange = useCallback((playerId: number, productId: number, supplierId: number) => {
    updateGameState(prevState => {
      const newProducts = prevState.products.map(product =>
        product.id === productId
          ? { ...product, supplier: supplierId }
          : product
      )
      return { ...prevState, products: newProducts }
    })
  }, [updateGameState])

  const handleTradeOffer = useCallback((from: number, to: number) => {
    updateGameState(prevState => ({
      ...prevState,
      tradeOffers: [...prevState.tradeOffers, { from, to, amount: 100 }] // 仮の取引額
    }))
  }, [updateGameState])

  // グラフデータの準備
  const chartData = {
    labels: Array.from({ length: gameState.turn }, (_, i) => i + 1),
    datasets: gameState.products.map(product => ({
      label: `${product.name}の需要`,
      data: product.demandHistory,
      borderColor: product.id === 1 ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)',
      tension: 0.1
    }))
  }

  useEffect(() => {
    // プレイヤー数が変更されたときの処理
    const playerDiff = playerCount - gameState.players.length
    if (playerDiff > 0) {
      // プレイヤーを追加
      updateGameState(prevState => ({
        ...prevState,
        players: [
          ...prevState.players,
          ...Array(playerDiff).fill(null).map(() => ({
            budget: 1000, score: 0, productionCapacity: 100, revenue: 0, expenses: 0,
            holdingCost: 0, stockoutPenalty: 0, orderCost: 0, rdInvestment: 0, facilityInvestment: 0, foreignExchangeGain: 0
          }))
        ],
        products: prevState.products.map(product => ({
          ...product,
          inventory: [...product.inventory, ...Array(playerDiff).fill(50)],
          orders: [...product.orders, ...Array(playerDiff).fill(0)],
        }))
      }))
    } else if (playerDiff < 0) {
      // プレイヤーを削除
      updateGameState(prevState => ({
        ...prevState,
        players: prevState.players.slice(0, playerCount),
        products: prevState.products.map(product => ({
          ...product,
          inventory: product.inventory.slice(0, playerCount),
          orders: product.orders.slice(0, playerCount),
        }))
      }))
    }
  }, [playerCount, updateGameState, gameState.players.length])

  return (
    <div className="container mx-auto p-4">
      {showTutorial ? (
        <Tutorial onClose={() => setShowTutorial(false)} />
      ) : (
        <>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>SCMゲーム - ターン {gameState.turn}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>現在の季節: {gameState.currentSeason}</p>
              <p>環境イベント: {gameState.environmentalEvent ? gameState.environmentalEvent.name : 'なし'}</p>
              <p>AIスコア: {gameState.aiScore}</p>
              <div className="flex space-x-2 mt-2">
                <Select value={gameMode} onValueChange={(value) => setGameMode(value as 'easy' | 'normal' | 'hard')}>
                  <SelectTrigger>
                    <SelectValue placeholder="ゲームモード" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">簡単</SelectItem>
                    <SelectItem value="normal">普通</SelectItem>
                    <SelectItem value="hard">難しい</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={playerCount.toString()} onValueChange={(value) => setPlayerCount(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="プレイヤー数" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1人</SelectItem>
                    <SelectItem value="2">2人</SelectItem>
                    <SelectItem value="3">3人</SelectItem>
                    <SelectItem value="4">4人</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="players">
            <TabsList>
              <TabsTrigger value="players">プレイヤー</TabsTrigger>
              <TabsTrigger value="market">市場</TabsTrigger>
              <TabsTrigger value="finance">財務</TabsTrigger>
            </TabsList>
<TabsContent value="players">
  <div className="flex flex-wrap">
    {gameState.players.map((_, index) => (
      <PlayerComponent
        key={index}
        gameState={gameState}
        playerId={index}
        onOrderChange={handleOrderChange}
        onInvestmentChange={handleInvestmentChange}
        onSupplierChange={handleSupplierChange}
        onTradeOffer={handleTradeOffer}
      />
    ))}
  </div>
</TabsContent>
            <TabsContent value="market">
              <Card>
                <CardContent>
                  <Line data={chartData} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="finance">
              {gameState.players.map((_, index) => (
                <FinancialReport key={index} gameState={gameState} playerId={index} />
              ))}
            </TabsContent>
          </Tabs>

          <Button onClick={nextTurn} className="mt-4">次のターン</Button>
        </>
      )}
    </div>
  )
}

import { useState } from "react"
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const monthlyData = [
  { month: "January", income: 5200, expenses: 3750, savings: 1450, year: 2024 },
  { month: "February", income: 5200, expenses: 3200, savings: 2000, year: 2024 },
  { month: "March", income: 5500, expenses: 4100, savings: 1400, year: 2024 },
  { month: "April", income: 5200, expenses: 3850, savings: 1350, year: 2024 },
  { month: "May", income: 5200, expenses: 3950, savings: 1250, year: 2024 },
  { month: "June", income: 5700, expenses: 4200, savings: 1500, year: 2024 },
  { month: "July", income: 5200, expenses: 3600, savings: 1600, year: 2024 },
  { month: "August", income: 5200, expenses: 4000, savings: 1200, year: 2024 },
  { month: "September", income: 5400, expenses: 3800, savings: 1600, year: 2024 },
  { month: "October", income: 5200, expenses: 3900, savings: 1300, year: 2024 },
  { month: "November", income: 5200, expenses: 4100, savings: 1100, year: 2024 },
  { month: "December", income: 5800, expenses: 4500, savings: 1300, year: 2024 },
]

export default function MonthlyReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState("November")
  const [selectedYear, setSelectedYear] = useState("2024")

  const currentMonthIndex = monthlyData.findIndex(
    (data) => data.month === selectedMonth && data.year.toString() === selectedYear
  )
  const currentMonthData = monthlyData[currentMonthIndex]
  const previousMonthData = currentMonthIndex > 0 ? monthlyData[currentMonthIndex - 1] : null

  const balancePreviousMonth = previousMonthData ? previousMonthData.income - previousMonthData.expenses : 0
  const totalRevenue = currentMonthData ? currentMonthData.income : 0
  const totalExpenses = currentMonthData ? currentMonthData.expenses : 0
  const currentBalance = totalRevenue + balancePreviousMonth - totalExpenses

  const summaryItems = [
    {
      title: "Saldo mês anterior",
      value: balancePreviousMonth,
      icon: <DollarSign className="h-5 w-5 text-blue-600" />,
      color: "text-blue-600"
    },
    {
      title: "Total de receita",
      value: totalRevenue,
      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      color: "text-green-600"
    },
    {
      title: "Total de despesas",
      value: totalExpenses,
      icon: <TrendingDown className="h-5 w-5 text-red-600" />,
      color: "text-red-600"
    },
    {
      title: "Saldo atual",
      value: currentBalance,
      icon: <DollarSign className="h-5 w-5 text-purple-600" />,
      color: "text-purple-600"
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 flex-col gap-8 p-6 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="border rounded-lg shadow p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Relatório Mensal</h2>
          <p className="text-sm text-gray-500">Selecione um mês e ano para visualizar os relatórios financeiros</p>

          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border p-2 rounded w-full md:w-44"
              aria-label="Selecionar mês"
            >
              {monthlyData.map((data) => (
                <option key={data.month} value={data.month}>
                  {data.month}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border p-2 rounded w-full md:w-28"
              aria-label="Selecionar ano"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        {currentMonthData && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
            {summaryItems.map((item) => (
              <div key={item.title} className="border rounded-lg overflow-hidden shadow-lg p-6 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  {item.icon}
                </div>
                <div className={`text-3xl font-bold ${item.color} mt-2`}>
                  {typeof item.value === "number" ? `$${item.value.toLocaleString()}` : item.value}
                </div>
                <p className="text-xs text-gray-500">{`${selectedMonth} ${selectedYear}`}</p>
              </div>
            ))}
          </div>
        )}

        {/* Line Chart */}
        <div className="border rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold">Tendência Financeira Anual</h2>
          <p className="text-sm text-gray-500">Receitas, despesas e poupança ao longo do ano</p>

          <div className="h-96 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [`$${value}`, name]} />
                <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} name="Receita" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Despesas" />
                <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} name="Poupança" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

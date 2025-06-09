import { useEffect, useState, useCallback } from "react"
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import AddTransactionButton from '../../components/AddTransactionButton';
import DateFilter from '../../components/DateFilter';
import Header from '../../components/Header';
import MonthSwitcher from '../../components/MonthSwitcher';
import { useDateFilter } from '../../routes/DateFilterContext';

export default function MonthlyReportsPage() {
  const { date } = useDateFilter();
  const userId = localStorage.getItem('userId');

  const [rawMonthlyData, setRawMonthlyData] = useState<{ month: string, income: number, expenses: number, savings: number, year: number }[]>([]);
  const [prevDecemberSavings, setPrevDecemberSavings] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar dados do ano atual e saldo de dezembro do ano anterior
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    if (!userId) {
      setRawMonthlyData([]);
      setPrevDecemberSavings(0);
      setIsLoading(false);
      return;
    }

    // Busca dados do ano atual
    let currentYearData: { month: string, income: number, expenses: number, savings: number, year: number }[] = [];
    try {
      const res = await fetch(`http://localhost:3000/api/transactions/monthly-report/${userId}?year=${date.year}`);
      if (res.ok) {
        const data = await res.json();
        currentYearData = data.monthlyData || [];
        setRawMonthlyData(currentYearData);
      } else {
        setRawMonthlyData([]);
      }
    } catch {
      setRawMonthlyData([]);
    }

    // Sempre busca saldo de dezembro do ano anterior
    try {
      const prevRes = await fetch(`http://localhost:3000/api/transactions/monthly-report/${userId}?year=${date.year - 1}`);
      if (prevRes.ok) {
        const prevData = await prevRes.json();
        const prevYearMonthly = prevData.monthlyData || [];
        const dec = prevYearMonthly[11]; // dezembro é índice 11
        setPrevDecemberSavings(dec ? dec.savings : 0);
      } else {
        setPrevDecemberSavings(0);
      }
    } catch {
      setPrevDecemberSavings(0);
    }

    setIsLoading(false);
  }, [date, userId]);

  useEffect(() => {
    fetchAllData();
  }, [date, userId, fetchAllData]);

  // Monta o monthlyData com savings corrigidos usando saldo inicial de dezembro
  const monthlyData = (() => {
    // Copia para não alterar state diretamente
    const arr = [...rawMonthlyData];
    let accSavings = prevDecemberSavings;
    return arr.map((entry) => {
      accSavings += (entry.income || 0) - (entry.expenses || 0);
      return {
        ...entry,
        savings: accSavings
      };
    });
  })();

  // Para o gráfico: insere um ponto inicial "Saldo anterior" se houver saldo herdado
  const chartData = (() => {
    if (prevDecemberSavings !== 0) {
      return [
        {
          month: 'Saldo anterior',
          income: 0,
          expenses: 0,
          savings: prevDecemberSavings,
          year: date.year
        },
        ...monthlyData
      ];
    }
    return monthlyData;
  })();

  // Lógica dos cards
  const idx = date.month - 1; // date.month: 1=Jan, 2=Fev, ..., 12=Dez
  const currentMonthData = monthlyData[idx] ?? null;
  const previousMonthData =
    idx === 0
      ? null
      : monthlyData[idx - 1] ?? null;

  // Saldo mês anterior (card)
  const balancePreviousMonth =
    idx === 0
      ? prevDecemberSavings // Janeiro: saldo de dezembro do ano anterior
      : previousMonthData
        ? previousMonthData.savings
        : 0;
  const totalRevenue = currentMonthData ? currentMonthData.income : 0;
  const totalExpenses = currentMonthData ? currentMonthData.expenses : 0;
  const currentBalance = totalRevenue + balancePreviousMonth - totalExpenses;

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
    <>
      <Header />
      <AddTransactionButton onTransactionAdded={fetchAllData} />
      <DateFilter />

      {/* MonthSwitcher centralizado com espaçamento controlado */}
      <div className="flex justify-center items-center w-full mt-8 mb-0">
        <MonthSwitcher />
      </div>

      <div className="min-h-screen flex flex-col bg-gray-50 max-w-screen-xl mx-auto">
        <div className="flex flex-1 flex-col gap-8 p-6">

          {/* Summary Cards */}
          {isLoading ? (
            <div className="w-full flex justify-center items-center py-8">
              <span className="text-gray-400">Carregando...</span>
            </div>
          ) : currentMonthData && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-10/12 mx-auto">
              {summaryItems.map((item) => (
                <div key={item.title} className="border rounded-lg overflow-hidden shadow-lg p-6 hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    {item.icon}
                  </div>
                  <div className={`text-3xl font-bold ${item.color} mt-2`}>
                    {typeof item.value === "number" ? `R$${item.value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : item.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Line Chart */}
          <div className="border rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold">Tendência Financeira Anual - {date.year}</h2>
            <p className="text-sm text-gray-500">Receitas, despesas e poupança ao longo do ano</p>

            <div className="h-96 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`R$${Number(value).toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2})}`, name]} />
                  <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} name="Receita" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Despesas" />
                  <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} name="Poupança" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

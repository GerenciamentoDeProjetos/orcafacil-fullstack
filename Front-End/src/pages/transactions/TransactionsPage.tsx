"use client"

import { useEffect, useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, Search, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import Header from "../../components/Header"
import AddTransactionButton from "../../components/AddTransactionButton"
import DateFilter from "../../components/DateFilter"
import MonthSwitcher from "../../components/MonthSwitcher"
import { useDateFilter } from '../../routes/DateFilterContext';

const transactions = [
  {
    id: 1,
    date: "2024-01-15",
    description: "Grocery Store",
    category: "Food & Dining",
    amount: -85.5,
    type: "expense",
  },
  { id: 2, date: "2024-01-15", description: "Salary Deposit", category: "Income", amount: 3500.0, type: "income" },
  { id: 3, date: "2024-01-14", description: "Gas Station", category: "Transportation", amount: -45.2, type: "expense" },
  {
    id: 4,
    date: "2024-01-14",
    description: "Netflix Subscription",
    category: "Entertainment",
    amount: -15.99,
    type: "expense",
  },
  { id: 5, date: "2024-01-13", description: "Coffee Shop", category: "Food & Dining", amount: -12.5, type: "expense" },
  { id: 6, date: "2024-01-12", description: "Freelance Payment", category: "Income", amount: 750.0, type: "income" },
  {
    id: 7,
    date: "2024-01-12",
    description: "Electric Bill",
    category: "Bills & Utilities",
    amount: -120.0,
    type: "expense",
  },
  { id: 8, date: "2024-01-11", description: "Restaurant", category: "Food & Dining", amount: -65.3, type: "expense" },
  { id: 9, date: "2024-01-10", description: "Online Shopping", category: "Shopping", amount: -89.99, type: "expense" },
  {
    id: 10,
    date: "2024-01-09",
    description: "Movie Tickets",
    category: "Entertainment",
    amount: -24.0,
    type: "expense",
  },
]

const categories = [
  "All",
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Bills & Utilities",
  "Shopping",
  "Income",
]

const TransactionsPage = () => {
  const { date } = useDateFilter();

  const userId = localStorage.getItem('userId');

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("All")

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || transaction.category === selectedCategory
    const matchesType = selectedType === "All" || transaction.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = Math.abs(transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0))
  const netAmount = totalIncome - totalExpenses

  const formatCurrency = (amount: number | bigint) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const fetchAllData = () => {

  };

  useEffect(() => {
          fetchAllData();
          // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, userId]);

  return (
    <>
      <Header />
      <AddTransactionButton onTransactionAdded={fetchAllData} />
      <DateFilter />

      {/* MonthSwitcher centralizado com espaçamento controlado */}
      <div className="flex justify-center items-center w-full mt-8 mb-0">
          <MonthSwitcher />
      </div>

      <div className="min-h-screen bg-gradient-to-br mt-0">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Transações Financeiras</h1>
            <p className="text-gray-600 text-lg">Gerencie suas finanças de forma inteligente</p>
          </div> */}

          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {/* Income Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <ArrowUpIcon className="h-5 w-5 opacity-80 text-green-600" />
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">Renda Total</h3>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
              </div>
            </div>

            {/* Expenses Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                  <ArrowDownIcon className="h-5 w-5 opacity-80 text-red-600" />
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">Despesas Totais</h3>
                <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>

            {/* Net Amount Card */}
            <div
              className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <DollarSign className="h-6 w-6 text-gray-800" />
                  </div>
                  {netAmount >= 0 ? (
                    <ArrowUpIcon className="h-5 w-5 opacity-80 text-green-600" />
                  ) : (
                    <ArrowDownIcon className="h-5 w-5 opacity-80 text-red-600" />
                  )}
                </div>
                <h3 className="text-sm font-medium opacity-90 mb-1">Valor Líquido</h3>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(netAmount)}</p>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar transações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 min-w-[160px]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All" ? "Todas Categorias" : category}
                    </option>
                  ))}
                </select>

                {/* Type Filter */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 min-w-[140px]"
                >
                  <option value="All">Todos Tipos</option>
                  <option value="income">Renda</option>
                  <option value="expense">Despesa</option>
                </select>
              </div>

              {/* Add Transaction Button */}
              {/* <button className="flex items-center gap-2 bg-gradient-to-br from-green-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-gren-500 hover:to-green-500 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
              <Plus className="h-5 w-5" />
              Adicionar Transação
              </button> */}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-900">Data</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Descrição</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Categoria</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Tipo</th>
                    <th className="text-right p-4 font-semibold text-gray-900">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-8 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-12 w-12 text-gray-300" />
                          <p className="text-lg font-medium">Nenhuma transação encontrada</p>
                          <p className="text-sm">Tente ajustar seus filtros de pesquisa</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((transaction, index) => (
                      <tr
                        key={transaction.id}
                        className={`hover:bg-blue-50/50 transition-colors duration-150 border-b border-gray-100 ${index % 2 === 0 ? "bg-white/50" : "bg-gray-50/30"
                          }`}
                      >
                        <td className="p-4 text-gray-700 font-medium">{formatDate(transaction.date)}</td>
                        <td className="p-4 text-gray-900 font-medium">{transaction.description}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {transaction.category}
                          </span>
                        </td>
                        <td className="p-4">
                          {transaction.type === "income" ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <ArrowUpIcon className="h-3 w-3" />
                              Renda
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <ArrowDownIcon className="h-3 w-3" />
                              Despesa
                            </span>
                          )}
                        </td>
                        <td
                          className={`p-4 text-right font-bold text-lg ${transaction.type === "income" ? "text-green-600" : "text-red-600"
                            }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TransactionsPage

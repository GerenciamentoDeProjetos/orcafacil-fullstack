import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import AddTransactionButton from './AddTransactionButton';
import DateFilter from '../../components/DateFilter';
import { useDateFilter } from '../../routes/DateFilterContext';
import { Wallet } from 'lucide-react';
import { HiChartBar } from 'react-icons/hi';
import { motion } from 'framer-motion';

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const Dashboard = () => {
    const { date } = useDateFilter();
    const [balanceData, setBalanceData] = useState({
        total_income: 0,
        total_expense: 0,
        balance: 0,
    });
    const userId = localStorage.getItem('userId');

    const fetchBalance = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/transactions/balance/${userId}?month=${date.month}&year=${date.year}`
            );
            if (response.ok) {
                const data = await response.json();
                setBalanceData({
                    total_income: data.total_income,
                    total_expense: data.total_expense,
                    balance: data.balance,
                });
            } else {
                console.error('Erro ao buscar saldo:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar saldo:', error);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, [date, userId]);

    // Variantes de animação para os componentes
    const containerVariants = {
        hidden: { opacity: 0, y: 20 }, // Começa invisível e levemente abaixo
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 }, // Anima filhos em sequência
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 }, // Começa invisível e levemente abaixo
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }, // Animação suave ao aparecer
    };

    return (
        <>
            <Header />
            <AddTransactionButton onTransactionAdded={fetchBalance} />
            <DateFilter />

            {/* Adicionando padding-top para compensar a altura do Header */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 padding p-20 pt-[7rem] bg-gray-50"
                variants={containerVariants} // Variantes para a animação do container
                initial="hidden"
                animate="visible"
            >
                {/* Saldo Atual */}
                <motion.div
                    className={`bg-white p-4 rounded-xl shadow-md flex flex-col justify-between ${
                        balanceData.balance < 0 ? 'border-2 border-red-500' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Saldo Atual</h2>
                        <Wallet className="text-blue-400" />
                    </div>
                    <div
                        className={`mt-4 text-3xl font-bold ${
                            balanceData.balance < 0 ? 'text-red-500' : 'text-gray-900'
                        }`}
                    >
                        R${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(balanceData.balance)}
                    </div>
                    <div className="mt-2 text-sm text-green-600 bg-green-100 w-fit px-2 py-1 rounded-md">
                        {`Saldo até ${months[date.month - 1]} de ${date.year}`}
                    </div>
                    <div className="mt-4 flex justify-between text-sm text-gray-600">
                        <div>
                            <p>Receitas</p>
                            <p className="text-green-600 font-medium">
                                R${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(balanceData.total_income)}
                            </p>
                        </div>
                        <div>
                            <p>Despesas</p>
                            <p className="text-red-500 font-medium">
                                R${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(balanceData.total_expense)}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Despesas Mensais */}
                <motion.div
                    className="bg-white p-6 rounded-xl shadow-md"
                    variants={itemVariants} // Animação individual
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Despesas Mensais <span>{date.year}</span></h2>
                        <HiChartBar className="text-blue-400 w-6 h-6" />
                    </div>
                    <div className="mt-10 flex justify-center items-center text-gray-400">
                        <p>Sem dados disponíveis</p>
                    </div>
                    <div className="mt-8 flex justify-between text-sm text-gray-400">
                        {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map(month => (
                            <span key={month}>{month}</span>
                        ))}
                    </div>
                </motion.div>

                {/* Despesas por Categoria */}
                <motion.div
                    className="bg-white p-6 rounded-xl shadow-md"
                    variants={itemVariants} // Animação individual
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Despesas por Categoria</h2>
                        <HiChartBar className="text-blue-400 w-6 h-6" />
                    </div>
                    {[
                        { label: "Moradia", amount: "R$1.200,00", percent: 33, color: "bg-blue-100", text: "text-blue-500", count: 3 },
                        { label: "Alimentação", amount: "R$850,00", percent: 23, color: "bg-green-100", text: "text-green-500", count: 25 },
                        { label: "Transporte", amount: "R$450,00", percent: 12, color: "bg-yellow-100", text: "text-yellow-500", count: 12 },
                        { label: "Entretenimento", amount: "R$320,00", percent: 9, color: "bg-pink-100", text: "text-pink-400", count: 8 },
                        { label: "Compras", amount: "R$580,00", percent: 16, color: "bg-pink-200", text: "text-pink-600", count: 15 },
                        { label: "Outros", amount: "R$280,00", percent: 8, color: "bg-gray-200", text: "text-gray-500", count: 7 },
                    ].map((item, idx) => (
                        <div key={idx} className="mb-4">
                            <div className="flex justify-between text-sm font-medium text-gray-800">
                                <span>{item.label}</span>
                                <span>{item.amount}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full mt-1 mb-1">
                                <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percent}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span className={`${item.text} font-semibold`}>{item.percent}%</span>
                                <span>{item.count} transações</span>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Transações Recentes */}
                <motion.div
                    className="bg-white p-6 rounded-xl shadow-md"
                    variants={itemVariants} // Animação individual
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Transações Recentes</h2>
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            📅
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="Pesquisar transações..."
                        className="w-full border border-gray-200 rounded-md px-3 py-2 mb-4 text-sm text-gray-600 placeholder-gray-400"
                    />
                    <div className="space-y-4 overflow-y-auto max-h-64 pr-1">
                        {[
                            { title: "Aluguel do Apartamento", category: "Moradia", date: "14 Out, 2023", amount: "-R$1.200,00", color: "text-red-500", icon: "🔴" },
                            { title: "Depósito de Salário", category: "Receitas", date: "11 Out, 2023", amount: "+R$3.500,00", color: "text-green-600", icon: "🟢" },
                            { title: "Compras no Mercado", category: "Alimentação", date: "9 Out, 2023", amount: "-R$125,45", color: "text-red-500", icon: "🔴" },
                            { title: "Corrida de Uber", category: "Transporte", date: "7 Out, 2023", amount: "-R$32,50", color: "text-red-500", icon: "🔴" },
                        ].map((tx, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-xl">{tx.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{tx.title}</p>
                                        <p className="text-xs text-gray-500">{tx.category} • {tx.date}</p>
                                    </div>
                                </div>
                                <div className={`text-sm font-bold ${tx.color}`}>{tx.amount}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default Dashboard;

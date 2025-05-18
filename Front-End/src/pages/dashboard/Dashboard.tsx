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

// Função auxiliar para formatar a data da transação
function formatTransactionDate(day: number, month: number, year: number) {
    if (!day || !month || !year) return '';
    const dia = String(day).padStart(2, '0');
    const mes = months[month - 1].slice(0, 3);
    return `${dia} ${mes}, ${year}`;
}

const Dashboard = () => {
    const { date } = useDateFilter();
    const [balanceData, setBalanceData] = useState({
        total_income: 0,
        total_expense: 0,
        balance: 0,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [search, setSearch] = useState('');
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

    const fetchRecentTransactions = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/transactions/recent/${userId}`
            );
            if (response.ok) {
                const data = await response.json();
                setRecentTransactions(data.transactions || []);
            } else {
                console.error('Erro ao buscar transações recentes:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar transações recentes:', error);
        }
    };

    // Atualiza saldo e transações recentes juntos
    const fetchAllData = () => {
        fetchBalance();
        fetchRecentTransactions();
    };

    useEffect(() => {
        fetchAllData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, userId]);

    // Variantes de animação para os componentes
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    // Ícone e cor baseado se é receita ou despesa
    function getTxVisuals(isIncome: boolean) {
        return isIncome
            ? { icon: "🟢", color: "text-green-600", sign: "+" }
            : { icon: "🔴", color: "text-red-500", sign: "-" };
    }

    // Filtra transações conforme busca instantânea (case insensitive)
    const filteredTransactions = recentTransactions.filter(
        tx => tx.title.toLowerCase().includes(search.trim().toLowerCase())
    );

    return (
        <>
            <Header />
            <AddTransactionButton onTransactionAdded={fetchAllData} />
            <DateFilter />

            {/* Adicionando padding-top para compensar a altura do Header */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 padding p-20 pt-[7rem] bg-gray-50"
                variants={containerVariants}
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
                    variants={itemVariants}
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
                    variants={itemVariants}
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
                    variants={itemVariants}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Transações Recentes</h2>
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            📅
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Pesquisar transações..."
                            className="w-full border border-gray-200 rounded-md px-3 py-2 mb-4 text-sm text-gray-600 placeholder-gray-400 pr-10"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                type="button"
                                className="absolute right-4 top-2 text-gray-400 hover:text-gray-600"
                                onClick={() => setSearch('')}
                                tabIndex={-1}
                                aria-label="Limpar pesquisa"
                            >
                                &#10005;
                            </button>
                        )}
                    </div>
                    <div className="space-y-4 overflow-y-auto max-h-96 pr-1">
                        {filteredTransactions.length === 0 && (
                            <div className="text-center text-gray-400">Nenhuma transação encontrada.</div>
                        )}
                        {filteredTransactions.map((tx, idx) => {
                            const { icon, color, sign } = getTxVisuals(tx.is_income);
                            const valor = `${sign}R$${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(Number(tx.amount)))}`;
                            const dateStr = formatTransactionDate(tx.transaction_day, tx.transaction_month, tx.transaction_year);
                            return (
                                <div key={tx.id ?? idx} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                            <span className="text-xl">{icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{tx.title}</p>
                                            <p className="text-xs text-gray-500">{tx.category} • {dateStr}</p>
                                        </div>
                                    </div>
                                    <div className={`text-sm font-bold ${color}`}>{valor}</div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default Dashboard;

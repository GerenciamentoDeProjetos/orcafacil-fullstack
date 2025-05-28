/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Header from '../../components/Header';
import AddTransactionButton from '../../components/AddTransactionButton';
import DateFilter from '../../components/DateFilter';
import MonthSwitcher from '../../components/MonthSwitcher';
import { useDateFilter } from '../../routes/DateFilterContext';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const categoryBarColors = [
    { color: "bg-green-200", text: "text-green-600" },       // Verde claro
    { color: "bg-cyan-200", text: "text-cyan-600" },         // Azul ciano
    { color: "bg-red-300", text: "text-red-600" },           // Vermelho
    { color: "bg-yellow-200", text: "text-yellow-600" },     // Amarelo
    { color: "bg-purple-200", text: "text-purple-600" },     // Roxo
    { color: "bg-blue-400", text: "text-blue-900" },         // Azul escuro
    { color: "bg-green-700", text: "text-green-900" },       // Verde escuro
    { color: "bg-pink-200", text: "text-pink-600" },         // Rosa
];

function getCategoryBarColor(index: number) {
    return categoryBarColors[index % categoryBarColors.length];
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Loader = () => (
    <div className="flex justify-center items-center h-[350px]">
        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
    </div>
);

const ReportCategoryPage = () => {
    const { date } = useDateFilter();

    const userId = localStorage.getItem('userId');

    const [expenseData, setExpenseData] = useState<any[] | null>(null);
    const [incomeData, setIncomeData] = useState<any[] | null>(null);
    const [loadingExpense, setLoadingExpense] = useState(false);
    const [loadingIncome, setLoadingIncome] = useState(false);

    // Fetch despesas por categoria do mês/ano
    const fetchExpenseData = async () => {
        setLoadingExpense(true);
        try {
            const res = await fetch(
                `http://localhost:3000/api/transactions/category-by-month/${userId}?year=${date.year}&month=${date.month}&type=expense`
            );
            if (res.ok) {
                const data = await res.json();
                setExpenseData(data.categoryData || []);
            } else {
                setExpenseData([]);
            }
        } catch (e) {
            console.error('Failed to fetch expense data:', e);
            setExpenseData([]);
        }
        setTimeout(() => setLoadingExpense(false), 600);
    };

    // Fetch receitas por categoria do mês/ano
    const fetchIncomeData = async () => {
        setLoadingIncome(true);
        try {
            const res = await fetch(
                `http://localhost:3000/api/transactions/category-by-month/${userId}?year=${date.year}&month=${date.month}&type=income`
            );
            if (res.ok) {
                const data = await res.json();
                setIncomeData(data.categoryData || []);
            } else {
                setIncomeData([]);
            }
        } catch (e) {
            console.error('Failed to fetch income data:', e);
            setIncomeData([]);
        }
        setTimeout(() => setLoadingIncome(false), 600);
    };

    const fetchAllData = () => {
        fetchExpenseData();
        fetchIncomeData();
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

            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-8 pt-2 pb-8 mt-0 bg-gray-50 max-w-screen-xl mx-auto"
                initial="hidden"
                animate="visible"
            >
                {/* Despesas por Categoria */}
                <motion.div
                    className="bg-white p-6 rounded-xl shadow-md"
                    variants={itemVariants}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {`Despesas por categoria - ${months[date.month - 1]} de ${date.year}`}
                        </h2>
                        <HiTrendingDown className="text-red-400 w-6 h-6" />
                    </div>
                    <div
                        className={`space-y-4 ${expenseData && expenseData.length > 6 ? 'overflow-x-auto max-w-full flex-nowrap flex pr-6' : ''}`}
                        style={{ maxHeight: 450, minHeight: 450 }}
                    >
                        {loadingExpense || !expenseData ? (
                            <Loader />
                        ) : (
                            expenseData.length === 0 ? (
                                <div className="text-center text-gray-400">Nenhuma categoria encontrada.</div>
                            ) : (
                                expenseData.map((item, idx) => {
                                    const { color, text } = getCategoryBarColor(idx);
                                    return (
                                        <div
                                            key={item.category}
                                            className={`mb-4 min-w-[220px] ${expenseData.length > 6 ? 'mr-4' : ''}`}
                                            style={{ flex: expenseData.length > 6 ? '0 0 220px' : undefined }}
                                        >
                                            <div className="flex justify-between items-center text-sm font-medium text-gray-800 mb-1">
                                                <span>{item.category}</span>
                                                <span className="font-semibold text-base text-gray-900">
                                                    R${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.total)}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2 rounded-full mb-2">
                                                <div className={`h-2 rounded-full ${color}`} style={{ width: `${item.percent}%` }}></div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className={`${text} font-semibold text-xs`}>{item.percent}%</span>
                                                <span className="text-xs text-gray-500">{item.count} transaç{item.count === 1 ? 'ão' : 'ões'}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )
                        )}
                    </div>
                </motion.div>

                {/* Receitas por Categoria */}
                <motion.div
                    className="bg-white p-6 rounded-xl shadow-md"
                    variants={itemVariants}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {`Receitas por categoria - ${months[date.month - 1]} de ${date.year}`}
                        </h2>
                        <HiTrendingUp className="text-green-400 w-6 h-6" />
                    </div>
                    <div
                        className={`space-y-4 ${incomeData && incomeData.length > 6 ? 'overflow-x-auto max-w-full flex-nowrap flex pr-6' : ''}`}
                        style={{ maxHeight: 450, minHeight: 450 }}
                    >
                        {loadingIncome || !incomeData ? (
                            <Loader />
                        ) : (
                            incomeData.length === 0 ? (
                                <div className="text-center text-gray-400">Nenhuma categoria encontrada.</div>
                            ) : (
                                incomeData.map((item, idx) => {
                                    const { color, text } = getCategoryBarColor(idx);
                                    return (
                                        <div
                                            key={item.category}
                                            className={`mb-4 min-w-[220px] ${incomeData.length > 6 ? 'mr-4' : ''}`}
                                            style={{ flex: incomeData.length > 6 ? '0 0 220px' : undefined }}
                                        >
                                            <div className="flex justify-between items-center text-sm font-medium text-gray-800 mb-1">
                                                <span>{item.category}</span>
                                                <span className="font-semibold text-base text-gray-900">
                                                    R${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.total)}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2 rounded-full mb-2">
                                                <div className={`h-2 rounded-full ${color}`} style={{ width: `${item.percent}%` }}></div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className={`${text} font-semibold text-xs`}>{item.percent}%</span>
                                                <span className="text-xs text-gray-500">{item.count} transaç{item.count === 1 ? 'ão' : 'ões'}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default ReportCategoryPage;

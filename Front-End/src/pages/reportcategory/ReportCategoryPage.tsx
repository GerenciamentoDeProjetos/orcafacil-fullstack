import Header from '../../components/Header';
import DateFilter from '../../components/DateFilter';
import { useDateFilter } from '../../routes/DateFilterContext';
import { HiChartBar } from 'react-icons/hi';
import { motion } from 'framer-motion';

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

const fakeExpenseCategories = [
    { category: "Moradia", total: 1200, percent: 33, count: 3 },
    { category: "Alimentação", total: 850, percent: 23, count: 25 },
    { category: "Transporte", total: 450, percent: 12, count: 12 },
    { category: "Entretenimento", total: 320, percent: 9, count: 8 },
    { category: "Compras", total: 580, percent: 16, count: 15 },
    { category: "Outros", total: 280, percent: 8, count: 7 },
];

const fakeIncomeCategories = [
    { category: "Salário", total: 3500, percent: 65, count: 1 },
    { category: "Renda Extra", total: 800, percent: 15, count: 4 },
    { category: "Investimentos", total: 600, percent: 11, count: 2 },
    { category: "Prêmios e Presentes", total: 300, percent: 6, count: 2 },
    { category: "Reembolsos", total: 120, percent: 2, count: 1 },
    { category: "Outros", total: 100, percent: 1, count: 1 },
];

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ReportCategoryPage = () => {
    const { date } = useDateFilter();

    return (
        <>
            <Header />
            <DateFilter />

            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 padding p-20 pt-[7rem] bg-gray-50"
                initial="hidden"
                animate="visible"
            >
                {/* Despesas por Categoria */}
                <motion.div
                    className="bg-white p-6 rounded-xl shadow-md"
                    variants={itemVariants}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Despesas por Categoria {date.year}</h2>
                        <HiChartBar className="text-blue-400 w-6 h-6" />
                    </div>
                    <div
                        className={`space-y-4 ${fakeExpenseCategories.length > 6 ? 'overflow-x-auto max-w-full flex-nowrap flex pr-6' : ''}`}
                        style={{ maxHeight: 400, minHeight: 120 }}
                    >
                        {fakeExpenseCategories.length === 0 && (
                            <div className="text-center text-gray-400">Nenhuma categoria encontrada.</div>
                        )}
                        {fakeExpenseCategories.map((item, idx) => {
                            const { color, text } = getCategoryBarColor(idx);
                            return (
                                <div
                                    key={item.category}
                                    className={`mb-4 min-w-[220px] ${fakeExpenseCategories.length > 6 ? 'mr-4' : ''}`}
                                    style={{ flex: fakeExpenseCategories.length > 6 ? '0 0 220px' : undefined }}
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
                        })}
                    </div>
                </motion.div>

                {/* Receitas por Categoria */}
                <motion.div
                    className="bg-white p-6 rounded-xl shadow-md"
                    variants={itemVariants}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Receitas por Categoria {date.year}</h2>
                        <HiChartBar className="text-green-400 w-6 h-6" />
                    </div>
                    <div
                        className={`space-y-4 ${fakeIncomeCategories.length > 6 ? 'overflow-x-auto max-w-full flex-nowrap flex pr-6' : ''}`}
                        style={{ maxHeight: 400, minHeight: 120 }}
                    >
                        {fakeIncomeCategories.length === 0 && (
                            <div className="text-center text-gray-400">Nenhuma categoria encontrada.</div>
                        )}
                        {fakeIncomeCategories.map((item, idx) => {
                            const { color, text } = getCategoryBarColor(idx);
                            return (
                                <div
                                    key={item.category}
                                    className={`mb-4 min-w-[220px] ${fakeIncomeCategories.length > 6 ? 'mr-4' : ''}`}
                                    style={{ flex: fakeIncomeCategories.length > 6 ? '0 0 220px' : undefined }}
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
                        })}
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default ReportCategoryPage;

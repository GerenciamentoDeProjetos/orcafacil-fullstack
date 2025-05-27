import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import logo from '../assets/imgs/orcafacil-logo.png';
import { Link, useLocation } from 'react-router-dom';

const SlideBarMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para abrir/fechar o menu

    const menuVariants = {
        hidden: { x: '-100%' }, // Escondido fora da tela à esquerda
        visible: { x: 0, transition: { duration: 0.3 } }, // Desliza para dentro
    };

    const location = useLocation();

    const isDashboard = location.pathname === '/dashboard';
    const isReportCategory = location.pathname === '/report/category';
    const isReportMonthly = location.pathname === '/report/monthly';
    const isTransactions = location.pathname === '/transactions';

    return (
        <>
            {/* Botão para abrir o menu */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)} // Alterna o menu
                className="h-12 w-12 bg-white text-green-600 rounded-full flex items-center justify-center shadow-md fixed top-4 left-4 z-50 mt-3 transition duration-300 hover:bg-green-200"
                title="Abrir Menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Menu Lateral */}
            {isMenuOpen && (
                <motion.div
                    className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col"
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    {/* Cabeçalho do Menu */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            {/* Logo pequena */}
                            <img
                                src={logo}
                                alt="Logo OrçaFácil"
                                className="w-20 h-20 object-contain" // Logo menor e proporcional
                            />
                            {/* Nome em minúsculas */}
                            <h1 className="text-lg text-gray-800 font-bold ml-5">MENU</h1>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(false)} // Fecha o menu
                            className="text-gray-500 hover:text-gray-800 transition"
                            title="Fechar Menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Opções do Menu */}
                    <div className="flex flex-col gap-4 px-4 py-6">
                        {/* Dashboard */}
                        <Link to="/dashboard" title="Tela Principal" className="w-full">
                            <button
                                className={`w-full text-center text-sm font-medium py-2 px-3 rounded-md transition
                                    ${
                                        isDashboard
                                            ? "text-green-700 bg-green-100 font-semibold shadow-inner"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }
                                `}
                                type="button"
                            >
                                Dashboard
                            </button>
                        </Link>

                        {/* Transações */}
                        <Link to="/transactions" title="Transações" className="w-full">
                            <button
                                className={`w-full text-center text-sm font-medium py-2 px-3 rounded-md transition
                                    ${
                                        isTransactions
                                            ? "text-green-700 bg-green-100 font-semibold shadow-inner"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }
                                `}
                                type="button"
                            >
                                Transações
                            </button>
                        </Link>

                        {/* Relatórios Mensais */}
                        <Link to="/report/monthly" title="Relatório mensal" className="w-full">
                            <button
                                className={`w-full text-center text-sm font-medium py-2 px-3 rounded-md transition
                                    ${
                                        isReportMonthly
                                            ? "text-green-700 bg-green-100 font-semibold shadow-inner"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }
                                `}
                                type="button"
                            >
                                Relatórios Mensais
                            </button>
                        </Link>

                        {/* Relatórios por Categorias */}
                        <Link to="/report/category" title="Relatórios por Categorias" className="w-full">
                            <button
                                className={`w-full text-center text-sm font-medium py-2 px-3 rounded-md transition
                                    ${
                                        isReportCategory
                                            ? "text-green-700 bg-green-100 font-semibold shadow-inner"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }
                                `}
                                type="button"
                            >
                                Relatórios por Categorias
                            </button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default SlideBarMenu;

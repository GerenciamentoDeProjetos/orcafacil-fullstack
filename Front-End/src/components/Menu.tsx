import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react'; // Ícones para menu e fechar
import logo from '../assets/imgs/orcafacil-logo.png'; // Importando a logo

const SidebarMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para abrir/fechar o menu

    const menuVariants = {
        hidden: { x: '-100%' }, // Escondido fora da tela à esquerda
        visible: { x: 0, transition: { duration: 0.3 } }, // Desliza para dentro
    };

    return (
        <>
            {/* Botão para abrir o menu */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)} // Alterna o menu
                className="h-12 w-12 bg-white text-green-600 rounded-full flex items-center justify-center shadow-md fixed top-4 left-4 z-50 mt-3"
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
                    <div className="flex flex-col space-y-4 px-4 py-6">
                        <button
                            className="text-sm font-medium text-green-600 bg-green-50 py-2 px-3 rounded-md shadow-sm"
                            title="Tela Principal"
                        >
                            Dashboard
                        </button>
                        <button
                            className="text-sm font-medium text-gray-700 hover:bg-gray-100 py-2 px-3 rounded-md transition"
                            title="Transações"
                        >
                            Transações
                        </button>
                        <button
                            className="text-sm font-medium text-gray-700 hover:bg-gray-100 py-2 px-3 rounded-md transition"
                            title="Relatórios Mensais"
                        >
                            Relatórios Mensais
                        </button>
                        <button
                            className="text-sm font-medium text-gray-700 hover:bg-gray-100 py-2 px-3 rounded-md transition"
                            title="Relatórios por Categorias"
                        >
                            Relatórios por Categorias
                        </button>
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default SidebarMenu;

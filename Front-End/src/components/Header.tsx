import { useState } from 'react';
import logo from '../assets/imgs/orcafacil-logo.png';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react'; // Ícone de logout
import { useNavigate } from 'react-router-dom'; // Para navegação
import SidebarMenu from './Menu'; // Importação do menu lateral

const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Estado para abrir/fechar o menu do perfil
    const navigate = useNavigate();

    // Recupera o nome e email do localStorage
    const userName = localStorage.getItem('userName') ?? 'Usuário';
    const userEmail = localStorage.getItem('userEmail') ?? 'email@exemplo.com';
    const userInitials = userName
        .split(' ')
        .join('')
        .substring(0, 2)
        .toUpperCase();

    const handleLogout = () => {
        localStorage.clear(); // Limpa o localStorage
        navigate('/login'); // Redireciona para a página de login
    };

    // Variantes de animação para o Header
    const headerVariants = {
        hidden: { opacity: 0, y: -50 }, // Começa invisível e acima
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, // Animação suave descendo
    };

    return (
        <motion.header
            className="fixed top-0 left-0 w-full flex justify-between items-center bg-gradient-to-r from-green-400 via-green-500 to-green-600 px-8 py-4 shadow-lg z-50"
            variants={headerVariants} // Aplicando variantes de animação
            initial="hidden"
            animate="visible"
        >
            {/* Menu lateral */}
            <SidebarMenu />

            {/* Logo com fundo branco arredondado */}
            <div className="flex items-center gap-4">
                <div className="bg-white p-2 shadow-md ml-20 rounded-md">
                    <img
                        src={logo}
                        alt="Logo Orça Fácil"
                        className="w-14 h-14 object-contain"
                    />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-wide">
                    Dashboard
                </h1>
            </div>

            {/* Botão de Perfil */}
            <div className="relative">
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)} // Alterna o menu
                    className="h-14 w-14 rounded-full bg-white text-green-600 font-bold flex items-center justify-center transition duration-300 hover:bg-green-200 shadow-md"
                    title="Perfil"
                >
                    {userInitials}
                </button>

                {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-4 px-5 z-50">
                        <p className="text-sm font-medium text-gray-800">{userName}</p>
                        <p className="text-xs text-gray-500">{userEmail}</p>
                        <hr className="my-2 border-gray-200" />
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-start w-full text-red-500 text-sm font-medium hover:bg-red-50 px-3 py-2 rounded-md transition"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sair
                        </button>
                    </div>
                )}
            </div>
        </motion.header>
    );
};

export default Header;

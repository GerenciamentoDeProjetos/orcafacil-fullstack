import logo from '../../assets/imgs/orcafacil-logo.png';
import { motion } from 'framer-motion';

const Header = () => {
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
            {/* Logo com fundo branco arredondado */}
            <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-r-full shadow-md">
                    <img
                        src={logo}
                        alt="Logo Orça Fácil"
                        className="w-24 h-14 object-contain"
                    />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-wide">
                    Painel de usuário
                </h1>
            </div>

            {/* Botão de Perfil */}
            <div className="flex items-center">
                <button
                    className="h-12 w-12 rounded-full bg-white text-green-600 font-bold flex items-center justify-center transition duration-300 hover:bg-gray-100 shadow-md"
                    title="Perfil"
                >
                    RL
                </button>
            </div>
        </motion.header>
    );
};

export default Header;

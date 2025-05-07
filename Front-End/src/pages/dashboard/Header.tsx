
import React from 'react';
import logo from '../../assets/imgs/orcafacil-logo.png';


const Header = () => {
    return (
        <header className={"flex justify-between bg-primary-1 px-4 py-2"}>

            <div className="flex px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {/*<CreditCard className="h-10 w-7" />*/}
                    <img src={logo} alt="Logo Orça Fácil" className='w-7' />
                    <h1 className="text-xl text-blue-900">Orça Fácil</h1>
                </div>
            </div>
            <div className="flex items-center space-x-4">

                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <button>RL</button>
                </div>
            </div>
        </header>
    );
};

export default Header;
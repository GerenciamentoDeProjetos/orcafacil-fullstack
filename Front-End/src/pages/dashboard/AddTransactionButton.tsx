import React, { useState } from 'react';

const AddTransactionButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal
    const [transactionType, setTransactionType] = useState(0); // 0: Receita, 1: Despesa
    const [transaction, setTransaction] = useState({
        title: '',
        category: '',
        amount: '',
        day: '',
        month: '',
    });

    const categories = {
        income: ['Salário', 'Investimento', 'Rendimentos', 'Outros'],
        expense: ['Aluguel', 'Luz', 'Água', 'Internet', 'Transporte', 'Compras', 'Outros'],
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTransaction({ ...transaction, [name]: value });
    };

    const handleAddTransaction = () => {
        console.log('Nova transação:', { transactionType, ...transaction });
        // Resetar o estado e fechar o modal
        setTransaction({ title: '', category: '', amount: '', day: '', month: '' });
        setIsModalOpen(false);
    };

    return (
        <>
            {/* Botão para adicionar transação */}
            <div className="fixed bottom-8 right-8">
                <button
                    className="h-16 w-16 rounded-full bg-green-500 text-white text-4xl flex items-center justify-center shadow-lg hover:bg-green-600 transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    +
                </button>
            </div>

            {/* Modal para adicionar transação */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Adicionar Transação</h2>

                        {/* Tipo de transação */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Transação
                            </label>
                            <div className="flex space-x-4">
                                <button
                                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                                        transactionType === 0
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-700'
                                    }`}
                                    onClick={() => setTransactionType(0)}
                                >
                                    Receita
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                                        transactionType === 1
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-200 text-gray-700'
                                    }`}
                                    onClick={() => setTransactionType(1)}
                                >
                                    Despesa
                                </button>
                            </div>
                        </div>

                        {/* Formulário */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Título
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={transaction.title}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                placeholder="Ex: Aluguel, Salário"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Categoria
                            </label>
                            <select
                                name="category"
                                value={transaction.category}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            >
                                <option value="">Selecione uma categoria</option>
                                {(transactionType === 0
                                    ? categories.income
                                    : categories.expense
                                ).map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Valor
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={transaction.amount}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                placeholder="Ex: 1200.00"
                            />
                        </div>

                        <div className="flex space-x-4">
                            <div className="mb-4 w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dia
                                </label>
                                <input
                                    type="number"
                                    name="day"
                                    value={transaction.day}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    placeholder="Ex: 15"
                                />
                            </div>
                            <div className="mb-4 w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mês
                                </label>
                                <input
                                    type="number"
                                    name="month"
                                    value={transaction.month}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    placeholder="Ex: 5"
                                />
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600"
                                onClick={handleAddTransaction}
                            >
                                Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddTransactionButton;

import React, { useState } from 'react';

const AddTransactionButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState(0); // 0 = Receita, 1 = Despesa
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
        setTransaction((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddTransaction = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Usuário não autenticado.');
            return;
        }

        // Validação dos campos obrigatórios
        if (!transaction.title || !transaction.category || !transaction.amount || !transaction.day || !transaction.month) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    title: transaction.title,
                    category: transaction.category,
                    amount: parseFloat(transaction.amount),
                    transaction_day: parseInt(transaction.day, 10),
                    transaction_month: parseInt(transaction.month, 10),
                    type: transactionType,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                console.error('Erro do servidor:', data.error);
                alert(data.error ?? 'Erro ao adicionar transação');
                return;
            }

            alert('Transação adicionada com sucesso!');
            setTransaction({
                title: '',
                category: '',
                amount: '',
                day: '',
                month: '',
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erro ao comunicar com o servidor:', error);
            alert('Erro ao comunicar com o servidor. Verifique se o backend está rodando e acessível.');
        }
    };

    return (
        <>
            <div className="fixed bottom-8 right-8">
                <button
                    className="h-16 w-16 rounded-full bg-green-500 text-white text-4xl flex items-center justify-center shadow-lg hover:bg-green-600 transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    +
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Adicionar Transação</h2>

                        {/* Tipo de Transação */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Transação</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <select
                                name="category"
                                value={transaction.category}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            >
                                <option value="">Selecione uma categoria</option>
                                {(transactionType === 0 ? categories.income : categories.expense).map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dia</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
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

import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react'; // Ícone relacionado à adição
import { useDateFilter } from '../../routes/DateFilterContext';

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const AddTransactionButton = () => {
    const { date } = useDateFilter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState(0); // 0 = Receita, 1 = Despesa
    const [transaction, setTransaction] = useState({
        title: '',
        category: '',
        amount: '',
        day: '',
        month: date.month, // Preenche automaticamente com o mês atual do contexto
        year: date.year, // Preenche automaticamente com o ano atual do contexto
    });
    const [errors, setErrors] = useState({
        title: false,
        category: false,
        amount: false,
        day: false,
    });

    const categories = {
        income: ['Salário', 'Investimento', 'Rendimentos', 'Outros'],
        expense: ['Aluguel', 'Luz', 'Água', 'Internet', 'Transporte', 'Compras', 'Outros'],
    };

    useEffect(() => {
        if (isModalOpen) {
            // Atualiza o mês e ano automaticamente ao abrir o modal
            setTransaction((prev) => ({
                ...prev,
                month: date.month,
                year: date.year,
            }));
        }
    }, [isModalOpen, date]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTransaction((prev) => ({ ...prev, [name]: value }));

        // Validação em tempo real: remove o erro ao preencher corretamente
        if (name === 'title' && value) setErrors((prev) => ({ ...prev, title: false }));
        if (name === 'category' && value) setErrors((prev) => ({ ...prev, category: false }));
        if (name === 'amount' && parseFloat(value) > 0) setErrors((prev) => ({ ...prev, amount: false }));
        if (name === 'day' && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 31) {
            setErrors((prev) => ({ ...prev, day: false }));
        }
    };

    const validateFields = () => {
        const newErrors = {
            title: !transaction.title,
            category: !transaction.category,
            amount: !transaction.amount || parseFloat(transaction.amount) <= 0,
            day: !transaction.day || parseInt(transaction.day, 10) < 1 || parseInt(transaction.day, 10) > 31,
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleAddTransaction = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Usuário não autenticado.');
            return;
        }

        if (!validateFields()) {
            return; // Não permite continuar se houver erros
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
                    transaction_month: transaction.month, // Envia o número do mês
                    transaction_year: transaction.year, // Envia o ano
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
                month: date.month, // Restaura o mês do contexto
                year: date.year, // Restaura o ano do contexto
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erro ao comunicar com o servidor:', error);
            alert('Erro ao comunicar com o servidor. Verifique se o backend está rodando e acessível.');
        }
    };

    return (
        <>
            <div className="fixed bottom-8 right-6">
                <button
                    className="h-16 w-16 rounded-full bg-green-500 text-white text-4xl flex items-center justify-center shadow-lg hover:bg-green-600 transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusCircle className="text-white w-7 h-7" />
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Adicionar Transação</h2>

                        {/* Exibição do mês e ano selecionados */}
                        <div className="absolute bottom-20 right-6 bg-blue-100 text-green-700 px-3 py-1 rounded-md text-sm font-medium shadow w-40 text-center">
                            {`${months[transaction.month - 1]} de ${transaction.year}`}
                        </div>

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
                                className={`w-full border px-3 py-2 text-sm rounded-md ${
                                    errors.title ? 'border-2 border-red-500 animate-shake' : 'border-gray-300'
                                }`}
                                placeholder="Ex: Aluguel, Salário"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <select
                                name="category"
                                value={transaction.category}
                                onChange={handleInputChange}
                                className={`w-full border px-3 py-2 text-sm rounded-md ${
                                    errors.category ? 'border-2 border-red-500 animate-shake' : 'border-gray-300'
                                }`}
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
                                className={`w-full border px-3 py-2 text-sm rounded-md ${
                                    errors.amount ? 'border-2 border-red-500 animate-shake' : 'border-gray-300'
                                }`}
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
                                    className={`w-full border px-3 py-2 text-sm rounded-md ${
                                        errors.day ? 'border-2 border-red-500 animate-shake' : 'border-gray-300'
                                    }`}
                                    placeholder="Ex: 15"
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

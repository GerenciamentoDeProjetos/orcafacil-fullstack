/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { useDateFilter } from "../routes/DateFilterContext";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const categories = {
  income: ['Salário', 'Renda Extra', 'Investimentos', 'Prêmios e Presentes', 'Reembolsos', 'Outros'],
  expense: ['Moradia', 'Alimentação', 'Transporte', 'Saúde e Bem-estar', 'Lazer e Compras', 'Outros'],
};

interface EditTransactionModalProps {
  transaction: any;
  onClose: (shouldRefresh?: boolean) => void;
  onSuccess: () => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  onClose,
  onSuccess,
}) => {
  const { date } = useDateFilter();

  const [transactionType, setTransactionType] = useState(transaction.type === "income" ? 0 : 1);
  const [form, setForm] = useState({
    title: transaction.description || "",
    category: transaction.category || "",
    amount: transaction.amount?.toString() || "",
    day: transaction.date ? new Date(transaction.date).getDate().toString() : "",
    month: transaction.date ? new Date(transaction.date).getMonth() + 1 : date.month,
    year: transaction.date ? new Date(transaction.date).getFullYear() : date.year,
  });
  const [errors, setErrors] = useState({
    title: false,
    category: false,
    amount: false,
    day: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Atualiza mês e ano ao abrir o modal se necessário
    setForm((prev) => ({
      ...prev,
      month: transaction.date ? new Date(transaction.date).getMonth() + 1 : date.month,
      year: transaction.date ? new Date(transaction.date).getFullYear() : date.year,
    }));
  }, [transaction, date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validação em tempo real: remove o erro ao preencher corretamente
    if (name === "title" && value) setErrors((prev) => ({ ...prev, title: false }));
    if (name === "category" && value) setErrors((prev) => ({ ...prev, category: false }));
    if (name === "amount" && parseFloat(value) > 0) setErrors((prev) => ({ ...prev, amount: false }));
    if (name === "day" && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 31) {
      setErrors((prev) => ({ ...prev, day: false }));
    }
  };

  const validateFields = () => {
    const newErrors = {
      title: !form.title,
      category: !form.category,
      amount: !form.amount || parseFloat(form.amount) <= 0,
      day: !form.day || parseInt(form.day, 10) < 1 || parseInt(form.day, 10) > 31,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleUpdateTransaction = async () => {
    if (!validateFields()) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/transactions/${transaction.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          amount: parseFloat(form.amount),
          transaction_day: parseInt(form.day, 10),
          transaction_month: form.month,
          transaction_year: form.year,
          type: transactionType,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error ?? "Erro ao editar transação");
        setIsLoading(false);
        return;
      }

      alert("Transação editada com sucesso!");
      setIsLoading(false);
      onSuccess();
    } catch {
      alert("Erro ao comunicar com o servidor.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <Pencil className="w-5 h-5 text-blue-700" />
          Editar Transação
        </h2>

        {/* Exibição do mês e ano selecionados */}
        <div className="absolute bottom-20 right-6 bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium shadow w-40 text-center">
          {`${months[Number(form.month) - 1]} de ${form.year}`}
        </div>

        {/* Tipo de Transação */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Transação</label>
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                transactionType === 0
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setTransactionType(0)}
            >
              Receita
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                transactionType === 1
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700"
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
            value={form.title}
            onChange={handleInputChange}
            className={`w-full border px-3 py-2 text-sm rounded-md ${
              errors.title ? "border-2 border-red-500 animate-shake" : "border-gray-300"
            }`}
            placeholder="Ex: Aluguel, Salário"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select
            name="category"
            value={form.category}
            onChange={handleInputChange}
            className={`w-full border px-3 py-2 text-sm rounded-md ${
              errors.category ? "border-2 border-red-500 animate-shake" : "border-gray-300"
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
            value={form.amount}
            onChange={handleInputChange}
            className={`w-full border px-3 py-2 text-sm rounded-md ${
              errors.amount ? "border-2 border-red-500 animate-shake" : "border-gray-300"
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
              value={form.day}
              onChange={handleInputChange}
              className={`w-full border px-3 py-2 text-sm rounded-md ${
                errors.day ? "border-2 border-red-500 animate-shake" : "border-gray-300"
              }`}
              placeholder="Ex: 15"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700"
            onClick={() => onClose(false)}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleUpdateTransaction}
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionModal;

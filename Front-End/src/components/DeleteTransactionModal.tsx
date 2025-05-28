import React from "react";
import { Trash2 } from "lucide-react";

interface DeleteTransactionModalProps {
  transaction: {
    id: number;
    date: string;
    description: string;
    category: string;
    type: "income" | "expense";
    amount: number;
  } | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

const DeleteTransactionModal: React.FC<DeleteTransactionModalProps> = ({
  transaction,
  onClose,
  onConfirm,
}) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <div className="flex flex-col items-center">
          <Trash2 className="w-9 h-9 text-red-600 mb-2" />
          <h2 className="text-lg font-bold mb-1 text-gray-900">Excluir transação?</h2>
          <p className="text-sm text-gray-700 mb-3 text-center">
            Tem certeza que quer excluir esta transação?
          </p>
          <div className="w-full bg-gray-50 rounded-md px-3 py-2 text-left mb-2 text-xs text-gray-800">
            <div>
              <b>Data:</b> {new Date(transaction.date).toLocaleDateString("pt-BR")}
            </div>
            <div>
              <b>Título:</b> {transaction.description}
            </div>
            <div>
              <b>Categoria:</b> {transaction.category}
            </div>
            <div>
              <b>Tipo:</b> {transaction.type === "income" ? "Renda" : "Despesa"}
            </div>
            <div>
              <b>Valor:</b> {transaction.type === "income" ? "+" : "-"}
              {Number(transaction.amount).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <button
              className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600"
              onClick={() => onConfirm(transaction.id)}
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTransactionModal;

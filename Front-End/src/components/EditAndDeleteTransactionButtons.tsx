import React from "react";
import { Pencil, Trash2 } from "lucide-react";

// Interface para os dados da transação (usado no modal)
interface TransactionData {
  id: number;
  date: string;
  description: string;
  category: string;
  type: "income" | "expense";
  amount: number;
}

interface EditAndDeleteTransactionButtonsProps {
  transaction: TransactionData;
  onEdit: (transaction: TransactionData) => void;
  onRequestDelete: (transaction: TransactionData) => void;
}

const EditAndDeleteTransactionButtons: React.FC<EditAndDeleteTransactionButtonsProps> = ({
  transaction,
  onEdit,
  onRequestDelete,
}) => {
  return (
    <div className="flex gap-2 justify-end">
      {/* Edit Button */}
      <button
        title="Editar"
        className="w-9 h-9 flex items-center justify-center bg-white border border-blue-300 rounded-lg shadow shadow-blue-100 hover:bg-blue-50 transition"
        onClick={() => onEdit(transaction)}
      >
        <Pencil className="w-5 h-5 text-blue-600" />
      </button>
      {/* Delete Button */}
      <button
        title="Excluir"
        className="w-9 h-9 flex items-center justify-center bg-white border border-red-300 rounded-lg shadow shadow-red-100 hover:bg-red-50 transition"
        onClick={() => onRequestDelete(transaction)}
      >
        <Trash2 className="w-5 h-5 text-red-600" />
      </button>
    </div>
  );
};

export default EditAndDeleteTransactionButtons;

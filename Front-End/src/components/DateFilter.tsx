import { useState, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';
import { useDateFilter } from '../routes/DateFilterContext';

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const currentDate = new Date();

const DateFilter = () => {
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [yearError, setYearError] = useState(false);
  const [monthError, setMonthError] = useState(false);

  const { date, setDate } = useDateFilter();

  // Sincroniza o estado local com os valores do contexto ao abrir o modal
  useEffect(() => {
    if (open) {
      setSelectedMonth((date.month || currentDate.getMonth() + 1) - 1); // Ajusta para índice de 0-11
      setSelectedYear(date.year || currentDate.getFullYear());
    }
  }, [open, date]);

  const toggleModal = () => setOpen(!open);

  const handleApply = () => {
    const isYearInvalid = selectedYear < 1000 || selectedYear > currentDate.getFullYear();
    const isMonthInvalid =
      (selectedYear === currentDate.getFullYear() && selectedMonth > currentDate.getMonth());

    if (isYearInvalid) {
      setYearError(true);
      setTimeout(() => setYearError(false), 500);
      return;
    }

    if (isMonthInvalid) {
      setMonthError(true);
      setTimeout(() => setMonthError(false), 500);
      return;
    }

    setOpen(false);
    setDate({ month: selectedMonth + 1, year: selectedYear }); // Salva no contexto
  };

  return (
    <>
      {/* Botão fixo no canto inferior direito */}
      <div className="fixed bottom-28 right-6 z-50">
        <button
          onClick={toggleModal}
          className="bg-green-500 hover:bg-green-600 rounded-full w-16 h-16 flex items-center justify-center shadow-xl transition-colors"
          title="Filtrar por mês"
        >
          <CalendarDays className="text-white w-7 h-7" />
        </button>
      </div>

      {/* Modal centralizado */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[320px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Selecionar Período</h3>

            <div className="flex gap-3 mb-4">
              {/* Dropdown para selecionar o mês */}
              <select
                className={`w-2/3 border px-2 py-1 text-sm rounded-md focus:outline-none ${
                  monthError
                    ? 'border-red-500 animate-shake'
                    : 'border-gray-300 focus:ring-2 focus:ring-green-500'
                }`}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>

              {/* Campo de entrada para o ano */}
              <input
                type="number"
                className={`w-1/3 border px-2 py-1 text-sm rounded-md focus:outline-none ${
                  yearError
                    ? 'border-red-500 animate-shake'
                    : 'border-gray-300 focus:ring-2 focus:ring-green-500'
                }`}
                value={selectedYear}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setSelectedYear(value);

                  // Verifica se o ano é inválido
                  if (value > currentDate.getFullYear() || value < 1000) {
                    setYearError(true);
                  } else {
                    setYearError(false);
                  }

                  // Verifica se o mês ainda é válido no novo ano selecionado
                  if (value === currentDate.getFullYear() && selectedMonth > currentDate.getMonth()) {
                    setMonthError(true);
                  } else {
                    setMonthError(false);
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-1 rounded-md bg-green-500 text-white text-sm hover:bg-green-600"
                onClick={handleApply}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DateFilter;

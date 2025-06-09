import { useDateFilter } from '../routes/DateFilterContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const currentDate = new Date();

const MonthSwitcher = () => {
  const { date, setDate } = useDateFilter();

  const handlePrev = () => {
    let newMonth = date.month - 1;
    let newYear = date.year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear = date.year - 1;
    }
    // Não permite ir para antes de 1000
    if (newYear < 1000) return;
    setDate({ month: newMonth, year: newYear });
  };

  const handleNext = () => {
    let newMonth = date.month + 1;
    let newYear = date.year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear = date.year + 1;
    }
    // Não permite ir para um mês futuro
    if (
      newYear > currentDate.getFullYear() ||
      (newYear === currentDate.getFullYear() && newMonth - 1 > currentDate.getMonth())
    ) {
      return;
    }
    setDate({ month: newMonth, year: newYear });
  };

  // Desativa seta direita se já está no mês e ano atual
  const isNextDisabled =
    date.year > currentDate.getFullYear() ||
    (date.year === currentDate.getFullYear() && date.month - 1 >= currentDate.getMonth());

  // Desativa seta esquerda se já está no ano mínimo
  const isPrevDisabled = date.year <= 1000 && date.month === 1;

  return (
    <div className="flex justify-center items-center py-6 w-full mt-20">
      <button
        onClick={handlePrev}
        disabled={isPrevDisabled}
        className={`w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 bg-white shadow transition
          ${isPrevDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 active:bg-gray-200"}`}
        title="Mês anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <span
        className="mx-8 text-3xl font-bold text-gray-900 select-none text-center"
        style={{ minWidth: 205, display: 'inline-block' }}
        >
        {months[date.month - 1]} <span className="text-lg font-semibold text-gray-500">{date.year}</span>
      </span>
      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className={`w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 bg-white shadow transition
          ${isNextDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 active:bg-gray-200"}`}
        title="Próximo mês"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MonthSwitcher;

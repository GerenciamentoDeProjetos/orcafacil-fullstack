import { createContext, useContext, useState, ReactNode } from 'react';

// Define a interface para manter o estado do contexto
interface DateFilterContextProps {
  date: { month: number; year: number }; // Sempre inicializado com valores
  setDate: (date: { month: number; year: number }) => void;
}

// Cria o contexto com o tipo apropriado
const DateFilterContext = createContext<DateFilterContextProps | undefined>(undefined);

export const DateFilterProvider = ({ children }: { children: ReactNode }) => {
  // Obtém o mês e o ano atual
  const currentDate = new Date();
  const [date, setDate] = useState<{ month: number; year: number }>({
    month: currentDate.getMonth() + 1, // `getMonth` retorna meses de 0-11, então adicionamos +1
    year: currentDate.getFullYear(),
  });

  return (
    <DateFilterContext.Provider value={{ date, setDate }}>
      {children}
    </DateFilterContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useDateFilter = () => {
  const context = useContext(DateFilterContext);
  if (context === undefined) {
    throw new Error('useDateFilter must be used within a DateFilterProvider');
  }
  return context;
};

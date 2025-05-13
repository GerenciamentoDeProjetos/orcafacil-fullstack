import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { DateFilterProvider } from './routes/DateFilterContext'; // Importando o contexto de filtro de data

function App() {
  return (
    <DateFilterProvider>
      <Router>
        <AppRoutes />
      </Router>
    </DateFilterProvider>
  );
}

export default App;

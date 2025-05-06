import AppRouter from '@Routes/index';
import { BrowserRouter as Router } from 'react-router';

function App() {
    return (
        <Router>
            <AppRouter />
        </Router>
    );
}

export default App;

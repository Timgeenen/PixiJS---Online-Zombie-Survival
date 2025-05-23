import { AppRouter } from '@Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router } from 'react-router';

const nodeEnv = import.meta.env.VITE_ENV;
if (nodeEnv === 'dev') {
    localStorage.setItem('debug', 'socket.io-client:socket');
}

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <AppRouter />
            </Router>
            {nodeEnv === 'dev' && <ReactQueryDevtools />}
        </QueryClientProvider>
    );
}

export default App;

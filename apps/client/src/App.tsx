import { AppRouter } from '@Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
    const nodeEnv = import.meta.env.VITE_ENV;
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

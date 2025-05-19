import { AppRouter } from '@Routes';
import { authorizeUser } from '@Services';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router';

const queryClient = new QueryClient();

function App() {
    const nodeEnv = import.meta.env.VITE_ENV;
    useEffect(() => {
        authorizeUser();
    }, []);
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

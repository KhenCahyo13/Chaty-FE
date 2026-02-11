import './index.css'

import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { AppProvider } from './components/core/app-provider';
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient();
export const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	scrollRestoration: true,
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppProvider
			queryClient={queryClient}
			router={router}
		/>
	</StrictMode>,
)

import React from 'react';
import { Provider} from 'jotai';

type JotaiProviderProps = {
	children: React.ReactNode;
	store?: any;
}

const JotaiProvider = ({children, store}: JotaiProviderProps) => {
	return (
		<Provider>
			{children}
		</Provider>
	);
};

export default JotaiProvider;
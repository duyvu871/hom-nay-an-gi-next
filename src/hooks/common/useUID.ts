import { useState } from 'react';
// eslint-disable-next-line import/named
import {v4 as uuidv4} from 'uuid';

const useUID = (): {
	generateUID: () => string;
} => {
	const [uidStore, setUIDStore] = useState({});

	const generateUID = () => {
		// setUIDStore((prevStore) => ({ ...prevStore, [newUID]: newUID }));
		return uuidv4();
	};

	return {
		generateUID,
	};
};

export {useUID};

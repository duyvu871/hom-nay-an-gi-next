import Cookies from 'js-cookie';

const getCookie = (name: string) => {
	return Cookies.get(name);
};

const setCookie = (name: string, value: string, expires: string) => {
	Cookies.set(name, value, { expires: setExpirationTime(expires) });
};

const removeCookie = (name: string) => {
	Cookies.remove(name);
};

const setExpirationTime = (expires: string) => {
	return new Date(expires);
};

export { getCookie, setCookie, removeCookie, setExpirationTime };
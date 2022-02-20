import { useState, useEffect } from "react";
import api from "../services/api";


export const useHooks = (initialState, root = '') => {
	const [state, setState] = useState([]);

	const getData = async () => {
		const res = await api.get(`${root}/${initialState.id}`);
		return res.data;
	}

	useEffect(() => {
		getData().then(data => {
			setState(data);
		});
	}, []);
	return [state, setState];
}
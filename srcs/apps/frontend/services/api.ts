import Axios from "axios";
import Cookies from "js-cookie";

export const url = "http://localhost:4000";

let token_jwt = Cookies.get('token') || null;

export const headers = {
    'Accept': 'application/json', 
    'Content-Type': 'application/json',
    'authorization': ''
};

const headersData = {
    'Accept': 'application/json', 
    'Content-Type': 'multipart/form-data',
    'authorization': ''
};


if (token_jwt) {
    headers["authorization"] = `Bearer ${token_jwt}`;
    headersData["authorization"] = `Bearer ${token_jwt}`;
}

export const apiFormData = Axios.create({
    baseURL: url,
    headers: headersData
});


const api = Axios.create({
    baseURL: url,
    headers: headers
});

export default api;
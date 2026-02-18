import axios from 'axios';


const baseURL = "https://clique-1.onrender.com/";

const api = axios.create({
    baseURL
})


export default api
// src/axiosFlask.js
import axios from 'axios'

const axiosFlask = axios.create({
    baseURL: 'http://localhost:5000'
})

export default axiosFlask
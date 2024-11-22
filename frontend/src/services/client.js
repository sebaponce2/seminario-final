import 'dotenv/config';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

export const client = axios.create({
  baseURL: apiUrl,
});
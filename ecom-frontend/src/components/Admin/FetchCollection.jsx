import axios from "axios";
import { buildUrl } from "../../config/api";
const api = (path) => buildUrl(`/api${path}`);

//const BASE_URL = "http://127.0.0.1:8000/api/collections";

const FetchCollection = async (slug) => {
  try {
    const res = await axios.get(api(`/collections/${slug}`));
    return res.data;
  } catch (error) {
    return null; 
  }
};

export default FetchCollection;
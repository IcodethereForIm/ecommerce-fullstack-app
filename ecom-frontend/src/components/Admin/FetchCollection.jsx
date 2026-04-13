import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/collections";

const FetchCollection = async (slug) => {
  try {
    const res = await axios.get(`${BASE_URL}/${slug}`);
    return res.data;
  } catch (error) {
    return null; 
  }
};

export default FetchCollection;
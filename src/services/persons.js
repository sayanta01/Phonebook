import axios from "axios";
const baseUrl = "http://localhost:3001/api/persons";
// const baseUrl = "/api/persons";

const getAll = async () => {
  const request = axios.get(baseUrl);
  return request.then((response) => {
    return response.data;
  });
};

const create = async (newPerson) => {
  const res = await axios.post(baseUrl, newPerson);
  return res.data;
};

const update = async (id, updatedPerson) => {
  const res = await axios.put(`${baseUrl}/${id}`, updatedPerson);
  return res.data;
};

const del = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default { getAll, create, update, del };

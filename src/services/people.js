import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getPeople = async () => {
    const request = await axios.get(baseUrl)
    const response = request
    return await response.data
}

const create = async (newPerson) => {
    const request = axios.post(baseUrl, newPerson)
    const response = await request
    return response.data
}
const update = async (id, newPerson) => {
    console.log('updating :>> ', id, newPerson);
    await axios.put(`${baseUrl}/${id}`, newPerson)
    const newList = getPeople()
    return newList
}

const deletePerson = async (id) => {
    console.log(`deleting ${baseUrl}/${id}`)
    await axios.delete(`${baseUrl}/${id}`)
    return getPeople()
}

export default { getPeople, create, update, deletePerson }


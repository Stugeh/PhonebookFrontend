import axios from 'axios'
const baseUrl = 'api/persons'

// fetches phonebook from the server.
const getPeople = async () => {
    const request = await axios.get(baseUrl)
    const response = request
    return await response.data
}

// Posts a new person on the server.
const create = async (newPerson) => {
    const request = axios.post(baseUrl, newPerson)
    const response = await request
    return response.data
}

// updates existing entry.
const update = async (id, newPerson) => {
    console.log('updating :>> ', id, newPerson)
    await axios.put(`${baseUrl}/${id}`, newPerson)
        .catch(error => console.log('error', error))
    const newList = getPeople()
    return newList
}

// deletes a person.
const deletePerson = async (id) => {
    console.log(`deleting ${baseUrl}/${id}`)
    await axios.delete(`${baseUrl}/${id}`)
    return getPeople()
}

export default { getPeople, create, update, deletePerson }


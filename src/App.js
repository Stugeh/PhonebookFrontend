import React, { useState, useEffect } from 'react'
import Renderers from './Renderers'
import people from './services/people'


const FilterPeople = (persons, newSearch) => {
  const filteredList = newSearch === '' ?
    persons
    :
    persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))
  return filteredList
}

const Notification = ({ message, errorMsg }) => {
  if (message !== null) {
    return (
      <div className="message">
        {message}
      </div>
    )
  }
  if (errorMsg !== null) {
    return (
      <div className="error">
        {errorMsg}
      </div>
    )
  } else { return (null) }
}


const App = () => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [persons, setPersons] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const hook = () => {
    people.getPeople().then(initPeople => setPersons(initPeople))
  }

  useEffect(hook, [])


  const addPerson = (event) => {
    event.preventDefault()
    const person = { name: newName, number: newNumber }
    if (!persons.some(e => e.name === person.name)) {
      people
        .create(person)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage(`added ${returnedPerson.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
          console.log('returnedPerson', returnedPerson)
        })
    } else {
      const result = window.confirm(`${person.name} is already in the phonebook. Would you like to update the number?`)
      if (result) {
        const newPersons = persons.filter(personObject => personObject.name === person.name)
        people
          .update(newPersons[0].id, { ...person, number: newNumber })
          .then(returnedPersons => {
            setNewName('')
            setNewNumber('')
            setPersons(returnedPersons)
            setMessage(`updated ${person.name}`)
            setTimeout(() => {
              setMessage(null)
            }, 3000)
          }).catch(error => {
            console.log('error')
            setErrorMsg(`${person.name} has already been removed from the server.`)
            setTimeout(() => {
              setErrorMsg(null)
            }, 5000)
          })
      }
    }
  }

  const handleName = (event) => {
    setNewName(event.target.value)
  }

  const handleNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setNewSearch(event.target.value)
  }

  const filteredList = FilterPeople(persons, newSearch)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} errorMsg={errorMsg} />
      <Renderers.Search newSearch={newSearch} handleSearch={handleSearch} />
      <h2>Add new</h2>
      <Renderers.AddForm newName={newName} newNumber={newNumber} handleName={handleName}
        handleNumber={handleNumber} addPerson={addPerson} />
      <h2>Numbers</h2>
      <Renderers.RenderNumbers filteredList={filteredList} setPersons={setPersons} setMessage={setMessage} />
    </div>
  )

}

export default App
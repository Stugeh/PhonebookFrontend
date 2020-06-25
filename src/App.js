import React, { useState, useEffect } from 'react'
import Renderers from './Renderers'
import people from './services/people'

// filters list when using the search box.
const FilterPeople = (persons, newSearch) => {
  const filteredList = newSearch === '' ?
    persons
    :
    persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))
  return filteredList
}

// error and success notifications when modifying the phonebook.
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
  // variables that require updating
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [persons, setPersons] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  // calls for getPeople to fetch the phonebook the server and assings it.
  const hook = () => {
    people.getPeople().then(initPeople => setPersons(initPeople))
  }
  useEffect(hook, [])

  // adds a person to the phonebook, resets the input boxes and calls for a notification.
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
        .catch(error => {
          // given data doesnt match the backends validation requirements
          console.log(error.response.data)
          setErrorMsg(error.response.data.error)
          setTimeout(() => {
            setErrorMsg(null)
          }, 5000)
        })
    } else {
      // If the name exists on the server the user is asked if they want to update the number.
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
            console.log(error)
            setErrorMsg(`${person.name} has already been removed from the server.`)
            setTimeout(() => {
              setErrorMsg(null)
            }, 5000)
          })
      }
    }
  }

  // handlers 
  const handleName = (event) => {
    setNewName(event.target.value)
  }
  const handleNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearch = (event) => {
    setNewSearch(event.target.value)
  }

  // assigns the list of users that fit the search into a variable.
  const filteredList = FilterPeople(persons, newSearch)

  // Calls renderers to render the page.
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
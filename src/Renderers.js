import React from 'react'
import people from './services/people'

// event handler for the delete button.
const Remove = async (person, setPersons, setMessage) => {
    const result = window.confirm(`Are you sure you want to delete ${person.name}`)
    if (result) {
        setMessage(`deleted ${person.name}`)
        setTimeout(() => {
            setMessage(null)
        }, 3000)
        const newList = await people.deletePerson(person.id)
        console.log(newList)
        setPersons(newList)

    }

}

// Renders a person.
const Person = ({ person, setPersons, setMessage }) =>
    <div>
        {person.name + ' '}
        {person.number + ' '}
        <button onClick={() => Remove(person, setPersons, setMessage)}>
            delete
        </button>
    </div>


// Renders the form that allows adding numbers.
const AddForm = ({ newName, newNumber, handleName, handleNumber, addPerson }) =>
    <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={handleName} /> </div>
        <div>number: <input value={newNumber} onChange={handleNumber} /> </div>
        <div><button type="submit">add</button></div>
    </form>


// Renders search box.
const Search = ({ newSearch, handleSearch }) =>
    <div>Search: <input value={newSearch} onChange={handleSearch} /></div>


// Recursively calls Person to render every person in the phonebook.    
const RenderNumbers = ({ filteredList, setPersons, setMessage }) => {
    //console.log(filteredList)
    return (
        filteredList.map(person =>
            <Person key={person.name} person={person} setPersons={setPersons} setMessage={setMessage} />
        )
    )
}

export default { Person, AddForm, Search, RenderNumbers } 
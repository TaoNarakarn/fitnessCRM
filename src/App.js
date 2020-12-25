import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { listTodos } from './graphql/queries';
import { createTodo as createNoteMutation, deleteTodo as deleteNoteMutation } from './graphql/mutations';

const initialFormState = { name: '', description: '' };

function App () {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    fetchNotes();
  }, [])

  async function fetchNotes () {
    const apiData = await API.graphql({ query: listTodos })
    setNotes(apiData.data.listTodos.items)
  }

  async function createNote () {
    if (!formData.name || !formData.description) return
    await API.graphql({ query: createNoteMutation, variables: { input: formData } })
    setNotes([...notes, formData])
    setFormData(initialFormState)
  }

  async function deleteNote ({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id)
    setNotes(newNotesArray)
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } } })
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Testing Notes App!</h1>
        <input
          type="text"
          onChange={e => setFormData({ ...formData, 'name': e.target.value })}
          placeholder="Note name"
          value={formData.name}
        />
        <input
          type="text"
          onChange={e => setFormData({ ...formData, 'description': e.target.value })}
          placeholder="Note description"
          value={formData.description}
        />
        <button onClick={createNote}>Create Note</button>
        <table style={{ marginBottom: 30 }}>
          <tbody>
            {
              notes.map(note => (
                <tr key={note.id || note.name}>
                  <td>{note.name}</td>
                  <td>{note.description}</td>
                  <td><button onClick={() => deleteNote(note)}>Delete note</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <AmplifySignOut />
      </header>
    </div>
  );
}

export default withAuthenticator(App);

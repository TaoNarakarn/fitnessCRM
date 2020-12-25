import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
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
    const notesFromAPI = apiData.data.listTodos.items
    await Promise.all(notesFromAPI.map(async note => {
      if (note.image) {
        const image = await Storage.get(note.image)
        note.image = image
      }
      return note
    }))
    setNotes(apiData.data.listTodos.items)
  }

  async function createNote () {
    if (!formData.name || !formData.description) return
    await API.graphql({ query: createNoteMutation, variables: { input: formData } })
    if (formData.image) {
      const image = await Storage.get(formData.image)
      formData.image = image
    }
    setNotes([...notes, formData])
    setFormData(initialFormState)
  }

  async function deleteNote ({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id)
    setNotes(newNotesArray)
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } } })
  }

  async function onChange (e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0]
    setFormData({ ...formData, image: file.name })
    await Storage.put(file.name, file)
    fetchNotes()
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Testing Notes App!</h1>
        <table>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  onChange={e => setFormData({ ...formData, 'name': e.target.value })}
                  placeholder="Note name"
                  value={formData.name}
                />
              </td>
              <td>
                <input
                  type="text"
                  onChange={e => setFormData({ ...formData, 'description': e.target.value })}
                  placeholder="Note description"
                  value={formData.description}
                />
              </td>
              <td>
                <input type="file" onChange={onChange} />
              </td>
              <td><button onClick={createNote}>Create Note</button></td>
            </tr>
          </tbody>
        </table>



        <table style={{ marginBottom: 30 }}>
          <tbody>
            {
              notes.map(note => (
                <tr key={note.id || note.name}>
                  <td>{note.name}</td>
                  <td>{note.description}</td>
                  <td>{note.image && <img src={note.image} style={{ width: 400 }} alt="notes" />} </td>
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

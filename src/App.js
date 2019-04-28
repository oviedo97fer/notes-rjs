import React, { Component } from 'react';
import './App.css';
import Note from './Components/Note/Note';
import Form from './Components/NoteForm/Form';

//importando configuracion de Firebase
import { DB_CONFIG } from './config/config';
//importando Firebase
import firebase from 'firebase';
import 'firebase/database';

class App extends Component {
  constructor(){
    super();
    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.state={
      notes: [
        /* {noteId: 1, noteContent: 'note 1'},
        {noteId: 2, noteContent: 'note 2'} */
      ]
    };

    this.app = firebase.initializeApp(DB_CONFIG);
    this.db= this.app.database().ref().child('notes');
  }

  componentDidMount(){
    const notes = this.state.notes;
    //para actualizar la vista al agregar:
    this.db.on('child_added', snap=>{
      notes.push({
        noteId: snap.key,
        notesContent: snap.val().noteContent
      })
      this.setState({
        notes
      })
    });
    //para actualizar la vista al borrar:
    this.db.on('child_removed', snap=>{
      for( let i = 0; i<notes.length; i++){
        if(notes[i].noteId === snap.key){
          notes.splice(i, 1);
        }
      }
      this.setState({
        notes
      })
    })
  }

  addNote(note){
    /* let { notes } = this.state;
    notes.push({
      noteId: notes.length+1 ,
      noteContent: note
    });
    this.setState({
      notes
    }); */

    this.db.push().set({noteContent: note});
  }
  removeNote(noteId){
    this.db.child(noteId).remove();
  }

  render() {
    return (
      <div className="notesContainer">
        <div className="notesHeader">
        <h1>React & Firebase App</h1>
        </div>
        <div className='notesBody'>
          <ul>{
            this.state.notes.map(note => {
              return(
               <Note
               noteContent={note.noteContent}
               noteId={note.noteId}
               key={note.noteId}
               removeNote={this.removeNote}
               />
              )
            })
          }
          </ul>
        </div>
        <div className='notesFooter'>
          <div>
               <Form addNote={this.addNote}></Form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

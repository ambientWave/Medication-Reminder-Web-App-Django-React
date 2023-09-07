import React, {useState, useEffect} from "react";
import ListItem from "../components/ListItem";


const NotesListPage = () => {
    let [notes, setNotes] = useState([]);
    
    /* Every time your component renders, 
    React will update the screen and then run 
    the code inside useEffect. In other words,
    useEffect "delays" a piece of code from
    running until that render is reflected 
    on the screen. */
    // this hook runs every single time of the component render
    useEffect(() => {
        getNotes();
    }, []);

    let getNotes = async () => {
        let response = await fetch('/api/notes/')
        let data = await response.json()
        setNotes(data)
    };

    return (
        <div className="notes">
            <div className="notes-header">
                <h2 className="notes-title">&#9782; Medications</h2>
                <p className="notes-count">{notes.length}</p>
            </div>
            <div className='notes-list'>
                {/* notes is an array 
                that resides in state hook.
                It holds the database entries
                recieved by the fetch call as objects.
                Each object contains the different data
                fields and values of each record in database  */}
                
                {notes.map((note, i) => (
                    /* each child node must have
                    different prop (observe how key 
                    is not showing after actual dom render)
                    when one iterates through an array.
                    Otherwise, the following error would showup:
                    'Each child in a list should have a unique
                    "key" prop.' */
                    // <div key={note.id}>
                    //     {JSON.stringify(note)}
                    // </div>
                    <ListItem key={i} NoteItem={note}/>
                ))}

            </div>
            


        </div>
    )
}

export default NotesListPage;
import React, {useState, useEffect} from "react";
import ListItem from "../components/ListItem";

const NotesListPage = () => {
    let [notes, setNotes] = useState([]);
    
    // this hook runs every single time of the component render
    useEffect(() => {
        getNotes();
    }, []);

    let getNotes = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/notes/')
        let data = await response.json()
        setNotes(data)
    };

    return (
        <div>
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
                    <ListItem Key={i} NoteItem={note}/>
                ))}

            </div>
            


        </div>
    )
}

export default NotesListPage;
import React, {useState, useEffect} from "react";

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
            


        </div>
    )
}

export default NotesListPage;
import React, {useState, useEffect} from "react";
import { useParams, Link } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg";

const NotePage = () => {
    let noteId = useParams();
    let [note, setNote] = useState(null)
    useEffect(() => {
        getNote()
    }, [noteId])

    let getNote = async () => {
        let response = await fetch(`/api/notes/${noteId.id}`)
        let data = await response.json()
        setNote(data)
    }
    return (
        <div className="note">
            <div className="note-header">
                <Link to="/">
                    <h3>
                        <ArrowLeft/>
                    </h3>
                </Link>

                
            </div>
            <textarea defaultValue={note?.body}></textarea>

        </div>
    )
}

export default NotePage;
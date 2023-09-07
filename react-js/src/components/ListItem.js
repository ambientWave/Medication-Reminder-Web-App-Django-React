import React from "react";
import { Link } from "react-router-dom";

// NoteItem is a destructured object passed to this component from parent component "NotesListPage" by the prop "NoteItem"
const ListItem = ({NoteItem}) => {
    return (
        <div>
            <Link to={`/note/${NoteItem.id}`}>
                {NoteItem.body}
            </Link>

        </div>
    )
}

export default ListItem;
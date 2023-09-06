import React from "react";

// NoteItem is a destructured object passed to this component from parent component "NotesListPage" by the prop "NoteItem"
const ListItem = ({NoteItem}) => {
    return (
        <div>
            <div>
                {NoteItem.body}
            </div>

        </div>
    )
}

export default ListItem;
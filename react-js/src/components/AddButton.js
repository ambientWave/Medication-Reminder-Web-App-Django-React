import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as AddIcon } from "../assets/add.svg";

const AddButton = () => {
    return (
        // In React, we can make the app go to any directory we like by assigning the relative path to "to" prop.
        // Notice that we can type any path we like even if this not a real path on storage medium because inside
        // web app, the used principles are different from ones used in normal HTML5 pages.
        // Notice that this path is totally different from backend API endpoints
        <Link to="/note/new" className='floating-button'>
            <AddIcon/>
        </Link>
    )
}

export default AddButton
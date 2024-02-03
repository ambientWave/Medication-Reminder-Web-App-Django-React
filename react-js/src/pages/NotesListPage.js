import React, {useState, useEffect} from "react";
import ListItem from "../components/ListItem";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";
import AddButton from "../components/AddButton";
import useAxios from "../utils/UseAxios";
import { useNavigate } from "react-router-dom";

const NotesListPage = () => {
    let [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const api = useAxios();
    const navigate = useNavigate();

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

        setTimeout(() => {
            api.get('/api/notes/')
            .then(response => {
                if(!(response.status === 200 && response.statusText === 'OK')){
                    throw Error('Sorry, some error occurred while fetching your reminders.');
                }
                return response.data;
            })
            .then(data => {
                setNotes(data);
                console.log(notes);
                setLoading(false);
                setError(false);
            })
            .catch(err => {
                console.log(err.message);
                setError(true);
                if(err.response.status === 401){ //Unauthorized
                    getNotes();
                    // navigate("/login");
                }
            })
 
        }, 4000)

        // let response = await fetch('/api/notes/')
        // let data = await response.json()
        // setNotes(data)
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

                {/* there must be a message prompted to user saying "You don't have any reminders" if the fetched object is empty in NotesListPage */}
                {loading? (<center>
                    <Skeleton baseColor="#202020" highlightColor="#444" style={{position: "relative", right: 95+"px"}} width="60%" height={17}/>
                    <Skeleton style={{position: "relative", right: 27+"px"}}
                    baseColor="#202020" 
                    highlightColor="#444" 
                    count={2} 
                    variant="rectangular" 
                    width={505} 
                    height={13}/>
                    </center>) : (notes.map((note, i) => (
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
                )))}

            </div>
            <AddButton/>


        </div>
    )
}

export default NotesListPage;
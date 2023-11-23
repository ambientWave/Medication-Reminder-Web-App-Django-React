import React, {useState, useEffect} from "react";
import { useParams, Link } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg";
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

const NotePage = () => {
    let noteId = useParams();
    let [note, setNote] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    useEffect(() => {
        getNote()
    }, [noteId])

    let getNote = setTimeout(() => {async () => {
        
            await fetch(`/api/notes/${noteId.id}`)
            .then(response => {
                if(!response.ok){
                    throw Error('Sorry, some error occurred while fetching your reminder.');
                }
                return response.json();
            })
            .then(data => {
                setNote(data);
                setLoading(false);
                setError(false);
            })
            .catch(err => {
                console.log(err.message);
                setError(true);
            })
        // let response = await fetch(`/api/notes/${noteId.id}`)
        // let data = await response.json()
        // setNote(data)
        }, 4000})
        
    return (
        <div className="note">
            <div className="note-header">
                <Link to="/">
                    <h3>
                        <ArrowLeft/>
                    </h3>
                </Link>

                
            </div>{

            }
             {loading ? (<center>
                    <Skeleton baseColor="#202020" highlightColor="#444" style={{position: "relative", right: 95+"px"}} width="60%"/>
                    <Skeleton 
                    baseColor="#202020" 
                    highlightColor="#444" 
                    count={2} 
                    variant="rectangular" 
                    width={505} 
                    height={13}/>
                    </center>) : <textarea defaultValue={note?.body}></textarea>}
            

        </div>
    )
}

export default NotePage;
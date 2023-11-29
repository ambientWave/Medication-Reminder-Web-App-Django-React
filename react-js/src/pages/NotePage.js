import React, {useState, useEffect} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg";
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import LoadingBar from 'react-top-loading-bar'

const NotePage = () => {
    let noteId = useParams();
    const navigate = useNavigate();
    let [note, setNote] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        setProgress(40);
        getNote();
        
    }, [noteId])

    let getNote = async () => {setTimeout(() => {
        
            fetch(`/api/notes/${noteId.id}`)
            .then(response => {
                if(!response.ok){
                    throw Error('Sorry, some error occurred while fetching your reminder.');
                }
                return response.json();
            })
            .then(data => {
                setNote(data);
                setProgress(100);
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
        }, 4000)}

    const handleChange = (event) => {
        let keyFromTargetElement = event.target.id
        setNote({...note, [keyFromTargetElement]: event.target.value}); // Dynamic Object Key in JavaScript
        };

    let updateNote = async() => {
        setProgress(40);
        let response = fetch(`/api/notes/${noteId.id}/update`, {
            method: "PUT",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(note)
    
    });

    setTimeout(() => {
    setProgress(100);
    }, 4000);
    setTimeout(() => {
    navigate('/');
    }, 5000);

    };

    let deleteNote = async() => {
        setProgress(40);
        let response = fetch(`/api/notes/${noteId.id}/delete`, {
            method: "DELETE",
            headers: {"Content-type": "application/json"}
    
    });
    setTimeout(() => {
        setProgress(100);
        }, 4000);
    setTimeout(() => {
        navigate('/');
        }, 5000);
    };    

    return (
        
        <div className="note">
            <LoadingBar
            color='#f68657'
            progress={progress}
            onLoaderFinished={() => setProgress(0)}/>
            <div className="note-header">
                <Link to="/">
                    <h3>
                        <ArrowLeft/>
                    </h3>
                </Link>
                <button onClick={deleteNote}>Delete</button>

                
            </div>
            <div style={{height: "90vh", overflow: "auto"}}>{loading ? (<center>
                    <Skeleton baseColor="#202020" highlightColor="#444" style={{position: "relative", right: 95+"px"}} width="60%" height={17}/>
                    <Skeleton style={{position: "relative", right: 27+"px"}}
                    baseColor="#202020" 
                    highlightColor="#444" 
                    count={2} 
                    variant="rectangular" 
                    width={505} 
                    height={13}/>
                    </center>) : (<div style={{height: "150vh", overflow: "auto"}}>
                    
                        <div className="mb-5 row">
                            <div className="col">
                                <label>Medication Name</label>
                                <input id="medicine_name" type="text" onChange={handleChange} required defaultValue={note?.medicine_name} className="form-control"/>
                            </div>
                            <div className="col">
                                <label>Route of Adminstration</label>
                                <input id="route_of_administration" type="text" onChange={handleChange} required defaultValue={note?.route_of_administration} className="form-control"/>
                            </div>
                        </div>
                        <div className="mb-5 row">
                            <div className="col">
                                <label>Dosage Form</label>
                                <input type="text" required defaultValue={note?.dosage_form} className="form-control"/>
                            </div>
                            <div className="col">
                                <label>Dosage</label>
                                <input type="text" defaultValue={note?.dosage_quantity_of_units_per_time+" "+note?.dosage_unit_of_measure} className="form-control"/>
                            </div>                            
                            <div className="col">
                                <label>Intake Frequency</label>
                                <input type="text" defaultValue={note?.dosage_frequency+" "+((note?.dosage_frequency === 1) ? "time" : "times")+" "+note?.periodic_interval} className="form-control" id="phone_input" name="Phone"/>
                            </div>
                        </div>
                        <div className="mb-5 row">
                            <div className="col-9">
                                <label>First Time of Intake</label>
                                <input type="datetime-local" required defaultValue={note?.first_time_of_intake.slice(0, -1)} className="form-control"/>
                            </div>

                        </div>
                        <div className="mb-5 row">
                            <label>Is It a Chronic Medication?</label>
                            <div className="col">                        <div className="form-check form-check-inline">
                            
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value={true} defaultChecked={note?.is_chronic_or_acute}/>
                            <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value={false} defaultChecked={!note?.is_chronic_or_acute}/>
                            <label className="form-check-label" htmlFor="inlineRadio2">No</label>
                        </div></div>
                        </div>


                        <div className="mb-5 row">
                            <div className="col-9">
                                <label>Stopping Time</label>
                                <input type="datetime-local" disabled={note?.is_chronic_or_acute ? true : false} required defaultValue={note?.is_chronic_or_acute ? null : (note?.stopped_by_datetime.slice(0, -1))} className="form-control"/>
                            </div>
                        </div>
                        <div className="mb-5">
                            {/* <label>Regimen Notes</label> */}
                            <textarea style={{backgroundColor: "wheat", height: "auto"}} defaultValue={note?.regimen_note} placeholder="Regimen Notes" className="form-control" id="message" name="message" rows="5"></textarea>
                        </div>
                        <button onClick={(e) => updateNote({})} className="btn btn-primary px-4 btn-lg">Update</button>
                    </div>)}

            </div>
             
            

        </div>
    )
}

export default NotePage;
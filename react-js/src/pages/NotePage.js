import React, {useState, useEffect} from "react";
import { useParams, Link } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg";
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import LoadingBar from 'react-top-loading-bar'
import { Form } from 'react-bootstrap';
const NotePage = () => {
    let noteId = useParams();
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

                
            </div>
            <div style={{height: "90vh", overflow: "auto"}}>{loading ? (<center>
                    <Skeleton baseColor="#202020" highlightColor="#444" style={{position: "relative", right: 95+"px"}} width="60%" height={17}/>
                    <Skeleton 
                    baseColor="#202020" 
                    highlightColor="#444" 
                    count={2} 
                    variant="rectangular" 
                    width={505} 
                    height={13}/>
                    </center>) : (<div style={{height: "150vh", overflow: "auto"}}>
                    
                        <div class="mb-5 row">
                            <div class="col">
                                <label>Medication Name</label>
                                <input type="text" required defaultValue={note?.medicine_name} class="form-control"/>
                            </div>
                            <div class="col">
                                <label>Route of Adminstration</label>
                                <input type="text" required defaultValue={note?.route_of_administration} class="form-control"/>
                            </div>
                        </div>
                        <div class="mb-5 row">
                            <div class="col">
                                <label>Dosage Form</label>
                                <input type="text" required defaultValue={note?.dosage_form} class="form-control"/>
                            </div>
                            <div class="col">
                                <label>Dosage</label>
                                <input type="text" defaultValue={note?.dosage_quantity_of_units_per_time+" "+note?.dosage_unit_of_measure} class="form-control"/>
                            </div>                            
                            <div class="col">
                                <label>Intake Frequency</label>
                                <input type="text" defaultValue={note?.dosage_frequency+" "+((note?.dosage_frequency === 1) ? "time" : "times")+" "+note?.periodic_interval} class="form-control" id="phone_input" name="Phone"/>
                            </div>
                        </div>
                        <div class="mb-5 row">
                            <div class="col-9">
                                <label>First Time of Intake</label>
                                <input type="datetime-local" required defaultValue={note?.first_time_of_intake.slice(0, -1)} class="form-control"/>
                            </div>

                        </div>
                        <div class="mb-5 row">
                            <label>Is It a Chronic Medication?</label>
                            <div class="col">                        <div class="form-check form-check-inline">
                            
                            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value={true} checked={note?.is_chronic_or_acute}/>
                            <label class="form-check-label" for="inlineRadio1">Yes</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value={false} checked={!note?.is_chronic_or_acute}/>
                            <label class="form-check-label" for="inlineRadio2">No</label>
                        </div></div>
                        </div>


                        <div class="mb-5 row">
                            <div class="col-9">
                                <label>Stopping Time</label>
                                <input type="datetime-local" disabled={note?.is_chronic_or_acute ? true : false} required defaultValue={note?.is_chronic_or_acute ? null : (note?.stopped_by_datetime.slice(0, -1))} class="form-control"/>
                            </div>
                        </div>
                        <div class="mb-5">
                            {/* <label>Regimen Notes</label> */}
                            <textarea style={{backgroundColor: "wheat", height: "auto"}} defaultValue={note?.regimen_note} placeholder="Regimen Notes" class="form-control" id="message" name="message" rows="5"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary px-4 btn-lg">Post</button>
                    </div>)}

            </div>
             
            

        </div>
    )
}

export default NotePage;
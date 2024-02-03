import React, {useState, useEffect} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import LoadingBar from 'react-top-loading-bar';
import moment from "moment";
import { nullable, z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form";
import useAxios from "../utils/UseAxios";


const NotePage = () => {
    let noteId = useParams();
    const navigate = useNavigate();
    let [note, setNote] = useState<any | null>(null); // useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [progress, setProgress] = useState(0);
    const api = useAxios();

    const formSchema = z.object({medicine_name: z.string({required_error: "Medication name is required",
    invalid_type_error: "Please enter a clear and detailed medication name. The name should, preferably, include the strength, form and quantity of dosage units if applicable",
    }).min(5), route_of_administration: z.string({required_error: "A route must be selected",
    invalid_type_error: "A route must be selected",
    }).min(4), dosage_form: z.string({required_error: "A form must be selected",
    invalid_type_error: "A form must be selected",
    }).min(2), dosage_unit_of_measure: z.string({required_error: "A unit must be selected",
    invalid_type_error: "A unit must be selected",
    }).min(2), periodic_interval: z.string({required_error: "A periodic interval must be selected",
    invalid_type_error: "A periodic interval must be selected",
    }).min(2), dosage_frequency: z.coerce.number({required_error: "Dosage frequency is required",
    invalid_type_error: "Dosage frequency must be an integer",
    }).int().gt(0), dosage_quantity_of_units_per_time: z.coerce.number({required_error: "Quantity of dosage units per time is required",
    invalid_type_error: "Quantity of dosage units per time must be a number that is greater than 0",
    }).positive(), first_time_of_intake: z.coerce.date({
        errorMap: (issue, { defaultError }) => ({
        message: issue.code === "invalid_date" ? "A valid date and time must be entered!" : defaultError,
        }), // the supplied is_chronic_or_acute input from html field is always text and prior to calling the api, values need to be converted to true boolean types
    }), is_chronic_or_acute: z.string().transform((val) => ((val === 'true') ? true : false)), stopped_by_datetime: z.coerce.date({
        errorMap: (issue, { defaultError }) => ({ // as the case with first_time_of_intake, zod date fields have issues with standard errors attributes therefore a workaround is implemented using errorMap
        message: issue.code === "invalid_date" ? "A valid date and time must be entered!" : defaultError,
        }), // allow the values of this field to be null and able to transform supplied empty values to null even if the field must be validated as date objects
    }).or(z.string().max(0)).nullable().transform((val) => ((val === '') || (val === undefined) ? null : val)), regimen_note: z.string()}).refine( input => {

    // allows stopped_by_datetime to be optional only when is_chronic_or_acute is true
    if (input.is_chronic_or_acute !== true && input.stopped_by_datetime === undefined) return false

    return true
    } ) // stopped_by_datetime field in the backend need to allow null values
      // datetime field in django accept empty string if condition

    type formSchemaType = z.infer<typeof formSchema>
    const { register, watch, getValues, handleSubmit, formState: { errors, isSubmitting } } = useForm<formSchemaType>({
        resolver : zodResolver(formSchema)
    })
    

    useEffect(() => {
        setProgress(40);
        getNote();
        
    }, [noteId])

    let getNote = async () => {setTimeout(() => {
            if (noteId.id === 'new') {
                setProgress(100);
                setLoading(false);
                return} else {
            api.get(`/api/notes/${noteId.id}`)
            .then(response => {
                if(!(response.status === 200 && response.statusText === 'OK')){
                    throw Error('Sorry, some error occurred while fetching your reminder.');
                }
                return response.data;
            })
            .then(data => {
                console.log(data);
                // let localDate = new Date(utcDate); // convert to local datetime
                setNote(data);
                setProgress(100);
                setLoading(false);
                setError(false);
            })
            .catch(err => {
                console.log(err.message);
                setError(true);
                if(err.response.status === 401){ //Unauthorized
                    navigate("/login");
                }
            })
        // let response = await fetch(`/api/notes/${noteId.id}`)
        // let data = await response.json()
        // setNote(data)
        }}, 4000)}

    function noteObjectUpdater(ElementId, updatedValue) {
        if((ElementId === 'dosage_quantity_of_units_per_time') || (ElementId === 'dosage_frequency')) {
            if(updatedValue) {
                try {
                    const regex = /[+-]?\d+(\.\d+)?/g;

                    let floats = (updatedValue).match(regex).map(function(v) { return parseFloat(v); });
                    setNote({...(typeof note === 'object' ? note : {}), [ElementId]: floats[0]});
                }
                catch (err) {
                    alert("Field must not be empty");
                }
            }
        } else if((ElementId === 'first_time_of_intake') || ElementId === ('stopped_by_datetime')) {
            try {if (/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.test(updatedValue)) {
                let LocalDateTime = new Date(updatedValue)
                let UTCDateTime = LocalDateTime.toISOString() //toUTCString()
                setNote({...note, [ElementId]: UTCDateTime}); // Dynamic Object Key in Javascript
            }}
            catch (err) {
                alert("Enter a valid datetime");
            }

        } else if(ElementId === 'is_chronic_or_acute') {
            let isTrueSet = (updatedValue === 'true' ? true : false);
            setNote({...note, [ElementId]: isTrueSet}); // Dynamic Object Key in Javascript
        } else {
            setNote({...note, [ElementId]: updatedValue}); // Dynamic Object Key in Javascript
        }

    }

    const handleChange = (event) => {
        let keyFromTargetElement = event.target.id
        let inputFromTargetElement = event.target.value
        noteObjectUpdater(keyFromTargetElement, inputFromTargetElement);

        // if (event.target.getAttribute('name') === 'is_chronic_or_acute') {
        //     setNote({...note, [event.target.name]: event.target.value});
        // }
        if (noteId.id === 'new' && note === null) {
            setNote({});
            noteObjectUpdater(keyFromTargetElement, inputFromTargetElement);
            console.log(note);
        } else {
            noteObjectUpdater(keyFromTargetElement, inputFromTargetElement);
            console.log(note);
        }
        
        
        };

        function jsonDataTypeReplacer(key, value) {
            if((key === "dosage_quantity_of_units_per_time") || (key === "dosage_frequency")) {
                return +value;
            } else if(key === "is_chronic_or_acute") {
                return (value === 'true' ? true : false);
            } else if((key === 'first_time_of_intake') || key === ('stopped_by_datetime')) {
                try {if (/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.test(value)) {
                    let LocalDateTime = new Date(value)
                    let UTCDateTime = LocalDateTime.toISOString() //toUTCString()
                    return UTCDateTime;}
                } catch (err) {
                    alert("A datetime field contains invalid input. Please enter a valid datetime in case you didn't do so");
                }

            } else {
                return value;
            }
            
        }
    // complete work on django server-end validation
    const onSubmit: SubmitHandler<formSchemaType> = async (data) => {
        console.log(data);
        if (noteId.id === 'new') {
            setProgress(40);

            let response = api.post(`/api/notes/create`, {
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(data)
        
        });
    
        setTimeout(() => {
        setProgress(100);
        }, 4000);
        setTimeout(() => {
        navigate('/');
        }, 5000);
        
        } else {
            setProgress(40);
            let response = api.put(`/api/notes/${noteId.id}/update`, {
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(data)
        
        });

        setTimeout(() => {
        setProgress(100);
        }, 200);
        let alertElement = document.getElementById("success-alert")
        if(alertElement !== null) {
            alertElement.style.display = 'none'; // hide
            alertElement.style.opacity = "0"
            alertElement.style.display = 'block'; // show
            alertElement.animate({opacity: 500},
                { duration: 2000,        // number in ms [this would be equiv of your speed].
        //                easing: 'ease-in-out',
                        iterations: 1,         // infinity or a number.
        //             // fill: ''
                });
            setTimeout( () => {
                if(alertElement !== null) {
            alertElement.style.transitionProperty = 'height, margin, padding';
            alertElement.style.transitionDuration = "500ms";
            alertElement.style.boxSizing = 'border-box';
            alertElement.style.height = alertElement.offsetHeight + 'px';
            // alertElement.offsetHeight;
            alertElement.style.overflow = 'hidden';
            alertElement.style.height = "0";
            alertElement.style.paddingTop = "0";
            alertElement.style.paddingBottom = "0";
            alertElement.style.marginTop = "0";
            alertElement.style.marginBottom = "0";}}, 2200)
            setTimeout( () => {
                if(alertElement !== null) {
                alertElement.style.display = 'none';
                alertElement.style.removeProperty('height');
                alertElement.style.removeProperty('padding-top');
                alertElement.style.removeProperty('padding-bottom');
                alertElement.style.removeProperty('margin-top');
                alertElement.style.removeProperty('margin-bottom');
                alertElement.style.removeProperty('overflow');
                alertElement.style.removeProperty('transition-duration');
                alertElement.style.removeProperty('transition-property');
                //alert("!");
            }}, 5000);
        }


        }
    };

        let createNote = async() => {
            setProgress(40);



            let response = fetch(`/api/notes/create`, {
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(note, jsonDataTypeReplacer)
        
        });
    
        setTimeout(() => {
        setProgress(100);
        }, 4000);
        setTimeout(() => {
        navigate('/');
        }, 5000);
    
        };
        
    let updateNote = async() => {
        setProgress(40);
        let response = fetch(`/api/notes/${noteId.id}/update`, {
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(note, jsonDataTypeReplacer)
    
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
        let response = api.delete(`/api/notes/${noteId.id}/delete`, {
            headers: {"Content-type": "application/json"}
    
    });
    setTimeout(() => {
        setProgress(100);
        }, 4000);
    setTimeout(() => {
        navigate('/');
        }, 5000);
    };
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.currentTarget.id === "dosage_frequency") {
            if (!(/([0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab|Escape)/g.test(event.key))) {
                event.preventDefault();
            };
        } else if (event.currentTarget.id === "dosage_quantity_of_units_per_time") {
            if (!(/([0-9]|\.|Backspace|Delete|ArrowLeft|ArrowRight|Tab|Escape)/g.test(event.key))) {
                event.preventDefault();
            };
        }


    }
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
                {noteId.id !== "new" ? <button onClick={deleteNote}>Delete</button> 
                : (<button onClick={(e) => handleSubmit(onSubmit)}>Done</button>)}


            </div>
            <div className="alert alert-success" id="success-alert" style={{display: "none", position: "absolute", width: "100%", zIndex: 999}}>
                    {/* <button type="button" className="btn btn-close" data-dismiss="alert"></button> */}
                    <strong>Success! </strong> This reminder has been updated.
            </div>
            <div style={{height: "90vh", overflow: "auto"}}>{loading ? (<center>
                    <Skeleton baseColor="#202020" highlightColor="#444" style={{position: "relative", right: 95+"px"}} width="60%" height={17}/>
                    <Skeleton style={{position: "relative", right: 27+"px"}}
                    baseColor="#202020" 
                    highlightColor="#444" 
                    count={2} 
                    // variant="rectangular" 
                    width={505} 
                    height={13}/>
                    </center>) : (<form onSubmit={handleSubmit(onSubmit)} style={{height: "170vh", overflow: "auto"}}>
                    
                        <div className="mb-5 row">
                            <div className="col">
                                <label>Medication Name (required)</label>
                                <input id="medicine_name" type="text" {...register("medicine_name", {onChange: (e) => {console.log(JSON.stringify(watch(), jsonDataTypeReplacer));if (e.target.validity.valid) {e.target.classList.remove('custom-invalid-input');e.target.classList.add('custom-valid-input');} else {e.target.classList.remove('custom-valid-input');e.target.classList.add('custom-invalid-input');}}})} disabled={isSubmitting} minLength={5} required defaultValue={note?.medicine_name} className="form-control"/>
                                {errors.medicine_name && (
                                    <p style={{color: "red"}} className="text-sm mt-1">{errors.medicine_name.message}</p>
                                )}
                            </div>
                            <div className="col">
                                <label>Route of Adminstration</label>
                                <select id="route_of_administration" {...register("route_of_administration", {onChange: (e) => {console.log(JSON.stringify(watch(), jsonDataTypeReplacer));if (e.target.validity.valid) {e.target.classList.remove('custom-invalid-input');e.target.classList.add('custom-valid-input');} else {e.target.classList.remove('custom-valid-input');e.target.classList.add('custom-invalid-input');}}})} disabled={isSubmitting} required defaultValue={note?.route_of_administration} className="form-select">
                                    <option selected disabled value="">Please choose ...</option>

                                    <option value="oral">Orally</option>

                                    <option value="parentral/im">Intra-muscular</option>

                                    <option value="parentral/sc">Subcutaneous</option>

                                    <option value="parentral/iv">Intravenous</option>

                                </select>
                                {errors.route_of_administration && (
                                    <p style={{color: "red"}} className="text-sm mt-1">{errors.route_of_administration.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="mb-5 row">
                            <div className="col">
                                <label>Dosage Form</label>
                                <select id="dosage_form" {...register("dosage_form", {onChange: (e) => {console.log(JSON.stringify(watch(), jsonDataTypeReplacer));if (e.target.validity.valid) {e.target.classList.remove('custom-invalid-input');e.target.classList.add('custom-valid-input');} else {e.target.classList.remove('custom-valid-input');e.target.classList.add('custom-invalid-input');}}})} disabled={isSubmitting} required defaultValue={note?.dosage_form} className="form-select">
                                    <option selected disabled value="">Please choose ...</option>

                                    <option value="tablet">Tablet</option>

                                    <option value="capsule">Capsule</option>

                                    <option value="syrup">Syrup</option>

                                    <option value="injectable">Injectable</option>

                                </select>
                                {errors.dosage_form && (
                                    <p style={{color: "red"}} className="text-sm mt-1">{errors.dosage_form.message}</p>
                                )}
                            </div>
                            <div className="col">
                                <label>Dosage Unit of Measure</label>
                                <select id="dosage_unit_of_measure" {...register("dosage_unit_of_measure", {onChange: (e) => {console.log(JSON.stringify(watch(), jsonDataTypeReplacer));if (e.target.validity.valid) {e.target.classList.remove('custom-invalid-input');e.target.classList.add('custom-valid-input');} else {e.target.classList.remove('custom-valid-input');e.target.classList.add('custom-invalid-input');}}})} disabled={isSubmitting} required defaultValue={note?.dosage_unit_of_measure} className="form-select">
                                    <option selected disabled value="">Please choose ...</option>

                                    <option value="tablet">Tablet</option>

                                    <option value="capsule">Capsule</option>

                                    <option value="gravimetric/mg">Milligram/mg</option>

                                    <option value="gravimetric/iu">International Unit/iu</option>

                                    <option value="volumetric/ml">Milliliter/ml</option>

                                </select>
                                {errors.dosage_unit_of_measure && (
                                    <p style={{color: "red"}} className="text-sm mt-1">{errors.dosage_unit_of_measure.message}</p>
                                )}
                                {/* <input type="text" defaultValue={note?.dosage_quantity_of_units_per_time+" "+note?.dosage_unit_of_measure} className="form-control"/> */}
                            </div>                            
                            <div className="col">
                                <label>Quantity of Units/Time</label>
                                <input type="number" pattern="\d*" placeholder="e.g. 2.5" min="0.1" step="0.1" id="dosage_quantity_of_units_per_time" onKeyDown={handleKeyDown} {...register("dosage_quantity_of_units_per_time", {onChange: (e) => {console.log(JSON.stringify(watch(), jsonDataTypeReplacer));if (e.target.validity.valid) {e.target.classList.remove('custom-invalid-input');e.target.classList.add('custom-valid-input');} else {e.target.classList.remove('custom-valid-input');e.target.classList.add('custom-invalid-input');}}})} disabled={isSubmitting} required defaultValue={note?.dosage_quantity_of_units_per_time} className="form-control"></input>
                                {/* <input type="text" defaultValue={note?.dosage_frequency+" "+((note?.dosage_frequency === 1) ? "time" : "times")+" "+note?.periodic_interval} className="form-control" id="phone_input" name="Phone"/> */}
                                {errors.dosage_quantity_of_units_per_time && (
                                    <p style={{color: "red"}} className="text-sm mt-1">{errors.dosage_quantity_of_units_per_time.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="mb-5 row">
                            <div className="col-9">
                                <label>Dosage Periodic Interval</label>
                                <select id="periodic_interval" {...register("periodic_interval", {onChange: (e) => {console.log(JSON.stringify(watch(), jsonDataTypeReplacer));if (e.target.validity.valid) {e.target.classList.remove('custom-invalid-input');e.target.classList.add('custom-valid-input');} else {e.target.classList.remove('custom-valid-input');e.target.classList.add('custom-invalid-input');}}})} disabled={isSubmitting} required defaultValue={note?.periodic_interval} className="form-select">
                                    <option selected disabled value="">Please choose ...</option>

                                    <option value="daily">Daily Regimen</option>

                                    <option value="weekly">Weekly Regimen</option>

                                    <option value="monthly">Monthly Regimen</option>

                                </select>
                                {errors.periodic_interval && (
                                    <p style={{color: "red"}} className="text-sm mt-1">{errors.periodic_interval.message}</p>
                                )}

                            </div>

                        </div>
                        <div className="mb-5 row">
                            <div className="col-9">
                                <label>Dosage Frequency/Interval</label>
                                <input type="number" pattern="\d*" placeholder="e.g. 1" step="1" min="1" id="dosage_frequency" onKeyDown={handleKeyDown} {...register("dosage_frequency", {onChange: (e) => {console.log(JSON.stringify(watch(), jsonDataTypeReplacer));if (e.target.validity.valid) {e.target.classList.remove('custom-invalid-input');e.target.classList.add('custom-valid-input');} else {e.target.classList.remove('custom-valid-input');e.target.classList.add('custom-invalid-input');}}})} disabled={isSubmitting} required defaultValue={note?.dosage_frequency} className="form-control"></input>
                                {errors.dosage_frequency && (
                                    <p style={{color: "red"}} className="text-sm mt-1">{errors.dosage_frequency.message}</p>
                                )}
                            </div>

                        </div>
                        
                        <div className="mb-5 row">
                            <div className="col-9">
                                <label>First Time of Intake</label>
                                <input type="datetime-local" id="first_time_of_intake" {...register("first_time_of_intake", {onChange: (e) => {console.log(JSON.stringify(watch(), jsonDataTypeReplacer));if (e.target.validity.valid) {e.target.classList.remove('custom-invalid-input');e.target.classList.add('custom-valid-input');} else {e.target.classList.remove('custom-valid-input');e.target.classList.add('custom-invalid-input');}}})} disabled={isSubmitting} required defaultValue={(noteId.id === 'new') ? undefined : (moment.utc(note?.first_time_of_intake).local().format("YYYY-MM-DDTHH:mm:ss"))} className="form-control"/>
                                {errors.first_time_of_intake && (
                                    <p style={{color: "red"}} className="text-sm mt-1">{errors.first_time_of_intake.message}</p>
                                )}
                            </div>

                        </div>
                        <div className="mb-5 row">
                            <label>Is It a Chronic Medication?</label>
                            <div className="col">
                                <div className="form-check form-check-inline">
                                    {/* unlike all fields, the input from this field needs to be also updated in the note state hook because stopping time disabled and required attributes are dependent on it */}
                                    <input className="form-check-input" type="radio" id="is_chronic_or_acute" {...register("is_chronic_or_acute", {onChange: (e) => {setNote({...note, is_chronic_or_acute: true});console.log(JSON.stringify(watch(), jsonDataTypeReplacer));if (e.target.validity.valid) {e.target.classList.remove('custom-invalid-input');e.target.classList.add('custom-valid-input');} else {e.target.classList.remove('custom-valid-input');e.target.classList.add('custom-invalid-input');}}})} disabled={isSubmitting} value={"true"} defaultChecked={note?.is_chronic_or_acute}/>
                                    <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" id="is_chronic_or_acute" {...register("is_chronic_or_acute", {onChange: (e) => {setNote({...note, is_chronic_or_acute: false});console.log(JSON.stringify(watch(), jsonDataTypeReplacer));if (e.target.validity.valid) {e.target.classList.remove('custom-invalid-input');e.target.classList.add('custom-valid-input');} else {e.target.classList.remove('custom-valid-input');e.target.classList.add('custom-invalid-input');}}})} disabled={isSubmitting} value={"false"} defaultChecked={!note?.is_chronic_or_acute}/>
                                    <label className="form-check-label" htmlFor="inlineRadio2">No</label>
                                </div>
                                {errors.is_chronic_or_acute && (
                                    <p style={{color: "red"}} className="text-sm mt-1">{errors.is_chronic_or_acute.message}</p>
                                )}
                            </div>
                        </div>


                        <div className="mb-5 row">
                            <div className="col-9">
                                <label>Stopping Time</label>
                                <input type="datetime-local" id="stopped_by_datetime" {...register("stopped_by_datetime", {onChange: (e) => {console.log(JSON.stringify(watch(), jsonDataTypeReplacer));if (e.target.validity.valid) {e.target.classList.remove('custom-invalid-input');e.target.classList.add('custom-valid-input');} else {e.target.classList.remove('custom-valid-input');e.target.classList.add('custom-invalid-input');}}})} disabled={note?.is_chronic_or_acute === 'true' || note?.is_chronic_or_acute === true || isSubmitting || String(getValues('is_chronic_or_acute')) === 'true' ? true : false} required={note?.is_chronic_or_acute === 'true' || note?.is_chronic_or_acute === true || String(getValues("is_chronic_or_acute")) === 'true' ? false : true} defaultValue={note?.is_chronic_or_acute || noteId.id === 'new' ? undefined : (moment.utc(note?.stopped_by_datetime).local().format("YYYY-MM-DDTHH:mm:ss"))} className="form-control"/>
                                {errors.stopped_by_datetime && (
                                    <p style={{color: "red"}} className="text-sm mt-1">{errors.stopped_by_datetime.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="mb-5">
                            {/* <label>Regimen Notes</label> */}
                            <textarea style={{backgroundColor: "wheat", height: "auto"}} id="regimen_note" {...register("regimen_note", {onChange: (e) => {console.log(JSON.stringify(watch(), jsonDataTypeReplacer));if (e.target.validity.valid) {e.target.classList.remove('custom-invalid-input');e.target.classList.add('custom-valid-input');} else {e.target.classList.remove('custom-valid-input');e.target.classList.add('custom-invalid-input');}}})} disabled={isSubmitting} defaultValue={note?.regimen_note} placeholder="Regimen Notes" className="form-control" rows={5}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary px-4 btn-lg" disabled={isSubmitting}>{(noteId.id === 'new') ? "Create" : "Update"}</button>
                    </form>)}

            </div>
             
            

        </div>
    )
}

export default NotePage;
import React from "react";
import { Link } from "react-router-dom";
import tabCap from "../assets/tabletAndCapsule.png";
import syr from "../assets/syrup.png";
import inj from "../assets/inj2.png";
import time2 from "../assets/time2.png";
import stop from "../assets/stop.png";
import moment from "moment";

// import {Container,Row,Col} from "react-bootstrap";
// import 'bootstrap/dist/css/bootstrap.css';

// NoteItem is a destructured object passed to this component from parent component "NotesListPage" by the prop "NoteItem"
const ListItem = ({NoteItem}) => {
  setInterval(function() {
    console.log("After timeout: " + new Date());
    }, 60*1000);
  let firstIntakeTimeAsMoment = moment(NoteItem.first_time_of_intake);
  let firstIntakeTimeMinutesComponent = firstIntakeTimeAsMoment.get('minute');
  let firstIntakeTimeHoursComponent = firstIntakeTimeAsMoment.get('hour');
  let firstIntakeTimeDayOfWeekComponent = firstIntakeTimeAsMoment.get('day');
  let firstIntakeTimeDateComponent = firstIntakeTimeAsMoment.get('date');
  /* need to set moment todayWithSameTimeAsIntake instance of one day i.e. 24 h backward 
  then 24h/frequency would be added frequency times with each moment instance is stored in an array. 
  Then, we loop through this array and check for time precedence i.e. if the present time is before 
  one element, then, we calculate the diff duration, end the loop and parse it.
  If the present time greater than the last instance in the array then the steps should be 
  repeated but with 24 h forward */
  // this would be used for daily regimens
  let todayWithSameTimeAsIntake = moment().set({'hour': firstIntakeTimeHoursComponent, 'minute': firstIntakeTimeMinutesComponent});
  let oneDayPastTodayWithSameTimeAsIntake = moment(todayWithSameTimeAsIntake).subtract(1, 'd');
  // this would be used for weekly regimens
  let dayOfPresentWeekWithSameTimeAsIntake = moment().set({'day': firstIntakeTimeDayOfWeekComponent, 'hour': firstIntakeTimeHoursComponent, 'minute': firstIntakeTimeMinutesComponent});
  let dayOfPastWeekWithSameTimeAsIntake = moment(dayOfPresentWeekWithSameTimeAsIntake).subtract(7, 'd')
  // this would be used for monthly regimens
  let dayOfPresentMonthWithSameTimeAsIntake = moment().set({'date': firstIntakeTimeDateComponent, 'hour': firstIntakeTimeHoursComponent, 'minute': firstIntakeTimeMinutesComponent});
  let dayOfPastMonthWithSameTimeAsIntake = moment(dayOfPresentMonthWithSameTimeAsIntake).subtract(30, 'd')
  
  let durationBetweenThePresentAndTodayIntake = moment.duration(moment().diff(todayWithSameTimeAsIntake))
  // console.log(durationBetweenThePresentAndTodayIntake);

  let workingPresentMomentObject
  let workingPastMomentObject
  let periodicIntervalInt // represents the hours of a given period of time whether a day, week or month
  switch (NoteItem.periodic_interval) {
  case "daily":
    workingPresentMomentObject = todayWithSameTimeAsIntake
    workingPastMomentObject = oneDayPastTodayWithSameTimeAsIntake
    periodicIntervalInt = 24 // 1 day
    break;
  case "weekly":
    workingPresentMomentObject = dayOfPresentWeekWithSameTimeAsIntake
    workingPastMomentObject = dayOfPastWeekWithSameTimeAsIntake
    periodicIntervalInt = 168 // 7 days
    break;
  case "monthly":
    workingPresentMomentObject = dayOfPresentMonthWithSameTimeAsIntake
    workingPastMomentObject = dayOfPastMonthWithSameTimeAsIntake
    periodicIntervalInt = 720 // 30 days
    break;
}
  let freq = NoteItem.dosage_frequency;
  let arrayDistributedDoseTimes = [];
  let stepDateTimeMomentObject;
  if(moment().isAfter(workingPresentMomentObject)) {
    arrayDistributedDoseTimes.push(workingPresentMomentObject)
    for(let step = 1; step <= freq+1; step++) {
      stepDateTimeMomentObject = moment(arrayDistributedDoseTimes[step-1])
      stepDateTimeMomentObject.add(periodicIntervalInt/freq, 'h')
      arrayDistributedDoseTimes.push(stepDateTimeMomentObject)
      
    }
  } else {
    arrayDistributedDoseTimes.push(workingPastMomentObject);
    for(let step = 1; step <= freq+1; step++) {
      stepDateTimeMomentObject = moment(arrayDistributedDoseTimes[step-1])
      stepDateTimeMomentObject.add(periodicIntervalInt/freq, 'h')
      arrayDistributedDoseTimes.push(stepDateTimeMomentObject)
      
    };
  }
  console.log(arrayDistributedDoseTimes);
  let nextTimeAdminstrationMomentDiff
  let nextTimeAdminstrationMomentDiffMonths
  let nextTimeAdminstrationMomentDiffDays
  let nextTimeAdminstrationMomentDiffHours
  let nextTimeAdminstrationMomentDiffMinutes
  for(let momentObject of arrayDistributedDoseTimes) {
    if(momentObject.isAfter(moment())) {
      nextTimeAdminstrationMomentDiff = moment.duration(momentObject.diff(moment()))
      nextTimeAdminstrationMomentDiffMonths = nextTimeAdminstrationMomentDiff.get('M');
      nextTimeAdminstrationMomentDiffDays = nextTimeAdminstrationMomentDiff.get('d');
      nextTimeAdminstrationMomentDiffHours = nextTimeAdminstrationMomentDiff.get('h');
      nextTimeAdminstrationMomentDiffMinutes = nextTimeAdminstrationMomentDiff.get('m')
      break;
    } else {
      continue;

    }
  }
  let stoppedByDateTimeMomentObject = moment(NoteItem.stopped_by_datetime);
  let durationBetweenThePresentAndStoppedByDateTime = moment.duration(stoppedByDateTimeMomentObject.diff(moment()));
  let stoppedAfterMomentDiffMonths = durationBetweenThePresentAndStoppedByDateTime.get('M');
  let stoppedAfterMomentDiffDays = durationBetweenThePresentAndStoppedByDateTime.get('d');
  let stoppedAfterMomentDiffHours = durationBetweenThePresentAndStoppedByDateTime.get('h');
  let stoppedAfterMomentDiffMinutes = durationBetweenThePresentAndStoppedByDateTime.get('m')
  return (
      <div>
        <Link to={`/note/${NoteItem.id}`}>
          <div className="notes-list-item">
            <h3>{NoteItem.medicine_name}</h3>
            {/* **************************************** */}
            <div>
              <table>
                <tbody>
                <tr>
                  <td style={{width: 90+"px"}}>
                    {/* Immediately Invoked Function Expression (IIFE) */}
                    {(() => { 
                    switch (NoteItem.dosage_form) {
                      case "tablet" || "capsule":
                        return <div style={{display: "inline", position: "relative", top: 8+"px"}}><img src={tabCap} width="30px" /></div>;
                      case "syrup":
                        return <div style={{display: "inline", position: "relative", top: 10+"px"}}><img src={syr} width="30px" /></div>;
                      case "injectable":
                        return <div style={{display: "inline", position: "relative", top: 10+"px"}}><img src={inj} width="17px" /></div>;
                    }
                  })()}
                  <div style={{display: "inline"}}>{NoteItem.dosage_quantity_of_units_per_time}</div>
                  {(() => {
                    switch (NoteItem.dosage_unit_of_measure) {
                      case "tablet":
                        return " Tab";
                      case "capsule":
                        return " Capsule";
                      case "gravimetric/mg":
                        return " mg";
                      case "gravimetric/iu":
                        return " IU";
                      case "volumetric/ml":
                        return " ml";
                    }
                  })()}</td>
                  <td><img
                    src={time2}
                    style={{display: "inline", position: "relative", top: 10+"px"}}
                    width="30px"
                  />
                  <div style={{display: "inline", width: 410+"px"}}>Next Dose After {nextTimeAdminstrationMomentDiffMonths} Months, {nextTimeAdminstrationMomentDiffDays} Days, {nextTimeAdminstrationMomentDiffHours} Hours, {nextTimeAdminstrationMomentDiffMinutes} Minutes</div></td>
                </tr>                  
                </tbody>

              </table>
              <table>
                <tbody>
                <tr>
                  <td>
                    <img
                    src={stop}
                    style={{display: "inline", position: "relative", top: 5+"px"}}
                    width="25px"
                  />
                  {NoteItem.is_chronic_or_acute? <div style={{display: "inline"}}>This is a chronic medication and you shouldn't stop it without consulting your physician</div>: <div style={{display: "inline", width: 410+"px"}}>Stopped After {stoppedAfterMomentDiffMonths} Months, {stoppedAfterMomentDiffDays} Days, {stoppedAfterMomentDiffHours} Hours</div>}
                  

                  </td>
                </tr>                  
                </tbody>

              </table>
            </div>


            {/* **************************************** */}
          </div>
        </Link>
      </div>
    );
}

export default ListItem;
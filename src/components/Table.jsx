import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import DatePickerMultiple from 'react-multi-date-picker'
import { DateTime } from 'luxon'
import axios from 'axios'
import {AiFillFileAdd} from 'react-icons/ai'
import {GiNextButton,GiPreviousButton} from 'react-icons/gi'

import "react-datepicker/dist/react-datepicker.css";
import { addOneDay, calculateMonthYear, formatDateTime, formatTimestamp, getProperFormat, timestampToDate } from "../../utils/dateutils";
import { createArray, paginate } from "../../utils/paginate";
const Table = () => {
  const baseURL = 'http://localhost:5000'
  const [itemsPerPage, setItemsPage] = useState(4)
  const [currentPage, setCurrentPage] = useState(1)
  const [allEntries, setAllEntries] = useState()
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [leadCount, setLeadCount] = useState(0);
  const [excludedDates, setExcludedDates] = useState([]);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [drr, setDrr] = useState(0);
  const [newExcluded,setNewExcluded] = useState([])
  const [showInputForm, setShowInputForm] = useState(false);
  const [monthYear, setMonthYear] = useState({
    month: '',
    year: ''
  });

  const [lastUpdated, setLastUpdated] = useState('');


  const resetValues = () => {
    setMonthYear({
      month: '',
      year: ''
    });

    setDrr(0);
    setExcludedDates([]);
    setNumberOfDays(0);
    setLeadCount(0);
    setEndDate();
    setStartDate();

  }

  const changePage = (page) => {
    console.log(page, currentPage)

    // ! when page is less than zero then go to last page
    if (page <= 0) {
      setCurrentPage(paginate(allEntries, 1, itemsPerPage).totalNumberOfPages)
      return
    }

    console.log(paginate(allEntries, 1, itemsPerPage).totalNumberOfPages)

    // ! when page is greater than last page then go to first page
    if (page > paginate(allEntries, 1, itemsPerPage).totalNumberOfPages) {
      setCurrentPage(1)
      return
    }
    setCurrentPage(page)
  }

  console.log(startDate)



 
// ! when the save button is clicked run this function
  const handleSave = async () => {


    // ! if any value is missing then alert 
    if (!startDate || !endDate || !numberOfDays || !monthYear.month || !monthYear.year || !drr || !leadCount) {

      alert('fields missing')

      return
    }

    // ! pack the entry data in an object so it is more clear
    const entryData = { startDate, endDate, excludedDates:newExcluded, leadCount, numberOfDays, monthYear, drr }

    // ! api request
    try {
      const response = await axios.post(`${baseURL}/api/entries`,
        entryData)

        if(response.status===201){
          // ! go to the last page after adding an entry
        }
        
      console.log(response)
    } catch (error) {
      console.log(error)
    }


    // ! reset the values
    resetValues()

    
    // ! then call the api to get all entries ( this will update the latest entry & show)
    
    getAllEntries()

    // ! however I am using mongodb lastUpdated timestamp value but I used to show that this can also be handled on frontend

    setLastUpdated(formatTimestamp(Date.now()))

    // ! don't show the input form  after clicking save
    setShowInputForm(false)
  }



  // ! when a user makes any chages to excluded dates in the add entry form 
  'then only care about the last element in the excluded array and add it to newExcluded state variable'
  
  // reason : because it will trigger an infinite loop, I created a new state variable so that excluded dates will stay unaffected

  useEffect(()=>{
    // console.log(excludedDates[excludedDates.length-1])
    setNewExcluded(excludedDates[excludedDates.length-1])
  },[excludedDates])



  const handleExcluded = (date) => {
    console.log(date)
    console.log(date)

    // ! to persist data in the array using spread operator
    setExcludedDates( [...excludedDates, date]);

  }




  console.log(numberOfDays)


  // ! because drr(daily run rate) is dependent on numberOfDays & leadCount , recompute it when these two things change 

  useEffect(() => {
    if (leadCount) {

      setDrr(leadCount / numberOfDays)

    }
  }, [numberOfDays, leadCount])



  useEffect(() => {
    var start = DateTime.fromISO(getProperFormat(startDate));
    var end = DateTime.fromISO(getProperFormat(endDate));

    var diffInDays = end.diff(start, 'days').days;

    // ! this will get the difference between start date & end Date

    const range = diffInDays


    // ! this was the most daunting task to debug for me
    // ! the excluded dates array was coming as an array of objects and I needed the last index's length of that 
    const totalDays = range - ((excludedDates[excludedDates?.length - 1])?.length || 0)



    console.log((excludedDates[excludedDates?.length - 1])?.length)


    setNumberOfDays(totalDays)
  }, [excludedDates])


  
  useEffect(() => {

   // ! get the proper format & set month year
    if (startDate) {
      const { month, year } = calculateMonthYear(startDate)
      setMonthYear({
        month,
        year
      })
    }

    // ! reset the end date to nothing when start date changes

    setEndDate()
    setExcludedDates([{}])
  }, [startDate])

  // ! when end date changes, reset the excluded dates array to an empty object

  useEffect(() => {
    setExcludedDates([{}])
  }, [endDate])


// ! api call to get all entries
  const getAllEntries = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/entries`)

      // https://daily-run-rate-calc.onrender.com


      if (response?.status === 200) {

        setAllEntries(response?.data?.data)
      }

    } catch (error) {
      console.log(error)
    }
  }





  useEffect(() => {
    getAllEntries()
  }, [])


  return (
    <div className="h-screen  ">
      <div className="md:w-[40rem] lg:w-[80rem] mx-auto  overflow-x-auto">
        {
          !showInputForm && <div className="w-[10rem] text-4xl mt-4">
            <button className="" onClick={() => setShowInputForm(true)}><AiFillFileAdd /></button>
          </div>
        }
        {showInputForm && <table className="table  text-lg border border-black  border-collapse sm:w-[30rem] md:[w-40rem]  lg:w-[60rem] mx-auto" style={{ border: '1px solid black', borderCollapse: 'collapse' }} >
          {/* head */}
          <thead>
            <tr>
              <th>Action</th>
              <th>ID</th>
              <th>Month,year</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th> Dates Excluded </th>
              <th> Number of Days </th>
              <th>Lead Count</th>
              <th>Expected DRR</th>
              <th>Last Updated</th>

            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <td >N/A</td>
              <td>1</td>
              <td> {!startDate && 'First Choose Start Date' || `${monthYear?.month} , ${monthYear.year}`}        </td>
              <td className="relative"> <DatePicker  selected={startDate} placeholderText="choose start date" onChange={(date) => setStartDate(date)} className="input w-[5rem] text-xs p-1" />

                {startDate && <span className="absolute bottom-3 left-9 text-blue-400 hover:cursor-pointer" onClick={() => setStartDate()}>clear</span>}</td>

              {/*  ! end Date */}
              <td className="relative "> <DatePicker minDate={addOneDay(startDate)} placeholderText={!startDate && 'choose endDate'} disabled={!startDate} selected={endDate} onChange={(date) => setEndDate(date)} className="input w-[5rem] text-xs p-1" />
                {endDate && <span className="absolute bottom-3 left-9 text-blue-400 hover:cursor-pointer" onClick={() => setEndDate()}>clear</span>}
              </td>
              <td className="z-[100]"> <DatePickerMultiple  calendarPosition="right" style={{
                
              }}  disabled={!startDate || !endDate}
                value={excludedDates[excludedDates.length - 1]}
                multiple minDate={startDate} maxDate={endDate} selected={excludedDates}
                onChange={handleExcluded} className="input text-xs p-1 " /></td>
              <td> <input className="w-[5rem]" type="text" value={numberOfDays} disabled /></td>
              <td><input className='input w-[5rem] text-xs p-1' value={leadCount} type="text" placeholder='0' disabled={!startDate || !endDate} onChange={(e) => setLeadCount(e.target.value)} /></td>
              <td><input className='input w-[5rem] text-xs p-1' type="text" placeholder='0' value={leadCount ? drr : 'first enter lead count'} disabled /></td>
              <td className='flex flex-col'>
                <span className="btn  btn-primary text-xs p-1" onClick={() => handleSave()}>Save</span>
                <span className="btn btn-danger text-xs p-1" onClick={() => setShowInputForm(false)}>Cancel</span>
              </td>

            </tr>
            {/* row 2 */}

            {/* row 3 */}


          </tbody>
        </table>}


        <div className="mt-10 sm:w-[20rem]  md:w-[40rem] lg:w-[60rem]  overflow-x-auto mx-auto">

          <div className="flex justify-center gap-4 items-center">
            <>
            </>
            <div className="mb-10 flex gap-4">
              <span className="btn btn-primary" onClick={() => changePage(currentPage - 1)}>Prev</span>
              <select className="select" name="" id="" onChange={(e) => changePage(e.target.value)} value={currentPage}>
                {allEntries && createArray(paginate(allEntries, currentPage, itemsPerPage).totalNumberOfPages).map((item) => {
                  return <option>{item} </option>
                })}
              </select>
              <span className="btn btn-primary" onClick={() => changePage(currentPage + 1)}>Next</span>
            </div>

          </div>
          <table className="table text-lg border border-black  border-collapse   lg:w-[100%] mx-auto" style={{ border: '1px solid black', borderCollapse: 'collapse' }} >
            {/* head */}
            <thead>
              <tr>
                <th>Action</th>
                <th>ID</th>
                <th>Month,year</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th> Dates Excluded </th>
                <th> Number of Days </th>
                <th>Lead Count</th>
                <th>Expected DRR</th>
                <th>Last Updated</th>

              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {
                allEntries?.length > 0 &&
                paginate(allEntries, currentPage, itemsPerPage).itemsForCurrentPage.map((entry, idx) => {
                  return <tr>
                    <td>N/A</td>

                    {/* // ! after thinking for a bit I found this myself (without chatgpt) */}
                    {/* <td>{idx+1}</td> */}
                    <td> {(idx + 1) + (parseInt(currentPage) * 2) - 2} </td>
                    <td className="sm:text-xs"> {entry.monthYear.month},{entry.monthYear.year} </td>
                    <td className="relative sm:text-xs text-md">

                      {timestampToDate(entry.startDate)}</td>

                    {/*  ! end Date */}
                    <td className="relative sm:text-xs text-md"> {timestampToDate(entry.endDate)}</td>
                    <td className="text-center">

                      {entry.excludedDates.length === 0 && "No excluded Dates"}
                      {entry.excludedDates.map((item, index) => {

                        // ! because the database is structured such that the first index is coming empty always regardless
                     

                        return <>
                          <span className="text-sm">{item && timestampToDate(item)}</span>
                          <br />
                        </>
                      })}  </td>
                    <td> {entry.numberOfDays}</td>
                    <td>
                      {entry.leadCount}
                    </td>
                    <td>
                      {entry.drr.toFixed(2)}
                    </td>
                    <td className='flex flex-col text-sm'>
                      {formatDateTime(entry.updatedAt)}
                    </td>

                  </tr>
                })
              }
              {/* row 2 */}

              {/* row 3 */}


            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default Table
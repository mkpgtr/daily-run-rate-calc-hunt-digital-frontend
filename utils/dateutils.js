import { DateTime } from "luxon";

export const getProperFormat = (inputDate)=>{


    const inputDateString = inputDate

    const parsedDate = DateTime.fromJSDate(new Date(inputDateString));

const formattedDate = parsedDate.toFormat("yyyy-MM-dd");
console.log(formattedDate);

return formattedDate


}


export const calculateMonthYear = (datestring) => {
    const date = new Date(datestring);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return { month, year };
}

export function timestampToDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  



export const addOneDay = (dateString) => {
    const date = DateTime.fromJSDate(new Date(dateString));
    const newDate = date.plus({ days: 1 });
    return newDate.toJSDate();
};


export const formatTimestamp = (timestamp) => {
    const dateTime = DateTime.fromMillis(timestamp);
    return dateTime.toFormat('yyyy-MM-dd HH:mm:ss');
};


export function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
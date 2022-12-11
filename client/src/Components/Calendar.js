import React from "react";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import "./styles.scss";

function daysInThisMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function weekCount(year, month_number) {

    // month_number is in the range 1..12

    var firstOfMonth = new Date(year, month_number - 1, 1);
    var lastOfMonth = new Date(year, month_number, 0);

    var used = firstOfMonth.getDay() + lastOfMonth.getDate();

    return Math.ceil(used / 7);
}

function renderHead() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return (
        <tr>
            {days.map(day => (
                <td>
                    <Paper variant="outlined" square sx={{ padding: "2em" }}>
                        {day}
                    </Paper>
                </td>
            ))}
        </tr>
    );
}

function renderWeek(startIndex, startDate, endOfMonth) {
    const rows = [];
    let current = startDate;
    for (let i = 0; i < 7; i++) {
        if (i >= startIndex && current <= endOfMonth) {
            rows.push(<td key={i}><Paper variant="outlined" square sx={{ padding: "2em" }}>
                {current}
            </Paper></td>);
            current = current + 1;
        } else {
            rows.push(<td key={i}><Paper variant="outlined" square sx={{ padding: "2em" }}>
                {" "}
            </Paper></td>);
        }
    }
    return (
        <tr key={startDate}>
            {rows}
        </tr>
    );
}
function getDayIndex(year, month) {
    var date = new Date(year, month - 1, 1);
    return date.getDay();
}
export default function (params) {
    let now = new Date(2022, 11);
    let days = daysInThisMonth(now);
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    let numberOfWeeks = weekCount(currentYear, currentMonth);
    const rows = [];
    let startIndex = getDayIndex(currentYear, currentMonth);
    console.log(days);
    let currentDay = 1;
    rows.push(renderWeek(startIndex, 1, days));
    currentDay = currentDay + (7 - startIndex);
    for (let i = 1; i < numberOfWeeks; i++) {
        rows.push(renderWeek(0, currentDay, days));
        currentDay += 7;
    }
    return (
        <table>
            <thead>
                {renderHead()}
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}
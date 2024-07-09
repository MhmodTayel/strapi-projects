'use strict';
const { DateTime, Interval } = require('luxon');
const _ = require('lodash');

// playground https://jsfiddle.net/bxomp5fc/

function todayDateStrapi() {
    return toStrapiFormat(getTodayDate());
}

function nowDateTimeStrapi() {
    return DateTime.local().toISO();
}

function parseDate(date) {
    return DateTime.fromFormat(date, 'yyyy-MM-dd');
}

function parseDateTime(date) {
    return DateTime.fromISO(date);
}

function toStrapiFormat(date) {
    if (_.isDate(date)) {
        // if its a js date
        return DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
    }

    return date.toFormat('yyyy-MM-dd');
}

function dateAndTimeToStrapiFormat(date, time) {
    var timeString = time.split(':');
    var hours = timeString[0];
    var minutes = timeString[1];

    var converted = DateTime.fromFormat(date + ' ' + hours + ':' + minutes, 'yyyy-MM-dd HH:mm').toISO();
    if (converted == null) converted = DateTime.fromFormat(date + ' ' + time, 'yyyy-MM-dd HH:mm:ss').toISO();
    if (converted == null) converted = DateTime.fromFormat(date + ' ' + time, 'yyyy-MM-dd HH:mm:ss.SS').toISO();
    if (converted == null) converted = DateTime.fromFormat(date + ' ' + time, 'yyyy-MM-dd HH:mm:ss.SSS').toISO();

    return converted;
}

function addDays(date, days) {
    return date.plus({ days: days });
}

function subtractDays(date, days) {
    return date.minus({ days: days });
}

function getTodayDate() {
    var dt = DateTime.now();
    var dateOnlyIso = dt.toISODate();
    var todayDate = DateTime.fromFormat(dateOnlyIso, 'yyyy-MM-dd');
    return todayDate;
}

function toDayOfWeek(date) {
    return date.toFormat('cccc');
}

function strapiDateToDayOfWeek(date) {
    return parseDate(date).toFormat('cccc');
}

function strapiDateToFormat(date, format) {
    return parseDate(date).toFormat(format || 'dd/MM/yyyy');
}

function strapiDateTimeToFormat(date, format) {
    return parseDateTime(date).toFormat(format || 'dd/MM/yyyy HH:mm');
}

function strapiTimeToFormat(date, format) {
    return DateTime.fromFormat(date, 'HH:mm:ss').toFormat(format || 'hh:mm a');
}

function getDayIndex(day) {
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return daysOfWeek.indexOf(day);
}

function changeDate(oldDay, newDay, oldDate, startDate, endDate) {
    const oldDayIndex = getDayIndex(oldDay);
    const newDayIndex = getDayIndex(newDay);
    const dayDifference = newDayIndex - oldDayIndex;

    const oldDateParsed = parseDateTime(oldDate);
    const newDate = addDays(oldDateParsed, dayDifference);

    const startDateParsed = parseDateTime(startDate);
    const endDateParsed = parseDateTime(endDate);
    const interval = Interval.fromDateTimes(startDateParsed, endDateParsed);

    if (interval.contains(newDate)) {
        return newDate.toISODate();
    }
    return null;
}

function fillGaps(startDate, endDate, newDay) {

    const newDayIndex = getDayIndex(newDay);
    const startDateParsed = parseDateTime(addDays(parseDate(startDate), 1));
    const endDateParsed = parseDateTime(addDays(parseDate(endDate), -1));

    let newDates = [];
    const interval = Interval.fromDateTimes(startDateParsed, endDateParsed);
    let startNewDate = addDays(startDateParsed, (newDayIndex - startDateParsed.weekday + 7) % 7);

    while (interval.contains(startNewDate)) {
        newDates.push(startNewDate.toISODate())
        startNewDate = startNewDate.plus({ days: 7 });
    }
    return newDates;
}

module.exports = {
    todayDateStrapi,
    nowDateTimeStrapi,
    parseDate,
    parseDateTime,
    toStrapiFormat,
    dateAndTimeToStrapiFormat,
    addDays,
    subtractDays,
    getTodayDate,
    toDayOfWeek,
    strapiDateToDayOfWeek,
    strapiDateToFormat,
    strapiDateTimeToFormat,
    strapiTimeToFormat,
    changeDate,
    fillGaps
};

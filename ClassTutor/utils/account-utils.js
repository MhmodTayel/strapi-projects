'use strict';
const crypto = require('crypto');
const _ = require('lodash');

function randomUUID() {
    return crypto.randomUUID();
}

function generateRandomEmail() {
    return crypto.randomUUID() + "@noemail.com";
}

function generateRandomPassword() {
    return crypto.randomBytes(3 * 4).toString('base64');
}

function generateReadableRandomPassword() {
    return generateString(3, "ABCDEFGHIJKLMNOPQRSTUVWXYZ") + generateString(5, "0123456789");
}

function generateString(length, characters) {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function generateUsername(fName, lName) {
    // TODO: check if username is unique in database

    var separateNames = getSeparateNames(fName, lName);

    var totalSubStringLength = 9;
    var firstSubStringLength = 8;
    var rndNumber = zeroPad(getRndInteger(0, 999), 3);
    var firstSubString = separateNames.fName.toLowerCase().replace(/\s/g, "").substring(0, firstSubStringLength);
    var secondSubString = separateNames.lName.toLowerCase().replace(/\s/g, "").substring(0, totalSubStringLength - firstSubString.length);

    return firstSubString + secondSubString + rndNumber;
}

function getSeparateNames(fName, lName) {
    fName = fName.trim();

    if (!lName) {
        if (/\s/.test(fName)) {
            // has multiple words

            lName = fName.split(" ").splice(-1)[0].trim(); // get last word
            fName = fName.replace(/\w+[.!?]?$/, '').trim(); // remove last word and space
        } else {
            lName = fName;
        }
    }

    return {
        lName: lName.trim(),
        fName: fName.trim()
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

function cleanEmail(email) {
    if (email.toLowerCase().includes("@noemail.com"))
        return "";
    return email.toLowerCase();
}

module.exports = {
    randomUUID,
    generateRandomEmail,
    generateRandomPassword,
    generateReadableRandomPassword,
    generateUsername,
    getSeparateNames,
    cleanEmail
}
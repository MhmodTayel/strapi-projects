/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable indent */
//replace a substring in a string (only first occurrence)
const replaceNextSubstring = (string, substring, newSubstring) => {
   if (!string) return string;
   //escape special characters from the substring
   const escapedSubstring = escapeForRegex(substring)
   const regex = new RegExp(escapedSubstring)
   return string.replace(regex, newSubstring)
}

//escape special characters from a string that can't be used directly in a regular expression
const escapeForRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// splitStringAroundSubstring: split a string in two parts on both sides of a substring
// return an array with the part on the left of the substring and the part on the right of the substring
const splitStringAroundSubstring = (str, sub) => {
   let splitIndex = str.indexOf(sub);
   return [str.substring(0, splitIndex), str.substring(splitIndex + sub.length)];
}

module.exports = {
   replaceNextSubstring,
   splitStringAroundSubstring
}
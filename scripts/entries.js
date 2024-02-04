import { targetTitleClassList } from './linkedout.js'

export function getDateEntry() {
    let date = new Date();
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // JavaScript months are 0-based.
    let year = date.getFullYear().toString().substr(-2); // Get last two digits of year

    return month + '/' + day + '/' + year;
}

export function getLinkEntry() {
    const link = document.URL.split('&')[0]
    return `=HYPERLINK("${link}", "Link")`
}

export function getJobNameEntry() {
    const title = document.getElementsByClassName(targetTitleClassList)[0].innerText
    return title.split(' · ')[0]
}
const targetCompanyNameClassList = 'job-details-jobs-unified-top-card__primary-description-without-tagline'
const targetPositionNameClassList = 'job-details-jobs-unified-top-card__job-title-link'

export function getDateEntry() {
    let date = new Date()

    let day = String(date.getDate()).padStart(2, '0')
    let month = String(date.getMonth() + 1).padStart(2, '0')
    let year = date.getFullYear()

    return `=DATE(${year},${month},${day})`
}

export function getLinkEntry() {
    const link = document.URL.split('&')[0]
    return `=HYPERLINK("${link}", "Link")`
}

export function getCompanyEntry() {
    const company = document.getElementsByClassName(targetCompanyNameClassList)[0].innerText
    return company.split(' · ')[0]
}

export function getJobNameEntry() {
    const title = document.getElementsByClassName(targetPositionNameClassList)[0].innerText
    return title.split(' · ')[0]
}
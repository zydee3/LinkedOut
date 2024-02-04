import { readColumn, writeRow, getColumnIdx } from './sheet.js'

/* Begin Region: Notification Handling ---------------------------- */

export async function establishNotificationPermission() {
    if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
            console.log('Notification permission denied')
        } else {
            console.log('Notification permission granted')
        }
    }

    return Notification.permission
}

function sendNotification(title, message) {
    if (Notification.permission === "granted") {
        new Notification(title, { body: message });
    }
}

/* End Region: Notification Handling ------------------------------ */
/* Begin Region: Sheet Preprocessing and Handling ----------------- */

const formulaExpr = /currentJobId=(\d+)/


function extractJobId(link) {
    const match = link.match(formulaExpr)
    return match ? parseInt(match[1]) : -1
}

function containsJobId(formulas, jobId) {
    if (formulas.length === 0) {
        return false
    }

    for (let formula of formulas) {
        if (extractJobId(formula) === jobId) {
            return true
        }
    }

    return false
}

async function getWriteRowIdx(sheetID, sheetCapacity, columnLink, jobId) {
    const formulaData = await readColumn(sheetID, sheetCapacity, columnLink)
    const jobExists = containsJobId(formulaData, jobId)

    if (jobExists) {
        return -1;
    }

    return formulaData.length + 2
}

/* End Region: Sheet Preprocessing and Handling ------------------- */
/* Begin Region: LinkedIn Event Listeners and Scraping ------------ */

let entryTemplate
export const targetParentClassList = "jobs-search__job-details"
export const targetButtonClassList = "artdeco-button__text"
export const isTargetButtonText = (text) => text === "Apply" || text === "Easy Apply"
export const targetTitleClassList = "job-details-jobs-unified-top-card__primary-description-without-tagline"


export async function createListeners(sheetID, sheetCapacity, columnLink, data) {
    entryTemplate = data
    const parentContainer = document.getElementsByClassName(targetParentClassList)[0]
    parentContainer.addEventListener('click', async function(event) {

        if (isTargetButtonText(event.target.innerText)) {
            event.stopPropagation()

            const jobId = extractJobId(document.URL)
            const nextRowIdx = await getWriteRowIdx(sheetID, sheetCapacity, columnLink, jobId)

            console.log(`nextRowIdx: ${nextRowIdx}`)
            
            if (nextRowIdx === -1) {
                sendNotification("LinkedOut", "You have already applied to this job.")
                return
            }

            const data = []
            const encodings = []
            
            for (let key in entryTemplate) {
                const entry = entryTemplate[key]
                data[getColumnIdx(key)] = entry.f()
                encodings[getColumnIdx(key)] = entry.type
            }

            writeRow(sheetID, nextRowIdx, data, encodings)
        }
    })

    console.log("Listeners created")
}

/* End Region: LinkedIn Event Listeners and Scraping -------------- */
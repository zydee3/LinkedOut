import { establishNotificationPermission, createListeners } from './linkedout.js'
import { getDateEntry, getCompanyEntry, getJobNameEntry, getLinkEntry } from './entries.js'

const sheetID = "1kKSPvoOdJAnhbnEqhvy65mUk-MPp7Yy5QjDntIIcW9s"
const sheetCapacity = 1000
const columnLink = "D"

const data = {
    "A": {
        "f": getDateEntry,
        "type": "formula"
    },
    "B": {
        "f": getCompanyEntry,
        "type": "string"
    },
    "C": {
        "f": getJobNameEntry,
        "type": "string"
    },
    "D": {
        "f": getLinkEntry,
        "type": "formula"
    }
}

establishNotificationPermission()
createListeners(sheetID, sheetCapacity, columnLink, data)
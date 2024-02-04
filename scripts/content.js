import { establishNotificationPermission, createListeners } from './linkedout.js'
import { getDateEntry, getJobNameEntry, getLinkEntry } from './entries.js'

const sheetID = "1kKSPvoOdJAnhbnEqhvy65mUk-MPp7Yy5QjDntIIcW9s"
const sheetCapacity = 1000
const columnLink = "C"

const data = {
    "A": {
        "f": getDateEntry,
        "type": "string"
    },
    "B": {
        "f": getJobNameEntry,
        "type": "string"
    },
    "C": {
        "f": getLinkEntry,
        "type": "formula"
    }
}

establishNotificationPermission()
createListeners(sheetID, sheetCapacity, columnLink, data)
/* Begin Region: Helper Functions --------------------------------- */

function getAccessToken() {
    return new Promise((resolve, _) => {
        chrome.runtime.sendMessage({ action: 'getAuthToken' }, (token) => {
            if (token) {
                resolve(token)
            } else {
                throw new Error('Invalid access token for Google Sheets API.')
            }
        })
    })
}

function getSheetBaseURL() {
    return 'https://sheets.googleapis.com/v4/spreadsheets'
}

/* End Region: Helper Functions ----------------------------------- */
/* Begin Region: Read from Google Sheets -------------------------- */

export function getColumnIdx(columnLetter) {
    if (!columnLetter.match(/[a-zA-Z]/i)) {
        throw new Error("Invalid column letter")
    }

    if (columnLetter.match(/[a-z]/)) {
        columnLetter = columnLetter.toUpperCase()
    }

    let columnIdx = 0

    // A => 1, B => 2, ..., Z => 26, AA => 27, AB => 28, ...
    for (let i = 0; i < columnLetter.length; i++) {
        columnIdx += (columnLetter.charCodeAt(i) - 'A'.charCodeAt(0)) * Math.pow(26, columnLetter.length - i - 1)
    }

    return columnIdx
}

function createColumnReadURL(sheetID, sheetCapacity, sheetColumn) {
    const sheetBaseURL = getSheetBaseURL()
    const sheetRange = `${sheetColumn}2:${sheetColumn}${sheetCapacity}`
    const parameters = '?valueRenderOption=FORMULA'
    return `${sheetBaseURL}/${sheetID}/values/${sheetRange}${parameters}`
}

async function createColumnReadHeader() {
    const token = await getAccessToken()

    return {
        method: 'GET',
        async: true,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
}

export async function readColumn(sheetID, sheetCapacity, sheetColumn) {
    const request = createColumnReadURL(sheetID, sheetCapacity, sheetColumn)
    const header = await createColumnReadHeader()
 
    try {
        const response = await fetch(request, header)
        const jsonData = await response.json()

        if (!jsonData.values || jsonData.values.length === 0) {
            return []
        }

        return jsonData.values
            .filter((posting_data) => posting_data[0] !== undefined)
            .map((posting_data, _) => posting_data[0])
    } catch (error) {
        console.log(error)
    }
}

/* End Region: Read from Google Sheets ---------------------------- */
/* Begin Region: Write to Google Sheets --------------------------- */

function createWriteURL(sheetID) {
    return `${getSheetBaseURL()}/${sheetID}:batchUpdate`
}

function createRowUpdateEntry(rowIdx, data, encodings) {
    let updates = [];
    let startColumnIdx = -1;
    let endColumnIdx = -1;

    for (let i = 0; i < data.length; i++) {
        const value = data[i];

        if (value) {
            if (encodings[i] === "formula") {
                updates[i] = { userEnteredValue: { formulaValue: value } };
            } else {
                updates[i] = { userEnteredValue: { stringValue: value } };
            }

            if (startColumnIdx === -1) {
                startColumnIdx = i;
            }

            endColumnIdx = i + 1;
        }
    }

    return {
        updateCells: {
            range: {
                sheetId: 0,
                startRowIndex: rowIdx - 1,
                endRowIndex: rowIdx,
                startColumnIndex: startColumnIdx,
                endColumnIndex: endColumnIdx,
            },
            rows: [{ values: updates }],
            fields: "*"
        }
    };
}

async function createWriteHeader(rowIdx, data, encodings) {
    const entry = createRowUpdateEntry(rowIdx, data, encodings)
    const token = await getAccessToken()

    return {
        method: 'POST',
        async: true,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            requests: [entry],
        }),
    };
}

export async function writeRow(sheetID, rowIdx, data, encodings) {
    const header = await createWriteHeader(rowIdx, data, encodings)
    const request = createWriteURL(sheetID)

    try {
        const response = await fetch(request, header)

        if (!response.ok) {
            throw new Error('Failed to write to Google Sheets.')
        }

        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

/* End Region: Write to Google Sheets ----------------------------- */
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.action === 'getAuthToken') {
        chrome.identity.getAuthToken({ interactive: true }, token => {
            if (chrome.runtime.lastError) {
                throw new Error(chrome.runtime.lastError.message);
            } 

            sendResponse(token);
            
        });

        return true;
    }
});
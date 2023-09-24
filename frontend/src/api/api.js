

async function makeRequest(method, endpoint, data={}, token=false) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
        method: method, // Verwenden Sie die Methode aus den Parametern
        headers: headers,
        body: JSON.stringify(data)
    });

    const jsonData = await response.json();
    if (!response.ok) {
        throw new Error(jsonData.message);
    }

    return jsonData;
}


export {makeRequest}

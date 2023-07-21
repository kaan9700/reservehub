async function makePostRequest(endpoint, data, token=false) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // console.log('POST', data);

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });

    const jsonData = await response.json();

    if (!response.ok) {
        throw new Error(jsonData.message);
    }

    return jsonData;
}

export {makePostRequest}

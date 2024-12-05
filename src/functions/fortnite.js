async function getPlayerStats(playerName) {
    const url = `https://fortnite-api.com/v2/stats/br/v2?name=${playerName}&accountType=epic`
    const apiKey = process.env.fortniteAPIKey;
    const headers = {
        "Authorization": apiKey,
        "User-Agent": "RefugeeBot by ninju"
    }
    const response = await fetch(url, {
        headers: headers
    }).then(response => response.json());
    return response;
}
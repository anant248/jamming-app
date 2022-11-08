const clientId = '2cbcde00cd8e4c1a80cd94616d1366f6';
const redirectUri = 'http://keep-jamming.surge.sh';
let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // check for an access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);   // from the url of the page retrieves the access token using regex
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);  // from the url of the page retrieves the expires in using regex

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            // Clears the parameters, allowing us to grab a new access token when the old one expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else { // redirects to the base URI
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        })
    },

    savePlaylist(name, trackUris) {
        // checks if values are saved to the arguments
        if (!name || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userId;

        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: name})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, 
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackUris})
                })
            })
        })
    }
}

export default Spotify;
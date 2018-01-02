//import fetch from 'cross-fetch';

let API_ENDPOINT = 'http://localhost:5000/api';

export const NEW_DOWNLOAD = 'NEW_DOWNLOAD';
export function newDownload(url) {
  return {
    type: NEW_DOWNLOAD,
    url: url
  }
}

export const DOWNLOAD_CREATED = 'DOWNLOAD_CREATED';
export function downloadCreated(json) {
  return {
    type: DOWNLOAD_CREATED,
    data: json,
    receiveAt: Date.now()
  }
}

export const REQUEST_DOWNLOADS = 'REQUEST_DOWNLOADS';
export function requestDownloads() {
  return {
    type: REQUEST_DOWNLOADS
  }
}

export const RECEIVE_DOWNLOADS = 'RECEIVE_DOWNLOADS';
export function receiveDownloads(json) {
  return {
    type: RECEIVE_DOWNLOADS,
    data: json,
    receivedAt: Date.now()
  }
}

export const RECEIVE_DOWNLOAD_PROGRESS = 'RECEIVE_DOWNLOAD_PROGRESS';
export function receiveDownloadProgress(json) {
  return {
    type: RECEIVE_DOWNLOAD_PROGRESS,
    data: json,
    receivedAt: Date.now()
  }
}

export const DOWNLOAD_FINISHED = 'DOWNLOAD_FINISHED';
export function downloadFinished(json) {
  return {
    type: DOWNLOAD_FINISHED,
    data: json,
    receiveAt: Date.now()
  }
}

export function createNewDownload(url) {
  return (dispatch) => {
    dispatch(newDownload(url));

    let apiUrl = `${API_ENDPOINT}/downloads/new`;
    return fetch(apiUrl, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url})
    })
    .then(response => response.json())
    .then(json => dispatch(downloadCreated(json)))
    .catch(error => console.log('An error occurred.', error));
  }
}

export function fetchDownloads() {
  return (dispatch) => {
    dispatch(requestDownloads());

    let apiUrl = `${API_ENDPOINT}/downloads/all`;
    /*
    return fetch(apiUrl)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      )
      .then(
        json => dispatch(receiveDownloads(json))
      );
      */
    return fetch(apiUrl)
      .then(response => response.json())
      .then(json => dispatch(receiveDownloads(json)))
      .catch(error => console.log('An error occurred.', error));
  }
}

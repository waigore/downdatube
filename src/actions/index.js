import fetch from 'cross-fetch';

let API_ENDPOINT = 'http://localhost:5000/api';

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

export function fetchDownloads() {
  return (dispatch) => {
    dispatch(requestDownloads());

    let url = `${API_ENDPOINT}/downloads/all`;
    return fetch(url)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      )
      .then(
        json => dispatch(receiveDownloads(json))
      );
  }
}

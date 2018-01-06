//import fetch from 'cross-fetch';

const API_ENDPOINT = 'http://localhost:5000/api';

export const NEW_DOWNLOAD = 'NEW_DOWNLOAD';
export function newDownload(url) {
  return {
    type: NEW_DOWNLOAD,
    url: url
  }
}

export const NEW_DOWNLOAD_CREATED = 'NEW_DOWNLOAD_CREATED';
export function newDownloadCreated(json) {
  return {
    type: NEW_DOWNLOAD_CREATED,
    data: json,
    receiveAt: Date.now()
  }
}

export const NEW_DOWNLOAD_FAILED = 'NEW_DOWNLOAD_FAILED';
export function newDownloadFailed(error) {
  return {
    type: NEW_DOWNLOAD_FAILED,
    error: error
  }
}

export const RESET_NEW_DOWNLOAD_VIEW_STATE = 'RESET_NEW_DOWNLOAD_VIEW_STATE';
export function resetNewDownloadViewState() {
  return {
    type: RESET_NEW_DOWNLOAD_VIEW_STATE
  }
}

export const REQUEST_DOWNLOADS = 'REQUEST_DOWNLOADS';
export function requestDownloads() {
  return {
    type: REQUEST_DOWNLOADS
  }
}

export const DOWNLOADS_RECEIVED = 'DOWNLOADS_RECEIVED';
export function downloadsReceived(json) {
  return {
    type: DOWNLOADS_RECEIVED,
    data: json,
    receivedAt: Date.now()
  }
}

export const REQUEST_DOWNLOAD_PROGRESS = 'REQUEST_DOWNLOAD_PROGRESS';
export function requestDownloadProgress(ids) {
  return {
    type: REQUEST_DOWNLOAD_PROGRESS,
    ids: ids
  }
}

export const DOWNLOAD_PROGRESS_RECEIVED = 'DOWNLOAD_PROGRESS_RECEIVED';
export function downloadProgressReceived(json) {
  return {
    type: DOWNLOAD_PROGRESS_RECEIVED,
    data: json,
    receivedAt: Date.now()
  }
}

export function createNewDownload(url) {
  return (dispatch) => {
    dispatch(newDownload(url));

    let apiUrl = `${API_ENDPOINT}/add_download`;
    return fetch(apiUrl, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url})
    })
    .then(response => response.json())
    .then(json => dispatch(newDownloadCreated(json)))
    .catch(error => {
      console.log('An error occurred.', error),
        dispatch(newDownloadFailed(error))
    });
  }
}

export function fetchDownloads(byStatus) {
  return (dispatch) => {
    dispatch(requestDownloads());

    let apiUrl = `${API_ENDPOINT}/downloads/${byStatus}`;
    console.log('apiUrl:', apiUrl);

    return fetch(apiUrl)
      .then(response => response.json())
      .then(json => dispatch(downloadsReceived(json)))
      .catch(error => console.log('An error occurred.', error));
  }
}

export function fetchDownloadProgress(ids) {
  return (dispatch) => {
    dispatch(requestDownloadProgress(ids));

    let apiUrl = `${API_ENDPOINT}/downloads/byIdList`;
    console.log("ids:", ids);
    return fetch(apiUrl, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ids: ids})
    })
    .then(response => response.json())
    .then(json => dispatch(downloadProgressReceived(json)))
    .catch(error => console.log('An error occurred.', error));
  }
}

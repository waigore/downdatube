import {combineReducers} from 'redux';
import {
  REQUEST_DOWNLOADS,
  RECEIVE_DOWNLOADS,
  RECEIVE_DOWNLOAD_PROGRESS,
  DOWNLOAD_FINISHED
} from '../actions';

const mergeDownloadItems = function(items, newItems) {
  let newItemIds = newItems.map(item => item.id);
  let updatedItems = items.filter(item => !newItemIds.includes(item.id));
  return updatedItems.concat(newItems);
}

const markDownloadItemFinished = function(items, finishedDownload) {
  for (let i = 0; i < items.length; ++i) {
    let item = items[i];
    if (item.id == finishedDownload.videoId) {
      item.status = 'FINISHED';
      item.status_pct = 100;
    }
  }
  console.log("Items:", items);
  return items;

  /*
  let finishedItem = items.reduce(item => item.id == finishedDownload.videoId);
  if (finishedItem) {
    finishedItem.status = 'FINISHED';
    finishedItem.status_pct = 100;
  }

  return items;
  */
}

const downloads = function(state = {items: []}, action) {
  switch (action.type) {
    case REQUEST_DOWNLOADS:
      return Object.assign({}, state);
    case RECEIVE_DOWNLOADS:
      return Object.assign({}, state, {
        items: action.data.items
      });
    case RECEIVE_DOWNLOAD_PROGRESS:
      return Object.assign({}, state, {
        items: mergeDownloadItems(state.items, action.data.items)
      });
    case DOWNLOAD_FINISHED:
      return Object.assign({}, state, {
        items: markDownloadItemFinished(state.items, action.data.result)
      });
    default:
      return state;
  }
}

const appReducer = combineReducers({
  downloads: downloads
});

export default appReducer;

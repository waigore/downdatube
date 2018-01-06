import {combineReducers} from 'redux';
import moment from 'moment';
import {
  REQUEST_DOWNLOADS,
  RECEIVE_DOWNLOADS,
  RECEIVE_DOWNLOAD_PROGRESS
} from '../actions';

const statusValues = {
  DOWNLOADING: 0,
  QUEUED: 1,
  INITIAL: 2,
  FINISHED: 3
}

const sortDownloadItems = function(items) {
  items.sort((item1, item2) => {
    let statusDiff = statusValues[item1.status] - statusValues[item2.status];
    if (statusDiff != 0) return statusDiff;
    return moment(item2.queueDate).diff(moment(item1.queueDate));
  });
}

const mergeDownloadItems = function(items, newItems) {
  if (!newItems || newItems.length == 0) {
    return items;
  }

  let newItemIds = newItems.map(item => item.id);
  let updatedItems = items.filter(item => !newItemIds.includes(item.id)).concat(newItems);
  sortDownloadItems(updatedItems);
  return updatedItems;
}

const resetDownloadItems = function(items) {
  sortDownloadItems(items);
  return items;
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

}

const downloads = function(state = {items: []}, action) {
  switch (action.type) {
    case REQUEST_DOWNLOADS:
      return Object.assign({}, state);
    case RECEIVE_DOWNLOADS:
      return Object.assign({}, state, {
        items: resetDownloadItems(action.data.items)
      });
    case RECEIVE_DOWNLOAD_PROGRESS:
      return Object.assign({}, state, {
        items: mergeDownloadItems(state.items, action.data.items)
      });
    default:
      return state;
  }
}

const appReducer = combineReducers({
  downloads: downloads
});

export default appReducer;

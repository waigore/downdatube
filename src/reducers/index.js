import {combineReducers} from 'redux';
import moment from 'moment';
import {
  RESET_NEW_DOWNLOAD_VIEW_STATE,
  DOWNLOADS_RECEIVED,
  DOWNLOAD_PROGRESS_RECEIVED,
  NEW_DOWNLOAD_CREATED,
  NEW_DOWNLOAD_FAILED
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
    case DOWNLOADS_RECEIVED:
      return Object.assign({}, state, {
        items: resetDownloadItems(action.data.items)
      });
    case DOWNLOAD_PROGRESS_RECEIVED:
      return Object.assign({}, state, {
        items: mergeDownloadItems(state.items, action.data.items)
      });
    default:
      return state;
  }
}

const newDownload = function(state = {status: "INITIAL", videoId: null, error: null}, action) {
  switch (action.type) {
    case RESET_NEW_DOWNLOAD_VIEW_STATE:
      return Object.assign({}, state, {
        status: "INITIAL",
        videoId: null,
        error: null
      });
    case NEW_DOWNLOAD_CREATED:
      return Object.assign({}, state, {
        status: "SUCCESS",
        videoId: action.data.id,
        error: null
      });
    case NEW_DOWNLOAD_FAILED:
      return Object.assign({}, state, {
        status: 'ERROR',
        videoId: null,
        error: action.data.error
      });
    default:
      return state;
  }
}

const appReducer = combineReducers({
  downloads: downloads,
  newDownload: newDownload
});

export default appReducer;

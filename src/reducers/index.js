import {combineReducers} from 'redux';
import {
  REQUEST_DOWNLOADS,
  RECEIVE_DOWNLOADS,
  RECEIVE_DOWNLOAD_PROGRESS
} from '../actions';

const mergeDownloadItems = function(items, newItems) {
  let newItemIds = newItems.map(item => item.id);
  let updatedItems = items.filter(item => !newItemIds.includes(item.id));
  return updatedItems.concat(newItems);
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
      })
    default:
      return state;
  }
}

const appReducer = combineReducers({
  downloads: downloads
});

export default appReducer;

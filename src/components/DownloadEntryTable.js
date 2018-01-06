import React from 'react';
import Websocket from 'react-websocket';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Col, Progress, Table } from 'reactstrap';
import {
  requestDownloads,
  fetchDownloads,
  fetchDownloadProgress
} from '../actions';

let WS_ENDPOINT = 'ws://localhost:5000/';

class DownloadEntryTable extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //console.log("Fetching download entries on mount")
    //this.props.fetchDownloads(this.props.byStatus);

    console.log("Setting download progress background timer");
    this.timerId = setInterval(
      () => {
        /*if (!this.props.downloads) {
          return;
        }*/
        let ids = this.props.downloads.items
          .filter(entry => entry.status != 'FINISHED')
          .map(entry => entry.id);
        if (ids.length > 0) {
          this.props.fetchDownloadProgress(ids);
        }
      },
      2000
    );
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);
    /*
    if (nextProps.byStatus && this.props.byStatus !== nextProps.byStatus) {
      console.log("Fetching download entries");
      nextProps.fetchDownloads(nextProps.byStatus);
    }*/
  }

  componentWillUnmount() {
    console.log("Clearing download progress timer");
    clearInterval(this.timerId);
  }

  formatDownloadPct(pct) {
    return pct + "%";
  }

  formatStatus(s) {
    switch (s) {
      case 'INITIAL':
        return 'Initial';
      case 'QUEUED':
        return 'Queued';
      case 'DOWNLOADING':
        return 'Downloading';
      case 'FINISHED':
        return 'Finished';
      default:
        return s;
    }
  }

  renderStatus(downloadEntry) {
    switch (downloadEntry.status) {
      case 'INITIAL':
      case 'QUEUED':
        return (
          <div>{this.formatStatus(downloadEntry.status)}</div>
        );
      case 'DOWNLOADING':
        return (
          <Progress animated value={downloadEntry.status_pct}></Progress>
        );
      default:
        return (
          <div>{this.formatStatus(downloadEntry.status)}</div>
        );
    }
  }

  renderDownloads() {
    let i = 0;
    return this.props.downloads.items.map((downloadEntry) => {
      return (
        <tr key={downloadEntry.id}>
          <th scope="row">{++i}</th>
          <td>{downloadEntry.uploader || '???'}</td>
          <td>{downloadEntry.name || '???'}</td>
          <td>{this.renderStatus(downloadEntry)}</td>
        </tr>
      );
    });
  }

  render() {
    if (!this.props.downloads || !this.props.downloads.items) {
      return (
          <div>Loading...</div>
      );
    }
    /*else if (this.props.downloads.items.length == 0) {
      return (
        <div>{"Nothing here. Click 'New' to start downing some Tube!"}</div>
      );
    }*/
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Uploader</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.renderDownloads()}
          </tbody>
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {
        downloads: state.downloads
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      requestDownloads,
      fetchDownloads,
      fetchDownloadProgress
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadEntryTable);

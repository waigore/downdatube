import React from 'react';
import Websocket from 'react-websocket';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Col, Progress, Table } from 'reactstrap';
import {
  requestDownloads,
  receiveDownloads,
  receiveDownloadProgress,
  downloadFinished,
  fetchDownloads
} from '../actions';

let WS_ENDPOINT = 'ws://localhost:5000/';

class DownloadEntryTable extends React.Component {

  componentDidMount() {
    this.props.fetchDownloads();
  }

  componentWillUnmount() {
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

  handleWSData(data) {
    let dlData = JSON.parse(data);
    let msgType = dlData.msg;
    switch(msgType) {
      case 'ALL_DOWNLOADS':
        this.props.receiveDownloads(dlData);
        break;
      case 'DOWNLOAD_PROGRESS':
        this.props.receiveDownloadProgress(dlData);
        break;
      case 'DOWNLOAD_FINISHED':
        this.props.downloadFinished(dlData);
        break;
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
          <td>{downloadEntry.id}</td>
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
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.renderDownloads()}
          </tbody>
        </Table>
        <Websocket url={WS_ENDPOINT}
              onMessage={this.handleWSData.bind(this)}/>
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
      receiveDownloads,
      receiveDownloadProgress,
      downloadFinished,
      fetchDownloads
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadEntryTable);

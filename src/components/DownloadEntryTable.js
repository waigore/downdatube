import React from 'react';
import Websocket from 'react-websocket';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import { Badge, Button, Container, Col, Progress, Row, Table } from 'reactstrap';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';
import {
  requestDownloads,
  fetchDownloads,
  fetchDownloadProgress,
  doRemoveDownload
} from '../actions';

let WS_ENDPOINT = 'ws://localhost:5000/';

class RemoveRow extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.removeHandler(this.props.value);
  }

  render() {
    return (
      <div onClick={this.handleClick}><FaTimesCircle /></div>
    );
  }
}

class DownloadEntryTable extends React.Component {

  constructor(props) {
    super(props);

    this.removeRow = this.removeRow.bind(this);
  }

  componentDidMount() {
    console.log("Setting download progress background timer");
    this.timerId = setInterval(
      () => {
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
  }

  componentWillUnmount() {
    console.log("Clearing download progress timer");
    clearInterval(this.timerId);
  }

  removeRow(entry) {
    console.log(entry);
    this.props.doRemoveDownload(entry.id);
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

  renderName(downloadEntry) {
    let queueDate = moment(downloadEntry.queueDate);
    console.log("Queue Date:", queueDate);
    let badgeColor = null;
    let badgeText = null;
    if (queueDate.dayOfYear() == moment().dayOfYear()) {
      badgeColor = 'primary';
      badgeText = 'today';
    }
    else {
      badgeColor = 'light';
      badgeText = queueDate.fromNow();
    }

    return (
      <div><Badge color={badgeColor}>{badgeText}</Badge> {downloadEntry.name || '???'}</div>
    );
  }

  renderStatus(downloadEntry) {
    switch (downloadEntry.status) {
      case 'INITIAL':
        return (
          <div>{this.formatStatus(downloadEntry.status)}</div>
        );
      case 'QUEUED':
        return (
          <div>
            {this.formatStatus(downloadEntry.status)}
            <RemoveRow removeHandler={this.removeRow} value={downloadEntry}/>
          </div>
        );
      case 'DOWNLOADING':
        return (
          <Container>
            <Row>
                <Col xs="6"><Progress animated value={downloadEntry.status_pct}></Progress></Col>
                <Col><RemoveRow removeHandler={this.removeRow} value={downloadEntry}/></Col>
            </Row>
          </Container>
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
          <td>{this.renderName(downloadEntry)}</td>
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
      fetchDownloadProgress,
      doRemoveDownload
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadEntryTable);

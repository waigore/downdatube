import React from 'react';
import Websocket from 'react-websocket';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import { Badge, Button, Container, Col, Progress, Row, Table, Tooltip } from 'reactstrap';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';
import {
  resetNewDownloadViewState,
  fetchDownloads,
  fetchDownloadProgress,
  doRemoveDownload
} from '../actions';
import {truncate} from '../util';

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
    this.toggleQueueDateTooltip = this.toggleQueueDateTooltip.bind(this);
    this.toggleDownloadPctTooltip = this.toggleDownloadPctTooltip.bind(this);

    this.state = {};
    this.updateTooltipToggleStates(props.downloads.items);
  }

  componentDidMount() {
    console.log("componentDidMount()");
    console.log("Setting download progress background timer");
    this.timerId = setInterval(
      () => {
        let ids = this.props.downloads.items
          .filter(entry => entry.status != 'FINISHED' && entry.status != 'ERROR')
          .map(entry => entry.id);
        if (ids.length > 0) {
          this.props.fetchDownloadProgress(ids);
        }
      },
      2000
    );

    this.updateTooltipToggleStates(this.props.downloads.items);
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps()", nextProps);

    this.updateTooltipToggleStates(nextProps.downloads.items);


    if (nextProps.newDownload.status != 'INITIAL')
    {
      console.log("Download entry table requests refresh!");
      this.props.fetchDownloads(nextProps.byStatus);
      this.props.resetNewDownloadViewState();
    }


  }

  componentWillUnmount() {
    console.log("componentWillUnmount()");
    console.log("Clearing download progress timer");
    clearInterval(this.timerId);
  }

  initTooltipToggleStates(downloadEntries) {
    console.log("Initializing tooltip toggle states based on download list")

  }

  updateTooltipToggleStates(downloadEntries) {
    console.log("Updating tooltip toggle states based on download list")
    downloadEntries.map(entry => {
      this.setState({
        ['queueDateTooltipOpen_'+entry.dbId]: false,
        ['downloadPctTooltipOpen_'+entry.dbId]: false
      });
    })
  }

  toggleQueueDateTooltip(entry) {
    this.setState({
      ['queueDateTooltipOpen_'+entry.dbId]: !this.state['queueDateTooltipOpen_'+entry.dbId]
    });
  }

  toggleDownloadPctTooltip(entry) {
    this.setState({
      ['downloadPctTooltipOpen_'+entry.dbId]: !this.state['downloadPctTooltipOpen_'+entry.dbId]
    });
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
    let badgeColor = null;
    let badgeText = null;
    if (queueDate.dayOfYear() == moment().dayOfYear()) {
      badgeColor = 'primary';
      badgeText = 'today';
    }
    else if (queueDate.dayOfYear() == moment().dayOfYear()-1) {
      badgeColor = 'light';
      badgeText = 'yesterday';
    }
    else {
      badgeColor = 'light';
      badgeText = queueDate.fromNow();
    }

    let name = downloadEntry.name || '???';

    return (
      <div>
        <Badge id={'queueDate_'+downloadEntry.dbId} color={badgeColor}>{badgeText}</Badge>
        {name}
        <Tooltip
            placement="top"
            isOpen={this.state['queueDateTooltipOpen_'+downloadEntry.dbId]}
            target={'queueDate_'+downloadEntry.dbId}
            toggle={() => this.toggleQueueDateTooltip(downloadEntry)}>
          {queueDate.fromNow()}
        </Tooltip>
      </div>
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
                <Col xs="6">
                  <Progress id={'downloadPct_'+downloadEntry.dbId} animated value={downloadEntry.status_pct}></Progress>
                  <Tooltip
                      placement="top"
                      isOpen={this.state['downloadPctTooltipOpen_'+downloadEntry.dbId]}
                      target={'downloadPct_'+downloadEntry.dbId}
                      toggle={() => this.toggleDownloadPctTooltip(downloadEntry)}>
                    {this.formatDownloadPct(downloadEntry.status_pct)}
                  </Tooltip>
                </Col>
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
    else if (this.props.downloads.items.length == 0) {
      return (
        <div>{"Nothing here. Paste some video URLs in the textbox above to start downing some Tube!"}</div>
      );
    }
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
        downloads: state.downloads,
        newDownload: state.newDownload
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      resetNewDownloadViewState,
      fetchDownloads,
      fetchDownloadProgress,
      doRemoveDownload
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadEntryTable);

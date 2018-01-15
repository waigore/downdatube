import React from 'react';
import { Alert, Button, Container, Col, Label, Input, Row, UncontrolledAlert } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NewDownloadErrorMsg from './NewDownloadErrorMsg';
import {
  createNewDownload,
  forceRedownload,
  fetchDownloads,
  resetNewDownloadViewState
} from '../actions';

class QuickDownloadWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      url: "",
      successAlertToggle: false,
      errorAlertToggle: false
    };

    this.dismissAllAlerts = this.dismissAllAlerts.bind(this);
    this.addDownload = this.addDownload.bind(this);
    this.forceDownload = this.forceDownload.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log("downloadWidget.componentWillReceiveProps:", nextProps);
    if (this.props.newDownload.status != nextProps.newDownload.status &&
        nextProps.newDownload.status != 'INITIAL') {

      this.setState({
        successAlertToggle: nextProps.newDownload.status == 'SUCCESS',
        errorAlertToggle: nextProps.newDownload.status == 'ERROR'
      });

      setTimeout(() => {
        this.dismissAllAlerts();
      }, 3000);
    }
  }

  forceDownload(videoId) {
    console.log("Force download", videoId);
    this.props.forceRedownload(videoId);
    this.setState({url: ""});
  }

  addDownload() {
    if (this.state.url == "") {
      return;
    }

    console.log(this.props.appSettings);
    //TODO obtain defaults from backend!
    let downloadOpts = {
      downloadAudio: this.props.appSettings.downloadAudio
    }
    this.props.createNewDownload(this.state.url, downloadOpts);
    this.setState({url: ""});
  }

  updateUrl(evt) {
    this.setState({
      url: evt.target.value
    });
  }

  dismissAllAlerts() {
    this.setState({
      successAlertToggle: false,
      errorAlertToggle: false
    });
  }

  /* TODO refactor into separate component so that you DRY!*/
  renderErrorAlertContents() {
    return (<NewDownloadErrorMsg error={this.props.newDownload.error} forceDownload={this.forceDownload} />);
  }

  renderAlerts() {
    switch (this.props.newDownload.status) {
      case 'SUCCESS':
      return (
        <Row>
          <Col>
            <Alert color="success" isOpen={this.state.successAlertToggle} toggle={this.dismissAllAlerts}>
            {'Video queued with id=' + this.props.newDownload.videoId + '.'}
            </Alert>
          </Col>
        </Row>
      )
      case 'ERROR':
      return (
        <Row>
          <Col>
            <Alert color="warning" isOpen={this.state.errorAlertToggle} toggle={this.dismissAllAlerts}>
            {this.renderErrorAlertContents()}
            </Alert>
          </Col>
        </Row>
      )
    }

  }

  render() {
    return (
      <div style={{marginBottom: "10px"}}>
        <Container fluid>
          {
            this.props.newDownload.status != 'INITIAL' && this.renderAlerts()
          }
          <Row>
            <Col xl="8">
              <Input name="url" id="videoUrl" placeholder="Paste video URL from Youtube here!" value={this.state.url} onChange={evt => this.updateUrl(evt)}/>
            </Col>
            <Col>
              <Button outline onClick={this.addDownload} color="primary">Add</Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {
        newDownload: state.newDownload,
        appSettings: state.appSettings
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      createNewDownload,
      forceRedownload,
      fetchDownloads,
      resetNewDownloadViewState
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QuickDownloadWidget);

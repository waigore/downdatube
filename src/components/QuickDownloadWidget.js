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
    if (nextProps.newDownload.status != 'INITIAL') {
      console.log("Setting success/error states for downloadWidget");
      this.setState({
        successAlertToggle: nextProps.newDownload.status == 'SUCCESS',
        errorAlertToggle: nextProps.newDownload.status == 'ERROR',
        newDownloadError: nextProps.newDownload.status == 'ERROR' && nextProps.newDownload.error
      });

      setTimeout(() => {
        this.dismissSuccessAlert();
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

  dismissSuccessAlert() {
    this.setState({
      successAlertToggle: false
    })
  }

  renderSuccessAlert() {
    return (
      <Alert color="success" isOpen={this.state.successAlertToggle} toggle={this.dismissAllAlerts}>
      {'Video queued with id=' + this.props.newDownload.videoId + '.'}
      </Alert>
    )
  }

  renderErrorAlert() {
    return (
      <Alert color="warning" isOpen={this.state.errorAlertToggle} toggle={this.dismissAllAlerts}>
        <NewDownloadErrorMsg error={this.state.newDownloadError} forceDownload={this.forceDownload} />
      </Alert>
    )
  }

  renderAlerts() {
    console.log("renderAlerts: newDownload.status=", this.props.newDownload.status);
    console.log("renderAlerts: successAlertToggle", this.state.successAlertToggle);
    console.log("renderAlerts: errorAlertToggle", this.state.errorAlertToggle);
    return (
      <div>
        {this.state.successAlertToggle && this.renderSuccessAlert()}
        {this.state.errorAlertToggle && this.renderErrorAlert()}
      </div>
    )
  }

  render() {
    return (
      <div style={{marginBottom: "10px"}}>
        <Container fluid>
          <Row>
            <Col>
            {
              this.renderAlerts()
            }
            </Col>
          </Row>
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

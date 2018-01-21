import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Alert, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FaBeer from 'react-icons/lib/fa/beer';

import NewDownloadErrorMsg from '../components/NewDownloadErrorMsg';
import {
  createNewDownload,
  forceRedownload,
  fetchAppSettings
} from '../actions';

class NewDownloadView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      goBack: false,
      url: "",
      initialAlertToggle: true,
      successAlertToggle: false,
      errorAlertToggle: false,
      downloadAudio: false
    };

    this.dismissAllAlerts = this.dismissAllAlerts.bind(this);
    this.resetAlerts = this.resetAlerts.bind(this);
    this.back = this.back.bind(this);
    this.saveAndAddAnother = this.saveAndAddAnother.bind(this);
    this.forceDownload = this.forceDownload.bind(this);
  }

  componentWillMount() {
    this.props.fetchAppSettings();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      initialAlertToggle: nextProps.newDownload.status == 'INITIAL',
      successAlertToggle: nextProps.newDownload.status == 'SUCCESS',
      errorAlertToggle: nextProps.newDownload.status == 'ERROR',
      newDownloadError: nextProps.newDownload.status == 'ERROR' && nextProps.newDownload.error
    });

    this.loadAppSettings(nextProps);

    setTimeout(() => {
      this.resetAlerts();
    }, 3000);
  }

  saveAndAddAnother() {
    if (this.state.url == "") {
      return;
    }

    let downloadOpts = {
      downloadAudio: this.state.downloadAudio
    }
    this.props.createNewDownload(this.state.url, downloadOpts);
    this.setState({url: ""});
  }

  back() {
    this.setState({url:"", goBack: true});
  }

  forceDownload(videoId) {
    console.log("Force download", videoId);
    let downloadOpts = {
      downloadAudio: this.state.downloadAudio
    }
    this.props.forceRedownload(videoId, downloadOpts);
    this.setState({url: ""});
  }

  updateUrl(evt) {
    this.setState({
      url: evt.target.value
    });
  }

  resetAlerts() {
    let currErrorAlertToggle = this.state.errorAlertToggle;
    this.setState({
      initialAlertToggle: !currErrorAlertToggle,
      successAlertToggle: false
    });
  }

  dismissAllAlerts() {
    this.setState({
      initialAlertToggle: false,
      successAlertToggle: false,
      errorAlertToggle: false
    });
  }

  loadAppSettings(theProps) {
    this.setState({
      downloadAudio: theProps.appSettings.downloadAudio
    })
  }

  renderErrorAlertContents() {
    return (<NewDownloadErrorMsg error={this.state.newDownloadError} forceDownload={this.forceDownload} />);
  }

  render() {
    if (this.state.goBack) {
      return (
        <Redirect to="/downloading" />
      )
    }
    return (
      <div>
        <h3>New Video</h3>
        <div>
          {
            !this.state.successAlertToggle && !this.state.errorAlertToggle &&
            <Alert color="primary" isOpen={this.state.initialAlertToggle} toggle={this.dismissAllAlerts}>
              Copy a video URL from Youtube to start download! <FaBeer />
            </Alert>
          }
          {
            this.state.successAlertToggle &&
            <Alert color="success" isOpen={this.state.successAlertToggle} toggle={this.dismissAllAlerts}>
              {'Video queued with id=' + this.props.newDownload.videoId + '.'}
            </Alert>
          }
          {
            this.state.errorAlertToggle &&
            <Alert color="warning" isOpen={this.state.errorAlertToggle} toggle={this.dismissAllAlerts}>
              {this.renderErrorAlertContents()}
            </Alert>
          }
        </div>
        <Form>
          <FormGroup>
            <Label for="videoUrl">Url</Label>
            <Input name="url" id="videoUrl" placeholder="Video URL" value={this.state.url} onChange={evt => this.updateUrl(evt)}/>
          </FormGroup>
          <FormGroup>
            <Label>
              <Input
                type="checkbox"
                checked={this.state.downloadAudio}
                onChange={(evt) => this.setState({downloadAudio : !this.state.downloadAudio})} />{ ' ' }
              Download audio along with video
            </Label>
          </FormGroup>
          <div>
            <Button onClick={this.back}>Back</Button>
            <Button onClick={this.saveAndAddAnother} color="primary">Save and add another</Button>
          </div>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {
        appSettings: state.appSettings,
        newDownload: state.newDownload
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      createNewDownload,
      fetchAppSettings,
      forceRedownload
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewDownloadView);

import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Alert, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  fetchAppSettings,
  doSaveAppSettings
} from '../actions';

class DownloadDefaultOptionsView extends Component {

  constructor(props) {
    super(props);

    this.reset = this.reset.bind(this);
    this.save = this.save.bind(this);
  }

  componentWillMount() {
    this.setState({
      downloadAudio: false
    });
    this.props.fetchAppSettings();
  }


  componentWillReceiveProps(nextProps) {
    console.log("DownloadDefaultOptions.componentWillReceiveProps", nextProps);
    this.setStateToProps(nextProps);
  }

  setStateToProps(theProps) {
    this.setState({
      downloadAudio: theProps.appSettings.downloadAudio
    })
  }

  reset() {
    setStateToProps(this.props);
  }

  save() {
    console.log("DOWNLOAD_AUDIO:", this.state.downloadAudio);
    this.props.doSaveAppSettings({
      downloadAudio: this.state.downloadAudio
    });
  }

  render() {
    return (
      <div>
        <h3>Download defaults</h3>
        <Form>
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
              <Button onClick={this.reset}>Reset</Button>
              <Button onClick={this.save} color="primary">Save</Button>
            </div>
        </Form>
      </div>

    );
  }
}

function mapStateToProps(state) {
    return {
        appSettings: state.appSettings
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      fetchAppSettings,
      doSaveAppSettings
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadDefaultOptionsView);

import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class NewDownloadView extends Component {

  constructor(props) {
    super(props);
    this.state = {goBack: false, url: ""};

    this.save = this.save.bind(this);
    this.saveAndAddAnother = this.saveAndAddAnother.bind(this);
  }

  componentDidMount() {
    //this.setState({goBack: false});
  }

  saveAndAddAnother() {
    //this.refs.videoUrl.value = '';
    //console.log(this.refs.url.getValue());
    this.setState({url: ""});
  }

  save() {
    console.log("Yes");
    this.setState({goBack: true});
  }

  updateUrl(evt) {
    this.setState({
      url: evt.target.value
    });
  }

  render() {
    if (this.state.goBack) {
      return (
        <Redirect to="/all" />
      )
    }
    return (
      <div>
        <h3>New Video</h3>
        <Form>
          <FormGroup>
            <Label for="videoUrl">Url</Label>
            <Input name="url" id="videoUrl" placeholder="Video URL" value={this.state.url} onChange={evt => this.updateUrl(evt)}/>
          </FormGroup>
          <div>
            <Button onClick={this.save}>Save</Button>
            <Button onClick={this.saveAndAddAnother} color="primary">Save and add another</Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default NewDownloadView;

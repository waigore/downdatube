import React from 'react';
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Row,
} from 'reactstrap';
import {Link} from 'react-router-dom';

export default class AppActionBar extends React.Component {

  render() {
    return (
      <div className="clearfix" style={{ padding: '.5rem', margin: '0px' }}>
        <ButtonGroup className="float-left">
          <Button><Link style={{ textDecoration: 'none', color: 'black'}} to="/all">All</Link></Button>{' '}
          <Button><Link style={{ textDecoration: 'none', color: 'black'}} to="/downloading">Downloading</Link></Button>{' '}
          <Button><Link style={{ textDecoration: 'none', color: 'black' }} to="/completed">Completed</Link></Button>
        </ButtonGroup>
        <Button color="primary" className="float-right"><Link style={{ textDecoration: 'none', color: 'white' }} to="/new">New</Link></Button>
      </div>
    );
  }
}

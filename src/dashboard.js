
import React, { Component } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { FaTrashAlt, FaCheck, FaRunning, FaWindowClose, FaSignOutAlt, FaPlus } from 'react-icons/fa';

import { Button, Modal, Table, ModalHeader, ModalFooter, ModalBody, Container, Row, Col, Form, FormGroup, Input, Label } from 'reactstrap';
// Input, Label, Form, FormGroup

export default class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.toggle = this.toggle.bind(this);
    this.saveData = this.saveData.bind(this);
    this.btnclk = this.btnclk.bind(this);


    this.state = {
      email: '',
      token: '',
      titledata: '',
      desc: '',
      tasklist: [],
      url: 'https://engine-staging.viame.ae/assessment/',
      modal: false,
      backdrop: true,
      dropdownOpen: false
    }

  }

  toggledrp() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
  saveData(e) {
    e.preventDefault();

    const obj = {
      todolist: {
        title: this.state.titledata,
        description: this.state.desc,
        status: 1
      }
    }

    axios.post(this.state.url + 'user/task', obj)
      .then(res => {

        if (!res.data.error) {
          this.getData();
          this.toggle();
        } else {
          alert(res.data.message);
        }
      })
      .catch(function (error) {
        alert('Username and password not match');
      })

  }

  logout() {
    const cookies = new Cookies();
    cookies.remove('token');
    cookies.remove('email');
    this.props.history.push(`/`);
  }

  componentDidMount() {
    const cookies = new Cookies();
    var token = cookies.get('token');
    var email = cookies.get('email');
    if (token) {
      this.setState({ token: token, email: email })
      this.getData();
    } else {
      this.props.history.push(`/`);
    }
  }

  getData() {
    const cookies = new Cookies();
    var token = cookies.get('token');
    axios.defaults.headers.common['x-access-token'] = token;
    axios.get(this.state.url + 'user/list')
      .then(response => {

        if (response.data.length > 0) {
          this.setState({ tasklist: response.data });
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }


  onChangetaskname(e) {

    this.setState({
      titledata: e.target.value
    });
  }

  onChangedesc(e) {
    this.setState({
      desc: e.target.value
    });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  btnclk(id, tmpdata) {

    if (id === 0) {
      axios.delete(this.state.url + 'user/task/' + tmpdata._id)
        .then(res => {

          if (!res.data.error) {
            this.getData();

          } else {
            alert(res.data.message);
          }
        })
        .catch(function (error) {
          alert('Username and password not match');
        })
    } else {


      const obj = {
        todolist: {
          title: tmpdata.title,
          description: tmpdata.description,
          status: id
        }
      }

      axios.put(this.state.url + 'user/task/' + tmpdata._id, obj)
        .then(res => {

          if (!res.data.error) {
            this.getData();

          } else {
            alert(res.data.message);
          }
        })
        .catch(function (error) {
          alert('Username and password not match');
        })
    }
  }



  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <img src="/logo.png" className="logo-cust" alt="vialogo" />
            </Col>
          </Row>
        </Container>
        <Container>
          <Col>
            <Row>
              <Col>
                <Button color="primary" onClick={this.logout}><FaSignOutAlt /></Button>
                <Button className="ml-1" color="danger" onClick={this.toggle}><FaPlus /></Button>
              </Col>
            </Row>

            <Row className="mt-2">
              <Table size="sm">
                <thead>
                  <tr>
                    <td>Task</td>
                    <td>Description</td>
                    <td>Status</td>
                    <td>Action</td>
                  </tr>
                </thead>
                <tbody>
                  <tr className={this.state.tasklist.length === 0 ? 'showbox' : 'hidebox'}>
                    <td ><h2>No Data Found</h2></td>
                  </tr>
                  {this.state.tasklist.map(data => (
                    <tr id={data._id} key={data._id}>
                      <td>{data.title}</td>
                      <td>{data.description}</td>
                      <td>{data.status === 1 ? 'Created' : ''}{data.status === 2 ? 'Working' : ''}{data.status === 3 ? 'Finished' : ''}{data.status === 4 ? 'Cancelled' : ''}</td>
                      <td>
                        <Button className={data.status === 3 ? 'active' : ''} outline color="info" size="sm" onClick={this.btnclk.bind(this, 3, data)} ><FaCheck /></Button>{' '}
                        <Button className={data.status === 2 ? 'active' : ''} outline color="secondary" onClick={this.btnclk.bind(this, 2, data)} size="sm"><FaRunning /></Button>{' '}
                        <Button className={data.status === 4 ? 'active' : ''} outline color="warning" onClick={this.btnclk.bind(this, 4, data)} size="sm"><FaWindowClose /></Button>{' '}
                        <Button outline color="danger" onClick={this.btnclk.bind(this, 0, data)} size="sm"><FaTrashAlt /></Button>{' '}

                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Row>
          </Col>
        </Container>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop={this.state.backdrop}>
          <ModalHeader toggle={this.toggle}>Add Task</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.saveData}>
              <FormGroup>
                <Label>Task</Label>

                <Input type="text" value={this.state.titledata} onChange={evt => this.onChangetaskname(evt)} />
              </FormGroup>
              <FormGroup>
                <Label  >Description</Label>
                <Input type="textarea" value={this.state.desc} onChange={evt => this.onChangedesc(evt)} />
              </FormGroup>
              <ModalFooter>
                <Button color="primary" >Save </Button>
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
              </ModalFooter>

            </Form>
          </ModalBody>
        </Modal>

      </div>)
  }
}

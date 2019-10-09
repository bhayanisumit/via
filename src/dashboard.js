
import React, { Component } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { FaTrashAlt, FaCheck, FaRunning, FaWindowClose, FaSignOutAlt, FaPlus, FaTimes } from 'react-icons/fa';
import { Button, Badge, Table, Container, Row, Col, Form, FormGroup, Input } from 'reactstrap';


export default class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.openaddpanel = this.openaddpanel.bind(this);
    this.saveData = this.saveData.bind(this);
    this.btnclk = this.btnclk.bind(this);
    this.close = this.close.bind(this);
    this.state = {
      email: '',
      token: '',
      titledata: '',
      desc: '',
      tasklist: [],
      url: 'https://engine-staging.viame.ae/assessment/',
      modal: false,
      backdrop: true,
      dropdownOpen: false,
      addboolen: false,
    }
  }

  openaddpanel() {
    this.setState({ addboolen: true });
  }

  saveData(e) {
    e.preventDefault();
    if (this.state.titledata && this.state.desc) {
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
            this.close();
          } else {
            alert(res.data.message);
          }
        })
        .catch(function (error) {
          alert('Something went wrong');
        })
    }
  }

  close() {
    this.setState({ addboolen: false, titledata: '', desc: '' })
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
                <Button className="ml-1" color="danger" onClick={this.openaddpanel}><FaPlus /></Button>
              </Col>
            </Row>
            <div className={this.state.addboolen ? 'showbox' : 'hidebox'} >
              <Form onSubmit={this.saveData}>
                <Row className="mt-2" form>
                  <Col md={4}>
                    <FormGroup>
                      <Input placeholder="Task" type="text" value={this.state.titledata} onChange={evt => this.onChangetaskname(evt)} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Input placeholder="Description" type="text" value={this.state.desc} onChange={evt => this.onChangedesc(evt)} />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <Button color="primary" size="sm" >Save </Button>
                    <Button className="ml-1" color="danger" size="sm" onClick={this.close}><FaTimes /></Button>

                  </Col>
                </Row>
              </Form>
            </div>
            <Row className="mt-4">
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
                      <td>{data.status === 1 ? <Badge color="success">Created</Badge> : ''}{data.status === 2 ? <Badge color='secondary'>Working</Badge> : ''}{data.status === 3 ? <Badge color='info'>Finished</Badge> : ''}{data.status === 4 ? <Badge color='warning'><del>Cancelled</del></Badge> : ''}</td>
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
      </div>)
  }
}

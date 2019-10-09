
import React, { Component } from 'react';
import axios from 'axios';
import { FaSignInAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { Button, Card,CardBody,CardTitle,Container, Row, Col,Form, FormGroup,Input, Label } from 'reactstrap';

export default class Register extends Component {

    constructor(props) {
        super(props);
        this.onChangeemail = this.onChangeemail.bind(this);
        this.onChangepwd = this.onChangepwd.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
  
        this.state = {
            email: 'bhayanisumit@gmail.com',
            pwd: '12345678',
            url  : 'https://engine-staging.viame.ae/assessment/'
        }
    }

    onChangeemail(e) {
        this.setState({
          email: e.target.value
        });
      }

      onChangepwd(e) {
        this.setState({
          pwd: e.target.value
        });
      }

      onSubmit(e){
        
        e.preventDefault();
        if(this.state.email && this.state.pwd){

          const obj =  {users: {email: this.state.email, password: this.state.pwd }};

          axios.post(this.state.url + 'users',obj)
              .then(res => {  
                  
                    if(!res.data.error) {
                       this.props.history.push(`/`)
                    }  else{
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
                        <img src="/logo.png"  className="logo-cust" alt="vialogo" />
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <Card>
        <CardBody>
          <CardTitle><h3 className='text-center pb-4'>Register</h3></CardTitle>
          
          <Form onSubmit={this.onSubmit}>
          <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input type="email"  value={this.state.email} onChange={this.onChangeemail}  />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input type="password" value={this.state.pwd} onChange={this.onChangepwd}   />
        </FormGroup>
        <CardTitle>
          <Button color="primary"><FaSignInAlt /></Button>{' '}
          <p className="mt-1"><Link to={'/'} className="nav-link">Login</Link></p>
        </CardTitle>
        </Form>
          </CardBody>
      </Card>                    
                    </Col>
                </Row>
            </Container>
            </div>
        )
    }
}

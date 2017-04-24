import React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { userLoginRequest, setErrors, setUser, setUserAuth } from '../actions/userActions'

import validateLoginInput from '../../server/shared/validations/login'

import Navbar from './Navbar'

import './Login.scss'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      clientErrors: {}
    }
    this.handleLogin = this.handleLogin.bind(this)
    this.handleOnChange= this.handleOnChange.bind(this)
  }
  componentDidMount () {
    this.props.dispatch(setErrors({}))
  }
  isValid () {
    const { errors, isValid } = validateLoginInput(this.state)

    if (!isValid) {
      this.setState({
        clientErrors: errors
      })
    }

    return isValid
  }
  handleLogin (event) {
    event.preventDefault()
    this.setState({
      clientErrors: {}
    })
    if (this.isValid()) {
      userLoginRequest(this.state)
        .then(
          response => {
            localStorage.setItem('token', response.data.token)
            this.props.dispatch(setUserAuth())
            this.props.dispatch(setUser(response.data.email))
            this.props.history.push('/')
          })
        .catch(
          error => {
            this.props.dispatch(setErrors(error.response.data.errors))
          })

    }
  }
  handleOnChange (event) {
    switch (event.target.id) {
    case 'email':
      this.setState({
        email: event.target.value
      })
      break
    case 'pwd':
      this.setState({
        password: event.target.value
      })
      break
    }
  }
  render () {
    const { serverErrors } = this.props
    const { clientErrors } = this.state
    return (
      <div>
        <Navbar />
        <div className='login-container'>
          <form>
            <h1>Login</h1>
            <div className='form-group'>
              <label>Email address:</label>
              {clientErrors.email && <span className='error'>{clientErrors.email}</span>}
              <input type='email' className='form-control' id='email' onChange={this.handleOnChange} />
            </div>
            <div className='form-group'>
              <label>Password:</label>
              {clientErrors.password && <span className='error'>{clientErrors.password}</span>}
              <input type='password' className='form-control' id='pwd' onChange={this.handleOnChange} />
            </div>
            <button type='submit' className='btn' onClick={this.handleLogin}>Login</button>
            {serverErrors.loginForm && <div className='login-error-container'><span className='error'>{serverErrors.loginForm}</span></div>}
          </form>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  dispatch: PropTypes.func,
  serverErrors: PropTypes.object,
  history: PropTypes.object
}

const mapStateToProps = (state) => {
  const { serverErrors } = state.userReducer

  return {
    serverErrors
  }
}
export default connect(mapStateToProps)(Login)
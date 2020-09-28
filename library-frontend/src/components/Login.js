import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../mutations'

const Login = ({ setIsLoggedIn, setNotification, setPage }) => {
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [ login, result ] = useMutation(LOGIN, {
    onError: error => setNotification(error.graphQLErrors[0].message)
  })

  useEffect(() => {
    if(result.data) {
      setIsLoggedIn(true)
      localStorage.setItem('token', result.data.login.value)
      setNotification(null)
      setPage('authors')
    }
  }, [result.data]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = event => {
    event.preventDefault()
    login({ variables: { username, password } })
    setPassword('')
    setUsername('')
  }

  return (
    <form onSubmit={handleLogin}>
      username 
      <input
        type='text'
        value={username}
        onChange={event => setUsername(event.target.value)}
      />
      <br/>
      password 
      <input
        type='password'
        value={password}
        onChange={event => setPassword(event.target.value)}
      />
      <br/>
      <button type='submit'>login</button>
    </form>
  )
}

export default Login
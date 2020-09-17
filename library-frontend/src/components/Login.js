import React, { useState } from 'react'

const Login = () => {
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  return (
    <form>
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
    </form>
  )
}

export default Login
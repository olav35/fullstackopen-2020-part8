
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendations from './components/Recommendations'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState('authors')
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))
  const [notification, setNotification] = useState(null)
  const client = useApolloClient()

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      {
        notification
      }
      <div>
        {
          isLoggedIn ? (
            <button onClick={handleLogout}>logout</button>
          ) : (
            <button onClick={() => setPage('login')}>login</button>
          )
        }
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('recommendations')}>recommendations</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      { page === 'authors' && <Authors /> }
      { page === 'books' && <Books /> }
      { page === 'recommendations' && <Recommendations /> }
      { page === 'add' && <NewBook /> }
      { 
        page === 'login' && <Login setIsLoggedIn={setIsLoggedIn}
                                   setNotification={setNotification}
                                   setPage={setPage} />
      }
    </div>
  )
}

export default App
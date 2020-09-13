  
import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import { EDIT_AUTHOR } from '../mutations'

const Authors = () => {
  const result = useQuery(ALL_AUTHORS)
  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  const [ birthYear, setBirthYear] = useState('')

  const handleEditAuthor = (event) => {
    event.preventDefault()
    const name = event.target.author.value

    editAuthor({ variables: { name, birthYear: Number(birthYear) } })

    setBirthYear('')
  }

  return result.loading ? <div>Loading...</div> : (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {result.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={handleEditAuthor}>
        author
        <select name='author'>
          {
            result.data.allAuthors.map(({name}) => <option value={name}>{name}</option>)
          }
        </select>
        <br/>
        born
        <input
          type='number'
          onChange={(event) => setBirthYear(event.target.value)}
          value={birthYear}
          />
        <br/>
        <button type='submit'>update year</button>
      </form>
    </div>
  )
}

export default Authors

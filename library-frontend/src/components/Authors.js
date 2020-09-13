  
import React from 'react'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'

const Authors = () => {
  const result = useQuery(ALL_AUTHORS)

  return (
    <div>
      <h2>authors</h2>
      {
        result.loading ? <div>Loading...</div> : (
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
        )
      }
    </div>
  )
}

export default Authors

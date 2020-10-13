import React from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { ME } from '../queries'

const Books = () => {
  const userResult = useQuery(ME, {
    refetchQueries: [ { query: ME } ]
  })
  const result = useQuery(ALL_BOOKS, {
    refetchQueries: [ { query: ALL_BOOKS } ]
  })

  const favoriteGenre = userResult.data && userResult.data.me.favoriteGenre

  return (
    <div>
      <h1>Recommendations</h1>
      books in your favorite genre <b>{favoriteGenre}</b>
      {
        result.loading ? <div>Loading...</div> : (
          <div>
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>
                    author
                  </th>
                  <th>
                    published
                  </th>
                </tr>
                {result.data.allBooks
                  .filter(book => book.genres.includes(favoriteGenre))
                  .map(a =>
                    <tr key={a.title}>
                      <td>{a.title}</td>
                      <td>{a.author.name}</td>
                      <td>{a.published}</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}

export default Books
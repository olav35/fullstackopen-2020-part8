import React from 'react'
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = () => {
  const result = useQuery(ALL_BOOKS, {
    refetchQueries: [ { query: ALL_BOOKS } ]
  })

  const [genre, setGenre] = useState(null)

  const genres = () => [...new Set(result.data.allBooks.map(book => book.genres).flat())]

  return (
    <div>
      <h2>books</h2>
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
                  .filter(book => genre === null || book.genres.includes(genre))
                  .map(a =>
                    <tr key={a.title}>
                      <td>{a.title}</td>
                      <td>{a.author.name}</td>
                      <td>{a.published}</td>
                    </tr>
                )}
              </tbody>
            </table>
            <button onClick={() => setGenre(null)}>
              All
            </button>
            {
              genres().map(genre => 
                <button
                  key={genre}
                  onClick={() => setGenre(genre)}>
                    {genre}
                </button>
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default Books
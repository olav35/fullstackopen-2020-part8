import { gql } from '@apollo/client'

export const ADD_BOOK = gql`
  mutation ($title: String!, $author: String!, $published: Int!, $genres: [String!]!){
    addBook (
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) { id }
  }
`

export const EDIT_AUTHOR = gql`
  mutation ($name: String!, $birthYear: Int!) {
    editAuthor(
      name: $name
      setBornTo: $birthYear
    ) {
      id
    }
  }
`
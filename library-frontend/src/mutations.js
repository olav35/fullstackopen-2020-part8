import { gql } from '@apollo/client'

export const ADD_BOOK = gql`
  mutation ($title: String!, $author: String!, $published: Int!, $genres: [String!]!){
    addBook (
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      published
      author {
        name
      }
    }
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

export const LOGIN = gql`
  mutation ($username: String!, $password: String!) {
    login(
      username: $username
      password: $password
    ) {
      value
    }
  }
`
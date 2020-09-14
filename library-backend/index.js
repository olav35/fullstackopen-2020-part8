const { ApolloServer, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')
const config = require('./utils/config')
const mongoose = require('mongoose')
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const Book = require('./models/book')

const getAuthorByName = (name) => authors.find(author => author.name === name)

const createAuthor = (name, born) => ({ name, born, id: uuid() })
const createBook = (title, published, author, genres) => ({ title, published, author, genres, id: uuid() })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: String!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(
      author: String
      genre: String
    ): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: _ => Book.collection.countDocuments(),
    authorCount: _ => authors.length,
    allBooks: (_, args) => books.filter(book => {
      if(args.author && args.author !== book.author) {
        return false
      }

      if(args.genre && !book.genres.includes(args.genre)) {
        return false
      }

      return true
    }),
    allAuthors: _ => authors
  },
  Mutation: {
    addBook: (_, args) => {
      let author = getAuthorByName(args.author)
      if(!author){
        author = createAuthor(args.author)
        authors = authors.concat(author)
      }
      const book = createBook(args.title, args.published, args.author, args.genres)
      books = books.concat(book)
      return book
    },
    editAuthor: (_, args) => {
      const author = getAuthorByName(args.name)
      if(!author) {
        return null
      }

      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map(author => author.name === updatedAuthor.name ? updatedAuthor : author)
      return updatedAuthor
    }
  },
  Author: {
    bookCount: (author) => books.filter(book => book.author === author.name).length
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

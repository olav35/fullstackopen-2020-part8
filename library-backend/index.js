const { ApolloServer, gql } = require('apollo-server')
const config = require('./utils/config')
const mongoose = require('mongoose')
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true)
const Book = require('./models/book')
const Author = require('./models/author')

const getAuthorByName = (name) => authors.find(author => author.name === name)

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
    authorCount: _ => Author.collection.countDocuments(),
    allBooks: _ => Book.find({}).populate({ path: 'author' }),
    allAuthors: _ => Author.find({})
  },
  Mutation: {
    addBook: async (_, args) => {
      let author = await Author.findOne({ name: args.author })
      if(!author){
        author = new Author({ name: args.author })
        await author.save()
      }
      const book = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres
      })
      return book.save()
    },
    editAuthor: async (_, args) => {
      const author = await Author.findOne({ name: args.name })
      if(!author) {
        return null
      }

      author.born = args.setBornTo
      return author.save()
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
const { ApolloServer, gql, UserInputError } = require('apollo-server')
const config = require('./utils/config')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true)
const Book = require('./models/book')
const User = require('./models/user')
const Author = require('./models/author')
const { JWT_SECRET } = require('./utils/config')

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

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
    me: User
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
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    me: (root, args, context) => context.currentUser,
    bookCount: _ => Book.collection.countDocuments(),
    authorCount: _ => Author.collection.countDocuments(),
    allBooks: (_, args) => {
      const query = args.genre ? { genres: { $in: [ args.genre ] } } : {}
      return Book.find(query).populate({ path: 'author '})
    },
    allAuthors: _ => Author.find({})
  },
  Mutation: {
    addBook: async (_, args, context) => {
      if(!context.currentUser) {
        throw new UserInputError('not logged in')
      }

      let author = await Author.findOne({ name: args.author })
      if(!author){
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }
      }
      const book = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres
      })
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return book
    },
    editAuthor: async (_, args, context) => {
      if(!context.currentUser) {
        throw new UserInputError('not logged in')
      }

      const author = await Author.findOne({ name: args.name })
      if(!author) {
        return null
      }

      author.born = args.setBornTo
      return author.save()
    },
    createUser: async (_, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })
      try {
        await user.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return user
    },
    login: async (_, args) => {
      const user = await User.findOne({ username: args.username })
      if(!user || args.password !== 'passord') {
        throw new UserInputError('invalid credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, config.JWT_SECRET) }
    }
  },
  Author: {
    bookCount: (author) => books.filter(book => book.author === author.name).length
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
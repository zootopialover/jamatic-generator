export default {
  type: 'Post',
  args: {
    id: intArg(),
    email: stringArg()
  },
  resolve: (_parent, args, context: Context) => {
    return jamatic.schema.user
      .findUnique({
        where: {
          id: args.userUniqueInput.id || undefined,
          email: args.userUniqueInput.email || undefined,
        },
      })
      .posts({
        where: {
          published: false,
        },
      })
  },
}

/* export default {
  model: 'Post',
  inputs: {
    userUniqueInput: {
      attributes: {
        id: 'integer',
        email: 'string'
      },
      required: true
    }
  },
  resolve: (context, args) => {
    return jamatic.schema['User'].find({
      where: {
        id: args.userUniqueInput.id || undefined,
        email: args.userUniqueInput.email || undefined,
      }
    }).posts({
      where: {
        published: false,
      },
    });
  }
} */
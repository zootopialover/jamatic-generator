export default {
  type: 'Post',
  args: {
    data: nonNull(
      arg({
        type: 'PostCreateInput',
      }),
    ),
    authorEmail: nonNull(stringArg()),
  },
  resolve: (_, args, context: Context) => {
    return jamatic.schema.post.create({
      data: {
        title: args.data.title,
        content: args.data.content,
        author: {
          connect: { email: args.authorEmail },
        },
      },
    })
  },
}

/* export default {
  model: 'Post',
  inputs: {
    data: {
      title: {
        type: 'string',
        required: true
      },
      content: 'string',
      authorEmail: {
        type: 'string',
        required: true
      }
    }
  },
  resolve: (context, args) => {
    return jamatic.schema['Post'].create({
      title: args.data.title,
      content: args.data.content,
      author: {
        connect: { email: args.authorEmail },
      }
    })
  }
} */
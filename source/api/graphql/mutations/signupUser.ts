export default {
  type: 'User',
  args: {
    email: stringArg(),
    name: stringArg(),
    posts: {
      title: stringArg(),
      content: stringArg(),
    }
  },
  resolve: (_, args, context: Context) => {
    const postData = args.data.posts?.map((post) => {
      return { title: post.title, content: post.content || undefined }
    })
    return jamatic.schema.user.create({
      data: {
        name: args.data.name,
        email: args.data.email,
        posts: {
          create: postData,
        },
      },
    })
  },
}

/* export default {
  model: 'User',
  inputs: {
    data: {
      email: {
        type: 'string',
        required: true
      },
      name: 'string',
      posts: {
        title: {
          type: 'string',
          required: true
        },
        content: 'string'
      }
    }
  },
  resolve: (context, args) => {
    const postData = args.data.posts
      ? args.data.posts.map((post) => {
          return { title: post.title, content: post.content || undefined }
        })
      : []
    return jamatic.schema['User'].create({
      name: args.data.name,
      email: args.data.email,
      posts: {
        create: postData,
      }
    });
  }
} */
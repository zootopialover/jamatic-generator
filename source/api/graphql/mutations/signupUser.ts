export default {
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
}
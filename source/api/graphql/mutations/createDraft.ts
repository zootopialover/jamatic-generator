export default {
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
}
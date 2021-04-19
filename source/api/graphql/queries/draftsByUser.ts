export default {
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
}
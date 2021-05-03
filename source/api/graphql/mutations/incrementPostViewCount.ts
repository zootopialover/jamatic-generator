export default {
  type: 'Post',
  args: {
    id: nonNull(intArg()),
  },
  resolve: (_, args, context: Context) => {
    return jamatic.schema.post.update({
      where: { id: args.id || undefined },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })
  },
}

/* export default {
  model: 'Post',
  resolve: (context, args) => {
    return jamatic.schema['Post'].update({
      where: { id: args.id || undefined },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })
  }
} */
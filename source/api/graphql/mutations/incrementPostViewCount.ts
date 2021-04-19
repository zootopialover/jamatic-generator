export default {
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
}
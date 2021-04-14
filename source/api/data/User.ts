export default {
    attributes: {
      email: {
        type: 'string',
        unique: true,
        validation: {
          required: true
        }
      },
      name: {
        type: 'string'
      },
      posts: {
        type: 'relation',
        relation: 'Post[]'
      }
    },
    skipTimestamps: true
  };
  
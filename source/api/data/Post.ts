export default {
    attributes: {
      title: {
        type: 'string',
        validation: {
          required: true
        }
      },
      content: {
        type: 'string'
      },
      published: {
        type: 'boolean',
        default: false
      },
      viewCount: {
        type: 'integer',
        default: 0
      },
      author: {
        type: 'relation',
        relation: 'User'
      }
    }
  };
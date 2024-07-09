
export default {
  async beforeUpdate(event) {
    const { data } = event.params;
    if (!data.publishedAt ) event.params.data.publishedAt = null;
        
  },

 
};

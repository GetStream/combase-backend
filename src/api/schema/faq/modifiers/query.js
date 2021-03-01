export const faq = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });
export const faqs = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });

// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Todo, Customer, Membership } = initSchema(schema);

export {
  Todo,
  Customer,
  Membership
};
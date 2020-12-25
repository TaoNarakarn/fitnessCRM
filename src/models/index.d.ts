import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Todo {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly image?: string;
  constructor(init: ModelInit<Todo>);
  static copyOf(source: Todo, mutator: (draft: MutableModel<Todo>) => MutableModel<Todo> | void): Todo;
}

export declare class Customer {
  readonly id: string;
  readonly name: string;
  readonly lastName?: string;
  readonly gender?: string;
  readonly tel: string;
  readonly address?: string;
  readonly email?: string;
  readonly photo?: string;
  readonly status?: string;
  readonly membership?: (string | null)[];
  readonly createDate?: string;
  constructor(init: ModelInit<Customer>);
  static copyOf(source: Customer, mutator: (draft: MutableModel<Customer>) => MutableModel<Customer> | void): Customer;
}

export declare class Membership {
  readonly id: string;
  readonly description?: string;
  readonly Price?: string;
  readonly From?: string;
  readonly To?: string;
  constructor(init: ModelInit<Membership>);
  static copyOf(source: Membership, mutator: (draft: MutableModel<Membership>) => MutableModel<Membership> | void): Membership;
}
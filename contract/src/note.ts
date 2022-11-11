import { AddPair, CancelOrder, CreateOrder, Halt } from "@verto/flex";
import { z } from 'zod'

// import append from 'ramda/src/append'
// import pick from 'ramda/src/pick'


const State = z.object({
  id: z.string().optional(),
  pairs: z.array(
    z.object({
      pair: z.array(z.string()).optional(),
      orders: z.array(
        z.object({
          id: z.string(),
          transfer: z.string(),
          creator: z.string(),
          token: z.string(),
          price: z.number(),
          quantity: z.number(),
          originalQuantity: z.number()
        })
      ).optional(),
      priceData: z.object({
        dominantToken: z.string(),
        block: z.number(),
        vwap: z.number(),
        matchLogs: z.array(z.object({
          id: z.string(),
          qty: z.number(),
          price: z.number()
        }))
      }).optional()
    })
  ),
  balances: z.record(z.string().min(43).max(43), z.number()),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  canEvolve: z.boolean(),
  evolve: z.string().optional(),
  title: z.string(),
  description: z.string(),
  topics: z.array(z.string()),
  content: z.string(),
  updated: z.number(),
  updatedBy: z.string(),
  log: z.array(z.object({
    title: z.string(),
    description: z.string(),
    topics: z.array(z.string()),
    content: z.string(),
    updated: z.number(),
    updatedBy: z.string()
  }))
})

type State = z.infer<typeof State>

const Note = z.object({
  title: z.string(),
  description: z.string(),
  topics: z.array(z.string()),
  content: z.string(),
})

const Action = z.object({
  caller: z.string(),
  input: z.object({
    function: z.string(), // transfer, createOrder, cancelOrder, addPair, 
    target: z.string().optional(),
    qty: z.number().optional(),
    data: z.any().optional(),
    timestamp: z.number().optional(),
    pair: z.union([z.string(), z.array(z.string())]).optional(),
    price: z.number().optional(),
    transaction: z.string().min(43).max(43).optional()
  })
})

type Action = z.infer<typeof Action>

export async function handle(state: State, action: Action): Promise<{ state: State } | { result: any }> {
  const balances = state.balances;
  const input = action.input;
  const caller = action.caller;

  ContractAssert(State.safeParse(state).success, 'Error: state is not valid! ' + JSON.stringify(State.safeParse(state).error))
  ContractAssert(Action.safeParse(action).success, 'Error: action is not valid!')

  // update
  if (input.function === "update") {
    // only owners can update contract
    ContractAssert(balances[caller] > 0, 'Must be owner to update')
    // validate input data
    ContractAssert(Note.safeParse(input.data).success, 'Data is required to update!')
    // validate input timestamp
    ContractAssert(input.timestamp, 'Timestamp is required!')

    const archive = Object.assign({}, Note.parse(state), { updated: state.updated, updatedBy: state.updatedBy })
    const note = Note.parse(input.data)
    state.log = [...state.log, archive]

    state = Object.assign({},
      state,
      note,
      { updated: input.timestamp, updatedBy: caller }
    )

    ContractAssert(State.safeParse(state).success, 'State is not valid, cannot update!')

    return { state }
  }

  // transfer
  if (input.function === "transfer") {
    const target = input.target;
    const quantity = input.qty;

    if (!balances[caller]) {
      balances[caller] = 0
    }

    if (!Number.isInteger(quantity) || quantity === undefined) {
      throw new ContractError(
        "Invalid value for quantity. Must be an integer."
      );
    }
    if (!target) {
      throw new ContractError("No target specified.");
    }
    if (quantity <= 0 || caller === target) {
      throw new ContractError("Invalid token transfer.");
    }
    if (!(caller in balances)) {
      throw new ContractError("Caller doesn't own any balance.");
    }
    if (balances[caller] < quantity) {
      throw new ContractError(
        "Caller balance not high enough to send " + quantity + " token(s)."
      );
    }

    balances[caller] -= quantity;
    if (target in balances) {
      balances[target] += quantity;
    } else {
      balances[target] = quantity;
    }

    return { state };
  }

  // balance
  if (input.function === "balance") {
    let target;
    if (!input.target) {
      target = caller;
    } else {
      target = input.target;
    }
    const ticker = state.ticker;

    if (typeof target !== "string") {
      throw new ContractError("Must specify target to get balance for.");
    }
    if (typeof balances[target] !== "number") {
      throw new ContractError("Cannot get balance; target does not exist.");
    }

    return {
      result: {
        target,
        ticker,
        balance: balances[target],
      },
    };
  }

  // evolve
  if (input.function === 'evolve') {
    if (state.canEvolve) {
      if (state.creator === action.caller) {
        state.evolve = action.input.value
      }
    }
    return { state }
  }

  if (input.function === "addPair") {
    const _ = await AddPair(state, action)
    return { state: _.state };
  }

  if (input.function === "cancelOrder") {
    const _ = await CancelOrder(state, action)
    return { state: _.state };
  }

  if (input.function === "createOrder") {
    const _ = await CreateOrder(state, action);
    return { state: _.state }
  }

  if (input.function === "halt") {
    const _ = await Halt(state, action);
    return { state: _.state };
  }

}
import { AddPair, CancelOrder, CreateOrder, Halt } from "@verto/flex";
import { z } from 'zod'

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


const Action = z.object({
  caller: z.string(),
  input: z.object({
    function: z.string(), // transfer, createOrder, cancelOrder, addPair, 
    target: z.string().optional(),
    qty: z.number().optional(),
  })
})

type Action = z.infer<typeof Action>

export async function handle(state: State, action: Action): Promise<{ state: State } | { result: any }> {
  const balances = state.balances;
  const input = action.input;
  const caller = action.caller;

  // update
  // transfer
  // balance
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
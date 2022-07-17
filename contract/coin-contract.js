/**
 * initState
 * 
 * {
 *   ticker: 'POAP-GAMECOIN',
 *   name: 'PoAP Game Coin',
 *   title: 'PoAP Game',
 *   owner: '',
 *   balances: {
 *     [owner]: 1_000_000_000_000
 *   },
 *   canEvolve: false
 * }
 */
const functions = { transfer, balance, mint } 

export function handle(state, action) {
  if (Object.keys(functions).includes(action.input.function)) {
    return functions[action.input.function](state, action)
  }
  throw new ContractError(`${action.input.function} function not implemented!`)
}

function transfer(state, action) {
  const { input, caller } = action
  const { target, qty } = input
  ContractAssert(target, 'No target specified')
  ContractAssert(caller !== target, 'Invalid Token Transfer. ')
  ContractAssert(qty, 'No quantity specified')
  const { balances } = state
  ContractAssert(
    caller in balances && balances[caller] >= qty,
    'Caller has insufficient funds'
  )
  balances[caller] -= qty
  if (!(target in balances)) {
    balances[target] = 0
  }
  balances[target] += qty
  state.balances = balances
  return { state }
}

function balance(state, action) {
  const { input, caller } = action
  let target = input.target ? input.target : caller;
  const { ticker, balances } = state;
  ContractAssert(
    typeof target === 'string', 'Must specify target to retrieve balance for'
  )
  return {
    result: {
      target,
      ticker,
      balance: target in balances ? balances[target] : 0
    }
  }
}

function mint(state, action) {
  ContractAssert(action.caller === state.owner, 'Only Owner can mint')
  ContractAssert(action.input.quantity, 'Quantity is required!')
  ContractAssert(Number.isInteger(action.input.quantity), 'Quantity must be integer')
  state.balances[state.owner] = state.balances[state.owner] + action.input.quantity 
  return { state }
}
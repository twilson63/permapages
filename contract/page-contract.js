const functions = { balance, transfer, visit, hasVisited }
export function handle(state, action) {
  if (Object.keys(functions).includes(action.input.function)) {
    return functions[action.input.function](state, action)
  }
  return ContractError('function not defined!')
}

function hasVisited(state, action) {
  const { caller } = action 
  ContractAssert(caller, 'Caller is required!')
  return { result: state.visits[caller]}
}

/**
 * a visit occurs when a user decides to 
 * mint a PoAP to document the visit of the webpage
 * this generates a record entry in the visits object
 * with the values `address, timestamp, nft`
 * 
 * this function should be called via an internal write of
 * the minting of a PoAP NFT for the visitor
 */
function visit(state, action) {
  const { caller } = action
  const { timestamp, nft } = action.input 
  ContractAssert(caller, 'PoAP Address is required!')
  ContractAssert(timestamp, 'Timestamp is required!')
  ContractAssert(nft, 'NFT ContractId is required!')

  if (!state.visits[caller]) {
    state.visits[caller] = { nft, timestamp }
  }
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


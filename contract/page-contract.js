/**
 * initialState
 * 
 * {
 *   owner: '',
 *   title: '',
 *   description: '',
 *   ticker: 'PAGE-',
 *   name: '',
 *   balances: {},
 *   locked: false,
 *   contentType: '',
 *   createdAt: ,
 *   tags: [],
 *   views: {}
 * }
 */
const functions = { balance, transfer, mint, view, viewCount }
export function handle(state, action) {
  if (Object.keys(functions).includes(action.input.function)) {
    return functions[action.input.function](state, action)
  }
  throw new ContractError('function not defined!')
}

function viewCount(state, action) {
  ContractAssert(state.views, 'State Views are not found!')
  return { result: Object.keys(state.views).length }
}

function view(state, action) {
  const { caller } = action 
  ContractAssert(caller, 'Caller is required!')
  ContractAssert(state.views, 'State Views are not found!')

  if (!state.views[caller]) {
    state.views[caller] = new Date().toISOString()
  }
  return { state }
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
function mint(state, action) {
  const { caller } = action
  
  ContractAssert(caller, 'PoAP Address is required!')
  
  if (!state.balances[caller]) {
    state.balances[caller] = 1
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


/**
 * initialState
 * 
 * {
 *   owner: '',
 *   poapCoin: '', // Play Token ContractId for permapages PoAP Game
 *   title: '',
 *   description: '',
 *   ticker: 'PAGE-',
 *   name: '',
 *   balances: {},
 *   contentType: '',
 *   createdAt: ,
 *   tags: [],
 *   stakes: {}
 * }
 */
const functions = { balance, mint, stake, unstake }
export function handle(state, action) {
  if (Object.keys(functions).includes(action.input.function)) {
    return functions[action.input.function](state, action)
  }
  throw new ContractError(`${action.input.function} function not implemented!`)
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
async function mint(state, action) {
  const { caller } = action
  // TODO: Check if caller has a permapage profile!
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


/*
* staking can only occur from treasury wallet
* when a user purchases a stake with their reward coin
* then the treasury wallet will call this function
* to allocate the stake, and transfer the coins to the
* page owner.
*/
async function stake(state, action) {
  const { caller } = action 
  const { quantity } = action.input 
  ContractAssert(caller, 'Caller is required!')
  ContractAssert(quantity, 'Quantity required!')
  ContractAssert(Number.isInteger(quantity), 'Quantity should be integer')

  const coinState = SmartWeave.contracts.readContractState(state.poapCoin)
  ContractAssert(coinState.balances[caller] >= quantity, 'Target does not have enough coin to stake!') 
  
  if (!state.stakes[caller]) {
    state.stakes[caller] = quantity
  } else {
    state.stakes[caller] = state.stakes[caller] + quantity 
  }

  return { state }
}

async function unstake(state, action) {
  // unstake quantity
  const { caller } = action 
  const { quantity } = action.input 
  ContractAssert(caller, 'Caller is required!')
  ContractAssert(quantity, 'Quantity required!')
  ContractAssert(Number.isInteger(quantity), 'Quantity should be integer')
  
  if (state.stakes[caller]) {
    state.stakes[caller] = (state.stakes[caller] - quantity) > 0 ? 0 : (state.stakes[caller] - quantity)
  } 

  return { state }
}

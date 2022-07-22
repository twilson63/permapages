/**
 * initState
 * 
 * {
 *   ticker: 'PASSPORT-POINT',
 *   name: 'Passport Reward Point',
 *   title: 'Passport Reward Points',
 *   owner: '',
 *   balances: {
 *   },
 *   registry: {
 *     [stamp_contract]: 1
 *   },
 *   rewards: {
 *   }, 
 *   canEvolve: false
 * }
 */
const REWARD_POINTS = 1000

const functions = { transfer, balance, mint, reward } 

export async function handle(state, action) {
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

/**
 * Rewards Caller and Stamp Owner given reward transaction, only one
 * reward can be given for caller|contract combo
 */
async function reward(state, action) {
  const { stampContract } = action.input 
  ContractAssert(action.caller, 'Caller is required!')
  ContractAssert(stampContract, 'Stamp Contract is required')
  ContractAssert(state.registry[stampContract], 'Contract MUST be registered!')
  ContractAssert(state.rewards[`${stampContract}:${action.caller}`] != 1, 'Stamp has already been rewarded!')
  
  const stampState = await SmartWeave.contracts.readContractState(stampContract)
  
  // TODO: if stampState.stakes then split the reward, 10% to creator, 90% to stakeholders
  let stamps = Object.keys(stampState.balances).length
  const points = stamps < 990 ? REWARD_POINTS - stamps : 10 

  // reward caller difference from REWARD_POINTS and stamps 
  state.balances[action.caller] += points
  // reward stamp owner difference from REWARD_POINTS and stamps 
  state.balances[stampState.owner] += points
  // track reward
  state.rewards[`${stampContract}:${action.caller}`] = 1

  return { state }
}
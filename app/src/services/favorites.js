// @ts-ignore
// eslint-disable-next-line no-undef
const { SmartWeaveWebFactory, LoggerFactory } = rsdk

LoggerFactory.INST.logLevel('fatal');
const CONTRACT_SRC = '-pTzzqJRvzHHcnj5ylgcsdKhtedGb79jhDxTcV6gYiU'

export function init(arweave) {
  const smartweave = SmartWeaveWebFactory.memCachedBased(arweave)
    .useRedStoneGateway({ notCorrupted: true })
    .build()

  function create(owner) {
    return smartweave.createContract.deployFromSourceTx({
      initState: JSON.stringify({ owner, favorites: [] }),
      srcTxId: CONTRACT_SRC
    }, true)
  }

  function add(contract, txId) {
    return smartweave.contract(contract).bundleInteraction({ function: 'add', tx: txId })
  }

  function remove(contract, txId) {
    return smartweave.contract(contract).bundleInteraction({ function: 'remove', tx: txId })
  }

  function list(contract) {
    return smartweave.contract(contract).readState().then(({ state }) => state.favorites)
  }

  return {
    create,
    add,
    remove,
    list
  }
}
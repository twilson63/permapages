//import { SmartWeaveWebFactory } from 'redstone-smartweave'
// eslint-disable-next-line no-unused-vars
/* global rsdk */
// @ts-ignore
const { WarpWebFactory, LoggerFactory } = window.warp
const CONTRACT_SRC = 'Hljxh8rYyXCb45BYULHb6KhUDnRkxc4ZUaUDCUkOP_w'

LoggerFactory.INST.logLevel("fatal");

export function init(arweave) {
  const smartweave = WarpWebFactory.memCached(arweave)

  function create() {
    return smartweave.createContract.deployFromSourceTx({
      initState: JSON.stringify({ addresses: [] }),
      srcTxId: CONTRACT_SRC
    }, true)
  }

  function like(contract = '', address = '', tags = []) {
    if (contract === '') {
      throw new Error('contract can not be empty!')
    }
    if (address === '') {
      throw new Error('address can not be empty!')
    }
    return smartweave.contract(contract)
      .connect('use_wallet')
      .bundleInteraction({
        function: 'like'
      })
      .then(addFee(address, tags, '.004'))
  }

  function unlike(contract = '', address = '', tags = []) {
    if (contract === '') {
      throw new Error('contract can not be empty!')
    }
    if (address === '') {
      throw new Error('address can not be empty!')
    }
    return smartweave.contract(contract)
      .connect('use_wallet')
      .bundleInteraction({
        function: 'unlike'
      })
      .then(addFee(address, tags, '.004'))
  }

  function likes(contract) {
    return smartweave.contract(contract)
      .connect('use_wallet')
      .readState()
      .then(({ state }) => state.addresses)

  }

  function liked(contract, address) {
    return smartweave.contract(contract)
      .connect('use_wallet')
      .readState()
      .then(({ state }) => state.addresses.includes(address))
  }

  function addFee(address, tags, price) {
    return async (res) => {
      const tx = await arweave.createTransaction({
        target: address,
        quantity: arweave.ar.arToWinston(price)
      })
      console.log(tx)
      tags.map(t => tx.addTag(t.name, t.value))
      await arweave.transactions.sign(tx)
      await arweave.transactions.post(tx)
      return res
    }
  }

  return {
    create,
    like,
    unlike,
    likes,
    liked
  }
}
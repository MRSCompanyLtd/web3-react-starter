# Web3 Starter App

This repository is a starter app to build web3 front-end applications for dapps. It currently supports Ethereum, Binance Smart Chain (BSC),
Polygon, and Avalanche networks. It will be updated in the future to support other networks.

This solution uses the following:
- Create React App
- Typescript
- Yarn
- Redux
- Alchemy Web3
- React-Router
- Walletconnect

## Steps to rebuild

1. Clone repository.
2. If not installed, add yarn globally `npm i g yarn`
3. Install dependencies `yarn`
4. Create a .env.development file at the root of the project and add the following variables
```
REACT_APP_ETH_RPC={Alchemy ETH mainnet wss url}
REACT_APP_ETH_RPC_HTTPS={Alchemy ETH mainnet api https url}
REACT_APP_BSC_RPC={BSC rpc wss url}
REACT_APP_BSC_RPC_HTTPS={BSC rpc https url}
REACT_APP_POLYGON_RPC={Alchemy Polygon wss url}
REACT_APP_POLYGON_RPC_HTTPS={Alchemy Polygon https url}
REACT_APP_AVALANCHE_RPC={Avalanche wss url}
REACT_APP_AVALANCHE_RPC_HTTPS={Avalanche https url}
REACT_APP_ARBITRUM_RPC={Alchemy Arbitrum wss url}
REACT_APP_ARBITRUM_RPC_HTTPS={Alchemy Arbitrum https url}
REACT_APP_FANTOM_RPC={Fantom wss url}
REACT_APP_FANTOM_RPC_HTTPS={Fantom https url}
```
You can create Ethereum, Arbitrum and Polygon API keys at Alchemy API; for BSC, Fantom, and Avalanche search online for a server. HTTPS is used for Walletconnect. You can ignore WSS if you don't want to use websockets, just make sure to replace the values in /utils/base. Websockets are recommended, however.

5. Run development environment `yarn start`

## Details

What's currently built:
1. State object is created in Redux to manage connection details. See it in /state/connect. It is also added to src/state.ts.
2. Redux state is added to provider in index.tsx.
3. A modal component is built in components/Modal.
4. App.tsx is set up with a connectWallet button and useEffect hooks to launch on load.
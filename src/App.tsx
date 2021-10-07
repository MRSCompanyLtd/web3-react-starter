import React from 'react';
import './App.css';
import { setProvider, web3 } from './utils/base';
import { Networks } from './utils/networks';
import { useAppDispatch, useAppSelector } from './hooks/base';
import { changeAccount, changeChain, makeConnection, reset } from './state/connect/connect';
import detectEthereumProvider from '@metamask/detect-provider';
import Modal from './components/Modal/Modal';

const App: React.FC = () => {
  const [modal, setModal] = React.useState<boolean>(false);
  const { chain, connected } = useAppSelector(state => {
    return {
      chain: state.connect.chainId,
      connected: state.connect.connected
    }
  });
  const dispatch = useAppDispatch();

  const connectWallet = React.useCallback(async (service: 'injected' | 'walletconnect') => {
    try {
      const chainId: number = await web3.eth.getChainId();
      await setProvider(service, chainId);
      const accounts: string[] = await web3.eth.getAccounts();
      dispatch(makeConnection({
        connected: true,
        address: accounts[0],
        chainId
      }));
      localStorage.setItem('walletprovider', service);
    }
    catch (e) {
      console.log(e);
    }
  }, [dispatch])

  React.useEffect(() => {
    const walletprovider: string | null = localStorage.getItem('walletprovider');
    if (walletprovider === 'injected' || walletprovider === 'walletconnect') {
      Promise.resolve(connectWallet(walletprovider));
    }
  }, [connectWallet]);

  React.useEffect(() => {
    async function subscribe() {
      const provider: any = await detectEthereumProvider();
      const wallet: string = localStorage.getItem('walletprovider') ?? 'injected';

      if (wallet === 'walletconnect' || wallet === 'injected') {
        provider.on("connect", async (chainId: {chainId: number}) => {
          dispatch(changeChain(chainId.chainId));
        });
    
        provider.on("disconnect", () => {
            localStorage.removeItem('walletprovider');
            dispatch(reset())
          }
        );

        provider.on("close", () => {
          localStorage.removeItem('walletprovider');
          dispatch(reset());
        })
    
        provider.on("accountsChanged", async (accounts: string[]) => {
          if (accounts.length === 0) {
            localStorage.removeItem('walletprovider');
          }
          dispatch((changeAccount(accounts[0])));
        });
    
        provider.on("chainChanged", async (chainId: number) => {
          dispatch(changeChain(chainId));
        });
      }
    }
    
    Promise.resolve(subscribe());

  }, [connected, dispatch])

  return (
    <div className="App">
      <div className="content">
        <button className="connect-button"
          onClick={() => setModal(true)}>
            {connected ? 'Connected' : 'Connect'}
          </button>
        <div className="chain-name">
          <span>{`Selected Network: ${Networks[Number(chain)]}`}</span>
        </div>
      </div>
      {modal &&
        <Modal open={modal} close={() => setModal(false)}>
          <div className="modal-header">
            {connected ? 'Disconnect?' : 'Connect to wallet'}
          </div>
          {!connected &&
          <div className="wallet-options">
            <div className="wallet-type" onClick={() => { connectWallet('injected'); setModal(false); }}>
              <span>Metamask</span>
            </div>
            <div className="wallet-type" onClick={() => { connectWallet('walletconnect'); setModal(false); }}>
              <span>Walletconnect</span>
            </div>
          </div>
          }
          {connected &&
          <button className="connect-button" onClick={() => { dispatch(reset()); setModal(false); }}>
            Disconnect
          </button>
          }
        </Modal>
      }
    </div>
  )
}

export default App;

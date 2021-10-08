import { AlchemyWeb3, createAlchemyWeb3 } from "@alch/alchemy-web3";
import detectEthereumProvider from "@metamask/detect-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Networks } from "./networks";

export let web3: AlchemyWeb3 = createAlchemyWeb3(`${process.env.REACT_APP_ETH_RPC}`, { writeProvider: null });

export const setProvider = async (service: 'injected' | 'walletconnect') => {
    if (service === 'injected')
    {
        const provider: any = await detectEthereumProvider();
        if (provider)
        {
            await provider.enable();
            web3 = createAlchemyWeb3(getEndpoint(Number(provider.chainId), false));
        }
        else
        {
            alert('Install a Web3 wallet such as Metamask.')
        }
    }
    else if (service === 'walletconnect')
    {
        const provider: WalletConnectProvider = new WalletConnectProvider({
            rpc: {
                1: getEndpoint(1, true),
                56: getEndpoint(56, true),
                137: getEndpoint(137, true),
                250: getEndpoint(250, true),
                42161: getEndpoint(42161, true),
                43114: getEndpoint(43114, true)
            }
        });

        await provider.enable();

        web3 = createAlchemyWeb3(getEndpoint(Number(provider.chainId)));
    }

    localStorage.setItem('walletprovider', service);
}

export const subscribeProvider = async (provider: WalletConnectProvider, service: 'injected' | 'walletconnect') => {
    provider.on("connect", async () => {
      localStorage.setItem('walletprovider', service);
    });

    provider.on("disconnect", () => {
        localStorage.removeItem('walletprovider');
      }
    );

    provider.on("accountsChanged", async (accounts: string[]) => {
      if (accounts.length === 0) {
        localStorage.removeItem('walletprovider');
      }
      console.log(await web3.eth.getChainId());
    });

    provider.on("chainChanged", async (chainId: number) => {
      console.log(chainId);
    });
  };

function getEndpoint(chainId: number, https = false): string {
    switch (Networks[chainId]?.toLowerCase()) {
        case ('ethereum'): {
            if (https) {
                return `${process.env.REACT_APP_ETH_RPC_HTTPS}`;
            }

            return `${process.env.REACT_APP_ETH_RPC}`;
        }
        case ('bsc'): {
            if (https) {
                return `${process.env.REACT_APP_BSC_RPC_HTTPS}`;
            }

            return `${process.env.REACT_APP_BSC_RPC}`;
        }
        case ('polygon'): {
            if (https) {
                return `${process.env.REACT_APP_POLYGON_RPC_HTTPS}`;
            }

            return `${process.env.REACT_APP_POLYGON_RPC}`;
        }
        case ('avalanche'): {
            if (https) {
                return `${process.env.REACT_APP_AVALANCHE_RPC_HTTPS}`;
            }

            return `${process.env.REACT_APP_AVALANCHE_RPC}`;
        }
        case ('arbitrum'): {
            if (https) {
                return `${process.env.REACT_APP_ARBITRUM_RPC_HTTPS}`;
            }

            return `${process.env.REACT_APP_ARBITRUM_RPC}`;
        }
        case ('fantom'): {
            if (https) {
                return `${process.env.REACT_APP_FANTOM_RPC_HTTPS}`;
            }

            return `${process.env.REACT_APP_FANTOM_RPC}`;
        }

        default: return `${process.env.REACT_APP_ETH_RPC}`;
    }
}
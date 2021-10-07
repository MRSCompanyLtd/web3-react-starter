import { AlchemyWeb3, createAlchemyWeb3 } from "@alch/alchemy-web3";
import detectEthereumProvider from "@metamask/detect-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Networks } from "./networks";

export const web3: AlchemyWeb3 = createAlchemyWeb3(`${process.env.REACT_APP_ETH_RPC}`);

export const setProvider = async (service: 'injected' | 'walletconnect', chainId = 1) => {
    if (service === 'injected')
    {
        const provider: any = await detectEthereumProvider();
        if (provider)
        {
            await provider.enable();
            web3.setWriteProvider(provider);
        }
    }
    else if (service === 'walletconnect')
    {
        const provider: WalletConnectProvider = new WalletConnectProvider({
            rpc: {
                1: getEndpoint(chainId, true),
                56: getEndpoint(56, true),
                137: getEndpoint(137, true),
                43114: getEndpoint(43114, true)
            }
        });

        await provider.enable();

        web3.setWriteProvider(provider);
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
    switch (Networks[chainId]) {
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

        default: return `${process.env.REACT_APP_ETH_RPC}`;
    }
}

export function setChain(chainId: number, https = false): void {
    const url: string = getEndpoint(chainId, https);
    web3.setProvider(url);
}
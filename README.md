# personal-subgraphs
POC for personal subgraphs. It contains the following:

- A simple PersonalSubgraphAnchor which anchors emitted ERC20s to track for an address, as a trigger for the Subgraph
- A Subgraph that tracks the Anchor contract, and then uses Data Source Templates to track all ERC20 tokesn that are emitted for that View.
- The View is of the sender of the transaction, on a single ethereum account.
- The Ethereum Account we are Indexing is Binance 14 (as labled by Etherscan). This was chosen as it would be a highly active account on Ethereum with many transactions.
- The Subgraph does not index any of the tokens from the start. It does a contract call to get the balances of Binance 14, and then starts to index every block for those tokens.
- It will still be slower than the outlined solution, since we are not filtering on the Binance 14 account.
- The personal subgraph is deployed here. It can be seen that it is successfully syncing this account for 4 tokens, AAVE, DYDX, USDT and USDC

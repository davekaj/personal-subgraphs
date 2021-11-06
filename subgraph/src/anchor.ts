import { BigInt } from "@graphprotocol/graph-ts";
import {
  AddERC20,
  // AddERC20Sender,
  // AddERC721,
  // AddERC721Sender,
} from "../generated/PersonalSubgraphAnchor/PersonalSubgraphAnchor";
import { ERC20 } from "../generated/PersonalSubgraphAnchor/ERC20";
import { ERC20 as ERC20Template } from "../generated/templates";
import { Token, User } from "../generated/schema";

// NOTE - using this for now as we do not have indexing at the Manifest level
// This address is Binance 14 on Etherscan. It has a ton of assets
export const userAddr = "0x28c6c06298d514db089934071355e5743bf21d60";
export const senderAddr = "0x93606b27cb5e4c780883ec4f6b7bed5f6572d1dd";

export function handleAddERC20(event: AddERC20): void {
  // Purposely locking to only this sender to work.
  // If the sender and user was indexed in the Manifest, it would create a unique subgraph
  if (event.params.sender.toHex() != senderAddr) return;

  let user = User.load(event.params.user.toHex());
  if (user == null) {
    user = new User(event.params.user.toHex());
    user.sender = senderAddr
    user.save();
  }

  let token = Token.load(event.params.token.toHex());
  if (token == null) {
    token = new Token(event.params.token.toHex());
    const contract = ERC20.bind(event.params.token);
    token.decimals = contract.decimals();
    token.balance = contract.balanceOf(event.params.user);
    token.user = event.params.user.toHex()
    token.save();

    ERC20Template.create(event.params.token);
  }
}

// export function handleAddERC20Sender(event: AddERC20Sender): void {}

// export function handleAddERC721(event: AddERC721): void {}

// export function handleAddERC721Sender(event: AddERC721Sender): void {}
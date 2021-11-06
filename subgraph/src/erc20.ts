import { Transfer } from "../generated/templates/ERC20/ERC20";
import { Token } from "../generated/schema";

import { userAddr } from "./anchor";

export function handleTransfer(event: Transfer): void {
  let token = Token.load(event.address.toHex()) as Token;
  if (event.params.to.toHex() == userAddr) {
    token.balance = token.balance.plus(event.params.value);
  } else if (event.params.from.toHex() == userAddr) { // If filter was enabled, wouldn't need check
    token.balance = token.balance.minus(event.params.value);
  }
  token.save();
}

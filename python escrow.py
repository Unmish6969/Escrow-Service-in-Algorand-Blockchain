from pyteal import *

def escrow_contract(creator, receiver, timeout):
    # Creator: the person who sets up the escrow
    # Receiver: the person who can withdraw funds after timeout
    # Timeout: after which time (in rounds) the receiver can withdraw the funds
    
    # Check that the transaction is a payment transaction
    is_payment = Txn.type_enum() == TxnType.Payment
    
    # Ensure the transaction receiver is the specified account
    is_correct_receiver = Txn.receiver() == Addr(receiver)
    
    # Ensure the transaction sender is the escrow contract (as the funds are locked here)
    is_from_escrow = Txn.sender() == Global.current_application_address()
    
    # Time condition: the receiver can withdraw after the specified timeout
    can_withdraw_after_timeout = Global.round() > Int(timeout)
    
    # The logic to either allow or disallow withdrawal
    program = And(
        is_payment,
        is_correct_receiver,
        can_withdraw_after_timeout,
        is_from_escrow
    )
    
    return program

# Compile the smart contract to TEAL
if __name__ == "__main__":
    creator_address = "Your-Creator-Address-Here"
    receiver_address = "Receiver-Address-Here"
    timeout_round = 5000  # Example round number
    
    print(compileTeal(escrow_contract(creator_address, receiver_address, timeout_round), mode=Mode.Signature))
    from pyteal import compileTeal, Mode

# Assuming `approval_program()` is your main function in the smart contract
if __name__ == "__main__":
    teal_code = compileTeal(approval_program(), mode=Mode.Application, version=2)
    with open("escrow_contract.teal", "w") as f:
        f.write(teal_code)


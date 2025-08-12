import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

// Test suite for Realvora DApp smart contracts
Clarinet.test({
  name: "Property NFT: Can create a new property",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'realvora-property-nft',
        'create-property',
        [
          types.ascii("Luxury Apartment NYC"),
          types.ascii("Premium apartment in Manhattan with city views"),
          types.ascii("New York, NY"),
          types.uint(1000000), // $1M total value
          types.uint(1000),    // 1000 shares
          types.uint(1000),    // $1000 per share
          types.uint(500),     // 5% rental yield
          types.ascii("https://ipfs.io/ipfs/QmPropertyMetadata")
        ],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result.expectOk(), types.uint(1));
    
    // Verify property was created
    let propertyQuery = chain.callReadOnlyFn(
      'realvora-property-nft',
      'get-property',
      [types.uint(1)],
      deployer.address
    );
    
    const property = propertyQuery.result.expectSome().expectTuple();
    assertEquals(property['name'], types.ascii("Luxury Apartment NYC"));
    assertEquals(property['total-shares'], types.uint(1000));
    assertEquals(property['available-shares'], types.uint(1000));
  },
});

Clarinet.test({
  name: "Property NFT: Can purchase shares",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // First create a property
    let block = chain.mineBlock([
      Tx.contractCall(
        'realvora-property-nft',
        'create-property',
        [
          types.ascii("Test Property"),
          types.ascii("Test Description"),
          types.ascii("Test Location"),
          types.uint(1000000),
          types.uint(1000),
          types.uint(1000),
          types.uint(500),
          types.ascii("https://test.com/metadata")
        ],
        deployer.address
      )
    ]);
    
    // Purchase shares
    block = chain.mineBlock([
      Tx.contractCall(
        'realvora-property-nft',
        'purchase-shares',
        [
          types.uint(1), // property-id
          types.uint(100) // shares to buy
        ],
        wallet1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result.expectOk(), types.uint(100));
    
    // Verify user owns shares
    let sharesQuery = chain.callReadOnlyFn(
      'realvora-property-nft',
      'get-user-shares',
      [types.uint(1), types.principal(wallet1.address)],
      deployer.address
    );
    
    assertEquals(sharesQuery.result, types.uint(100));
    
    // Verify available shares decreased
    let propertyQuery = chain.callReadOnlyFn(
      'realvora-property-nft',
      'get-property',
      [types.uint(1)],
      deployer.address
    );
    
    const property = propertyQuery.result.expectSome().expectTuple();
    assertEquals(property['available-shares'], types.uint(900));
  },
});

Clarinet.test({
  name: "DAO: Can create and vote on proposals",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;
    
    // First, give users voting power
    let block = chain.mineBlock([
      Tx.contractCall(
        'realvora-dao',
        'update-voting-power',
        [
          types.principal(wallet1.address),
          types.uint(500) // 500 voting power
        ],
        deployer.address
      ),
      Tx.contractCall(
        'realvora-dao',
        'update-voting-power',
        [
          types.principal(wallet2.address),
          types.uint(300) // 300 voting power
        ],
        deployer.address
      )
    ]);
    
    // Create a proposal
    block = chain.mineBlock([
      Tx.contractCall(
        'realvora-dao',
        'create-proposal',
        [
          types.some(types.uint(1)), // property-id
          types.uint(1), // proposal type (property sale)
          types.ascii("Sell Property 1"),
          types.ascii("Proposal to sell property 1 due to market conditions"),
          types.some(types.uint(1000000)), // amount
          types.none() // target
        ],
        wallet1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result.expectOk(), types.uint(1));
    
    // Vote on the proposal
    block = chain.mineBlock([
      Tx.contractCall(
        'realvora-dao',
        'vote',
        [
          types.uint(1), // proposal-id
          types.bool(true) // vote for
        ],
        wallet1.address
      ),
      Tx.contractCall(
        'realvora-dao',
        'vote',
        [
          types.uint(1), // proposal-id
          types.bool(false) // vote against
        ],
        wallet2.address
      )
    ]);
    
    assertEquals(block.receipts.length, 2);
    assertEquals(block.receipts[0].result.expectOk(), types.bool(true));
    assertEquals(block.receipts[1].result.expectOk(), types.bool(true));
    
    // Check proposal status
    let proposalQuery = chain.callReadOnlyFn(
      'realvora-dao',
      'get-proposal',
      [types.uint(1)],
      deployer.address
    );
    
    const proposal = proposalQuery.result.expectSome().expectTuple();
    assertEquals(proposal['votes-for'], types.uint(500));
    assertEquals(proposal['votes-against'], types.uint(300));
  },
});

Clarinet.test({
  name: "Marketplace: Can create and execute orders",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const buyer = accounts.get('wallet_1')!;
    const seller = accounts.get('wallet_2')!;
    
    // Create a buy order
    let block = chain.mineBlock([
      Tx.contractCall(
        'realvora-marketplace',
        'create-buy-order',
        [
          types.uint(1), // property-id
          types.uint(100), // shares
          types.uint(1000), // price per share
          types.uint(1440) // expires in blocks
        ],
        buyer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result.expectOk(), types.uint(1));
    
    // Create a sell order
    block = chain.mineBlock([
      Tx.contractCall(
        'realvora-marketplace',
        'create-sell-order',
        [
          types.uint(1), // property-id
          types.uint(50), // shares
          types.uint(950), // price per share (lower than buy order)
          types.uint(1440) // expires in blocks
        ],
        seller.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result.expectOk(), types.uint(2));
    
    // Execute trade
    block = chain.mineBlock([
      Tx.contractCall(
        'realvora-marketplace',
        'execute-trade',
        [
          types.uint(1), // buy-order-id
          types.uint(2), // sell-order-id
          types.uint(50) // shares to trade
        ],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result.expectOk(), types.uint(1)); // trade-id
    
    // Verify trade was recorded
    let tradeQuery = chain.callReadOnlyFn(
      'realvora-marketplace',
      'get-trade',
      [types.uint(1)],
      deployer.address
    );
    
    const trade = tradeQuery.result.expectSome().expectTuple();
    assertEquals(trade['shares'], types.uint(50));
    assertEquals(trade['price-per-share'], types.uint(950));
    assertEquals(trade['buyer'], types.principal(buyer.address));
    assertEquals(trade['seller'], types.principal(seller.address));
  },
});

Clarinet.test({
  name: "Property NFT: Can distribute and claim revenue",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;
    
    // Create property and purchase shares
    let block = chain.mineBlock([
      Tx.contractCall(
        'realvora-property-nft',
        'create-property',
        [
          types.ascii("Revenue Property"),
          types.ascii("Property for revenue testing"),
          types.ascii("Test City"),
          types.uint(1000000),
          types.uint(1000),
          types.uint(1000),
          types.uint(500),
          types.ascii("https://test.com/metadata")
        ],
        deployer.address
      ),
      Tx.contractCall(
        'realvora-property-nft',
        'purchase-shares',
        [types.uint(1), types.uint(300)],
        wallet1.address
      ),
      Tx.contractCall(
        'realvora-property-nft',
        'purchase-shares',
        [types.uint(1), types.uint(200)],
        wallet2.address
      )
    ]);
    
    // Distribute revenue
    block = chain.mineBlock([
      Tx.contractCall(
        'realvora-property-nft',
        'distribute-revenue',
        [
          types.uint(1), // property-id
          types.uint(10000), // total amount (10,000 STX)
          types.uint(1) // distribution-id
        ],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result.expectOk(), types.uint(1));
    
    // Claim revenue for wallet1 (300 shares out of 1000 = 30%)
    block = chain.mineBlock([
      Tx.contractCall(
        'realvora-property-nft',
        'claim-revenue',
        [
          types.uint(1), // property-id
          types.uint(1)  // distribution-id
        ],
        wallet1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    // wallet1 should receive 3000 STX (300 shares * 10 STX per share)
    assertEquals(block.receipts[0].result.expectOk(), types.uint(3000));
    
    // Claim revenue for wallet2 (200 shares out of 1000 = 20%)
    block = chain.mineBlock([
      Tx.contractCall(
        'realvora-property-nft',
        'claim-revenue',
        [
          types.uint(1), // property-id
          types.uint(1)  // distribution-id
        ],
        wallet2.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    // wallet2 should receive 2000 STX (200 shares * 10 STX per share)
    assertEquals(block.receipts[0].result.expectOk(), types.uint(2000));
  },
});

Clarinet.test({
  name: "Error handling: Cannot purchase more shares than available",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // Create property with limited shares
    let block = chain.mineBlock([
      Tx.contractCall(
        'realvora-property-nft',
        'create-property',
        [
          types.ascii("Limited Property"),
          types.ascii("Property with limited shares"),
          types.ascii("Test City"),
          types.uint(100000),
          types.uint(100), // Only 100 shares
          types.uint(1000),
          types.uint(500),
          types.ascii("https://test.com/metadata")
        ],
        deployer.address
      )
    ]);
    
    // Try to purchase more shares than available
    block = chain.mineBlock([
      Tx.contractCall(
        'realvora-property-nft',
        'purchase-shares',
        [
          types.uint(1), // property-id
          types.uint(150) // More than available
        ],
        wallet1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    // Should fail with ERR_EXCEEDS_MAX_SUPPLY (u106)
    assertEquals(block.receipts[0].result.expectErr(), types.uint(106));
  },
});

Clarinet.test({
  name: "Error handling: Cannot vote twice on same proposal",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // Give voting power and create proposal
    let block = chain.mineBlock([
      Tx.contractCall(
        'realvora-dao',
        'update-voting-power',
        [types.principal(wallet1.address), types.uint(500)],
        deployer.address
      ),
      Tx.contractCall(
        'realvora-dao',
        'create-proposal',
        [
          types.none(),
          types.uint(4), // protocol upgrade
          types.ascii("Test Proposal"),
          types.ascii("Test Description"),
          types.none(),
          types.none()
        ],
        wallet1.address
      )
    ]);
    
    // Vote once
    block = chain.mineBlock([
      Tx.contractCall(
        'realvora-dao',
        'vote',
        [types.uint(1), types.bool(true)],
        wallet1.address
      )
    ]);
    
    assertEquals(block.receipts[0].result.expectOk(), types.bool(true));
    
    // Try to vote again
    block = chain.mineBlock([
      Tx.contractCall(
        'realvora-dao',
        'vote',
        [types.uint(1), types.bool(false)],
        wallet1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    // Should fail with ERR_ALREADY_VOTED (u206)
    assertEquals(block.receipts[0].result.expectErr(), types.uint(206));
  },
});
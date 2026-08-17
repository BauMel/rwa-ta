# API `BaudouinApiTest` — Documentation

Endpoint that retrieves on-chain data for the **USDC** contract on Ethereum mainnet, with an optional query to also read a holder's balance.

**Base URL:** `http://localhost:3001`
**Route:** `GET /api/BaudouinApiTest`
**Demo:** [Watch the demo video](https://drive.google.com/file/d/16mGtc3JVbkLpkmiSjovWDZYQhTffuLXb/view?usp=sharing)

**Query parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `holder` | string (Ethereum address, `0x…40 hex`) | No | If provided, the response also includes the balance of this address. |

---

## 1. Call without `holder` (contract data only)

### Request

```bash
curl.exe "http://localhost:3001/api/BaudouinApiTest"
```

### Response `200 OK`

```json
{
  "success": true,
  "source": "ethereum-mainnet",
  "data": {
    "rpcUrl": "https://ethereum-rpc.publicnode.com",
    "blockNumber": 25775914,
    "contractAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "name": "USD Coin",
    "symbol": "USDC",
    "decimals": 6,
    "totalSupplyRaw": "49653761111627584",
    "totalSupply": "49653761111.627584"
  }
}
```

### Server log

```
=== [BaudouinApiTest] On-chain data ===
┌─────────────────┬────────────────────────────────────────────────┐
│ (index)         │ Values                                         │
├─────────────────┼────────────────────────────────────────────────┤
│ rpcUrl          │ 'https://ethereum-rpc.publicnode.com'          │
│ blockNumber     │ 25774989                                       │
│ contractAddress │ '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'   │
│ name            │ 'USD Coin'                                     │
│ symbol          │ 'USDC'                                         │
│ decimals        │ 6                                              │
│ totalSupplyRaw  │ '49597999541647348'                            │
│ totalSupply     │ '49597999541.647348'                           │
└─────────────────┴────────────────────────────────────────────────┘
GET /api/BaudouinApiTest 200 890.026 ms - 305
```

---

## 2. Call with a valid `holder` (contract data + balance)

### Request

```bash
curl.exe "http://localhost:3001/api/BaudouinApiTest?holder=0x28C6c06298d514Db089934071355E5743bf21d60"
```

### Response `200 OK`

```json
{
  "success": true,
  "source": "ethereum-mainnet",
  "data": {
    "rpcUrl": "https://ethereum-rpc.publicnode.com",
    "blockNumber": 25775019,
    "contractAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "name": "USD Coin",
    "symbol": "USDC",
    "decimals": 6,
    "totalSupplyRaw": "49607793002498403",
    "totalSupply": "49607793002.498403",
    "holder": {
      "address": "0x28C6c06298d514Db089934071355E5743bf21d60",
      "balance": "50828.46732"
    }
  }
}
```

### Server log

```
=== [BaudouinApiTest] On-chain data ===
┌─────────────────┬──────────────────────────────────────────────┬───────────────┬────────────────────────────────────────────────┐
│ (index)         │ address                                      │ balance       │ Values                                         │
├─────────────────┼──────────────────────────────────────────────┼───────────────┼────────────────────────────────────────────────┤
│ rpcUrl          │                                              │               │ 'https://ethereum-rpc.publicnode.com'          │
│ blockNumber     │                                              │               │ 25775019                                       │
│ contractAddress │                                              │               │ '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'   │
│ name            │                                              │               │ 'USD Coin'                                     │
│ symbol          │                                              │               │ 'USDC'                                         │
│ decimals        │                                              │               │ 6                                              │
│ totalSupplyRaw  │                                              │               │ '49607793002498403'                            │
│ totalSupply     │                                              │               │ '49607793002.498403'                           │
│ holder          │ '0x28C6c06298d514Db089934071355E5743bf21d60' │ '50828.46732' │                                                │
└─────────────────┴──────────────────────────────────────────────┴───────────────┴────────────────────────────────────────────────┘
GET /api/BaudouinApiTest?holder=0x28C6c06298d514Db089934071355E5743bf21d60 200 1132.234 ms - 395
```

---

## 3. Call with an invalid `holder` (error case)

### Request

```bash
curl.exe "http://localhost:3001/api/BaudouinApiTest?holder=notanaddress"
```

### Response

```json
{
  "success": false,
  "error": "Invalid holder address"
}
```

---

## Server startup log (reference)

```
PS C:\Users\BaudouinMeli\Desktop\TA\rwa-ta> npm start

> assessment@1.0.0 start
> node src/index.js

Port 3001 is free. Ready to start server.
Script called
MONGO_URI not set — skipping DB connection
Backend running on http://localhost:3001
```
# VeriFi backend & smart contract

1) Install dependencies
   npm install

2) Compile contracts
   npm run compile

3) Run local Hardhat node (optional)
   npm run start:node
   - In a new terminal, deploy to local:
     npm run deploy:local

4) Deploy to network (after filling .env)
   npm run deploy:rinkeby
   - After deploy, abi/VeriFi.json will be created with address & abi

5) Run verification server
   npm run start:server
   - API: GET http://localhost:4000/verify?proof=<proofString>

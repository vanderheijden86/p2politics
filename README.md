# p2politics
P2P political party powered by blockchain

To see what we are planning to accomplish checkout [this](https://www.youtube.com/watch?v=9mzaXMoaybg) video

# Get started on localhost
Install Etereum Testnet node via homebrew:
    https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Mac

Start in terminal met
```
    $ geth --testnet --rpc console
```
console is toevoeging om zoals je al raadt een js console te krijgen
hij zal wel lang moeten syncen denk ik eerste keer, was bij mij ook

Om een coinbase te krijgen op het testnet moet er op dit net een account gemaakt worden.
Dit wordt gedaan met het volgende command:
```
$ geth --testnet account new
```

# Entity Relationship Diagram
Inline-style:
![alt text](docs/entity_relationship_diagram.png "ERD")

# TODO
- Developer optie, admin toggle, voter add
- Create proposal route maken + formulier
- Vote form submittable maken
- Developer page voor setten van roles

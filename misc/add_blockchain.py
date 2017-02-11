import sys
import os
import json

name = sys.argv[1]

# read in all proposals
with open("../data/{}.json".format(name)) as f:
    proposals = json.load(f)

# commit proposals to chain
for proposal in proposals:
    with open("index.json", "w") as f:
        json.dump(proposal, f)
        os.system("truffle migrate --reset --network pubtest")

import json
import os
import sys
import time


name = sys.argv[1]

# read in all proposals
with open("../data/{}.json".format(name)) as f:
    proposals = json.load(f)

# commit proposals to chain
for num, proposal in enumerate(proposals):
    with open("index.json", "w") as f:
        json.dump(proposal, f)
        os.system("truffle exec add_{}.js --network pubtest".format(name))
        print(num)
        time.sleep(5)
